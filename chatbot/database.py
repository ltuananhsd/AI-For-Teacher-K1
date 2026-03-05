"""
database.py — Async PostgreSQL database layer via asyncpg connection pool.

Pool lifecycle:
  - init_pool()  → call on FastAPI startup (creates asyncpg pool)
  - init_db()    → call after init_pool() to create tables + indexes
  - close_pool() → call on FastAPI shutdown

All public functions are async. Parameterized queries use $1, $2, ... notation.
"""

import asyncpg
import json
import uuid
import os
from typing import Optional

DATABASE_URL = os.environ.get(
    "DATABASE_URL",
    "postgresql://chatbot:chatbot123@localhost:5432/chatbot"
)

# Global async connection pool — initialized on app startup
_pool: Optional[asyncpg.Pool] = None


# ---------------------------------------------------------------------------
# Pool lifecycle
# ---------------------------------------------------------------------------

async def init_pool():
    """Create asyncpg connection pool. Must be called before any DB operation."""
    global _pool
    _pool = await asyncpg.create_pool(
        DATABASE_URL,
        min_size=5,
        max_size=20,
        command_timeout=60,
    )


async def close_pool():
    """Gracefully close the connection pool on shutdown."""
    global _pool
    if _pool:
        await _pool.close()
        _pool = None


def get_pool() -> asyncpg.Pool:
    """Return the active pool. Raises if not initialized."""
    if _pool is None:
        raise RuntimeError("DB pool not initialized — call init_pool() first")
    return _pool


# ---------------------------------------------------------------------------
# Stage config — loaded once at module import (synchronous file read)
# ---------------------------------------------------------------------------

def _load_stage_config():
    try:
        with open("prompts/stages-flow.json", "r", encoding="utf-8") as f:
            flow = json.load(f)
        order = [s["id"] for s in flow.get("stages", [])]
        if not order:
            raise ValueError("stages array empty")
        return {
            "initial": flow.get("initial", order[0]),
            "terminal": flow.get("terminal", order[-1]),
            "hierarchy": {stage: i for i, stage in enumerate(order)},
            "cta_strip_when_terminal": flow.get("cta_strip_when_terminal", []),
        }
    except Exception:
        order = ["BASIC", "PRICING", "COMPLEX", "REGISTERED"]
        return {
            "initial": "BASIC",
            "terminal": "REGISTERED",
            "hierarchy": {s: i for i, s in enumerate(order)},
            "cta_strip_when_terminal": ["OPEN_REGISTER", "REGISTER_BTN"],
        }


_STAGE_CFG = _load_stage_config()
STAGE_HIERARCHY = _STAGE_CFG["hierarchy"]
STAGE_INITIAL = _STAGE_CFG["initial"]
STAGE_TERMINAL = _STAGE_CFG["terminal"]


# ---------------------------------------------------------------------------
# Schema initialization
# ---------------------------------------------------------------------------

