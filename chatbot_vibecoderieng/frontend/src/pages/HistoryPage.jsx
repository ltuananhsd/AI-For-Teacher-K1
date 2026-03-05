import { useState, useEffect, useCallback } from 'react';
import { Facebook, MessageSquare } from 'lucide-react';
import InfoCard from '../components/common/InfoCard';
import ConversationList from '../components/history/ConversationList';
import ConversationDetail from '../components/history/ConversationDetail';

const TABS = [
    { id: 'test', label: 'Thử Bot', icon: MessageSquare, url: '/api/v1/history/test' },
    { id: 'facebook', label: 'Facebook', icon: Facebook, url: '/api/v1/history/facebook' },
];

const PAGE_SIZE = 20;

export default function HistoryPage() {
    const [activeTab, setActiveTab] = useState('test');
    const [sessions, setSessions] = useState([]);
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [cursor, setCursor] = useState(null);

    const tab = TABS.find(t => t.id === activeTab);

    const fetchSessions = useCallback(async (cursorVal = null, append = false) => {
        const isFirst = !append;
        if (isFirst) setLoading(true); else setLoadingMore(true);
        try {
            const params = new URLSearchParams({ limit: PAGE_SIZE });
            if (cursorVal) params.set('cursor', cursorVal);
            const res = await fetch(`${tab.url}?${params}`);
            const data = await res.json();
            if (append) {
                setSessions(prev => [...prev, ...data]);
            } else {
                setSessions(data);
                setSelected(null);
            }
            setHasMore(data.length === PAGE_SIZE);
            if (data.length > 0) {
                setCursor(data[data.length - 1].updated_at);
            }
        } catch (e) {
            console.error(e);
        } finally {
            if (isFirst) setLoading(false); else setLoadingMore(false);
        }
    }, [activeTab]); // eslint-disable-line

    useEffect(() => {
        setSessions([]);
        setCursor(null);
        setHasMore(false);
        fetchSessions(null, false);
    }, [activeTab]);

    function handleLoadMore() {
        fetchSessions(cursor, true);
    }

    return (
        <div className="flex flex-col h-full gap-4">
            <InfoCard title="Hướng dẫn xem lịch sử">
                <p>Xem lại toàn bộ hội thoại từ <strong>Thử Bot</strong> (web) và <strong>Facebook Messenger</strong>.</p>
                <p>Nhấn vào một phiên để xem chi tiết tin nhắn. Tab Facebook hiển thị hội thoại từ trang Facebook đã kết nối.</p>
            </InfoCard>

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit shrink-0">
                {TABS.map(t => {
                    const Icon = t.icon;
                    const isActive = t.id === activeTab;
                    return (
                        <button
                            key={t.id}
                            onClick={() => setActiveTab(t.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? 'bg-white text-indigo-700 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Icon size={15} />
                            {t.label}
                        </button>
                    );
                })}
            </div>

            {/* Master-Detail */}
            <div className="flex-1 flex gap-4 min-h-0">
                {/* Session List (30%) */}
                <div className="w-[30%] min-w-[200px] bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="px-4 py-3 border-b border-gray-100 shrink-0">
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                            {sessions.length} hội thoại
                            {hasMore ? '+' : ''}
                        </p>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <ConversationList
                            sessions={sessions}
                            selected={selected}
                            onSelect={setSelected}
                            loading={loading || loadingMore}
                            onLoadMore={handleLoadMore}
                            hasMore={hasMore}
                        />
                    </div>
                </div>

                {/* Conversation Detail (70%) */}
                <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-0">
                    <ConversationDetail session={selected} />
                </div>
            </div>
        </div>
    );
}
