"""Extract key entities (names, numbers) from source text for coverage validation.
These 'anchors' must appear in LLM-generated chunks — any miss triggers fallback.
"""
import re
from typing import Dict, List

# Common Vietnamese surnames for name detection
_VIET_SURNAMES = [
    'Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Phan', 'Vũ', 'Đặng',
    'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý', 'Lưu', 'Đinh', 'Đoàn',
]

_HONORIFICS = r'(?:Mr\.|Ms\.|Mrs\.|TS\.|GS\.|ThS\.|PGS\.)'
_SURNAME_PAT = '|'.join(re.escape(s) for s in _VIET_SURNAMES)


def extract_anchors(text: str) -> Dict[str, List[str]]:
    """
    Extract entities that MUST survive into LLM chunks unchanged.
    Returns: {"names": [...], "numbers": [...]}
    """
    # Names with honorifics: Mr. Nguyễn Văn Tiệp
    honorific_names = re.findall(
        rf'{_HONORIFICS}\s+[\wÀ-ỹ]{{2,}}\s+[\wÀ-ỹ]{{2,}}(?:\s+[\wÀ-ỹ]{{2,}})?',
        text
    )
    # Full Vietnamese 3-part names by surname pattern
    surname_names = re.findall(
        rf'(?:{_SURNAME_PAT})\s+[\wÀ-ỹ]{{2,}}\s+[\wÀ-ỹ]{{2,}}',
        text
    )

    # Numbers with units that carry real information (prices, durations, ratios)
    numbers = re.findall(
        r'\d[\d.,]+\s*(?:VNĐ|đồng|%|triệu|tuần|giờ|buổi|người|tháng|năm|k\b)',
        text
    )
    # Standalone significant numbers (>=4 digits = phone/price/etc.)
    big_numbers = re.findall(r'\b\d{4,}\b', text)

    all_names = list(set(n.strip() for n in honorific_names + surname_names if n.strip()))
    all_numbers = list(set(n.strip() for n in numbers + big_numbers if n.strip()))

    return {"names": all_names, "numbers": all_numbers}
