"""
facebook_handler.py — Facebook Messenger webhook processing.

Responsibilities:
- Fernet encrypt/decrypt for page access tokens
- Webhook verification (GET challenge)
- Incoming message processing (non-streaming, BackgroundTask)
- Graph API message sending via httpx
"""

import os
import logging
import re
import uuid

import httpx
from cryptography.fernet import Fernet

import database

logger = logging.getLogger(__name__)

GRAPH_API_URL = "https://graph.facebook.com/v19.0/me/messages"
FB_VERIFY_TOKEN = os.getenv("FB_VERIFY_TOKEN", "")

# ---------------------------------------------------------------------------
# Fernet encryption for page access tokens
# ---------------------------------------------------------------------------

_fernet: Fernet | None = None

def _get_fernet() -> Fernet:
    global _fernet
    if _fernet is None:
        key = os.getenv("FERNET_KEY")
        if not key:
            raise RuntimeError("FERNET_KEY env var is required for token encryption")
        _fernet = Fernet(key.encode() if isinstance(key, str) else key)
    return _fernet


def encrypt_token(token: str) -> str:
    return _get_fernet().encrypt(token.encode()).decode()


def decrypt_token(encrypted: str) -> str:
    return _get_fernet().decrypt(encrypted.encode()).decode()


# ---------------------------------------------------------------------------
# Webhook verification
# ---------------------------------------------------------------------------

def verify_webhook(mode: str, token: str, challenge: str, expected_token: str = ""):
    """Return challenge string if token matches, raise ValueError otherwise.
    expected_token: token loaded from DB (overrides env FB_VERIFY_TOKEN if provided)."""
    effective = expected_token or FB_VERIFY_TOKEN
    if mode == "subscribe" and token == effective:
        return challenge
    raise ValueError("Webhook verification failed: token mismatch")


# ---------------------------------------------------------------------------
# Graph API — send message
# ---------------------------------------------------------------------------

async def send_fb_message(recipient_id: str, text: str, access_token: str):
    """Send text message to a Facebook user via Graph API."""
    payload = {
        "recipient": {"id": recipient_id},
        "message": {"text": text[:2000]},  # FB max 2000 chars
    }
    params = {"access_token": access_token}
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.post(GRAPH_API_URL, json=payload, params=params)
            if resp.status_code != 200:
                logger.error(f"Graph API error {resp.status_code}: {resp.text}")
            else:
                logger.info(f"FB reply sent to {recipient_id}")
    except Exception as e:
        logger.error(f"Failed to send FB message: {e}")


# ---------------------------------------------------------------------------
# Message processing
# ---------------------------------------------------------------------------

async def handle_message(
    sender_id: str,
    page_id: str,
    message_text: str,
    llm,
    ensemble_retriever,
    parent_docs_map: dict,
    format_docs,
    PROMPTS: dict,
):
    """Full chat processing pipeline for a single FB message. Non-streaming."""
    from langchain_core.messages import HumanMessage, SystemMessage
    from langchain_community.chat_message_histories import ChatMessageHistory

    session_id = f"fb_{sender_id}"

    try:
        # Get encrypted token from DB
        encrypted_token = await database.get_facebook_page_token(page_id)
        if not encrypted_token:
            logger.warning(f"No active page found for page_id={page_id}")
            return
        access_token = decrypt_token(encrypted_token)

        # Ensure session exists
        await database.create_session(session_id, title=f"FB: {message_text[:30]}")

        # Build history
        past_messages = await database.get_session_messages(session_id)
        recent = past_messages[-10:]
        history = ChatMessageHistory()
        for msg in recent:
            if msg["role"] == "user":
                history.add_user_message(msg["content"])
            elif msg["role"] == "bot":
                history.add_ai_message(msg["content"])

        # Retrieval
        context_text = ""
        script_answer = ""
        if ensemble_retriever:
            faiss_ret, bm25_ret = ensemble_retriever
            faiss_docs = faiss_ret.invoke(message_text)
            bm25_docs = bm25_ret.invoke(message_text)
            seen = set()
            docs = []
            for doc in faiss_docs + bm25_docs:
                key = doc.page_content[:120]
                if key not in seen:
                    seen.add(key)
                    docs.append(doc)
            for doc in list(docs):
                pid = doc.metadata.get("parent_id")
                if pid and pid in parent_docs_map:
                    parent = parent_docs_map[pid]
                    pkey = parent.page_content[:120]
                    if pkey not in seen:
                        seen.add(pkey)
                        docs.append(parent)
            context_text = format_docs(docs)
            for doc in docs:
                if doc.metadata.get("type") == "script_faq" and "ANSWER:" in doc.page_content:
                    parts = doc.page_content.split("ANSWER:", 1)
                    if len(parts) > 1:
                        script_answer = parts[1].strip().replace("[[OPEN_REGISTER]]", "")
                        break

        # Stage
        current_stage, is_registered = await database.get_session_state(session_id)
        stage_cfg = PROMPTS.get("stage_config", {})
        terminal = stage_cfg.get("terminal", "REGISTERED")
        initial = stage_cfg.get("initial", "BASIC")
        if is_registered:
            stage_context = PROMPTS["stages"].get(terminal, "")
        else:
            stage_context = PROMPTS["stages"].get(current_stage, PROMPTS["stages"].get(initial, ""))

        final_prompt = PROMPTS["system_prompt"].format(context=context_text)
        final_prompt += f"\n\n{stage_context}"
        if script_answer:
            final_prompt += PROMPTS["faq_override_instruction"].format(script_answer=script_answer)

        messages = [SystemMessage(content=final_prompt)] + history.messages + [HumanMessage(content=message_text)]

        # LLM invoke (non-streaming)
        result = await llm.ainvoke(messages)
        response_text = result.content if hasattr(result, "content") else str(result)

        # Strip stage tags + CTA for FB (no UI to handle them)
        response_text = re.sub(r'\[\[STAGE:(\w+)\]\]', '', response_text)
        cta_strip = stage_cfg.get("cta_strip_when_terminal", ["OPEN_REGISTER", "REGISTER_BTN"])
        for tag in cta_strip + ["REGISTER_BTN"]:
            response_text = response_text.replace(f"[[{tag}]]", "")
        response_text = response_text.strip()

        # Advance stage if tag was present
        stage_match = re.search(r'\[\[STAGE:(\w+)\]\]', result.content if hasattr(result, "content") else "")
        if stage_match:
            await database.advance_stage(session_id, stage_match.group(1).upper())

        # Save to DB
        await database.add_message(session_id, "user", message_text)
        await database.add_message(session_id, "bot", response_text)

        # Send reply to Facebook
        await send_fb_message(sender_id, response_text, access_token)

    except Exception as e:
        logger.error(f"FB handle_message error for {sender_id}: {e}")


# ---------------------------------------------------------------------------
# Webhook event parser
# ---------------------------------------------------------------------------

def extract_messages(body: dict):
    """Yield (sender_id, page_id, message_text) from webhook payload."""
    for entry in body.get("entry", []):
        page_id = entry.get("id", "")
        for event in entry.get("messaging", []):
            sender_id = event.get("sender", {}).get("id")
            msg = event.get("message", {})
            text = msg.get("text")
            # Skip non-text messages (stickers, attachments, echoes)
            if sender_id and text and not msg.get("is_echo"):
                yield sender_id, page_id, text
