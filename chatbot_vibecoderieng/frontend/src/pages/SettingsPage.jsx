import { useState, useEffect } from 'react';
import { Copy, Trash2, Download, AlertTriangle, Key, Save } from 'lucide-react';

function CopyRow({ label, value }) {
    const [copied, setCopied] = useState(false);
    function doCopy() {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }
    return (
        <div className="mb-3">
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
                <code className="flex-1 text-xs text-gray-700 truncate">{value}</code>
                <button onClick={doCopy} className="shrink-0 p-1.5 rounded-md hover:bg-gray-200 transition text-gray-500">
                    <Copy size={13} />
                </button>
                {copied && <span className="text-xs text-green-500 shrink-0">Đã sao chép!</span>}
            </div>
        </div>
    );
}

function SystemConfigCard() {
    const [embedKey, setEmbedKey] = useState('');
    const [fbToken, setFbToken] = useState('');
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        fetch('/api/v1/system-config')
            .then(r => r.json())
            .then(d => {
                setEmbedKey(d.embed_openai_key || '');
                setFbToken(d.fb_verify_token || '');
            })
            .catch(() => {});
    }, []);

    async function handleSave() {
        setSaving(true);
        setMsg('');
        try {
            const body = {};
            // Only send non-masked values
            if (embedKey && !embedKey.startsWith('***')) body.embed_openai_key = embedKey;
            if (fbToken !== undefined) body.fb_verify_token = fbToken;
            const res = await fetch('/api/v1/system-config', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            if (!res.ok) throw new Error('Lỗi lưu cấu hình');
            setMsg('Đã lưu thành công');
            // Re-fetch to show masked key
            const updated = await fetch('/api/v1/system-config').then(r => r.json());
            setEmbedKey(updated.embed_openai_key || '');
        } catch (e) {
            setMsg(e.message || 'Lỗi không xác định');
        } finally {
            setSaving(false);
            setTimeout(() => setMsg(''), 4000);
        }
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <Key size={16} className="text-gray-500" />
                <h2 className="text-base font-semibold text-gray-800">API Keys hệ thống</h2>
            </div>
            <div className="space-y-4">
                <div>
                    <label className="block text-xs text-gray-500 mb-1">OpenAI Embeddings Key</label>
                    <input
                        type="password"
                        value={embedKey}
                        onChange={e => setEmbedKey(e.target.value)}
                        placeholder="sk-..."
                        className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                    <p className="text-xs text-gray-400 mt-1">Dùng cho RAG embeddings (text-embedding-3-small)</p>
                </div>
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Facebook Verify Token</label>
                    <input
                        type="text"
                        value={fbToken}
                        onChange={e => setFbToken(e.target.value)}
                        placeholder="my_custom_token"
                        className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                    <p className="text-xs text-gray-400 mt-1">Token xác thực webhook Facebook (thay thế FB_VERIFY_TOKEN trong .env)</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 text-white text-sm hover:bg-blue-600 transition disabled:opacity-50 shadow-sm"
                    >
                        <Save size={14} />
                        {saving ? 'Đang lưu...' : 'Lưu'}
                    </button>
                    {msg && <span className="text-sm text-green-600">{msg}</span>}
                </div>
            </div>
        </div>
    );
}

export default function SettingsPage() {
    const origin = window.location.origin;
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

    function handleExport() {
        window.open('/api/v1/registrations/export', '_blank');
    }

    return (
        <div className="max-w-xl space-y-6">
            {/* System API Keys */}
            <SystemConfigCard />

            {/* Webhook URLs */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-base font-semibold text-gray-800 mb-4">Webhook & API URLs</h2>
                <CopyRow label="Facebook Webhook URL" value={`${origin}/webhook/facebook`} />
                <CopyRow label="API Base URL" value={`${origin}/api/v1`} />
                <p className="text-xs text-gray-400 mt-2">
                    Dùng Webhook URL khi cấu hình Facebook Developer Portal.
                    Verify Token quản lý trong card "API Keys hệ thống" ở trên.
                </p>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-2xl border border-red-100 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle size={16} className="text-red-500" />
                    <h2 className="text-base font-semibold text-red-600">Vùng nguy hiểm</h2>
                </div>

                <div className="space-y-3">
                    {/* Export CSV */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                        <div>
                            <p className="text-sm font-medium text-gray-700">Xuất danh sách đăng ký</p>
                            <p className="text-xs text-gray-400">Tải file CSV chứa toàn bộ leads</p>
                        </div>
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition shadow-sm"
                        >
                            <Download size={15} />
                            Xuất CSV
                        </button>
                    </div>

                    {/* Clear History */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-red-50 border border-red-100">
                        <div>
                            <p className="text-sm font-medium text-red-700">Xóa toàn bộ lịch sử chat</p>
                            <p className="text-xs text-red-400">Không thể hoàn tác</p>
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
                </div>

                {clearMsg && (
                    <p className="text-sm text-green-600 mt-3">{clearMsg}</p>
                )}
            </div>
        </div>
    );
}
