import requests
import time

API_URL = "http://localhost:8000/api/v1/chat"

questions = [
    "Khóa học này học xong làm được gì?",
    "Cho hỏi học phí khóa này là bao nhiêu vậy?",
    "Mình làm nhân sự (HR), quản lý hồ sơ và tuyển dụng thủ công rất mệt. Khóa này có giúp gì được không?",
    "Giảng viên là ai vậy?",
    "Nghe hấp dẫn đó, tôi muốn đăng ký học thì làm thế nào?"
]

for i, q in enumerate(questions):
    print(f"\n--- Câu hỏi {i+1}: {q} ---")
    session_id = f"test_tu_van_{i}"
    
    # Dummy request to bypass welcome message
    try:
        requests.post(API_URL, json={"message": "hi", "session_id": session_id}, timeout=5)
    except:
        pass

    try:
        response = requests.post(API_URL, json={"message": q, "session_id": session_id}, stream=True, timeout=60)
        answer = ""
        for chunk in response.iter_content(chunk_size=1024, decode_unicode=True):
            if chunk:
                answer += chunk
        print(f"Trả lời:\n{answer.strip()}\n")
    except Exception as e:
        print(f"Lỗi: {e}")
    time.sleep(1)
