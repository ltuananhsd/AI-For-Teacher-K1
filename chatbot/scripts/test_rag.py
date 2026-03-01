"""
RAG diagnostic test — 50 queries
Shows: RAG top-3 chunks retrieved + LLM answer
→ Giúp xác định: RAG ngu (chunk sai) vs AI ngu (chunk đúng nhưng trả lời sai)
"""
from dotenv import load_dotenv
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_community.retrievers import BM25Retriever
from langchain_deepseek import ChatDeepSeek
from langchain_core.messages import SystemMessage, HumanMessage

load_dotenv()
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
FAISS_PATH = "./faiss_index"

# ------------------------------------------------------------------
# 50 TEST QUERIES — grouped by topic
# ------------------------------------------------------------------
QUERIES = [
    # --- GIẢNG VIÊN (15 câu) ---
    ("GV-01", "Khóa học này có bao nhiêu giảng viên?"),
    ("GV-02", "Liệt kê tên đầy đủ tất cả giảng viên"),
    ("GV-03", "Mr. Nguyễn Văn Tiệp học ở đâu? Bằng cấp gì?"),
    ("GV-04", "Tiệp có kinh nghiệm tư vấn cho công ty nào?"),
    ("GV-05", "Co-founder CES Global là ai?"),
    ("GV-06", "Lưu Tuấn Anh có mấy năm kinh nghiệm về Generative AI?"),
    ("GV-07", "Lưu Tuấn Anh chuyên về mảng gì?"),
    ("GV-08", "Ms. Nguyễn Kim Anh đã dạy cho bao nhiêu học viên?"),
    ("GV-09", "Kim Anh có chứng chỉ gì liên quan AI?"),
    ("GV-10", "Giảng viên nào có nền tảng từ Harvard?"),
    ("GV-11", "Ai là Team Leader AI Automation trong khóa học?"),
    ("GV-12", "Giảng viên nào có chuyên môn về Báo chí, Truyền thông?"),
    ("GV-13", "Quote nổi bật của Mr. Lưu Tuấn Anh là gì?"),
    ("GV-14", "Kim Anh có chứng chỉ AI for Education không?"),
    ("GV-15", "Nguyễn Văn Tiệp đã tư vấn cho Viettel, VNPT chưa?"),

    # --- NỘI DUNG KHÓA HỌC (15 câu) ---
    ("KH-01", "Tên đầy đủ của khóa học là gì?"),
    ("KH-02", "Khóa học kéo dài bao nhiêu tuần?"),
    ("KH-03", "Học theo hình thức nào? Zoom hay offline?"),
    ("KH-04", "Phương pháp học Outcome-based là gì?"),
    ("KH-05", "Tỷ lệ lý thuyết và thực hành là bao nhiêu phần trăm?"),
    ("KH-06", "Buổi 1 học về chủ đề gì?"),
    ("KH-07", "Buổi 3 dạy công cụ gì về hình ảnh và video?"),
    ("KH-08", "Capstone Project diễn ra ở buổi mấy?"),
    ("KH-09", "Sau 5 buổi học xong thì học viên làm gì tiếp?"),
    ("KH-10", "Học viên cần chuẩn bị gì trước khi tham gia khóa học?"),
    ("KH-11", "Khóa học sử dụng công cụ AI nào của Google?"),
    ("KH-12", "Gemini 3 có những phiên bản nào được giảng dạy?"),
    ("KH-13", "Điều kiện để nhận chứng chỉ hoàn thành là gì?"),
    ("KH-14", "Lớp Premium tổ chức tối đa bao nhiêu người?"),
    ("KH-15", "Opal và Antigravity là công cụ để làm gì?"),

    # --- ĐẦU RA & GIÁ TRỊ (10 câu) ---
    ("DR-01", "Sau buổi 1 học viên có sản phẩm gì cụ thể?"),
    ("DR-02", "System Design Canvas học ở buổi nào?"),
    ("DR-03", "Khóa học giúp tính toán ROI như thế nào?"),
    ("DR-04", "Chứng chỉ sau khóa học tên đầy đủ là gì?"),
    ("DR-05", "Khóa học phù hợp cho đối tượng nào?"),
    ("DR-06", "C-Level, CEO có nên học khóa này không?"),
    ("DR-07", "Người không biết code có học được không?"),
    ("DR-08", "Triết lý đào tạo của chương trình là gì?"),
    ("DR-09", "Pipeline Idea → Content → App → ... gồm mấy bước?"),
    ("DR-10", "Học viên tạo ra được bao nhiêu sản phẩm sau 5 buổi?"),

    # --- LIÊN HỆ & ĐĂNG KÝ (5 câu) ---
    ("LH-01", "Email liên hệ của CES Global là gì?"),
    ("LH-02", "Số điện thoại hotline CES Global là bao nhiêu?"),
    ("LH-03", "Học phí khóa học là bao nhiêu tiền?"),
    ("LH-04", "Làm thế nào để đăng ký giữ chỗ khóa học?"),
    ("LH-05", "Chính sách hoàn tiền của khóa học như thế nào?"),

    # --- BẪY / THÔNG TIN KHÔNG CÓ (5 câu) ---
    ("BF-01", "Khóa học có dạy lập trình Python không?"),
    ("BF-02", "Giảng viên Nguyễn Văn Tiệp sinh năm bao nhiêu?"),
    ("BF-03", "Khóa học có phiên bản tiếng Anh không?"),
    ("BF-04", "Lưu Tuấn Anh tốt nghiệp trường đại học nào?"),
    ("BF-05", "Học xong có được giới thiệu việc làm không?"),
]

