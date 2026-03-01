import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Strips all internal tags and splits content into text segments + action markers
function parseContent(raw) {
    // Split by [[OPEN_REGISTER]] — each occurrence becomes a button marker
    const segments = raw.split('[[OPEN_REGISTER]]');
    // Also handle legacy [[REGISTER_BTN]] tag the same way
    const result = [];
    segments.forEach((seg, i) => {
        const subParts = seg.split('[[REGISTER_BTN]]');
        subParts.forEach((part, j) => {
            if (part.trim()) result.push({ type: 'text', content: part });
            if (j < subParts.length - 1) result.push({ type: 'register_btn' });
        });
        if (i < segments.length - 1) result.push({ type: 'register_btn' });
    });
    return result;
}

export default function MessageBubble({ message, onRegister }) {
    const isBot = message.role === 'bot';
    const [copied, setCopied] = useState(false);

    const segments = isBot ? parseContent(message.content) : [];
    const cleanText = message.content
        .replace(/\[\[OPEN_REGISTER\]\]/g, '')
        .replace(/\[\[REGISTER_BTN\]\]/g, '');

    const handleCopy = () => {
        navigator.clipboard.writeText(cleanText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (isBot && !cleanText.trim()) return null;

    return (
        <div className={cn(
            "flex w-full mb-6 gap-4 animate-fade-in group",
            isBot ? "justify-start" : "justify-end"
        )}>
            {/* Avatar (Bot only) */}
            {isBot && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#b91c1c] to-[#991b1b] flex items-center justify-center shrink-0 shadow-md shadow-red-100 mt-1">
                    <span className="text-white text-xs font-bold">A</span>
                </div>
            )}

            <div className={cn(
                "relative max-w-[85%] lg:max-w-[75%] px-5 py-4 text-sm leading-relaxed shadow-sm transition-all duration-200",
                isBot
                    ? "bg-white border border-gray-200 rounded-2xl rounded-tl-sm text-gray-800"
                    : "bg-indigo-600 text-white rounded-2xl rounded-tr-sm shadow-indigo-200"
            )}>

                {isBot ? (
                    <div className="prose prose-sm max-w-none prose-p:text-gray-700 prose-headings:text-gray-800 prose-strong:text-gray-900 prose-code:text-indigo-600 prose-code:bg-indigo-50 prose-code:px-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none">
                        {segments.map((seg, index) => (
                            <React.Fragment key={index}>
                                {seg.type === 'text' ? (
                                    <ReactMarkdown
                                        components={{
                                            a({ node, href, children, ...props }) {
                                                return (
                                                    <a href={href} className="text-blue-600 hover:text-blue-800 underline font-medium" target="_blank" rel="noopener noreferrer" {...props}>
                                                        {children}
                                                    </a>
                                                );
                                            },
                                            code({ node, inline, className, children, ...props }) {
                                                const match = /language-(\w+)/.exec(className || '')
                                                return !inline && match ? (
                                                    <div className="rounded-lg overflow-hidden my-3 border border-gray-200 bg-gray-50">
                                                        <div className="px-3 py-1.5 bg-gray-100 border-b border-gray-200 text-xs text-gray-500 flex justify-between items-center">
                                                            <span>{match[1]}</span>
                                                        </div>
                                                        <SyntaxHighlighter
                                                            style={oneLight}
                                                            language={match[1]}
                                                            PreTag="div"
                                                            customStyle={{ margin: 0, padding: '1rem', background: 'transparent' }}
                                                            {...props}
                                                        >
                                                            {String(children).replace(/\n$/, '')}
                                                        </SyntaxHighlighter>
                                                    </div>
                                                ) : (
                                                    <code className={className} {...props}>
                                                        {children}
                                                    </code>
                                                )
                                            }
                                        }}
                                    >
                                        {seg.content}
                                    </ReactMarkdown>
                                ) : (
                                    /* [[OPEN_REGISTER]] or [[REGISTER_BTN]] → clickable button */
                                    <button
                                        onClick={onRegister}
                                        className="inline-flex items-center gap-2 bg-[#1e3a8a] text-white px-4 py-2 rounded-lg my-2 hover:bg-[#172554] transition-colors text-sm font-medium shadow-sm"
                                    >
                                        Đăng ký tư vấn ngay
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                                    </button>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                ) : (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                )}

                {/* Copy Button (Bot Only, Hover) */}
                {isBot && (
                    <button
                        onClick={handleCopy}
                        className="absolute -bottom-6 left-0 flex items-center gap-1 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-indigo-600"
                    >
                        {copied ? <Check size={12} /> : <Copy size={12} />}
                        {copied ? "Copied" : "Copy"}
                    </button>
                )}
            </div>
        </div>
    );
}
