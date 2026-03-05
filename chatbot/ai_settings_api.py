"""
ai_settings_api.py — LLM provider configuration: load/save from DB, factory, cache, test.
"""

import os
import logging
import time
from typing import Optional

import database
from cryptography.fernet import Fernet

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Fernet — reuse same key as facebook_handler
# ---------------------------------------------------------------------------

_fernet: Optional[Fernet] = None

def _get_fernet() -> Fernet:
    global _fernet
    if _fernet is None:
        key = os.getenv("FERNET_KEY")
        if not key:
            raise RuntimeError("FERNET_KEY env var required")
        _fernet = Fernet(key.encode() if isinstance(key, str) else key)
    return _fernet


def _encrypt(value: str) -> str:
    return _get_fernet().encrypt(value.encode()).decode()


def _decrypt(value: str) -> str:
    try:
        return _get_fernet().decrypt(value.encode()).decode()
    except Exception:
        return ""


# ---------------------------------------------------------------------------
# Defaults
# ---------------------------------------------------------------------------

DEFAULTS = {
    "provider": "deepseek",
    "model": "deepseek-chat",
    "temperature": "0.3",
    "max_tokens": "8192",
}

API_KEY_ENV_MAP = {
    "deepseek": "DEEPSEEK_API_KEY",
    "openai": "OPENAI_API_KEY",
    "google": "GOOGLE_API_KEY",
}

PRICING = {
    "deepseek": {"input": 0.14, "output": 0.28},
    "openai": {"input": 0.15, "output": 0.60},
    "google": {"input": 0.075, "output": 0.30},
}


# ---------------------------------------------------------------------------
# Load / Save config
# ---------------------------------------------------------------------------

async def load_config() -> dict:
    """Load AI config from DB, fall back to env vars for API keys."""
    raw = await database.get_ai_config()
    cfg = {**DEFAULTS, **raw}

    # Resolve API key: prefer DB (encrypted), fall back to env var
    provider = cfg.get("provider", "deepseek")
    db_key_field = f"api_key_{provider}"
    encrypted = cfg.get(db_key_field, "")
    if encrypted and not encrypted.startswith("***"):
        cfg["api_key"] = _decrypt(encrypted)
    else:
        cfg["api_key"] = os.getenv(API_KEY_ENV_MAP.get(provider, ""), "")

    cfg["temperature"] = float(cfg.get("temperature", 0.3))
    cfg["max_tokens"] = int(cfg.get("max_tokens", 8192))
    return cfg


async def save_config(provider: str, model: str, temperature: float, max_tokens: int, api_key: str = ""):
    """Save AI config to DB. Encrypts API key if provided."""
    updates = {
        "provider": provider,
        "model": model,
        "temperature": str(temperature),
        "max_tokens": str(max_tokens),
    }
    if api_key:
        updates[f"api_key_{provider}"] = _encrypt(api_key)
    await database.set_ai_config_bulk(updates)
    # Invalidate LLM cache
    _llm_cache["hash"] = None


# ---------------------------------------------------------------------------
# LLM factory + cache
# ---------------------------------------------------------------------------

_llm_cache = {"hash": None, "instance": None}


def create_llm(config: dict):
    provider = config.get("provider", "deepseek")
    api_key = config.get("api_key", "")
    model = config.get("model", "deepseek-chat")
    temperature = float(config.get("temperature", 0.3))
    max_tokens = int(config.get("max_tokens", 8192))

    if provider == "deepseek":
        from langchain_deepseek import ChatDeepSeek
        kwargs = {"model": model, "temperature": temperature, "max_tokens": max_tokens, "timeout": 60}
        if api_key:
            kwargs["api_key"] = api_key
        return ChatDeepSeek(**kwargs)

    elif provider == "openai":
        from langchain_openai import ChatOpenAI
        kwargs = {"model": model, "temperature": temperature, "max_tokens": max_tokens}
        if api_key:
            kwargs["api_key"] = api_key
        return ChatOpenAI(**kwargs)

    elif provider == "google":
        from langchain_google_genai import ChatGoogleGenerativeAI
        kwargs = {"model": model, "temperature": temperature, "max_output_tokens": max_tokens}
        if api_key:
            kwargs["google_api_key"] = api_key
        return ChatGoogleGenerativeAI(**kwargs)

    raise ValueError(f"Unknown provider: {provider}")


async def get_llm():
    """Return cached LLM, rebuild if config changed."""
    config = await load_config()
    config_hash = hash(frozenset((k, str(v)) for k, v in config.items()))
    if _llm_cache["hash"] != config_hash:
        _llm_cache["instance"] = create_llm(config)
        _llm_cache["hash"] = config_hash
    return _llm_cache["instance"]


# ---------------------------------------------------------------------------
# System config (embedding key + FB verify token)
# ---------------------------------------------------------------------------

async def load_system_config() -> dict:
    """Load embed_openai_key and fb_verify_token from DB (with env fallbacks)."""
    raw = await database.get_ai_config()

    embed_encrypted = raw.get("embed_openai_key", "")
    if embed_encrypted:
        embed_key = _decrypt(embed_encrypted)
    else:
        embed_key = os.getenv("OPENAI_API_KEY", "")

    fb_token = raw.get("fb_verify_token", "") or os.getenv("FB_VERIFY_TOKEN", "")

    return {
        "embed_openai_key": embed_key,
        "fb_verify_token": fb_token,
    }


async def save_system_config(embed_openai_key: str = "", fb_verify_token: str = ""):
    """Save system config keys to DB."""
    updates = {}
    if embed_openai_key:
        updates["embed_openai_key"] = _encrypt(embed_openai_key)
    if fb_verify_token is not None:
        updates["fb_verify_token"] = fb_verify_token  # not secret, plain text
    if updates:
        await database.set_ai_config_bulk(updates)


# ---------------------------------------------------------------------------
# Test connection
# ---------------------------------------------------------------------------

async def test_connection(provider: str, model: str, temperature: float, max_tokens: int, api_key: str = "") -> dict:
    config = {"provider": provider, "model": model, "temperature": temperature, "max_tokens": max_tokens}

    # Use provided key; fall back to DB/env
    if not api_key:
        loaded = await load_config()
        api_key = loaded.get("api_key", "")
    config["api_key"] = api_key

    from langchain_core.messages import HumanMessage
    start = time.time()
    try:
        temp_llm = create_llm(config)
        result = await temp_llm.ainvoke([HumanMessage(content="Hi")])
        elapsed = int((time.time() - start) * 1000)
        return {"success": True, "message": "Kết nối thành công", "response_time_ms": elapsed}
    except Exception as e:
        elapsed = int((time.time() - start) * 1000)
        return {"success": False, "message": str(e), "response_time_ms": elapsed}
