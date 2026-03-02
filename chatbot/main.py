import os
import uuid
import logging
import asyncio
from datetime import datetime
from typing import List, Optional
from dotenv import load_dotenv

from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from langchain_deepseek import ChatDeepSeek
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_community.retrievers import BM25Retriever
from langchain_community.chat_message_histories import ChatMessageHistory
# ... (Previous imports remain same, verify correct imports)
# ... (Previous imports remain same, verify correct imports)
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.documents import Document

import database
import tiktoken
import json

# --- Prompts Setup ---
# prompts/system-role-and-rules.txt  — AI role, tone, strict rules
# prompts/stages-flow.json           — stage order, per-stage prompts, FAQ override instruction
# prompts/welcome-message.txt        — default welcome message (single language)
PROMPTS = {}
PROMPTS_DIR = "prompts"

def load_prompts():
    """Load prompt files from prompts/ and build unified PROMPTS dict."""
    global PROMPTS
    try:
        with open(f"{PROMPTS_DIR}/system-role-and-rules.txt", "r", encoding="utf-8") as f:
            system_prompt = f.read()

        with open(f"{PROMPTS_DIR}/stages-flow.json", "r", encoding="utf-8") as f:
            flow = json.load(f)

        with open(f"{PROMPTS_DIR}/welcome-message.txt", "r", encoding="utf-8") as f:
            welcome_message = f.read().strip()

        # Build stages dict keyed by id for fast lookup
        stages_dict = {s["id"]: s["prompt"] for s in flow["stages"]}

        PROMPTS = {
            "system_prompt": system_prompt,
            "welcome_message": welcome_message,
            "stage_config": {
                "initial": flow.get("initial", flow["stages"][0]["id"]),
                "terminal": flow.get("terminal", flow["stages"][-1]["id"]),
                "order": [s["id"] for s in flow["stages"]],
                "cta_strip_when_terminal": flow.get("cta_strip_when_terminal", []),
            },
            "stages": stages_dict,
            "faq_override_instruction": "\n\n" + flow.get("faq_override_instruction", ""),
        }
        logger.info(f"Prompts loaded — {len(stages_dict)} stages: {list(stages_dict.keys())}")
    except Exception as e:
        logger.error(f"Failed to load prompts: {e}")
        PROMPTS = {
            "system_prompt": "CRITICAL ERROR: Prompts lost. Answer normally.",
            "welcome_message": "Chào bạn.",
            "stage_config": {"initial": "BASIC", "terminal": "REGISTERED", "order": ["BASIC", "PRICING", "COMPLEX", "REGISTERED"], "cta_strip_when_terminal": ["OPEN_REGISTER"]},
            "stages": {"BASIC": "", "PRICING": "", "COMPLEX": "", "REGISTERED": ""},
            "faq_override_instruction": "",
        }

# --- Logging Setup ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Initial Load
load_prompts()

# --- Pricing Constants (USD per 1M tokens) ---
# DeepSeek V3 Pricing (Reference: $0.14 Input / $0.28 Output)
PRICE_EMBEDDING = 0.02
PRICE_DEEPSEEK_INPUT = 0.14
PRICE_DEEPSEEK_OUTPUT = 0.28

# --- Token Encoder ---
# Use cl100k_base for OpenAI embeddings (approximate for DeepSeek text too)
try:
    encoder = tiktoken.get_encoding("cl100k_base")
except:
    # Fallback if tiktoken fails
    logger.warning("Tiktoken encoding not found, falling back to simple split")
    class MockEncoder:
        def encode(self, text): return text.split()
    encoder = MockEncoder()


# --- Environment ---
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
# DEEPSEEK_API_KEY is automatically loaded by langchain_deepseek from env
FAISS_PATH = "./faiss_index"

# --- Models ---
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
llm = ChatDeepSeek(
    model="deepseek-chat", 
    temperature=0.3,
    max_tokens=8192,
    timeout=60
)

