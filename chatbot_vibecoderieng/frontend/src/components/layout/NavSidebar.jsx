import {
    MessageSquare, Users, Facebook, Code2, Database,
    Bot, Activity, Clock, ChevronLeft, ChevronRight, LogOut
} from 'lucide-react';

const NAV_ITEMS = [
    { hash: '#/chat', label: 'Thử Bot', icon: MessageSquare },
    { hash: '#/leads', label: 'Khách hàng', icon: Users },
    { hash: '#/channels/facebook', label: 'Facebook', icon: Facebook },
    { hash: '#/channels/web', label: 'Web Widget', icon: Code2 },
    { hash: '#/rag', label: 'Tài liệu AI', icon: Database },
    { hash: '#/ai-settings', label: 'Cài đặt AI', icon: Bot },
    { hash: '#/history', label: 'Lịch sử', icon: Clock },
    { hash: '#/status', label: 'Trạng thái', icon: Activity },
];

export default function NavSidebar({ collapsed, onToggle, currentHash }) {
    function isActive(hash) {
        if (hash === '#/chat') return currentHash === '#/chat' || currentHash === '#/' || currentHash === '' || currentHash === '#';
        // Prefix match supports sub-routes like #/channels/facebook, #/channels/web
        return currentHash === hash || currentHash.startsWith(hash + '/');
    }

    function handleLogout() {
        sessionStorage.removeItem('admin_auth');
        window.location.hash = '#/';
    }

    return (
        <div className={`h-full flex flex-col bg-white border-r border-gray-100 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
            {/* Logo / Toggle */}
            <div className="h-16 flex items-center justify-between px-3 border-b border-gray-100">
                {!collapsed && (
                    <span className="font-semibold text-gray-800 text-sm truncate pl-1">Admin Panel</span>
                )}
                <button
                    onClick={onToggle}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors ml-auto"
                    title={collapsed ? 'Mở rộng' : 'Thu gọn'}
                >
                    {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 px-2 py-4 flex flex-col gap-1 overflow-y-auto">
                {NAV_ITEMS.map(({ hash, label, icon: Icon }) => (
                    <a
                        key={hash}
                        href={hash}
                        title={collapsed ? label : undefined}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive(hash)
                                ? 'bg-indigo-50 text-indigo-700'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                    >
                        <Icon size={18} className="shrink-0" />
                        {!collapsed && <span className="truncate">{label}</span>}
                    </a>
                ))}
            </nav>

            {/* Logout */}
            <div className="px-2 py-3 border-t border-gray-100">
                <button
                    onClick={handleLogout}
                    title={collapsed ? 'Đăng xuất' : undefined}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                    <LogOut size={18} className="shrink-0" />
                    {!collapsed && <span>Đăng xuất</span>}
                </button>
            </div>
        </div>
    );
}
