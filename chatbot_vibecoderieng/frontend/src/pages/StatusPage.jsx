import { useState, useEffect } from 'react';
import { MessageSquare, Users, DollarSign, Database, Radio, Bot, Clock, Trash2, AlertTriangle } from 'lucide-react';
import InfoCard from '../components/common/InfoCard';

function formatUptime(seconds) {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const parts = [];
    if (d > 0) parts.push(`${d}d`);
    if (h > 0) parts.push(`${h}h`);
    parts.push(`${m}m`);
    return parts.join(' ');
}

function StatCard({ icon: Icon, label, value, sub, color = 'indigo' }) {
    const colors = {
        indigo: 'bg-indigo-50 text-indigo-600',
        green: 'bg-green-50 text-green-600',
        blue: 'bg-blue-50 text-blue-600',
        purple: 'bg-purple-50 text-purple-600',
        orange: 'bg-orange-50 text-orange-600',
        pink: 'bg-pink-50 text-pink-600',
    };
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colors[color] || colors.indigo}`}>
                <Icon size={18} />
            </div>
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className="text-2xl font-bold text-gray-800">{value ?? '—'}</p>
            {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
    );
}

export default function StatusPage() {
    const [stats, setStats] = useState(null);
    const [error, setError] = useState(false);
    const [clearing, setClearing] = useState(false);
    const [clearMsg, setClearMsg] = useState('');

    async function handleClearHistory() {
        if (!confirm('Xóa TOÀN BỘ lịch sử chat?\n\nHành động này không thể hoàn tác!')) return;
        if (!confirm('Xác nhận lần cuối: Xóa tất cả phiên chat và tin nhắn?')) return;
        setClearing(true);
        try {
            await fetch('/api/v1/history/all', { method: 'DELETE' });
            setClearMsg('Đã xóa toàn bộ lịch sử chat');
        } catch {
            setClearMsg('Lỗi khi xóa lịch sử');
        } finally {
            setClearing(false);
            setTimeout(() => setClearMsg(''), 4000);
        }
    }

    async function fetchStats() {
        try {
            const res = await fetch('/api/v1/status');
            setStats(await res.json());
            setError(false);
        } catch {
            setError(true);
        }
    }

    useEffect(() => {
        fetchStats();
        const interval = setInterval(fetchStats, 10000);
        return () => clearInterval(interval);
    }, []);

    if (error) {
        return <p className="text-red-500 text-sm">Không thể tải trạng thái hệ thống</p>;
    }

    if (!stats) {
        return <p className="text-gray-400 text-sm">Đang tải...</p>;
    }

    const s = stats;

    return (
        <div className="space-y-6">
            <InfoCard title="Hướng dẫn">
                <p>Tổng quan hoạt động của hệ thống: số phiên chat, đăng ký, chi phí API và thời gian hoạt động.</p>
                <p>Dữ liệu tự động cập nhật mỗi 10 giây. Sử dụng <strong>Xóa lịch sử</strong> để reset dữ liệu chat khi cần.</p>
            </InfoCard>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <StatCard
                    icon={MessageSquare}
                    label="Phiên chat"
                    value={s.sessions?.total}
                    sub={`+${s.sessions?.today ?? 0} hôm nay`}
                    color="indigo"
                />
                <StatCard
                    icon={Users}
                    label="Đăng ký"
                    value={s.registrations?.total}
                    sub={`+${s.registrations?.today ?? 0} hôm nay`}
                    color="green"
                />
                <StatCard
                    icon={MessageSquare}
                    label="Tin nhắn"
                    value={s.messages?.total}
                    color="blue"
                />
                <StatCard
                    icon={DollarSign}
                    label="Chi phí API"
                    value={`$${(s.usage?.total_cost_usd ?? 0).toFixed(4)}`}
                    sub={`${((s.usage?.total_prompt_tokens ?? 0) / 1000).toFixed(0)}K prompt tokens`}
                    color="purple"
                />
                <StatCard
                    icon={Database}
                    label="FAISS Index"
                    value={s.faiss?.loaded ? `${s.faiss.total_docs} chunks` : 'Chưa tải'}
                    sub={s.faiss?.loaded ? `${s.faiss.total_sources} nguồn tài liệu` : undefined}
                    color={s.faiss?.loaded ? 'orange' : 'pink'}
                />
                <StatCard
                    icon={Radio}
                    label="Facebook Pages"
                    value={s.facebook_pages?.active ?? 0}
                    sub={`/ ${s.facebook_pages?.total ?? 0} tổng số`}
                    color="pink"
                />
            </div>

            {/* Info Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <Bot size={18} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">LLM hiện tại</p>
                        <p className="text-sm font-semibold text-gray-800 capitalize">
                            {s.ai?.provider} — {s.ai?.model}
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                        <Clock size={18} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Uptime</p>
                        <p className="text-sm font-semibold text-gray-800">
                            {formatUptime(s.uptime_seconds ?? 0)}
                        </p>
                    </div>
                </div>
            </div>

            <p className="text-xs text-gray-400 text-right">Tự động cập nhật mỗi 10 giây</p>

            {/* Danger Zone */}
            <div className="bg-white rounded-xl border border-red-100 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle size={16} className="text-red-500" />
                    <h2 className="text-base font-semibold text-red-600">Vùng nguy hiểm</h2>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-red-50 border border-red-100">
                    <div>
                        <p className="text-sm font-medium text-red-700">Xóa toàn bộ lịch sử chat</p>
                        <p className="text-xs text-red-400">Xóa tất cả phiên chat và tin nhắn. Không thể hoàn tác.</p>
                    </div>
                    <button
                        onClick={handleClearHistory}
                        disabled={clearing}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 text-white text-sm hover:bg-red-600 transition disabled:opacity-50 shadow-sm"
                    >
                        <Trash2 size={15} />
                        {clearing ? 'Đang xóa...' : 'Xóa hết'}
                    </button>
                </div>
                {clearMsg && <p className="text-sm text-green-600 mt-3">{clearMsg}</p>}
            </div>
        </div>
    );
}
