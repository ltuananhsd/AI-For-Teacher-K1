import os
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings
from langchain_core.documents import Document
from dotenv import load_dotenv

load_dotenv()

FAISS_PATH = "./faiss_index"
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

q = "Khóa học tổ chức cho bao nhiêu người và lịch học ra sao?"
a = "Tùy vào nhu cầu, lớp học có thể tổ chức theo dạng Nhóm nhỏ Premium (10-15 người), Lớp tiêu chuẩn (20-30 người) hoặc Workshop doanh nghiệp (30-50 người). Lịch học rất linh hoạt với các phương án: Intensive (5 ngày liên tục), Weekend (học cuối tuần) hoặc Part-time (mỗi tuần 1 buổi tối)."

doc = Document(
    page_content=f"QUESTION: {q}\nANSWER: {a}",
    metadata={"source": "manual_faq", "type": "script_faq"}
)

print("Đang nạp bộ nhớ CSDL FAISS DB hiện tại...")
vectorstore = FAISS.load_local(FAISS_PATH, embeddings, allow_dangerous_deserialization=True)

print("Đang nhét trực tiếp câu hỏi FAQ mới vào Neural Network...")
vectorstore.add_documents([doc])

print("Đang lưu lại vào ổ cứng...")
vectorstore.save_local(FAISS_PATH)

print("✅ Đã hoàn thành! Nạp trót lọt mà không cần chạy lại Pipeline DeepSeek.")
