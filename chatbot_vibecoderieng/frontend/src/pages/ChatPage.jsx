import { useState } from 'react';
import ChatInput from '../components/chat/ChatInput';
import MessageBubble from '../components/chat/MessageBubble';
import RegistrationModal from '../components/modals/RegistrationModal';
import useChat from '../hooks/useChat';

export default function ChatPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {
        welcomeMessage,
        messages,
        input,
        setInput,
        isLoading,
        sendMessage,
        currentSessionId,
        stopResponse,
    } = useChat();

    return (
        <div className="h-full flex flex-col max-w-3xl mx-auto">
            <div className="flex-1 overflow-y-auto space-y-6 pb-4">
                {welcomeMessage && (
                    <MessageBubble
                        message={{ id: 'static-welcome', role: 'bot', content: welcomeMessage }}
                        onRegister={() => setIsModalOpen(true)}
                    />
                )}
                {messages.map((msg, i) => (
                    <MessageBubble
                        key={msg.id || i}
                        message={msg}
                        onRegister={() => setIsModalOpen(true)}
                    />
                ))}
                {isLoading && (
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-md shadow-indigo-100 mt-1">
                            <span className="text-white text-xs font-bold">C</span>
                        </div>
                        <div className="flex items-center gap-1 mt-3">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-75" />
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-150" />
                        </div>
                    </div>
                )}
                <div id="scroll-anchor" className="h-1" />
            </div>

            <div className="pt-4 flex flex-col gap-2 shrink-0">
                <div className="flex justify-center">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-[#1e3a8a] text-white text-[11px] font-medium px-4 py-1.5 rounded-full hover:bg-[#172554] transition-colors shadow-sm"
                    >
                        Đăng ký tư vấn ngay
                    </button>
                </div>
                <ChatInput
                    value={input}
                    onChange={setInput}
                    onSend={sendMessage}
                    onStop={stopResponse}
                    isLoading={isLoading}
                />
                <p className="text-center text-[10px] text-gray-400">
                    AI có thể mắc lỗi. Hãy kiểm tra lại thông tin quan trọng.
                </p>
            </div>

            <RegistrationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                sessionId={currentSessionId}
            />
        </div>
    );
}
