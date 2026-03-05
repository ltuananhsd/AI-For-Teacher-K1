import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Key, Save } from 'lucide-react';
import ProviderSelector from '../components/ai-settings/ProviderSelector';
import InfoCard from '../components/common/InfoCard';

const DEFAULT_CONFIG = {
    provider: 'deepseek',
    model: 'deepseek-chat',
    temperature: 0.3,
    max_tokens: 8192,
    api_key: '',
};

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
            .catch(() => { });
    }, []);

    async function handleSave() {
        setSaving(true);
        setMsg('');
        try {
            const body = {};
            if (embedKey && !embedKey.startsWith('***')) body.embed_openai_key = embedKey;
            if (fbToken !== undefined) body.fb_verify_token = fbToken;
            const res = await fetch('/api/v1/system-config', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            if (!res.ok) throw new Error('Lỗi lưu cấu hình');
            setMsg('Đã lưu thành công');
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

export default function AiSettingsPage() {
    const [config, setConfig] = useState(DEFAULT_CONFIG);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [testing, setTesting] = useState(false);
    const [saveMsg, setSaveMsg] = useState(null);
    const [testResult, setTestResult] = useState(null);

    useEffect(() => {
        fetch('/api/v1/ai-settings')
            .then(r => r.json())
            .then(data => setConfig(prev => ({ ...prev, ...data, api_key: '' })))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    async function handleSave() {
        setSaving(true);
        setSaveMsg(null);
        try {
            const res = await fetch('/api/v1/ai-settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config),
            });
            if (res.ok) {
                setSaveMsg({ ok: true, text: 'Đã lưu cấu hình thành công' });
            } else {
                setSaveMsg({ ok: false, text: 'Lỗi khi lưu cấu hình' });
            }
        } catch {
            setSaveMsg({ ok: false, text: 'Lỗi kết nối' });
        } finally {
            setSaving(false);
            setTimeout(() => setSaveMsg(null), 4000);
        }
    }

    async function handleTest() {
        setTesting(true);
        setTestResult(null);
        try {
            const res = await fetch('/api/v1/ai-settings/test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config),
            });
            const data = await res.json();
            setTestResult(data);
        } catch {
            setTestResult({ success: false, message: 'Lỗi kết nối' });
        } finally {
            setTesting(false);
        }
    }

    if (loading) {
        return <p className="text-gray-400 text-sm">Đang tải cấu hình...</p>;
    }

    return (
        <div className="max-w-xl space-y-6">
            <InfoCard title="Hướng dẫn cài đặt AI">
                <p><strong>Cấu hình LLM:</strong> Chọn nhà cung cấp AI (DeepSeek / OpenAI / Google) và model phù hợp. Nhập API Key nếu muốn thay đổi.</p>
                <p><strong>OpenAI Embeddings Key:</strong> Dùng riêng cho hệ thống RAG (tìm kiếm tài liệu). Độc lập với LLM.</p>
                <p><strong>Facebook Verify Token:</strong> Token xác thực webhook khi kết nối Facebook Messenger.</p>
            </InfoCard>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-base font-semibold text-gray-800 mb-5">Cấu hình LLM</h2>
                <ProviderSelector config={config} onChange={setConfig} />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                <button
                    onClick={handleTest}
                    disabled={testing}
                    className="flex-1 py-3 rounded-xl border border-indigo-200 text-indigo-600 text-sm font-medium hover:bg-indigo-50 transition disabled:opacity-50"
                >
                    {testing ? 'Đang kiểm tra...' : 'Kiểm tra kết nối'}
                </button>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 py-3 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
                >
                    {saving ? 'Đang lưu...' : 'Lưu cấu hình'}
                </button>
            </div>

            {/* Test result */}
            {testResult && (
                <div className={`flex items-start gap-3 px-4 py-3 rounded-xl text-sm ${testResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                    }`}>
                    {testResult.success
                        ? <CheckCircle size={16} className="mt-0.5 shrink-0" />
                        : <AlertCircle size={16} className="mt-0.5 shrink-0" />}
                    <div>
                        <p className="font-medium">{testResult.message}</p>
                        {testResult.response_time_ms && (
                            <p className="text-xs opacity-75 mt-0.5">{testResult.response_time_ms}ms</p>
                        )}
                    </div>
                </div>
            )}

            {/* Save message */}
            {saveMsg && (
                <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm ${saveMsg.ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                    }`}>
                    {saveMsg.ok ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                    <span>{saveMsg.text}</span>
                </div>
            )}

            {/* System API Keys */}
            <SystemConfigCard />
        </div>
    );
}
