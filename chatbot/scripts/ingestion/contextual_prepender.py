"""Contextual Retrieval — Anthropic technique (2024).

For each chunk, LLM generates 1-2 sentences of context describing:
- What this chunk is about
- Where it sits within the document
- Key entities (names, numbers) it contains

This context is prepended to the chunk content before embedding,
dramatically improving retrieval accuracy (~49% error reduction).

Cost: 1 extra DeepSeek call per chunk at ingestion time (one-off cost).
"""
import logging
from typing import List

from langchain_core.documents import Document as LangchainDocument
from langchain_core.language_models import BaseChatModel
from langchain_core.messages import HumanMessage, SystemMessage

logger = logging.getLogger(__name__)

_CONTEXT_SYSTEM = """You are a RAG (Retrieval-Augmented Generation) optimization expert.

Task: Write 1-2 short sentences describing a chunk in the context of the source document.
This sentence will be prepended to the chunk to improve embedding search accuracy.

RULES:
- Maximum 80 words
- Mention the main topic of the chunk
- Preserve person names, organizations, statistics EXACTLY if present
- Write naturally and concisely
- ONLY return the context sentence — no explanation, no prefix like "This chunk is about..."
"""

_CONTEXT_HUMAN = """Source document (section):
<document>
{document}
</document>

Chunk to contextualize:
<chunk>
{chunk}
</chunk>

Write context sentence (1-2 sentences):"""


def prepend_context(
    chunks: List[LangchainDocument],
    section_text: str,
    llm: BaseChatModel,
    source_name: str,
) -> List[LangchainDocument]:
    """
    For each chunk: call LLM to generate a short context sentence,
    then prepend it to chunk.page_content before embedding.

    Skips chunks already in scripted FAQ format (type=script_faq).
    Skips fallback_raw chunks (already contain full section text).
    """
    enriched = []
    for i, chunk in enumerate(chunks):
        chunk_type = chunk.metadata.get("type", "")

        # Don't touch FAQ scripted answers or raw fallbacks
        if chunk_type in ("script_faq", "fallback_raw", "fallback"):
            enriched.append(chunk)
            continue

        try:
            messages = [
                SystemMessage(content=_CONTEXT_SYSTEM),
                HumanMessage(content=_CONTEXT_HUMAN.format(
                    document=section_text[:3000],  # cap context to avoid huge prompts
                    chunk=chunk.page_content[:1500],
                )),
            ]
            response = llm.invoke(messages)
            context_sentence = response.content.strip()

            # Prepend context sentence to chunk
            enriched_content = f"{context_sentence}\n\n{chunk.page_content}"
            enriched_chunk = LangchainDocument(
                page_content=enriched_content,
                metadata={**chunk.metadata, "has_context": True},
            )
            enriched.append(enriched_chunk)
            logger.info(
                f"[{source_name}] Chunk {i+1} contextualized: "
                f"{context_sentence[:80]}..."
            )

        except Exception as e:
            logger.warning(f"[{source_name}] Contextual prepend failed chunk {i+1}: {e}")
            enriched.append(chunk)  # keep original on error

    return enriched
