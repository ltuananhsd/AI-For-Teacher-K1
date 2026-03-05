"""Validate that LLM-generated chunks cover all key anchors from the source.
If anchors are missing from chunks, a raw fallback chunk is created to prevent info loss.
"""
import logging
from typing import Dict, List

from langchain_core.documents import Document as LangchainDocument

logger = logging.getLogger(__name__)


def validate_coverage(
    chunks: List[LangchainDocument],
    anchors: Dict[str, List[str]],
    source_name: str,
) -> List[str]:
    """
    Check which anchors from the source are absent from all chunks combined.
    Returns list of missing anchor strings (empty list = full coverage).
    """
    all_chunk_text = " ".join(doc.page_content for doc in chunks)
    missing = []

    for category, items in anchors.items():
        for item in items:
            if item and item not in all_chunk_text:
                missing.append(item)
                logger.warning(f"[COVERAGE MISS] {source_name} | {category}: '{item}'")

    if not missing:
        logger.info(f"[COVERAGE OK] {source_name} — all anchors present")

    return missing


def create_fallback_chunk(
    missing_anchors: List[str],
    raw_source_text: str,
    source_name: str,
) -> LangchainDocument:
    """
    Fallback: store the original raw section as-is so no info is lost.
    Tagged as 'fallback_raw' for debugging — still searchable by FAISS.
    """
    preview = ", ".join(missing_anchors[:5])
    logger.info(f"[FALLBACK] {source_name} — adding raw chunk (missing: {preview}...)")
    return LangchainDocument(
        page_content=raw_source_text,
        metadata={
            "source": source_name,
            "title": "Thông tin bổ sung (raw fallback)",
            "type": "fallback_raw",
            "missing_anchors": ", ".join(missing_anchors[:10]),
        },
    )
