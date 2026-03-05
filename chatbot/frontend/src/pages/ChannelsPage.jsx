import { useState, useEffect } from 'react';
import { Plus, X, Copy } from 'lucide-react';
import FacebookPageCard from '../components/channels/FacebookPageCard';

const WEBHOOK_URL = `${window.location.origin}/webhook/facebook`;

export default function ChannelsPage() {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ page_id: '', page_name: '', page_access_token: '' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    async function fetchPages() {
        try {
            const res = await fetch('/api/v1/facebook/pages');
            setPages(await res.json());
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { fetchPages(); }, []);

    async function handleAdd(e) {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            const res = await fetch('/api/v1/facebook/pages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (!res.ok) throw new Error(await res.text());
            setForm({ page_id: '', page_name: '', page_access_token: '' });
            setShowForm(false);
            fetchPages();
        } catch (e) {
            setError(e.message);
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(id) {
        await fetch(`/api/v1/facebook/pages/${id}`, { method: 'DELETE' });
        fetchPages();
    }

    async function handleToggle(id) {
        await fetch(`/api/v1/facebook/pages/${id}/toggle`, { method: 'PUT' });
        fetchPages();
    }

    function copyWebhook() {
        navigator.clipboard.writeText(WEBHOOK_URL);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <div className="max-w-2xl space-y-6">
            {/* Webhook Info */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <h2 className="text-sm font-semibold text-blue-800 mb-2">Cấu hình Webhook Facebook</h2>
                <p className="text-xs text-blue-600 mb-3">
                    Dán URL này vào <strong>Facebook Developer Portal → Webhooks → Callback URL</strong>.
                    Verify Token là giá trị <code>FB_VERIFY_TOKEN</code> trong file .env.
                </p>
                <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-blue-100">
                    <code className="flex-1 text-xs text-gray-700 truncate">{WEBHOOK_URL}</code>
                    <button
                        onClick={copyWebhook}
                        className="shrink-0 p-1.5 rounded-md hover:bg-blue-50 text-blue-500 transition"
                    >
                        <Copy size={14} />
                    </button>
                    {copied && <span className="text-xs text-green-500">Đã sao chép!</span>}
                </div>
            </div>

            {/* Header + Add */}
            <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-800">
                    Trang Facebook đã kết nối ({pages.length})
                </h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition"
                >
                    {showForm ? <X size={16} /> : <Plus size={16} />}
                    {showForm ? 'Hủy' : 'Thêm trang'}
                </button>
            </div>

            {/* Add Form */}
            {showForm && (
                <form onSubmit={handleAdd} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm space-y-4">
                    <h3 className="text-sm font-semibold text-gray-700">Thêm Facebook Page</h3>
                    <div className="space-y-3">
                        <input
                            required
                            placeholder="Page ID (số, ví dụ: 123456789)"
                            value={form.page_id}
                            onChange={e => setForm(f => ({ ...f, page_id: e.target.value }))}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-300"
                        />
                        <input
                            required
                            placeholder="Tên trang (hiển thị)"
                            value={form.page_name}
                            onChange={e => setForm(f => ({ ...f, page_name: e.target.value }))}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-300"
                        />
                        <textarea
                            required
                            placeholder="Page Access Token (từ FB Developer Portal)"
                            value={form.page_access_token}
                            onChange={e => setForm(f => ({ ...f, page_access_token: e.target.value }))}
                            rows={3}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-300 resize-none font-mono"
                        />
                    </div>
                    {error && <p className="text-red-500 text-xs">{error}</p>}
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                        {saving ? 'Đang lưu...' : 'Kết nối trang'}
                    </button>
                </form>
            )}

            {/* Page List */}
            {loading ? (
                <p className="text-sm text-gray-400 text-center py-8">Đang tải...</p>
            ) : pages.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-sm">
                    Chưa có trang nào được kết nối
                </div>
            ) : (
                <div className="space-y-3">
                    {pages.map(page => (
                        <FacebookPageCard
                            key={page.id}
                            page={page}
                            onDelete={handleDelete}
                            onToggle={handleToggle}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
