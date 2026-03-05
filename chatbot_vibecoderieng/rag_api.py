"""
rag_api.py — RAG document management: list, delete, upload+reindex.

Upload flow:
  1. Save file to ./tailieuduan/
  2. Run scripts/ingest_semantic.py as subprocess (full rebuild — safest approach)
  3. Reload FAISS index into main.py globals on completion
"""

import os
import uuid
import shutil
import asyncio
import logging
import subprocess
import json
from typing import Dict, Optional

from fastapi import UploadFile

logger = logging.getLogger(__name__)

TAILIEU_DIR = "./tailieuduan"
FAISS_PATH = "./faiss_index"
ALLOWED_EXTENSIONS = {".pdf", ".docx", ".txt", ".xlsx", ".xls", ".md"}
MAX_UPLOAD_SIZE = 50 * 1024 * 1024  # 50 MB

# In-memory task status tracker
indexing_tasks: Dict[str, dict] = {}


def list_documents(vectorstore) -> list:
    """Extract unique source documents from FAISS vectorstore metadata."""
    if not vectorstore:
        return []
    sources: Dict[str, int] = {}
    for doc in vectorstore.docstore._dict.values():
        src = doc.metadata.get("source", "unknown")
        src_name = os.path.basename(src)
        sources[src_name] = sources.get(src_name, 0) + 1
    return [{"source": k, "chunk_count": v} for k, v in sorted(sources.items())]


def delete_document_from_index(source_name: str, vectorstore, embeddings):
    """
    Remove all chunks matching source_name and rebuild FAISS index.
    Returns new vectorstore or None if no docs remain.
    """
    from langchain_community.vectorstores import FAISS

    all_docs = list(vectorstore.docstore._dict.values())
    remaining = [
        d for d in all_docs
        if os.path.basename(d.metadata.get("source", "")) != source_name
    ]

    if not remaining:
        # Remove index files if no docs left
        if os.path.exists(FAISS_PATH):
            shutil.rmtree(FAISS_PATH)
        return None

    new_vs = FAISS.from_documents(remaining, embedding=embeddings)
    new_vs.save_local(FAISS_PATH)
    return new_vs


async def start_upload_task(
    file_content: bytes,
    filename: str,
    task_id: str,
    reload_callback,
):
    """Background task: save file + run ingest + reload retriever."""
    indexing_tasks[task_id] = {"status": "processing", "filename": filename, "error": None}

    # Sanitize filename
    safe_name = os.path.basename(filename)
    _, ext = os.path.splitext(safe_name)
    if ext.lower() not in ALLOWED_EXTENSIONS:
        indexing_tasks[task_id] = {"status": "error", "filename": filename, "error": "Định dạng file không hỗ trợ"}
        return

    # Ensure tailieuduan dir exists
    os.makedirs(TAILIEU_DIR, exist_ok=True)
    dest_path = os.path.join(TAILIEU_DIR, safe_name)

    try:
        # Write file to disk
        with open(dest_path, "wb") as f:
            f.write(file_content)
        logger.info(f"[RAG] Saved upload: {dest_path}")

        # Run ingest subprocess with --new-file for dedup scoping
        result = await asyncio.create_subprocess_exec(
            "python", "scripts/ingest_semantic.py", "--new-file", safe_name,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )
        stdout, stderr = await result.communicate()

        if result.returncode != 0:
            err_msg = stderr.decode(errors="replace")[-500:]
            logger.error(f"[RAG] Ingest failed: {err_msg}")
            indexing_tasks[task_id] = {"status": "error", "filename": filename, "error": err_msg}
            return

        logger.info(f"[RAG] Ingest complete for {safe_name}")

        # Parse dedup stats from stdout
        dedup_stats = None
        stdout_text = stdout.decode(errors="replace")
        for line in stdout_text.splitlines():
            if line.startswith("DEDUP_STATS:"):
                try:
                    dedup_stats = json.loads(line[len("DEDUP_STATS:"):])["dedup_stats"]
                except Exception:
                    pass

        # Reload main.py FAISS globals
        await reload_callback()

        indexing_tasks[task_id] = {
            "status": "done",
            "filename": filename,
            "error": None,
            "dedup_stats": dedup_stats,
        }

    except Exception as e:
        logger.error(f"[RAG] Upload task error: {e}")
        indexing_tasks[task_id] = {"status": "error", "filename": filename, "error": str(e)}


def get_task_status(task_id: str) -> Optional[dict]:
    return indexing_tasks.get(task_id)
