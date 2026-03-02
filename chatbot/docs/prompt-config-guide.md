# Prompt & Config Guide

> Mọi thứ AI cần biết để tùy chỉnh behavior của chatbot — không cần sửa code Python/JS.

---

## Cấu trúc prompts/

```
prompts/
├── stages-flow.json          ← QUAN TRỌNG NHẤT — stage engine + per-stage prompts
├── system-role-and-rules.txt ← Identity AI, tone, strict rules
└── welcome-message.txt       ← Lời chào (backend version)

frontend/src/
└── welcome-message.txt       ← Lời chào (frontend version — bake vào JS bundle lúc build)
```

> ⚠️ Có 2 file welcome-message.txt: một cho backend (lưu vào DB), một cho frontend (hiện ngay lập tức). Phải sửa cả hai nếu muốn đổi lời chào.

---

## stages-flow.json — Chi tiết

```json
{
    "initial": "BASIC",           // Stage mặc định khi tạo session mới
    "terminal": "REGISTERED",     // Stage sau khi user đăng ký — không advance nữa
    "cta_strip_when_terminal": ["OPEN_REGISTER", "REGISTER_BTN"], // Tag bị strip cho user đã đăng ký

    "faq_override_instruction": "...",  // Instruction khi tìm thấy FAQ match trong RAG

    "stages": [
        {
            "id": "BASIC",
            "prompt": "..."    // Instruction AI ở stage này
        },
        {
            "id": "PRICING",
            "prompt": "..."
        },
        {
            "id": "COMPLEX",
            "prompt": "..."   // Stage này mới được dùng [[OPEN_REGISTER]]
        },
        {
            "id": "REGISTERED",
            "prompt": "..."
        }
    ]
}
```

### Quy tắc stage quan trọng:
- **Thứ tự array = thứ tự advance** — BASIC(0) → PRICING(1) → COMPLEX(2) → REGISTERED(3)
- **Chỉ upgrade, không downgrade** — AI phân loại sai cũng không reset stage
- **AI tự quyết định stage** qua tag `[[STAGE:XXX]]` ở token đầu tiên của response
- **Backend buffer 80 chars** đầu để extract tag trước khi stream ra frontend

### Thêm stage mới:
1. Thêm object vào array `stages` ở vị trí muốn
2. `database.py` tự đọc order từ file → không cần sửa code
3. Thêm rule vào `system-role-and-rules.txt` để AI biết dùng `[[STAGE:TEN_MOI]]`

---

## system-role-and-rules.txt — Chi tiết

File plain text. Các phần quan trọng:

```
ROLE: ...         ← Tên, identity, domain của AI
OBJECTIVE: ...    ← Mục tiêu cuộc hội thoại
TONE: ...         ← Phong cách trả lời
LANGUAGE RULE:    ← Quy tắc ngôn ngữ (detect và reply cùng ngôn ngữ)

STRICT RULES:
1-5: Rules về cách trả lời
6. STAGE TAG:     ← Định nghĩa [[STAGE:XXX]] tags và khi nào dùng
7. REGISTRATION CTA: ← Quy tắc dùng [[OPEN_REGISTER]]

SUPPORTING INFORMATION:
{context}         ← Placeholder — backend inject RAG context vào đây
```

### Thay đổi cho project mới:
- Đổi ROLE (tên AI, công ty, domain)
- Đổi OBJECTIVE (mục tiêu tư vấn)
- Giữ nguyên cấu trúc STAGE TAG và REGISTRATION CTA

---

## Special Tags — Cách hoạt động

### `[[STAGE:XXX]]`
- AI đặt ở **token đầu tiên** của mỗi response
- Backend buffer → extract → `advance_stage()` → strip khỏi stream
- Frontend **không bao giờ nhìn thấy** tag này
- Values: `BASIC`, `PRICING`, `COMPLEX` (REGISTERED do backend set khi đăng ký)

### `[[OPEN_REGISTER]]`
- AI đặt ở **cuối response**, khi ở stage COMPLEX
- Backend **giữ lại** trong stream (không strip)
- `MessageBubble.jsx` parse → render thành button "Đăng ký tư vấn ngay"
- User bấm button → `RegistrationModal` mở
- Sau khi đăng ký → backend strip tag này khỏi mọi response tiếp theo

### `[[REGISTER_BTN]]`
- Tag cũ, luôn bị strip — không dùng nữa

---

## FAQ Override (faq_override_instruction)

Khi RAG tìm thấy document có `type == "script_faq"` (từ file xlsx câu hỏi thường gặp):
1. Extract phần "ANSWER:" từ document
2. Append `faq_override_instruction` vào system prompt với `{script_answer}`
3. AI được hướng dẫn dùng câu trả lời đã verify này làm base

### Để thêm FAQ:
Thêm Q&A vào file xlsx trong `tailieuduan/`, chạy lại `ingest_semantic.py`.

---

## Welcome Message

### Backend (`prompts/welcome-message.txt`):
- Được inject vào SQLite khi session mới tạo lần đầu gọi API
- Stored trong DB như tin nhắn bot thật
- Đọc bằng `PROMPTS["welcome_message"]` trong `main.py`

### Frontend (`frontend/src/welcome-message.txt`):
- Import qua Vite `?raw` → baked into JS bundle lúc build
- Hiện **ngay lập tức** khi app load — không cần API call
- `const WELCOME_MESSAGE = ...` trong `useChat.js`

### Đổi welcome message:
Sửa cả 2 file, rebuild frontend.
