import { Trash2, FileText } from 'lucide-react';

export default function DocumentList({ documents, onDelete, loading }) {
    if (loading) {
        return <p className="text-sm text-gray-400 text-center py-8">Đang tải danh sách tài liệu...</p>;
    }

    if (!documents.length) {
        return (
            <div className="text-center py-12 text-gray-400 text-sm">
                Chưa có tài liệu nào được index
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {documents.map(doc => (
                <div
                    key={doc.source}
                    className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 px-4 py-3 shadow-sm"
                >
                    <FileText size={16} className="text-indigo-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{doc.source}</p>
                        <p className="text-xs text-gray-400">{doc.chunk_count} chunks</p>
                    </div>
                    <button
                        onClick={() => {
                            if (confirm(`Xóa tài liệu "${doc.source}"?\nThao tác này sẽ xây dựng lại index.`)) {
                                onDelete(doc.source);
                            }
                        }}
                        className="shrink-0 p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                        <Trash2 size={15} />
                    </button>
                </div>
            ))}
        </div>
    );
}
