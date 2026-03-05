import { useState } from 'react';
import { Lock } from 'lucide-react';

const SESSION_KEY = 'admin_auth';

export default function AdminAuthGate({ children }) {
    const [authed, setAuthed] = useState(
        () => sessionStorage.getItem(SESSION_KEY) === 'true'
    );
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (authed) return children;

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/v1/admin/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });
            const data = await res.json();
            if (data.valid) {
                sessionStorage.setItem(SESSION_KEY, 'true');
                setAuthed(true);
            } else {
                setError('Mật khẩu không đúng');
            }
        } catch {
            setError('Lỗi kết nối. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
                <div className="flex flex-col items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                        <Lock size={22} className="text-indigo-600" />
                    </div>
                    <h1 className="text-xl font-semibold text-gray-800">Quản trị hệ thống</h1>
                    <p className="text-sm text-gray-500 text-center">Nhập mật khẩu quản trị để tiếp tục</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="password"
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-300 transition"
                        autoFocus
                    />
                    {error && <p className="text-red-500 text-xs text-center">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading || !password}
                        className="bg-indigo-600 text-white rounded-xl py-3 text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                        {loading ? 'Đang kiểm tra...' : 'Đăng nhập'}
                    </button>
                </form>
            </div>
        </div>
    );
}
