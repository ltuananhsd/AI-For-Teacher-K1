import { Trash2, MessageSquare } from 'lucide-react';

export default function FacebookPageCard({ page, info, conversationCount, onDelete, onToggle, onToggleMultiBubble }) {
    const { id, page_id, page_name, is_active, multi_bubble_enabled } = page;

    function handleDelete() {
        if (confirm(`Xóa trang "${page_name}"?`)) onDelete(id);
    }

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <span className="text-blue-600 font-bold text-sm">f</span>
                </div>

                <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-sm truncate">{page_name}</p>
                    <p className="text-xs text-gray-400 truncate">ID: {page_id}</p>

                    {/* Graph API info */}
                    {info && (
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                            {info.category && (
                                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                                    {info.category}
                                </span>
                            )}
                            {info.fan_count != null && (
                                <span className="text-xs text-gray-400">
                                    {info.fan_count.toLocaleString('vi-VN')} followers
                                </span>
                            )}
                        </div>
                    )}

                    {/* Conversation count + link to history */}
                    <div className="flex items-center gap-3 mt-1">
                        {conversationCount != null && (
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                                <MessageSquare size={11} />
                                {conversationCount} hội thoại
                            </span>
                        )}
                        <a
                            href="#/history"
                            className="text-xs text-indigo-500 hover:text-indigo-700 transition-colors"
                        >
                            Xem hội thoại →
                        </a>
                    </div>
                </div>

                {/* Status badge */}
                <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium ${is_active ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                    {is_active ? 'Hoạt động' : 'Tắt'}
                </span>

                {/* Multi-bubble toggle */}
                <div className="shrink-0 flex flex-col items-center gap-0.5">
                    <button
                        onClick={() => onToggleMultiBubble && onToggleMultiBubble(id)}
                        title={multi_bubble_enabled ? 'Tắt multi-bubble' : 'Bật multi-bubble'}
                        className={`w-8 h-4 rounded-full transition-colors relative ${multi_bubble_enabled ? 'bg-blue-400' : 'bg-gray-200'}`}
                    >
                        <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform ${multi_bubble_enabled ? 'left-4' : 'left-0.5'}`} />
                    </button>
                    <span className="text-[9px] text-gray-400 leading-none">Bubble</span>
                </div>

                {/* Active toggle */}
                <button
                    onClick={() => onToggle(id)}
                    title={is_active ? 'Tắt trang' : 'Bật trang'}
                    className={`shrink-0 w-10 h-6 rounded-full transition-colors relative ${is_active ? 'bg-indigo-500' : 'bg-gray-200'
                        }`}
                >
                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${is_active ? 'left-5' : 'left-1'
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
        </div>
    );
}
