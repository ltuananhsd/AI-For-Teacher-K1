import { Trash2 } from 'lucide-react';

export default function FacebookPageCard({ page, onDelete, onToggle }) {
    const { id, page_id, page_name, is_active, created_at } = page;

    function handleDelete() {
        if (confirm(`Xóa trang "${page_name}"?`)) onDelete(id);
    }

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <span className="text-blue-600 font-bold text-sm">f</span>
            </div>

            <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 text-sm truncate">{page_name}</p>
                <p className="text-xs text-gray-400 truncate">ID: {page_id}</p>
                {created_at && (
                    <p className="text-xs text-gray-300 mt-0.5">
                        {new Date(created_at).toLocaleDateString('vi-VN')}
                    </p>
                )}
            </div>

            {/* Status badge */}
            <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium ${
                is_active ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'
            }`}>
                {is_active ? 'Hoạt động' : 'Tắt'}
            </span>

            {/* Toggle */}
            <button
                onClick={() => onToggle(id)}
                title={is_active ? 'Tắt trang' : 'Bật trang'}
                className={`shrink-0 w-10 h-6 rounded-full transition-colors relative ${
                    is_active ? 'bg-indigo-500' : 'bg-gray-200'
                }`}
            >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                    is_active ? 'left-5' : 'left-1'
                }`} />
            </button>

            {/* Delete */}
            <button
                onClick={handleDelete}
                className="shrink-0 p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
                <Trash2 size={16} />
            </button>
        </div>
    );
}
