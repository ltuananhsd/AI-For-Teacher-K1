import { useState } from 'react';
import NavSidebar from './NavSidebar';

const PAGE_TITLES = {
    '#/leads': 'Leads',
    '#/channels': 'Kênh kết nối',
    '#/rag': 'Quản lý dữ liệu',
    '#/ai-settings': 'Cài đặt AI',
    '#/status': 'Trạng thái hệ thống',
    '#/settings': 'Cài đặt chung',
};

export default function DashboardLayout({ children }) {
    const [collapsed, setCollapsed] = useState(
        () => localStorage.getItem('sidebar_collapsed') === 'true'
    );

    const currentHash = window.location.hash || '#/';
    const pageTitle = PAGE_TITLES[currentHash] || 'Dashboard';

    function handleToggle() {
        const next = !collapsed;
        setCollapsed(next);
        localStorage.setItem('sidebar_collapsed', String(next));
    }

    return (
        <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
            <NavSidebar
                collapsed={collapsed}
                onToggle={handleToggle}
                currentHash={currentHash}
            />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <div className="h-16 bg-white border-b border-gray-100 flex items-center px-6 shadow-sm shrink-0">
                    <h1 className="text-lg font-semibold text-gray-800">{pageTitle}</h1>
                </div>
                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