# --- Global Components ---
ensemble_retriever = None
parent_docs_map: dict = {}  # section_id → parent LangchainDocument (for parent-child expansion)
try:
    if os.path.exists(FAISS_PATH):
        vectorstore = FAISS.load_local(FAISS_PATH, embeddings, allow_dangerous_deserialization=True)

        # MMR FAISS retriever — fetch 30 candidates, return 10 diverse (lambda=0.7: relevance vs diversity)
        faiss_retriever = vectorstore.as_retriever(
            search_type="mmr",
            search_kwargs={"k": 10, "fetch_k": 30, "lambda_mult": 0.7}
        )

        # BM25 retriever — keyword exact match, great for Vietnamese terms
        all_docs = [vectorstore.docstore._dict[doc_id] for doc_id in vectorstore.index_to_docstore_id.values()]
        bm25_retriever = BM25Retriever.from_documents(all_docs, k=10)

        # Build parent lookup: section_id → parent chunk (for parent-child retrieval expansion)
        parent_docs_map = {
            d.metadata["section_id"]: d
            for d in all_docs
            if d.metadata.get("chunk_level") == "parent" and d.metadata.get("section_id")
        }

        # ensemble_retriever is a tuple — merged manually in chat handler
        ensemble_retriever = (faiss_retriever, bm25_retriever)

        logger.info(
            f"RAG: Hybrid retriever loaded. Docs: {len(all_docs)} "
            f"({len(parent_docs_map)} parent sections)"
        )
    else:
        logger.warning(f"FAISS index not found at {FAISS_PATH}. Retrieval disabled.")
except Exception as e:
    logger.error(f"Failed to load FAISS index: {e}")

# --- Helper Functions ---
def format_docs(docs: List[Document]):
    # GLOBAL SANITIZATION: Remove the tag from any retrieved document
    return "\n\n".join(doc.page_content.replace("[[OPEN_REGISTER]]", "") for doc in docs)

def get_recent_history(session_id: str, limit: int = 10):
    """Retrieve limited history from SQLite."""
    messages = database.get_session_messages(session_id)
    # Keep only the last 'limit' messages for context window efficiency
    recent = messages[-limit:] if limit else messages
    
    history = ChatMessageHistory()
    for msg in recent:
        if msg['role'] == 'user':
            history.add_user_message(msg['content'])
        elif msg['role'] == 'bot':
            history.add_ai_message(msg['content'])
    return history

# Helper function 'determine_stage' removed (logic moved to DB-driven stages)

# --- API Models ---
class ChatRequest(BaseModel):
    message: str
    session_id: str = Field(default_factory=lambda: str(uuid.uuid4()))

class RegistrationRequest(BaseModel):
    name: str
    phone: str
    email: str
    notes: str = ""
    session_id: str = ""  # Optional session ID to mark as registered

# --- App ---
app = FastAPI(title="CES Global Chatbot API", version="2.1")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Routes ---

@app.post("/api/v1/register")
async def register_endpoint(req: RegistrationRequest):
    try:
        reg_id = database.save_registration(
            session_id=req.session_id or '',
            name=req.name,
            phone=req.phone,
            email=req.email,
            notes=req.notes
        )

        # Mark session as registered (if session_id provided)
        if req.session_id:
            database.mark_registered(req.session_id)
            logger.info(f"Session {req.session_id} marked as REGISTERED")

        logger.info(f"Registered user: {req.name} (id={reg_id})")
        return {"status": "success", "message": "Đăng ký thành công!", "id": reg_id}
    except Exception as e:
        logger.error(f"Registration error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/registrations")
async def get_registrations(date_from: str = None, date_to: str = None):
    """Get all registrations with optional date filter (YYYY-MM-DD)."""
    return database.get_registrations(date_from=date_from, date_to=date_to)

@app.delete("/api/v1/registrations/{reg_id}")
async def delete_registration(reg_id: str):
    database.delete_registration(reg_id)
    return {"status": "deleted", "id": reg_id}

@app.get("/api/v1/history")
async def get_history_list():
    return database.get_all_sessions()

@app.get("/api/v1/welcome")
async def get_welcome_message():
    import re
    welcome_msg = re.sub(r'\[\[STAGE:\w+\]\]', '', PROMPTS.get("welcome_message", ""))
    welcome_msg = welcome_msg.replace('[[OPEN_REGISTER]]', '').replace('[[REGISTER_BTN]]', '').strip()
    return {"message": welcome_msg}

