# Deployment Guide

---

## Prerequisites

```
Docker + Docker Compose
API Keys: GOOGLE_API_KEY, OPENAI_API_KEY, DEEPSEEK_API_KEY
```

---

## Setup lần đầu

### 1. Clone và cấu hình env
```bash
cp .env.example .env   # hoặc tạo .env mới
# Điền các API keys vào .env
```

### 2. Build FAISS index (một lần, hoặc khi thêm tài liệu)
```bash
# Local (cần venv)
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python ingest_semantic.py

# Kết quả: faiss_index/index.faiss + faiss_index/index.pkl
```

### 3. Build và chạy Docker
```bash
docker compose build
docker compose up -d

# App chạy tại http://localhost:7777
# Dashboard: bấm "Lịch sử chat" 5 lần → /#/dashboard
```

---

## Docker Architecture

```
                    Internet
                        │
                   port 7777
                        │
              ┌─────────────────┐
              │  frontend (nginx)│
              │  Vite build      │
              │  → React SPA     │
              │  /api/* → proxy  │
              └────────┬────────┘
                       │ Docker internal network
                       │ http://backend:8888
              ┌─────────────────┐
              │  backend        │
              │  FastAPI        │
              │  expose: 8888   │  ← NOT published to host
              └────────┬────────┘
                       │
              ┌─────────────────┐
              │  Volumes        │
              │  backend-data/  │  ← SQLite chat.db
              │  faiss_index/   │  ← Vector index (read-only)
              │  prompts/       │  ← AI config (read-only)
              │  tailieuduan/   │  ← Source docs (read-only)
              └─────────────────┘
```

**Backend không expose ra ngoài** — chỉ accessible qua nginx proxy. Nginx forward `/api/*` → `http://backend:8888`.

---

## Update tài liệu RAG

```bash
# 1. Thêm/sửa file trong tailieuduan/
# 2. Rebuild index (local, không cần Docker down)
python ingest_semantic.py
# 3. Restart backend để load index mới
docker compose restart backend
```

---

## Update prompts / AI behavior

```bash
# Sửa file trong prompts/ (stages-flow.json, system-role-and-rules.txt, welcome-message.txt)
# Restart backend — prompts load lúc startup
docker compose restart backend

# Nếu sửa frontend/src/welcome-message.txt:
docker compose build frontend
docker compose up -d frontend
```

---

## Chạy local (dev mode)

### Backend
```bash
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8888 --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev   # http://localhost:5173
# Vite proxy: /api/* → http://localhost:8888 (cấu hình trong vite.config.js)
```

---

## Deploy mới cho project khác

Checklist khi clone project này cho client mới:

```
□ Thay tailieuduan/ — tài liệu của client mới
□ Chạy python ingest_semantic.py — rebuild FAISS index
□ Sửa prompts/system-role-and-rules.txt — đổi ROLE, OBJECTIVE, tên AI
□ Sửa prompts/stages-flow.json — đổi stage prompts phù hợp domain mới
□ Sửa prompts/welcome-message.txt — lời chào mới
□ Sửa frontend/src/welcome-message.txt — lời chào frontend
□ Cấu hình .env — API keys
□ docker compose build && docker compose up -d
```

---

## Test

```bash
# E2E test (cần backend đang chạy trên port 8888)
source venv/bin/activate
python execution/test_chat_flow.py
```

Kết quả mong đợi: 25/25 tests pass, không có tag leakage.

---

## Logs

```bash
docker compose logs backend -f
docker compose logs frontend -f
```

---

## Common Issues

| Vấn đề | Nguyên nhân | Fix |
|--------|-------------|-----|
| `chat.db readonly` | DB file owned by root | Dùng volume `backend-data`, không mount file trực tiếp |
| FAISS not found | Index chưa build | Chạy `python ingest_semantic.py` |
| Prompts load fail | File missing/sai JSON | Check `prompts/stages-flow.json` valid JSON |
| Frontend không thấy API | Proxy config sai | Check `vite.config.js` target port |
| Docker network error | Backend chưa ready | `depends_on: backend` trong compose |
