import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import InfoCard from '../components/common/InfoCard';

// Reusable code block with copy button
function CopyBlock({ code, language = 'bash' }) {
    const [copied, setCopied] = useState(false);

    function handleCopy() {
        navigator.clipboard.writeText(code).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }

    return (
        <div className="relative group">
            <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 text-xs overflow-x-auto leading-relaxed">
                <code>{code}</code>
            </pre>
            <button
                onClick={handleCopy}
                className="absolute top-3 right-3 p-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 transition opacity-0 group-hover:opacity-100"
                title="Sao chép"
            >
                {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
            </button>
        </div>
    );
}

export default function WebWidgetPage() {
    const origin = window.location.origin;
    const [botName, setBotName] = useState('Chatbot');
    const [color, setColor] = useState('#6366f1');
    const [position, setPosition] = useState('bottom-right');
    const [embedCopied, setEmbedCopied] = useState(false);

    // Generated embed script tag
    const embedCode = `<script
  src="${origin}/widget/chatbot-widget.js"
  data-bot-name="${botName}"
  data-color="${color}"
  data-position="${position}"
  data-api-url="${origin}/api/v1/chat"
></script>`;

    function copyEmbed() {
        navigator.clipboard.writeText(embedCode).then(() => {
            setEmbedCopied(true);
            setTimeout(() => setEmbedCopied(false), 2000);
        });
    }

    // API docs examples
    const curlExample = `curl -X POST ${origin}/api/v1/chat \\
  -H "Content-Type: application/json" \\
  -d '{"message": "Xin chào", "session_id": "unique-session-id"}'`;

    const fetchExample = `const response = await fetch('${origin}/api/v1/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'Xin chào',
    session_id: 'unique-session-id',
  }),
});

// Response is a text/plain stream — read chunks:
const reader = response.body.getReader();
const decoder = new TextDecoder();
let fullText = '';
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  fullText += decoder.decode(value, { stream: true });
}
console.log(fullText);`;

    return (
        <div className="max-w-2xl space-y-6">
            <InfoCard title="Hướng dẫn tích hợp Web Widget">
                <p>Dán đoạn mã nhúng vào thẻ <code>&lt;body&gt;</code> của trang web bất kỳ để hiển thị chat widget.</p>
                <p>Widget tự động kết nối đến API của hệ thống này — không cần cấu hình thêm.</p>
                <p>Session ID được lưu trong <code>localStorage</code> — chat tiếp tục giữa các lần reload trang.</p>
            </InfoCard>

            {/* === EMBED CODE GENERATOR === */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
                <h2 className="text-base font-semibold text-gray-800">Tạo mã nhúng</h2>

                {/* Config inputs */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Tên bot</label>
                        <input
                            type="text"
                            value={botName}
                            onChange={e => setBotName(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-300"
                            placeholder="Chatbot"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Màu chủ đạo</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={color}
                                onChange={e => setColor(e.target.value)}
                                className="w-10 h-9 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                            />
                            <input
                                type="text"
                                value={color}
                                onChange={e => setColor(e.target.value)}
                                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm font-mono outline-none focus:ring-2 focus:ring-indigo-300"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Vị trí</label>
                        <select
                            value={position}
                            onChange={e => setPosition(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                        >
                            <option value="bottom-right">Dưới phải</option>
                            <option value="bottom-left">Dưới trái</option>
                        </select>
                    </div>
                </div>

                {/* Generated code */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-medium text-gray-500">Mã nhúng</label>
                        <button
                            onClick={copyEmbed}
                            className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 transition"
                        >
                            {embedCopied ? <><Check size={12} className="text-green-500" /> Đã sao chép</> : <><Copy size={12} /> Sao chép</>}
                        </button>
                    </div>
                    <pre className="bg-gray-900 text-green-300 rounded-xl p-4 text-xs overflow-x-auto leading-relaxed whitespace-pre-wrap">
                        {embedCode}
                    </pre>
                </div>
            </div>

            {/* === API DOCS === */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
                <h2 className="text-base font-semibold text-gray-800">API tích hợp trực tiếp</h2>
                <p className="text-xs text-gray-500">
                    Gọi thẳng API nếu bạn muốn tự xây dựng giao diện chat hoặc tích hợp vào hệ thống khác.
                </p>

                <div className="space-y-2">
                    <div className="flex gap-3 text-xs">
                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded font-mono font-semibold">POST</span>
                        <code className="text-gray-700">{origin}/api/v1/chat</code>
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                        <p><strong>Content-Type:</strong> application/json</p>
                        <p><strong>Response:</strong> text/plain (streaming chunks)</p>
                    </div>
                </div>

                <div>
                    <p className="text-xs font-medium text-gray-500 mb-1.5">Payload</p>
                    <CopyBlock language="json" code={`{
  "message": "Nội dung tin nhắn",
  "session_id": "unique-id-cho-moi-user"
}`} />
                </div>

                <div>
                    <p className="text-xs font-medium text-gray-500 mb-1.5">cURL</p>
                    <CopyBlock language="bash" code={curlExample} />
                </div>

                <div>
                    <p className="text-xs font-medium text-gray-500 mb-1.5">JavaScript (Fetch + Streaming)</p>
                    <CopyBlock language="javascript" code={fetchExample} />
                </div>
            </div>
        </div>
    );
}
