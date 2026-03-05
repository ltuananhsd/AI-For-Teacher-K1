import { useState, useEffect } from 'react';
import DocumentList from '../components/rag/DocumentList';
import FileUploadZone from '../components/rag/FileUploadZone';
import InfoCard from '../components/common/InfoCard';

export default function RagPage() {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    async function fetchDocuments() {
        try {
            const res = await fetch('/api/v1/rag/documents');
            setDocuments(await res.json());
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { fetchDocuments(); }, []);

    async function handleDelete(source) {
        await fetch(`/api/v1/rag/documents/${encodeURIComponent(source)}`, { method: 'DELETE' });
        fetchDocuments();
    }

    return (
        <div className="max-w-2xl space-y-6">
            <InfoCard title="Hướng dẫn quản lý tài liệu AI">
                <p>Tải lên tài liệu (PDF, DOCX, TXT...) để bot có thể tìm kiếm và trả lời dựa trên nội dung.</p>
                <p>Hệ thống sử dụng <strong>RAG (Retrieval-Augmented Generation)</strong>: tài liệu được chia nhỏ, vector hóa và lưu vào FAISS index.</p>
                <p>Xóa tài liệu sẽ rebuild lại toàn bộ FAISS index. Quá trình upload có thể mất vài phút tùy kích thước.</p>
            </InfoCard>

            {/* Stats */}
            <div className="bg-indigo-50 rounded-xl px-5 py-4 border border-indigo-100">
                <p className="text-sm text-indigo-700">
                    <span className="font-semibold">{documents.length} tài liệu</span> đã được index —{' '}
                    <span className="font-semibold">
                        {documents.reduce((s, d) => s + d.chunk_count, 0)}
                    </span> chunks tổng cộng
                </p>
            </div>

            {/* Upload Zone */}
            <div>
                <h2 className="text-base font-semibold text-gray-800 mb-3">Tải lên tài liệu mới</h2>
                <FileUploadZone onUploadComplete={fetchDocuments} />
            </div>

            {/* Document List */}
            <div>
                <h2 className="text-base font-semibold text-gray-800 mb-3">
                    Tài liệu đã index ({documents.length})
                </h2>
                <DocumentList documents={documents} onDelete={handleDelete} loading={loading} />
            </div>
        </div>
    );
}
