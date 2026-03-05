import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import ProviderSelector from '../components/ai-settings/ProviderSelector';

const DEFAULT_CONFIG = {
    provider: 'deepseek',
    model: 'deepseek-chat',
    temperature: 0.3,
    max_tokens: 8192,
    api_key: '',
};

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
                <div className={`flex items-start gap-3 px-4 py-3 rounded-xl text-sm ${
                    testResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
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
                <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm ${
                    saveMsg.ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                }`}>
                    {saveMsg.ok ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                    <span>{saveMsg.text}</span>
                </div>
            )}
        </div>
    );
}
