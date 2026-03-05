const MODELS = {
    deepseek: ['deepseek-chat', 'deepseek-reasoner'],
    openai: ['gpt-4o-mini', 'gpt-4o', 'gpt-4.1-mini'],
    google: ['gemini-2.0-flash', 'gemini-2.5-flash', 'gemini-2.5-pro'],
};

const PROVIDER_LABELS = {
    deepseek: 'DeepSeek',
    openai: 'OpenAI',
    google: 'Google Gemini',
};

export default function ProviderSelector({ config, onChange }) {
    const { provider, model, temperature, max_tokens, api_key } = config;

    function set(key, value) {
        onChange({ ...config, [key]: value });
    }

    return (
        <div className="space-y-5">
            {/* Provider Tabs */}
            <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">
                    Provider
                </label>
                <div className="flex gap-2">
                    {Object.entries(PROVIDER_LABELS).map(([key, label]) => (
                        <button
                            key={key}
                            onClick={() => set('provider', key)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                                provider === key
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Model */}
            <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">
                    Model
                </label>
                <div className="flex gap-2">
                    <input
                        value={model}
                        onChange={e => set('model', e.target.value)}
                        placeholder="Nhập tên model"
                        className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                    {(MODELS[provider] || []).map(m => (
                        <button
                            key={m}
                            onClick={() => set('model', m)}
                            className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                                model === m
                                    ? 'bg-indigo-100 text-indigo-700 font-medium'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {m}
                        </button>
                    ))}
                </div>
            </div>

            {/* API Key */}
            <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">
                    API Key
                </label>
                <input
                    type="password"
                    value={api_key}
                    onChange={e => set('api_key', e.target.value)}
                    placeholder="Để trống để giữ key hiện tại"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono outline-none focus:ring-2 focus:ring-indigo-300"
                />
            </div>

            {/* Temperature */}
            <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">
                    Temperature — <span className="text-indigo-600 font-semibold">{Number(temperature).toFixed(1)}</span>
                </label>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={temperature}
                    onChange={e => set('temperature', parseFloat(e.target.value))}
                    className="w-full accent-indigo-500"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Chính xác (0.0)</span>
                    <span>Sáng tạo (1.0)</span>
                </div>
            </div>

            {/* Max Tokens */}
            <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">
                    Max Tokens
                </label>
                <input
                    type="number"
                    min="256"
                    max="16384"
                    step="256"
                    value={max_tokens}
                    onChange={e => set('max_tokens', parseInt(e.target.value))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-300"
                />
            </div>
        </div>
    );
}