# ------------------------------------------------------------------
# Load retriever + LLM
# ------------------------------------------------------------------
vectorstore = FAISS.load_local(FAISS_PATH, embeddings, allow_dangerous_deserialization=True)
faiss_ret = vectorstore.as_retriever(
    search_type="mmr",
    search_kwargs={"k": 10, "fetch_k": 30, "lambda_mult": 0.7}
)
all_docs = [vectorstore.docstore._dict[doc_id] for doc_id in vectorstore.index_to_docstore_id.values()]
bm25_ret = BM25Retriever.from_documents(all_docs, k=10)
# Build parent lookup — same as production main.py
parent_map = {
    d.metadata["section_id"]: d
    for d in all_docs
    if d.metadata.get("chunk_level") == "parent" and d.metadata.get("section_id")
}
llm = ChatDeepSeek(model="deepseek-chat", temperature=0.1, max_tokens=300)

SYSTEM = """Bạn là trợ lý tư vấn khóa học CES Global. Trả lời NGẮN GỌN (tối đa 3 câu) dựa HOÀN TOÀN vào context.
Nếu context KHÔNG có thông tin → trả lời đúng 1 câu: "Tôi chưa có thông tin về vấn đề này."
KHÔNG bịa đặt. KHÔNG thêm thông tin ngoài context.

CONTEXT:
{context}"""

def retrieve(q):
    faiss_docs = faiss_ret.invoke(q)
    bm25_docs = bm25_ret.invoke(q)
    seen, docs = set(), []
    for d in faiss_docs + bm25_docs:
        k = d.page_content[:100]
        if k not in seen:
            seen.add(k)
            docs.append(d)
    # Parent-child expansion — same as production main.py
    for d in list(docs):
        pid = d.metadata.get("parent_id")
        if pid and pid in parent_map:
            parent = parent_map[pid]
            pk = parent.page_content[:100]
            if pk not in seen:
                seen.add(pk)
                docs.append(parent)
    return docs

def llm_answer(q, docs):
    # Use ALL retrieved docs — same as production main.py (no truncation of doc list)
    ctx = "\n\n---\n\n".join(d.page_content for d in docs)
    resp = llm.invoke([
        SystemMessage(content=SYSTEM.format(context=ctx)),
        HumanMessage(content=q)
    ])
    return resp.content.strip()

# ------------------------------------------------------------------
# Run
# ------------------------------------------------------------------
print(f"\n{'='*72}")
print(f"  RAG DIAGNOSTIC — {len(QUERIES)} queries | RAG top-3 + LLM answer")
print(f"  Đọc kết quả: chunk top-1 sai → RAG ngu | chunk đúng mà trả lời sai → AI ngu")
print(f"{'='*72}")

for qid, q in QUERIES:
    docs = retrieve(q)
    top3 = [
        f"[{d.metadata.get('type','?')}] {(d.metadata.get('title') or d.page_content[:55]).strip()[:60]}"
        for d in docs[:3]
    ]
    ans = llm_answer(q, docs)

    print(f"\n[{qid}] {q}")
    print(f"  RAG: {top3[0]}")
    if len(top3) > 1: print(f"       {top3[1]}")
    if len(top3) > 2: print(f"       {top3[2]}")
    print(f"  LLM: {ans[:250]}")

print(f"\n{'='*72}\nXong {len(QUERIES)} câu hỏi.\n")