async def init_db():
    """Create all tables and indexes if they don't exist. Idempotent."""
    pool = get_pool()
    async with pool.acquire() as conn:
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS sessions (
                id TEXT PRIMARY KEY,
                title TEXT,
                current_stage TEXT DEFAULT 'BASIC',
                is_registered INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS messages (
                id TEXT PRIMARY KEY,
                session_id TEXT REFERENCES sessions(id) ON DELETE CASCADE,
                role TEXT,
                content TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS usage_logs (
                id TEXT PRIMARY KEY,
                session_id TEXT REFERENCES sessions(id) ON DELETE CASCADE,
                model_name TEXT,
                prompt_tokens INTEGER,
                completion_tokens INTEGER,
                embedding_tokens INTEGER,
                total_cost_usd REAL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS registrations (
                id TEXT PRIMARY KEY,
                session_id TEXT,
                name TEXT NOT NULL,
                phone TEXT NOT NULL,
                email TEXT DEFAULT '',
                notes TEXT DEFAULT '',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        # Facebook pages (for multi-channel integration)
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS facebook_pages (
                id TEXT PRIMARY KEY,
                page_id TEXT UNIQUE NOT NULL,
                page_name TEXT NOT NULL,
                page_access_token TEXT NOT NULL,
                is_active INTEGER DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        # AI config key-value store
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS ai_config (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # Performance indexes
        await conn.execute("CREATE INDEX IF NOT EXISTS idx_messages_session ON messages(session_id)")
        await conn.execute("CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at)")
        await conn.execute("CREATE INDEX IF NOT EXISTS idx_sessions_updated ON sessions(updated_at DESC)")
        await conn.execute("CREATE INDEX IF NOT EXISTS idx_registrations_created ON registrations(created_at)")
        await conn.execute("CREATE INDEX IF NOT EXISTS idx_usage_session ON usage_logs(session_id)")


# ---------------------------------------------------------------------------
# Usage logging
# ---------------------------------------------------------------------------

async def log_usage(session_id, model_name, prompt_tokens, completion_tokens,
                    embedding_tokens, total_cost_usd):
    async with get_pool().acquire() as conn:
        await conn.execute(
            """INSERT INTO usage_logs
               (id, session_id, model_name, prompt_tokens, completion_tokens,
                embedding_tokens, total_cost_usd)
               VALUES ($1, $2, $3, $4, $5, $6, $7)""",
            str(uuid.uuid4()), session_id, model_name,
            prompt_tokens, completion_tokens, embedding_tokens, total_cost_usd,
        )


# ---------------------------------------------------------------------------
# Stage management
# ---------------------------------------------------------------------------

async def advance_stage(session_id: str, proposed_stage: str):
    """Upgrade stage only — never downgrade."""
    current_stage, is_registered = await get_session_state(session_id)
    if is_registered:
        return
    if STAGE_HIERARCHY.get(proposed_stage, 0) > STAGE_HIERARCHY.get(current_stage, 0):
        async with get_pool().acquire() as conn:
            await conn.execute(
                "UPDATE sessions SET current_stage = $1 WHERE id = $2",
                proposed_stage, session_id,
            )


async def mark_registered(session_id):
    """Set is_registered=1 and move to terminal stage."""
    async with get_pool().acquire() as conn:
        await conn.execute(
            "UPDATE sessions SET is_registered = 1, current_stage = $1 WHERE id = $2",
            STAGE_TERMINAL, session_id,
        )


async def get_session_state(session_id):
    """Return (current_stage, is_registered) tuple."""
    async with get_pool().acquire() as conn:
        row = await conn.fetchrow(
            "SELECT current_stage, is_registered FROM sessions WHERE id = $1",
            session_id,
        )
        if row:
            return row["current_stage"], row["is_registered"]
        return STAGE_INITIAL, 0


# ---------------------------------------------------------------------------
# Session CRUD
# ---------------------------------------------------------------------------

async def get_all_sessions():
    async with get_pool().acquire() as conn:
        rows = await conn.fetch("SELECT * FROM sessions ORDER BY updated_at DESC")
        return [dict(r) for r in rows]


async def create_session(session_id=None, title="New Chat"):
    """Create session if not exists (idempotent)."""
    if not session_id:
        session_id = str(uuid.uuid4())
    async with get_pool().acquire() as conn:
        await conn.execute(
            "INSERT INTO sessions (id, title) VALUES ($1, $2) ON CONFLICT DO NOTHING",
            session_id, title,
        )
    return session_id


async def update_session_title(session_id, title):
    async with get_pool().acquire() as conn:
        await conn.execute(
            "UPDATE sessions SET title = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
            title, session_id,
        )


async def delete_session(session_id):
    """Delete session — CASCADE removes messages and usage_logs automatically."""
    async with get_pool().acquire() as conn:
        await conn.execute("DELETE FROM sessions WHERE id = $1", session_id)


# ---------------------------------------------------------------------------
# Messages
# ---------------------------------------------------------------------------

async def add_message(session_id, role, content):
    """Save message. Ensures session exists first."""
    async with get_pool().acquire() as conn:
        await conn.execute(
            "INSERT INTO sessions (id, title) VALUES ($1, $2) ON CONFLICT DO NOTHING",
            session_id, "New Chat",
        )
        msg_id = str(uuid.uuid4())
        await conn.execute(
            "INSERT INTO messages (id, session_id, role, content) VALUES ($1, $2, $3, $4)",
            msg_id, session_id, role, content,
        )
        await conn.execute(
            "UPDATE sessions SET updated_at = CURRENT_TIMESTAMP WHERE id = $1",
            session_id,
        )
        return msg_id


async def get_session_messages(session_id):
    async with get_pool().acquire() as conn:
        rows = await conn.fetch(
            "SELECT * FROM messages WHERE session_id = $1 ORDER BY created_at ASC",
            session_id,
        )
        return [dict(r) for r in rows]


# ---------------------------------------------------------------------------
# Registrations
# ---------------------------------------------------------------------------

async def save_registration(session_id, name, phone, email="", notes=""):
    async with get_pool().acquire() as conn:
        reg_id = str(uuid.uuid4())
        await conn.execute(
            """INSERT INTO registrations (id, session_id, name, phone, email, notes)
               VALUES ($1, $2, $3, $4, $5, $6)""",
            reg_id, session_id, name, phone, email, notes,
        )
        return reg_id


async def get_registrations(date_from=None, date_to=None):
    conditions = []
    params = []
    if date_from:
        params.append(date_from)
        conditions.append(f"DATE(created_at) >= ${len(params)}")
    if date_to:
        params.append(date_to)
        conditions.append(f"DATE(created_at) <= ${len(params)}")

    where = (" WHERE " + " AND ".join(conditions)) if conditions else ""
    query = f"SELECT * FROM registrations{where} ORDER BY created_at DESC"

    async with get_pool().acquire() as conn:
        rows = await conn.fetch(query, *params)
        return [dict(r) for r in rows]


async def delete_registration(reg_id):
    async with get_pool().acquire() as conn:
        await conn.execute("DELETE FROM registrations WHERE id = $1", reg_id)


# ---------------------------------------------------------------------------
# System stats (for Status dashboard)
# ---------------------------------------------------------------------------

async def get_system_stats():
    async with get_pool().acquire() as conn:
        stats = {}
        stats["sessions_total"] = await conn.fetchval("SELECT COUNT(*) FROM sessions")
        stats["sessions_today"] = await conn.fetchval(
            "SELECT COUNT(*) FROM sessions WHERE DATE(created_at) = CURRENT_DATE"
        )
        stats["messages_total"] = await conn.fetchval("SELECT COUNT(*) FROM messages")
        stats["registrations_total"] = await conn.fetchval("SELECT COUNT(*) FROM registrations")
        stats["registrations_today"] = await conn.fetchval(
            "SELECT COUNT(*) FROM registrations WHERE DATE(created_at) = CURRENT_DATE"
        )
        row = await conn.fetchrow(
            """SELECT COALESCE(SUM(total_cost_usd), 0),
                      COALESCE(SUM(prompt_tokens), 0),
                      COALESCE(SUM(completion_tokens), 0)
               FROM usage_logs"""
        )
        stats["total_cost_usd"] = round(float(row[0]), 4)
        stats["total_prompt_tokens"] = int(row[1])
        stats["total_completion_tokens"] = int(row[2])

        try:
            stats["fb_total"] = await conn.fetchval("SELECT COUNT(*) FROM facebook_pages")
            stats["fb_active"] = await conn.fetchval(
                "SELECT COUNT(*) FROM facebook_pages WHERE is_active = 1"
            )
        except Exception:
            stats["fb_total"] = 0
            stats["fb_active"] = 0

        return stats


async def delete_all_sessions():
    """Wipe all sessions + messages (CASCADE). Used by admin danger zone."""
    async with get_pool().acquire() as conn:
        await conn.execute("DELETE FROM sessions")


# ---------------------------------------------------------------------------
# Facebook pages
# ---------------------------------------------------------------------------

async def get_facebook_pages():
    """List pages without tokens (for UI listing)."""
    async with get_pool().acquire() as conn:
        rows = await conn.fetch(
            "SELECT id, page_id, page_name, is_active, created_at FROM facebook_pages ORDER BY created_at DESC"
        )
        return [dict(r) for r in rows]


async def get_facebook_page_token(page_id: str):
    """Return encrypted token for webhook processing."""
    async with get_pool().acquire() as conn:
        return await conn.fetchval(
            "SELECT page_access_token FROM facebook_pages WHERE page_id = $1 AND is_active = 1",
            page_id,
        )


async def add_facebook_page(page_id, page_name, encrypted_token):
    async with get_pool().acquire() as conn:
        row_id = str(uuid.uuid4())
        await conn.execute(
            """INSERT INTO facebook_pages (id, page_id, page_name, page_access_token)
               VALUES ($1, $2, $3, $4)
               ON CONFLICT (page_id) DO UPDATE SET page_name = $3, page_access_token = $4""",
            row_id, page_id, page_name, encrypted_token,
        )
        return row_id


async def delete_facebook_page(row_id: str):
    async with get_pool().acquire() as conn:
        await conn.execute("DELETE FROM facebook_pages WHERE id = $1", row_id)


async def toggle_facebook_page(row_id: str):
    async with get_pool().acquire() as conn:
        await conn.execute(
            "UPDATE facebook_pages SET is_active = CASE WHEN is_active = 1 THEN 0 ELSE 1 END WHERE id = $1",
            row_id,
        )


# ---------------------------------------------------------------------------
# AI config
# ---------------------------------------------------------------------------

async def get_ai_config():
    async with get_pool().acquire() as conn:
        rows = await conn.fetch("SELECT key, value FROM ai_config")
        return {r["key"]: r["value"] for r in rows}


async def set_ai_config(key: str, value: str):
    async with get_pool().acquire() as conn:
        await conn.execute(
            """INSERT INTO ai_config (key, value, updated_at) VALUES ($1, $2, CURRENT_TIMESTAMP)
               ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = CURRENT_TIMESTAMP""",
            key, value,
        )


async def set_ai_config_bulk(config_dict: dict):
    async with get_pool().acquire() as conn:
        async with conn.transaction():
            for key, value in config_dict.items():
                await conn.execute(
                    """INSERT INTO ai_config (key, value, updated_at) VALUES ($1, $2, CURRENT_TIMESTAMP)
                       ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = CURRENT_TIMESTAMP""",
                    key, str(value),
                )
