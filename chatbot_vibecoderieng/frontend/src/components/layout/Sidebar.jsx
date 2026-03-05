
import { useRef, useCallback } from 'react';
import { Plus, MessageSquare, Search, Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Sidebar({ sessions, activeId, onSelect, onNew, onDelete }) {
    // Hidden 5-tap trigger to open dashboard
    const tapRef = useRef({ count: 0, timer: null });
    const handleTitleTap = useCallback(() => {
        tapRef.current.count++;
        clearTimeout(tapRef.current.timer);
        if (tapRef.current.count >= 5) {
            tapRef.current.count = 0;
            window.location.hash = '#/dashboard';
        }
        // Reset after 2s of no taps
        tapRef.current.timer = setTimeout(() => { tapRef.current.count = 0; }, 2000);
    }, []);

    return (
        <div className="flex flex-col h-full w-full">
            {/* Header */}
            <div className="p-5 pb-2">
                <div className="flex items-center justify-between mb-6">
                    <h2
                        className="text-xl font-bold text-gray-800 tracking-tight select-none cursor-default"
                        onClick={handleTitleTap}
                    >Lịch sử chat</h2>
                    <button onClick={onNew} className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md shadow-blue-200 transition-all active:scale-95">
                        <Plus size={20} />
                    </button>
                </div>

                <div className="relative mb-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-gray-400"
                    />
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 scrollbar-thin">
                {sessions.map((session) => (
                    <div key={session.id} className="relative group/item">
                        <button
                            onClick={() => onSelect(session.id)}
                            className={cn(
                                "w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all",
                                activeId === session.id
                                    ? "bg-blue-50 border border-blue-100 shadow-sm ring-1 ring-blue-50"
                                    : "hover:bg-gray-50 border border-transparent"
                            )}
                        >
                            <div className={cn(
                                "p-2 rounded-lg shrink-0 transition-colors",
                                activeId === session.id ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-500 group-hover:bg-white"
                            )}>
                                <MessageSquare size={18} />
                            </div>
                            <div className="flex-1 min-w-0 pr-6">
                                <h3 className={cn(
                                    "font-medium text-sm truncate",
                                    activeId === session.id ? "text-blue-900" : "text-gray-700"
                                )}>
                                    {session.title || "Cuộc trò chuyện mới"}
                                </h3>
                                <p className="text-xs text-gray-400 mt-0.5 truncate">
                                    {new Date(session.updated_at).toLocaleDateString('vi-VN')}
                                </p>
                            </div>
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm('Bạn có chắc chắn muốn xóa cuộc hội thoại này?')) {
                                    onDelete(session.id);
                                }
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

