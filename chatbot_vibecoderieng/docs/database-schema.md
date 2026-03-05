# Database Schema & Storage Guide

---

## SQLite — Operational DB (`chat.db`)

File path: `CHAT_DB_FILE` env var (default `chat.db`, Docker: `/app/data/chat.db`)

### Tables

#### `sessions`
```sql
id           TEXT PRIMARY KEY   -- UUID
title        TEXT               -- Tên hiển thị sidebar (30 chars đầu của tin nhắn đầu)
current_stage TEXT DEFAULT 'BASIC'  -- Stage hiện tại: BASIC / PRICING / COMPLEX / REGISTERED
is_registered INTEGER DEFAULT 0     -- 1 nếu đã điền form đăng ký
created_at   TIMESTAMP
updated_at   TIMESTAMP
```

#### `messages`
```sql
id         TEXT PRIMARY KEY
session_id TEXT → sessions.id
role       TEXT   -- 'user' | 'bot'
content    TEXT   -- Nội dung đã strip toàn bộ [[STAGE:]] và [[OPEN_REGISTER]] tags
created_at TIMESTAMP
```

#### `registrations` (leads)
```sql
id         TEXT PRIMARY KEY
session_id TEXT → sessions.id
name       TEXT NOT NULL
phone      TEXT NOT NULL
email      TEXT DEFAULT ''
notes      TEXT DEFAULT ''
created_at TIMESTAMP
```

#### `usage_logs`
```sql
id                TEXT PRIMARY KEY
session_id        TEXT → sessions.id
model_name        TEXT   -- 'deepseek-chat'
prompt_tokens     INTEGER
completion_tokens INTEGER
embedding_tokens  INTEGER
total_cost_usd    REAL
created_at        TIMESTAMP
```

#### `scripts` (legacy)
```sql
name    TEXT PRIMARY KEY
content TEXT
```
Bảng này chứa script mẫu cho registration CTA. Không còn dùng trong flow chính.

---

### Key DB Functions (`database.py`)

| Function | Mô tả |
|----------|-------|
| `init_db()` | Tạo tables nếu chưa có, chạy migration |
| `create_session(id, title)` | Idempotent — OK gọi nhiều lần |
| `add_message(session_id, role, content)` | Lưu tin nhắn |
| `get_session_messages(session_id)` | Lấy toàn bộ messages |
| `advance_stage(session_id, proposed)` | Chỉ upgrade stage, không downgrade |
| `mark_registered(session_id)` | Set `is_registered=1`, stage → REGISTERED |
| `save_registration(...)` | Lưu lead vào bảng registrations |
| `get_registrations(date_from, date_to)` | Lấy leads, filter theo ngày |
| `delete_registration(id)` | Xóa lead |
| `log_usage(...)` | Ghi usage/cost tracking |

### Stage Config trong DB
`database.py` tự load stage order từ `prompts/stages-flow.json` lúc startup.
`STAGE_HIERARCHY` dict được build từ array `stages[].id` theo index.
Nếu file JSON missing → fallback hardcoded `["BASIC", "PRICING", "COMPLEX", "REGISTERED"]`.

---

## FAISS — Vector DB (RAG)

### Files
```
faiss_index/
├── index.faiss    -- Vector embeddings
└── index.pkl      -- Document metadata (source, title, type, tags)
```

### Build index
```bash
# Đọc toàn bộ files trong tailieuduan/ → chunk semantic → embed → lưu FAISS
python ingest_semantic.py
```

### Ingest pipeline
1. `.docx` → đọc text → **Gemini 2.5 Flash** phân tích ngữ nghĩa → tạo chunks có title/summary/tags
2. `.xlsx` → đọc row-by-row:
   - File "Câu hỏi thường gặp": format `QUESTION: ...\nANSWER: ...` → `type=script_faq`
   - File khác: mỗi row là 1 document
3. Embed bằng **OpenAI text-embedding-3-small**
4. Save vào FAISS local

### Retrieval (runtime)
- `ensemble_retriever.invoke(query)` → top-5 docs (cosine similarity)
- Nếu có `script_faq` match → extract ANSWER → FAQ override instruction
- Toàn bộ context inject vào `{context}` trong system prompt

### Cập nhật knowledge base
```bash
# Thêm/sửa file trong tailieuduan/
# Chạy lại ingest — sẽ rebuild toàn bộ index
python ingest_semantic.py
# Restart backend để load index mới
```

---

## So sánh Vector DB — Lựa chọn về sau

### FAISS (hiện tại)
```
✅ Zero overhead, load vào RAM, cực nhanh
✅ Zero config, file-based
✅ Đủ cho KB < 500 docs
❌ Không có persistent realtime (phải save/load thủ công)
❌ Không filter theo metadata
❌ Không scale ngang
→ Dùng khi: single project, KB nhỏ, muốn đơn giản nhất
```

### Chroma (upgrade tự nhiên từ FAISS)
```
✅ File-based, auto-persist
✅ Filter metadata (by source, type, date)
✅ Mỗi project 1 collection riêng
✅ API đơn giản, LangChain support tốt
✅ ~20 dòng thay đổi từ FAISS
❌ Chậm hơn FAISS một chút với large dataset
→ Dùng khi: muốn auto-persist, cần filter, multi-project trên 1 machine
```

### Qdrant (khi scale)
```
✅ Hybrid search built-in (dense + BM25 sparse)
✅ REST API chuẩn
✅ Nhẹ (~100MB RAM baseline)
✅ Multi-tenancy
✅ Dashboard UI
❌ Cần Docker service riêng
❌ Setup phức tạp hơn
→ Dùng khi: 10+ projects, cần hybrid search, scale
```

### Weaviate (SaaS platform)
```
✅ Multi-tenancy tốt nhất — 1 instance nhiều clients hoàn toàn cô lập
✅ GraphQL + REST
✅ Auto-embedding option
❌ Nặng (~1GB RAM)
❌ GraphQL learning curve
❌ Overkill cho single project
→ Dùng khi: SaaS model, nhiều clients trên 1 infra, cần tenant isolation
```

### Migration FAISS → Chroma (ước tính)
```python
# ingest_semantic.py: đổi ~5 dòng
from langchain_community.vectorstores import Chroma
vectorstore = Chroma.from_documents(documents, embeddings, persist_directory="./chroma_index")

# main.py: đổi ~5 dòng
from langchain_community.vectorstores import Chroma
vectorstore = Chroma(persist_directory="./chroma_index", embedding_function=embeddings)
```
