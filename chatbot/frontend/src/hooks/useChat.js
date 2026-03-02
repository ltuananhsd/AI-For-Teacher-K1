import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

const API_URL = '/api/v1';

export default function useChat() {
    const [welcomeMessage, setWelcomeMessage] = useState("Xin chào...");
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessions, setSessions] = useState([]);
    const [currentSessionId, setCurrentSessionId] = useState(null);
    const abortControllerRef = useRef(null);

    const makeWelcomeMsg = (text) => ({
        id: uuidv4(),
        role: 'bot',
        content: text.trim(),
        timestamp: new Date().toISOString()
    });

    // Load history list on mount
    useEffect(() => {
        const init = async () => {
            try {
                let fetchedWelcome = "Xin chào! Mình có thể giúp gì cho bạn?";
                try {
                    const wRes = await fetch(`${API_URL}/welcome`);
                    if (wRes.ok) {
                        const wData = await wRes.json();
                        fetchedWelcome = wData.message;
                        setWelcomeMessage(fetchedWelcome);
                    }
                } catch (e) {
                    console.error("Failed to fetch welcome:", e);
                }

                const res = await fetch(`${API_URL}/history`);
                if (res.ok) {
                    const data = await res.json();
                    setSessions(data);
                    if (data.length > 0) {
                        setCurrentSessionId(data[0].id);
                    } else {
                        setMessages([]);
                    }
                }
            } catch (e) {
                console.error("Failed to fetch history:", e);
            }
        };
        init();
    }, []);

    // Load messages when session changes
    useEffect(() => {
        if (currentSessionId) {
            loadSessionMessages(currentSessionId);
        } else if (sessions.length === 0) {
            setMessages([]);
        }
    }, [currentSessionId, sessions.length, welcomeMessage]);

    const loadSessionMessages = async (sessionId) => {
        setIsLoading(true);
        try {
            const res = await fetch(`${API_URL}/history/${sessionId}`);
            if (res.ok) {
                const data = await res.json();
                if (data.messages && data.messages.length > 0) {
                    let msgsToParse = data.messages;
                    // The backend automatically saves the welcome message as the very first DB entry
                    // We strip it here because App.jsx explicitly renders a Static Welcome Bubble on top.
                    if (msgsToParse.length > 0 && msgsToParse[0].role === 'bot') {
                        msgsToParse = msgsToParse.slice(1);
                    }
                    const formatted = msgsToParse.map(msg => ({
                        id: uuidv4(),
                        role: msg.role === 'user' ? 'user' : 'bot',
                        content: msg.content,
                        timestamp: new Date().toISOString()
                    }));
                    setMessages(formatted);
                } else {
                    setMessages([]);
                }
            }
        } catch (e) {
            console.error("Failed to load session:", e);
        } finally {
            setIsLoading(false);
        }
    };

    const createNewSession = () => {
        const newId = uuidv4();
        setSessions(prev => [{ id: newId, title: 'New Chat', updated_at: new Date().toISOString() }, ...prev]);
        setCurrentSessionId(newId);
        setMessages([]);
    };

    const sendMessage = async (text) => {
        const messageText = text || input.trim();
        if (!messageText || isLoading) return;

        const userMsg = { id: uuidv4(), role: 'user', content: messageText, timestamp: new Date().toISOString() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        let sessionId = currentSessionId;
        if (!sessionId) {
            sessionId = uuidv4();
            setCurrentSessionId(sessionId);
            setSessions(prev => [{ id: sessionId, title: messageText.substring(0, 30) + "...", updated_at: new Date().toISOString() }, ...prev]);
        }

        const botMsgId = uuidv4();
        setMessages(prev => [...prev, { id: botMsgId, role: 'bot', content: '', timestamp: new Date().toISOString() }]);

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        try {
            const response = await fetch(`${API_URL}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ session_id: sessionId, message: messageText }),
                signal: abortControllerRef.current.signal
            });

            if (!response.ok) throw new Error("Network response was not ok");

            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let botContent = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    const remaining = decoder.decode();
                    if (remaining) {
                        botContent += remaining;
                        setMessages(prev => prev.map(msg =>
                            msg.id === botMsgId ? { ...msg, content: botContent } : msg
                        ));
                    }
                    break;
                }
                // stream: true keeps incomplete UTF-8 multi-byte chars for next chunk
                const chunk = decoder.decode(value, { stream: true });
                botContent += chunk;
                setMessages(prev => prev.map(msg =>
                    msg.id === botMsgId ? { ...msg, content: botContent } : msg
                ));
            }

            // Refresh sidebar titles/timestamps
            const histRes = await fetch(`${API_URL}/history`);
            if (histRes.ok) setSessions(await histRes.json());

        } catch (e) {
            if (e.name === 'AbortError') {
                console.log("Chat aborted by user");
                return;
            }
            console.error("Chat error:", e);
            setMessages(prev => prev.map(msg =>
                msg.id === botMsgId ? { ...msg, content: "Lỗi kết nối. Vui lòng thử lại." } : msg
            ));
        } finally {
            setIsLoading(false);
            abortControllerRef.current = null;
        }
    };

    const deleteSession = async (sessionId) => {
        try {
            const res = await fetch(`${API_URL}/history/${sessionId}`, { method: 'DELETE' });
            if (res.ok) {
                setSessions(prev => prev.filter(s => s.id !== sessionId));
                if (currentSessionId === sessionId) {
                    const remaining = sessions.filter(s => s.id !== sessionId);
                    if (remaining.length > 0) {
                        setCurrentSessionId(remaining[0].id);
                    } else {
                        setCurrentSessionId(null);
                        setMessages([makeWelcomeMsg()]);
                    }
                }
            }
        } catch (e) {
            console.error("Failed to delete session:", e);
        }
    };

    const stopResponse = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        setIsLoading(false);
    };

    return {
        welcomeMessage,
        messages,
        input,
        setInput,
        isLoading,
        sendMessage,
        stopResponse,
        sessions,
        currentSessionId,
        setSessionId: setCurrentSessionId,
        createNewSession,
        deleteSession,
        clearHistory: createNewSession
    };
}