@app.get("/api/v1/history/{session_id}")
async def get_session_history_endpoint(session_id: str):
    messages = database.get_session_messages(session_id)
    return {"messages": messages}

@app.delete("/api/v1/history/{session_id}")
async def delete_history_endpoint(session_id: str):
    database.delete_session(session_id)
    return {"status": "deleted", "id": session_id}

# --- Core Chat Logic ---

# System Prompt Template removed (Loaded from json)

@app.post("/api/v1/chat")
async def chat_endpoint(request: ChatRequest):
    logger.info(f"[{request.session_id}] Request: {request.message}")
    
    # Init Session
    database.create_session(request.session_id, title=request.message[:30] + "...")
    
    # 1. Load History (Windowed)
    history_chain = get_recent_history(request.session_id, limit=10)
    msg_count = len(database.get_session_messages(request.session_id))

    # Welcome Message from config (New Session context)
    if msg_count == 0:
        import re
        welcome_msg = re.sub(r'\[\[STAGE:\w+\]\]', '', PROMPTS.get("welcome_message", ""))
        welcome_msg = welcome_msg.replace('[[OPEN_REGISTER]]', '').replace('[[REGISTER_BTN]]', '').strip()
        
        # Save Welcome Message to DB 
        database.add_message(request.session_id, 'bot', welcome_msg)
        
        # Add to history chain so LLM has context
        history_chain.add_ai_message(welcome_msg)
    
    try:
        # 2. Retrieval & Script Check
        context_text = ""
        script_answer = ""
        embedding_tokens = 0
        
        if ensemble_retriever:
            # Calculate embedding tokens
            embedding_tokens = len(encoder.encode(request.message))

            # Hybrid retrieval: FAISS MMR (semantic) + BM25 (keyword) → merge + dedup by content
            faiss_ret, bm25_ret = ensemble_retriever
            faiss_docs = faiss_ret.invoke(request.message)
            bm25_docs  = bm25_ret.invoke(request.message)
            seen = set()
            docs = []
            for doc in faiss_docs + bm25_docs:
                key = doc.page_content[:120]  # dedup by first 120 chars
                if key not in seen:
                    seen.add(key)
                    docs.append(doc)

            # Parent-Child expansion: for each child chunk retrieved,
            # also pull in its parent section chunk so LLM gets full context
            for doc in list(docs):
                pid = doc.metadata.get("parent_id")
                if pid and pid in parent_docs_map:
                    parent = parent_docs_map[pid]
                    pkey = parent.page_content[:120]
                    if pkey not in seen:
                        seen.add(pkey)
                        docs.append(parent)

            context_text = format_docs(docs)

            # Extract Script Answer (FAQ override — highest priority doc)
            for doc in docs:
                if doc.metadata.get("type") == "script_faq":
                    if "ANSWER:" in doc.page_content:
                        parts = doc.page_content.split("ANSWER:", 1)
                        if len(parts) > 1:
                            # NUCLEAR SANITIZATION: Remove the tag from source if it exists
                            script_answer = parts[1].strip().replace("[[OPEN_REGISTER]]", "")
                            logger.info(f"[{request.session_id}] Script Match Found (Sanitized): {doc.metadata.get('source')}")
                            break
        
        # 3. Load Session State & Build Stage Context
        current_stage, is_registered = database.get_session_state(request.session_id)

        # Build stage-specific instruction (config-driven — no hardcoded stage names)
        stage_cfg = PROMPTS.get("stage_config", {})
        terminal = stage_cfg.get("terminal", "REGISTERED")
        initial = stage_cfg.get("initial", "BASIC")
        if is_registered:
            stage_context = PROMPTS["stages"].get(terminal, "")
        else:
            stage_context = PROMPTS["stages"].get(current_stage, PROMPTS["stages"].get(initial, ""))

        
        # 4. Construct Prompt (Outside Generator for Token Counting)
        final_prompt = PROMPTS["system_prompt"].format(context=context_text)
        final_prompt += f"\n\n{stage_context}"
        
        if script_answer:
            final_prompt += PROMPTS["faq_override_instruction"].format(script_answer=script_answer)

        # 4. Calculate Input Tokens
        input_text = final_prompt + request.message
        # Add history tokens approximation (simple concat)
        for msg in history_chain.messages:
             input_text += str(msg.content)
        input_tokens = len(encoder.encode(input_text))
        
        messages = [
            SystemMessage(content=final_prompt),
        ] + history_chain.messages + [HumanMessage(content=request.message)]

        # 5. Stream Generator — Buffer-based tag extraction
        async def generate():
            full_response = ""
            output_tokens = 0
            detected_stage = None
            import re

            # --- Buffer logic ---
            # We buffer the START of the response until we see ']]'
            # This guarantees [[STAGE:XXX]] is never split across chunks and yielded.
            tag_extracted = False   # True once we've processed (or timed-out) the header
            header_buffer = ""      # Accumulates initial chunks looking for the tag
            TAG_TIMEOUT = 80        # If 80 chars pass without a tag, stop waiting

            try:
                async for chunk in llm.astream(messages):
                    content = chunk.content
                    if not content:
                        continue

                    full_response += content

                    if not tag_extracted:
                        header_buffer += content

                        # Wait until we have the closing ']]' before deciding
                        if "]]" in header_buffer or len(header_buffer) >= TAG_TIMEOUT:
                            tag_extracted = True

                            # Try to extract stage tag from the full buffer
                            stage_match = re.search(r'\[\[STAGE:(\w+)\]\]', header_buffer)
                            if stage_match:
                                detected_stage = stage_match.group(1).upper()
                                logger.info(f"[{request.session_id}] Stage tag extracted: {detected_stage}")
                                # Use advance_stage() — guard prevents downgrade
                                database.advance_stage(request.session_id, detected_stage)

                            # Strip STAGE tag. Keep [[OPEN_REGISTER]] so frontend can trigger modal.
                            clean = re.sub(r'\[\[STAGE:\w+\]\]', '', header_buffer)
                            clean = clean.replace('[[REGISTER_BTN]]', '')  # this one is stripped always
                            clean = clean.lstrip('\n')
                            if clean:
                                yield clean
                        # Still buffering — don't yield yet
                        continue

                    # Past the header: stream directly
                    # Strip CTA tags for terminal (registered) users — list from config
                    cta_strip = PROMPTS.get("stage_config", {}).get("cta_strip_when_terminal", ["OPEN_REGISTER", "REGISTER_BTN"])
                    if is_registered:
                        for tag in cta_strip:
                            content = content.replace(f'[[{tag}]]', '')
                    else:
                        content = content.replace('[[REGISTER_BTN]]', '')
                    if content:
                        yield content

                # Count Output Tokens
                output_tokens = len(encoder.encode(full_response))

                # Clean full response for DB storage (strip ALL tags — DB should not store signals)
                full_response = re.sub(r'\[\[STAGE:\w+\]\]', '', full_response)
                full_response = full_response.replace('[[OPEN_REGISTER]]', '').replace('[[REGISTER_BTN]]', '').strip()

                # 6. Save to DB & Log Cost (Only after success)
                if full_response:
                    embedding_cost = (embedding_tokens / 1_000_000) * PRICE_EMBEDDING
                    input_cost = (input_tokens / 1_000_000) * PRICE_DEEPSEEK_INPUT
                    output_cost = (output_tokens / 1_000_000) * PRICE_DEEPSEEK_OUTPUT
                    total_cost = embedding_cost + input_cost + output_cost

                    database.log_usage(
                        session_id=request.session_id,
                        model_name="deepseek-chat",
                        prompt_tokens=input_tokens,
                        completion_tokens=output_tokens,
                        embedding_tokens=embedding_tokens,
                        total_cost_usd=total_cost
                    )

                    database.add_message(request.session_id, 'user', request.message)
                    database.add_message(request.session_id, 'bot', full_response)

                    # Update title for new sessions
                    msgs = database.get_session_messages(request.session_id)
                    if len(msgs) <= 2:
                        database.update_session_title(request.session_id, request.message[:50])

            except Exception as e:
                logger.error(f"Streaming error: {e}")
                yield f"System Error: {str(e)}"

        return StreamingResponse(generate(), media_type="text/plain")

    except Exception as e:
        logger.error(f"Endpoint error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
