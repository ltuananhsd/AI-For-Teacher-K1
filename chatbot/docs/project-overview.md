# Azura Chatbot — Project Overview

> AI tư vấn định cư EB-3 USA. Đọc file này trước tất cả. Đây là nguồn sự thật duy nhất cho AI kế nhiệm.

---

## Stack

| Layer | Tech |
|-------|------|
| LLM | DeepSeek V3 (`deepseek-chat`) via LangChain |
| Embedding | OpenAI `text-embedding-3-small` |
| Vector DB | FAISS (local file, loaded to RAM) |
| Backend | FastAPI + uvicorn, Python 3.10 |
| Frontend | React + Vite + TailwindCSS |
| DB | SQLite (sessions, messages, registrations, usage_logs) |
| Proxy | Nginx (frontend container) |
| Deploy | Docker Compose |

---

## Cấu trúc thư mục

```
/
├── main.py                     # FastAPI app — toàn bộ API endpoints + chat logic
├── database.py                 # SQLite operations — sessions, messages, registrations
├── ingest_semantic.py          # One-time script: đọc tài liệu → tạo FAISS index
├── requirements.txt
├── Dockerfile                  # Backend Docker image (Python 3.10-slim)
├── docker-compose.yml          # Orchestration: backend + frontend
├── .env                        # API keys (KHÔNG commit)
│
├── prompts/                    # Toàn bộ AI config — chỉnh ở đây, không sửa code
│   ├── stages-flow.json        # Stage order, per-stage prompts, FAQ instruction
│   ├── system-role-and-rules.txt # AI role, tone, strict rules
│   └── welcome-message.txt     # Lời chào backend (inject vào DB)
│
├── faiss_index/                # Vector index (build bằng ingest_semantic.py)
│   ├── index.faiss
│   └── index.pkl
│
├── tailieuduan/                # Tài liệu nguồn để RAG (.docx, .xlsx)
│
├── execution/
│   └── test_chat_flow.py       # E2E test script
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx             # Root: hash routing + chat layout
│   │   ├── welcome-message.txt # Lời chào frontend (Vite ?raw import → instant display)
│   │   ├── hooks/useChat.js    # Toàn bộ chat state + API calls
│   │   ├── components/
│   │   │   ├── chat/MessageBubble.jsx      # Render message + [[OPEN_REGISTER]] → button
│   │   │   ├── layout/Sidebar.jsx          # Session list + hidden 5-tap dashboard trigger
│   │   │   └── modals/RegistrationModal.jsx # Form đăng ký lead
│   │   └── pages/RegistrationDashboard.jsx # Admin dashboard xem leads
│   └── Dockerfile              # Frontend Docker image (Node build → nginx serve)
│
└── docs/
    ├── project-overview.md     # File này
    ├── prompt-config-guide.md  # Hướng dẫn cấu hình prompts
    ├── database-schema.md      # Schema + migration notes
    ├── deployment-guide.md     # Deploy local + Docker
    └── langchain-reference/    # LangChain docs (tham khảo khi build)
```

---

## Luồng hoạt động chính

```
User nhắn tin
    → useChat.js (POST /api/v1/chat)
    → main.py: embed query → FAISS search (top-5 docs)
    → Check FAQ script match
    → Load session stage từ SQLite
    → Build system prompt = system-role-and-rules.txt + stage instruction + context
    → DeepSeek stream response
    → Buffer 80 chars đầu → extract [[STAGE:XXX]] tag
    → advance_stage() nếu stage mới cao hơn (KHÔNG downgrade)
    → Stream content về frontend
    → MessageBubble render [[OPEN_REGISTER]] → button
    → User bấm button → RegistrationModal → POST /api/v1/register → SQLite
```

---

## Routing Frontend

| URL | Component |
|-----|-----------|
| `/#/` hoặc bất kỳ | ChatApp (chat interface) |
| `/#/dashboard` | RegistrationDashboard (admin) |

**Hidden trigger**: bấm chữ "Lịch sử chat" 5 lần trong 2 giây → mở dashboard.

---

## API Endpoints

| Method | Path | Mô tả |
|--------|------|-------|
| POST | `/api/v1/chat` | Chat, stream response |
| GET | `/api/v1/history` | Danh sách sessions |
| GET | `/api/v1/history/{id}` | Messages của session |
| DELETE | `/api/v1/history/{id}` | Xóa session |
| POST | `/api/v1/register` | Lưu lead đăng ký |
| GET | `/api/v1/registrations` | Xem leads (có filter date) |
| DELETE | `/api/v1/registrations/{id}` | Xóa lead |

---

## Biến môi trường

```env
GOOGLE_API_KEY=...        # Dùng cho ingest_semantic.py (Gemini chunking)
OPENAI_API_KEY=...        # Embedding (text-embedding-3-small)
DEEPSEEK_API_KEY=...      # LLM chat
CHAT_DB_FILE=/app/data/chat.db  # SQLite path (Docker volume)
```
