"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChatPreview, Message } from "../../types/chat";
import { fetchChat, fetchChats, sendMessage } from "../../lib/api";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";

function getChatLabel(chat: ChatPreview) {
    const firstMessage = chat.messages[0]?.content?.trim();

    if (firstMessage) {
        return firstMessage.length > 48
            ? `${firstMessage.slice(0, 48).trimEnd()}...`
            : firstMessage;
    }

    return "Untitled chat";
}

export default function ChatContainer() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [chatId, setChatId] = useState<string | null>(null);
    const [chats, setChats] = useState<ChatPreview[]>([]);
    const [loadingChats, setLoadingChats] = useState(true);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        let isMounted = true;

        async function loadChats() {
            try {
                const savedChats = await fetchChats();

                if (!isMounted) {
                    return;
                }

                setChats(savedChats);

                if (savedChats.length > 0) {
                    const firstChat = savedChats[0];
                    setChatId(firstChat.id);

                    const fullChat = await fetchChat(firstChat.id);

                    if (!isMounted) {
                        return;
                    }

                    setMessages(fullChat.messages);
                }
            } catch (error) {
                console.error("Failed to load chats:", error);
            } finally {
                if (isMounted) {
                    setLoadingChats(false);
                }
            }
        }

        void loadChats();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleSelectChat = async (selectedChatId: string) => {
        if (selectedChatId === chatId) {
            return;
        }

        setLoading(true);

        try {
            const chat = await fetchChat(selectedChatId);
            setChatId(chat.id);
            setMessages(chat.messages);
        } catch (error) {
            console.error("Failed to open chat:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleNewChat = () => {
        setChatId(null);
        setMessages([]);
    };

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
            const activeChatId = chatId ?? undefined;
            const res = await sendMessage(text, activeChatId);

            if (res.chatId) {
                setChatId(res.chatId);

                setChats((prev) => {
                    const existingChat = prev.find((chat) => chat.id === res.chatId);
                    const updatedChat: ChatPreview = existingChat
                        ? {
                            ...existingChat,
                            messages: existingChat.messages.length > 0
                                ? existingChat.messages
                                : [{ id: userMsg.id, content: text, role: "user" }],
                        }
                        : {
                            id: res.chatId,
                            createdAt: new Date().toISOString(),
                            summary: null,
                            messages: [{ id: userMsg.id, content: text, role: "user" }],
                        };

                    return [
                        updatedChat,
                        ...prev.filter((chat) => chat.id !== res.chatId),
                    ];
                });
            }

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
        <div className="flex h-full w-full overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-gray-200">
                <aside className="hidden w-80 shrink-0 border-r border-gray-200 bg-gray-50/80 lg:flex lg:flex-col">
                    <div className="border-b border-gray-200 px-4 py-4">
                        <button
                            type="button"
                            onClick={handleNewChat}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            New chat
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto px-3 py-3">
                        {loadingChats ? (
                            <p className="px-3 py-2 text-sm text-gray-500">Loading chats...</p>
                        ) : chats.length === 0 ? (
                            <p className="px-3 py-2 text-sm text-gray-500">No saved chats yet.</p>
                        ) : (
                            <div className="space-y-2">
                                {chats.map((chat) => {
                                    const isActive = chat.id === chatId;

                                    return (
                                        <button
                                            key={chat.id}
                                            type="button"
                                            onClick={() => void handleSelectChat(chat.id)}
                                            className={`w-full rounded-xl px-3 py-3 text-left transition-colors ${
                                                isActive
                                                    ? "bg-white shadow-sm ring-1 ring-indigo-200"
                                                    : "hover:bg-white"
                                            }`}
                                        >
                                            <p className="truncate text-sm font-medium text-gray-900">
                                                {getChatLabel(chat)}
                                            </p>
                                            <p className="mt-1 text-xs text-gray-500">
                                                {new Date(chat.createdAt).toLocaleDateString()}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </aside>

                <div className="flex min-w-0 flex-1 flex-col">
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
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleNewChat}
                            className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 lg:hidden"
                        >
                            New chat
                        </button>
                        <Link
                            href="/ingest"
                            className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                            </svg>
                            Add Documents
                        </Link>
                    </div>
                </header>

                <MessageList messages={messages} />

                <div ref={bottomRef} />

                <ChatInput onSend={handleSend} loading={loading} />
                </div>
            </div>
    );
}
