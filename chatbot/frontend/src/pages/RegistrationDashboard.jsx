import { useState, useEffect } from 'react';
import { Trash2, RefreshCw, Calendar, Users, ArrowLeft, Search } from 'lucide-react';

const API_URL = '/api/v1';

export default function RegistrationDashboard() {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [searchText, setSearchText] = useState('');

    const fetchRegistrations = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (dateFrom) params.set('date_from', dateFrom);
            if (dateTo) params.set('date_to', dateTo);
            const res = await fetch(`${API_URL}/registrations?${params}`);
            if (res.ok) {
                const data = await res.json();
                setRegistrations(data);
            }
        } catch (e) {
            console.error('Failed to fetch registrations:', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchRegistrations(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Xác nhận xóa đăng ký này?')) return;
        try {
            const res = await fetch(`${API_URL}/registrations/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setRegistrations(prev => prev.filter(r => r.id !== id));
            }
        } catch (e) {
            console.error('Failed to delete:', e);
        }
    };

    const handleFilter = (e) => {
        e.preventDefault();
        fetchRegistrations();
    };

    // Client-side text search on name/phone/email
    const filtered = registrations.filter(r => {
        if (!searchText) return true;
        const q = searchText.toLowerCase();
        return (r.name || '').toLowerCase().includes(q)
            || (r.phone || '').toLowerCase().includes(q)
            || (r.email || '').toLowerCase().includes(q);
    });

    // Stats
    const todayStr = new Date().toISOString().split('T')[0];
    const todayCount = registrations.filter(r =>
        r.created_at && r.created_at.startsWith(todayStr)
    ).length;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <a href="/" className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
                            <ArrowLeft size={20} />
                        </a>
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">Quản lý Đăng ký</h1>
                            <p className="text-sm text-gray-500">Dashboard theo dõi lead đăng ký tư vấn</p>
                        </div>
                    </div>
                    <button
                        onClick={fetchRegistrations}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                        Làm mới
                    </button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-6 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-blue-50 rounded-lg">
                                <Users size={20} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">{registrations.length}</p>
                                <p className="text-xs text-gray-500">Tổng đăng ký</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-green-50 rounded-lg">
                                <Calendar size={20} className="text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">{todayCount}</p>
                                <p className="text-xs text-gray-500">Hôm nay</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-purple-50 rounded-lg">
                                <Search size={20} className="text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">{filtered.length}</p>
                                <p className="text-xs text-gray-500">Kết quả lọc</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                    <form onSubmit={handleFilter} className="flex flex-wrap items-end gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Từ ngày</label>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={e => setDateFrom(e.target.value)}
                                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Đến ngày</label>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={e => setDateTo(e.target.value)}
                                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors"
                        >
                            Lọc theo ngày
                        </button>
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-xs font-medium text-gray-600 mb-1">Tìm kiếm</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                <input
                                    type="text"
                                    placeholder="Tên, SĐT, Email..."
                                    value={searchText}
                                    onChange={e => setSearchText(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                                />
                            </div>
                        </div>
                    </form>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="text-left px-5 py-3 font-medium text-gray-600">#</th>
                                    <th className="text-left px-5 py-3 font-medium text-gray-600">Họ tên</th>
                                    <th className="text-left px-5 py-3 font-medium text-gray-600">SĐT</th>
                                    <th className="text-left px-5 py-3 font-medium text-gray-600">Email</th>
                                    <th className="text-left px-5 py-3 font-medium text-gray-600">Ghi chú</th>
                                    <th className="text-left px-5 py-3 font-medium text-gray-600">Thời gian</th>
                                    <th className="text-center px-5 py-3 font-medium text-gray-600">Xóa</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-12 text-gray-400">
                                            <RefreshCw size={20} className="animate-spin mx-auto mb-2" />
                                            Đang tải...
                                        </td>
                                    </tr>
                                ) : filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-12 text-gray-400">
                                            Chưa có đăng ký nào
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((reg, i) => (
                                        <tr key={reg.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="px-5 py-3 text-gray-400">{i + 1}</td>
                                            <td className="px-5 py-3 font-medium text-gray-800">{reg.name}</td>
                                            <td className="px-5 py-3 text-gray-600">{reg.phone}</td>
                                            <td className="px-5 py-3 text-gray-600">{reg.email || '—'}</td>
                                            <td className="px-5 py-3 text-gray-500 max-w-[200px] truncate">{reg.notes || '—'}</td>
                                            <td className="px-5 py-3 text-gray-500 whitespace-nowrap">
                                                {reg.created_at ? new Date(reg.created_at).toLocaleString('vi-VN') : '—'}
                                            </td>
                                            <td className="px-5 py-3 text-center">
                                                <button
                                                    onClick={() => handleDelete(reg.id)}
                                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
