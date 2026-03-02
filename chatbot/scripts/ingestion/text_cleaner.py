"""Remove formatting noise from raw text before LLM processing.
Cleans: markdown images, box-drawing, backslash escapes, HTML entities,
zero-width chars, control chars, horizontal rules, extra whitespace.
"""
import re
import html


def clean_text(text: str) -> str:
    """Strip visual/formatting noise that pollutes semantic embeddings."""
    # Decode HTML entities: &amp; → &, &nbsp; → space, &#39; → ', etc.
    text = html.unescape(text)

    # Remove zero-width / invisible Unicode: ZWSP, BOM, ZWNJ, ZWJ, soft-hyphen
    text = re.sub(r'[\u200b\u200c\u200d\ufeff\u00ad\u2060]+', '', text)

    # Remove control characters (keep \n \t \r)
    text = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', '', text)

    # Remove markdown image syntax: ![alt](path)
    text = re.sub(r'!\[.*?\]\(.*?\)', '', text)
    # Remove markdown links — keep display text: [text](url) → text
    text = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', text)
    # Remove backslash escapes: \-, \*, \>, \. etc.
    text = re.sub(r'\\([^\w\s])', r'\1', text)

    # Remove ASCII/Unicode box-drawing characters
    text = re.sub(r'[┌┐└┘│─├┤┬┴┼╔╗╚╝║═▼▲►◄→←↑↓]+', '', text)
    # Remove lines that are ONLY box-drawing / whitespace (diagram rows)
    text = re.sub(r'^\s*[┌┐└┘│─├┤┬┴┼╔╗╚╝║═▼▲►◄→←\s]+$', '', text, flags=re.MULTILINE)

    # Remove horizontal rules: --- / === / *** (3+ repeated)
    text = re.sub(r'^[\-=\*]{3,}\s*$', '', text, flags=re.MULTILINE)

    # Remove lines that are purely decorative: ~~~~, ####
    text = re.sub(r'^[~#\-=_]{4,}\s*$', '', text, flags=re.MULTILINE)

    # Collapse 3+ consecutive blank lines → 2
    text = re.sub(r'\n{3,}', '\n\n', text)
    # Strip trailing whitespace per line
    text = '\n'.join(line.rstrip() for line in text.split('\n'))
    return text.strip()
