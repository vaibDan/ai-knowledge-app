"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Message } from "../../types/chat";
import { sendMessage } from "../../lib/api";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";

export default function ChatContainer() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (text: string) => {
        if (!text.trim()) return;

        const userMsg: Message = {
            id: crypto.randomUUID(),
            role: "user",
            content: text,
        };

        setMessages((prev) => [...prev, userMsg]);
        setLoading(true);

        try {
            const res = await sendMessage(text);

            const aiMsg: Message = {
                id: crypto.randomUUID(),
                role: "assistant",
                content: res.answer,
                sources: res.sources,
            };

            setMessages((prev) => [...prev, aiMsg]);
        } catch {
            const errorMsg: Message = {
                id: crypto.randomUUID(),
                role: "assistant",
                content: "Sorry, I encountered an error. Please try again.",
            };
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-full flex-col rounded-2xl bg-white shadow-xl ring-1 ring-gray-200">
            <header className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold text-gray-900">Knowledge Assistant</h1>
                        <p className="text-xs text-gray-500">Powered by Google AI</p>
                    </div>
                </div>
                <Link
                    href="/ingest"
                    className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                    Add Documents
                </Link>
            </header>

            <MessageList messages={messages} />

            <div ref={bottomRef} />

            <ChatInput onSend={handleSend} loading={loading} />
        </div>
    );
}