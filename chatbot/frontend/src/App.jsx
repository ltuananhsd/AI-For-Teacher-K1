import { useState, useEffect } from 'react';

import Sidebar from './components/layout/Sidebar';
import ChatInput from './components/chat/ChatInput';
import MessageBubble from './components/chat/MessageBubble';
import RegistrationModal from './components/modals/RegistrationModal';
import RegistrationDashboard from './pages/RegistrationDashboard';
import useChat from './hooks/useChat';
import { Menu } from 'lucide-react';

// Simple hash-based routing: /#/dashboard → Dashboard, everything else → Chat
function useHashRoute() {
    const [hash, setHash] = useState(window.location.hash);
    useEffect(() => {
        const onHashChange = () => setHash(window.location.hash);
        window.addEventListener('hashchange', onHashChange);
        return () => window.removeEventListener('hashchange', onHashChange);
    }, []);
    return hash;
}

export default function App() {
    const hash = useHashRoute();

    // Show dashboard if hash matches
    if (hash === '#/dashboard') {
        return <RegistrationDashboard />;
    }

    // Default: Chat UI
    return <ChatApp />;
}

function ChatApp() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {
        welcomeMessage,
        messages,
        input,
        setInput,
        isLoading,
        sendMessage,
        sessions,
        currentSessionId,
        setSessionId,
        createNewSession,
        deleteSession,
        stopResponse,
    } = useChat();

    return (
        <div className="flex h-screen w-full bg-transparent overflow-hidden">
            {/* Sidebar */}
            <div className={`${isSidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 border-r border-gray-100 bg-white flex flex-col overflow-hidden`}>
                <Sidebar
                    sessions={sessions}
                    activeId={currentSessionId}
                    onSelect={setSessionId}
                    onNew={createNewSession}
                    onDelete={deleteSession}
                />
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col relative min-w-0">

                {/* Header */}
                <div className="h-16 border-b border-gray-100/50 flex items-center justify-between px-6 bg-white sticky top-0 z-10 shadow-sm">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors active:scale-95"
                        >
                            <Menu size={20} />
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
                    <div className="max-w-3xl mx-auto space-y-6 pb-4">

                        {/* Static Welcome Message on Top */}
                        {welcomeMessage && (
                            <MessageBubble
                                message={{
                                    id: 'static-welcome',
                                    role: 'bot',
                                    content: welcomeMessage
                                }}
                                onRegister={() => setIsModalOpen(true)}
                            />
                        )}

                        {/* Dynamic DB Messages */}
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
                                <div className="flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
                                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-75" />
                                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-150" />
                                </div>
                            </div>
                        )}
                        <div id="scroll-anchor" className="h-1" />
                    </div>
                </div>

                {/* Input */}
                <div className="p-6 pt-0">
                    <div className="max-w-3xl mx-auto flex flex-col gap-2">
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

                        <p className="text-center text-[10px] text-gray-400 mt-2">
                            AI có thể mắc lỗi. Hãy kiểm tra lại thông tin quan trọng.
                        </p>
                    </div>
                </div>

                <RegistrationModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    sessionId={currentSessionId}
                />
            </div>
        </div>
    );
}
