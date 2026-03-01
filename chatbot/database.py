
import sqlite3
import json
import uuid
import os
from datetime import datetime

DB_FILE = os.environ.get("CHAT_DB_FILE", "chat.db")

# Load stage order from prompts/stages-flow.json — single source of truth
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
            "cta_strip_when_terminal": flow.get("cta_strip_when_terminal", [])
        }
    except Exception:
        # Fallback defaults if config missing
        order = ["BASIC", "PRICING", "COMPLEX", "REGISTERED"]
        return {
            "initial": "BASIC",
            "terminal": "REGISTERED",
            "hierarchy": {s: i for i, s in enumerate(order)},
            "cta_strip_when_terminal": ["OPEN_REGISTER", "REGISTER_BTN"]
        }

_STAGE_CFG = _load_stage_config()
STAGE_HIERARCHY = _STAGE_CFG["hierarchy"]   # kept for backward compat
STAGE_INITIAL = _STAGE_CFG["initial"]
STAGE_TERMINAL = _STAGE_CFG["terminal"]

def get_db_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    c = conn.cursor()
    # Create sessions table
    c.execute('''
        CREATE TABLE IF NOT EXISTS sessions (
            id TEXT PRIMARY KEY,
            title TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    # Create messages table
    c.execute('''
        CREATE TABLE IF NOT EXISTS messages (
            id TEXT PRIMARY KEY,
            session_id TEXT,
            role TEXT,
            content TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (session_id) REFERENCES sessions (id)
        )
    ''')
    c.execute('''
        CREATE TABLE IF NOT EXISTS usage_logs (
            id TEXT PRIMARY KEY,
            session_id TEXT,
            model_name TEXT,
            prompt_tokens INTEGER,
            completion_tokens INTEGER,
            embedding_tokens INTEGER,
            total_cost_usd REAL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (session_id) REFERENCES sessions (id)
        )
    ''')
    # Create registrations table (leads from registration form)
    c.execute('''
        CREATE TABLE IF NOT EXISTS registrations (
            id TEXT PRIMARY KEY,
            session_id TEXT,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            email TEXT DEFAULT '',
            notes TEXT DEFAULT '',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (session_id) REFERENCES sessions (id)
        )
    ''')
    
    # Migration: Add stage columns if they don't exist
    try:
        c.execute("ALTER TABLE sessions ADD COLUMN current_stage TEXT DEFAULT 'BASIC'")
    except:
        pass
    try:
        c.execute("ALTER TABLE sessions ADD COLUMN is_registered INTEGER DEFAULT 0")
    except:
        pass
    # cta_shown column kept for backward compat but no longer used
    
    conn.commit()
    conn.close()

def log_usage(session_id, model_name, prompt_tokens, completion_tokens, embedding_tokens, total_cost_usd):
    conn = get_db_connection()
    try:
        log_id = str(uuid.uuid4())
        conn.execute(
            'INSERT INTO usage_logs (id, session_id, model_name, prompt_tokens, completion_tokens, embedding_tokens, total_cost_usd) VALUES (?, ?, ?, ?, ?, ?, ?)',
            (log_id, session_id, model_name, prompt_tokens, completion_tokens, embedding_tokens, total_cost_usd)
        )
        conn.commit()
    except Exception as e:
        print(f"Error logging usage: {e}")
    finally:
        conn.close()

# Stage hierarchy loaded from config above (STAGE_HIERARCHY, STAGE_INITIAL, STAGE_TERMINAL)

def update_session_stage(session_id, stage):
    """Update the current stage for a session (raw, no guard)."""
    conn = get_db_connection()
    try:
        conn.execute('UPDATE sessions SET current_stage = ? WHERE id = ?', (stage, session_id))
        conn.commit()
    except Exception as e:
        print(f"Error updating stage: {e}")
    finally:
        conn.close()

def advance_stage(session_id: str, proposed_stage: str):
    """Only upgrade stage, never downgrade (BASIC -> PRICING -> COMPLEX).
    
    Guards against the AI misclassifying a follow-up casual question
    and resetting an already-upgraded stage back to BASIC.
    """
    current_stage, is_registered = get_session_state(session_id)
    if is_registered:
        return  # Registered users stay in REGISTERED stage
    
    current_level = STAGE_HIERARCHY.get(current_stage, 0)
    proposed_level = STAGE_HIERARCHY.get(proposed_stage, 0)
    
    if proposed_level > current_level:
        update_session_stage(session_id, proposed_stage)

def mark_registered(session_id):
    """Mark a session as registered and switch to terminal stage (config-driven)."""
    conn = get_db_connection()
    try:
        conn.execute('UPDATE sessions SET is_registered = 1, current_stage = ? WHERE id = ?',
                     (STAGE_TERMINAL, session_id))
        conn.commit()
    except Exception as e:
        print(f"Error marking registered: {e}")
    finally:
        conn.close()

def get_session_state(session_id):
    """Get the current stage and registration status for a session."""
    conn = get_db_connection()
    try:
        result = conn.execute(
            'SELECT current_stage, is_registered FROM sessions WHERE id = ?',
            (session_id,)
        ).fetchone()
        if result:
            return result['current_stage'], result['is_registered']
        return 'BASIC', 0
    finally:
        conn.close()

def get_all_sessions():
    conn = get_db_connection()
    try:
        # Get sessions ordered by updated_at descending
        sessions = conn.execute('SELECT * FROM sessions ORDER BY updated_at DESC').fetchall()
        return [dict(s) for s in sessions]
    finally:
        conn.close()

def create_session(session_id=None, title="New Chat"):
    conn = get_db_connection()
    try:
        if not session_id:
            session_id = str(uuid.uuid4())
        
        conn.execute(
            'INSERT OR IGNORE INTO sessions (id, title) VALUES (?, ?)',
            (session_id, title)
        )
        conn.commit()
        return session_id
    finally:
        conn.close()

def update_session_title(session_id, title):
    conn = get_db_connection()
    try:
        conn.execute('UPDATE sessions SET title = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', (title, session_id))
        conn.commit()
    finally:
        conn.close()

def add_message(session_id, role, content):
    conn = get_db_connection()
    try:
        # Ensure session exists
        create_session(session_id) # Won't duplicate due to IGNORE
        
        msg_id = str(uuid.uuid4())
        conn.execute(
            'INSERT INTO messages (id, session_id, role, content) VALUES (?, ?, ?, ?)',
            (msg_id, session_id, role, content)
        )
        
        # Update session timestamp
        conn.execute('UPDATE sessions SET updated_at = CURRENT_TIMESTAMP WHERE id = ?', (session_id,))
        
        conn.commit()
        return msg_id
    finally:
        conn.close()

def get_session_messages(session_id):
    conn = get_db_connection()
    try:
        messages = conn.execute(
            'SELECT * FROM messages WHERE session_id = ? ORDER BY created_at ASC',
            (session_id,)
        ).fetchall()
        return [dict(m) for m in messages]
    finally:
        conn.close()

def delete_session(session_id):
    conn = get_db_connection()
    try:
        conn.execute('DELETE FROM messages WHERE session_id = ?', (session_id,))
        conn.execute('DELETE FROM sessions WHERE id = ?', (session_id,))
        conn.commit()
    finally:
        conn.close()

def save_registration(session_id, name, phone, email='', notes=''):
    """Save a registration lead to DB."""
    conn = get_db_connection()
    try:
        reg_id = str(uuid.uuid4())
        conn.execute(
            'INSERT INTO registrations (id, session_id, name, phone, email, notes) VALUES (?, ?, ?, ?, ?, ?)',
            (reg_id, session_id, name, phone, email, notes)
        )
        conn.commit()
        return reg_id
    finally:
        conn.close()

def get_registrations(date_from=None, date_to=None):
    """Get registrations with optional date filter."""
    conn = get_db_connection()
    try:
        query = 'SELECT * FROM registrations'
        params = []
        conditions = []
        if date_from:
            conditions.append('DATE(created_at) >= ?')
            params.append(date_from)
        if date_to:
            conditions.append('DATE(created_at) <= ?')
            params.append(date_to)
        if conditions:
            query += ' WHERE ' + ' AND '.join(conditions)
        query += ' ORDER BY created_at DESC'
        rows = conn.execute(query, params).fetchall()
        return [dict(r) for r in rows]
    finally:
        conn.close()

def delete_registration(reg_id):
    """Delete a single registration by ID."""
    conn = get_db_connection()
    try:
        conn.execute('DELETE FROM registrations WHERE id = ?', (reg_id,))
        conn.commit()
    finally:
        conn.close()



# Initialize DB on import
init_db()
