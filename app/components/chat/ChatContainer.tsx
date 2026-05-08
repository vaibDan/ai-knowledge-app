"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChatPreview, Message } from "../../types/chat";
import { deleteChat, fetchChat, fetchChats, sendMessage } from "../../lib/api";
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
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [deletingChatId, setDeletingChatId] = useState<string | null>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const streamBufferRef = useRef("");
    const streamingMessageIdRef = useRef<string | null>(null);
    const streamingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        return () => {
            if (streamingIntervalRef.current) {
                clearInterval(streamingIntervalRef.current);
            }
        };
    }, []);

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

    const closeSidebarOnMobile = () => {
        if (typeof window !== "undefined" && window.innerWidth < 1024) {
            setSidebarOpen(false);
        }
    };

    const handleSelectChat = async (selectedChatId: string) => {
        if (selectedChatId === chatId) {
            closeSidebarOnMobile();
            return;
        }

        setLoading(true);

        try {
            const chat = await fetchChat(selectedChatId);
            setChatId(chat.id);
            setMessages(chat.messages);
            closeSidebarOnMobile();
        } catch (error) {
            console.error("Failed to open chat:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleNewChat = () => {
        if (streamingIntervalRef.current) {
            clearInterval(streamingIntervalRef.current);
            streamingIntervalRef.current = null;
        }

        streamBufferRef.current = "";
        streamingMessageIdRef.current = null;
        setChatId(null);
        setMessages([]);
    };

    const handleDeleteChat = async (targetChatId: string) => {
        setDeletingChatId(targetChatId);

        try {
            await deleteChat(targetChatId);

            const remainingChats = chats.filter((chat) => chat.id !== targetChatId);
            setChats(remainingChats);

            if (chatId !== targetChatId) {
                return;
            }

            const nextChat = remainingChats[0];

            if (!nextChat) {
                setChatId(null);
                setMessages([]);
                return;
            }

            const nextFullChat = await fetchChat(nextChat.id);
            setChatId(nextFullChat.id);
            setMessages(nextFullChat.messages);
        } catch (error) {
            console.error("Failed to delete chat:", error);
        } finally {
            setDeletingChatId(null);
        }
    };

    const startStreamingAnimation = (assistantMessageId: string) => {
        if (streamingIntervalRef.current) {
            return;
        }

        streamingIntervalRef.current = setInterval(() => {
            const nextChunk = streamBufferRef.current.slice(0, 6);

            if (!nextChunk) {
                if (!streamBufferRef.current && streamingIntervalRef.current) {
                    clearInterval(streamingIntervalRef.current);
                    streamingIntervalRef.current = null;
                }
                return;
            }

            streamBufferRef.current = streamBufferRef.current.slice(nextChunk.length);

            setMessages((prev) =>
                prev.map((message) =>
                    message.id === assistantMessageId
                        ? {
                            ...message,
                            content: message.content + nextChunk,
                        }
                        : message
                )
            );

            if (!streamBufferRef.current && streamingIntervalRef.current) {
                clearInterval(streamingIntervalRef.current);
                streamingIntervalRef.current = null;
            }
        }, 24);
    };

    const queueStreamChunk = (assistantMessageId: string, chunk: string) => {
        if (!chunk) {
            return;
        }

        streamBufferRef.current += chunk;
        startStreamingAnimation(assistantMessageId);
    };

    const flushStreamingBuffer = async (assistantMessageId: string) => {
        while (streamBufferRef.current.length > 0 || streamingIntervalRef.current) {
            await new Promise((resolve) => setTimeout(resolve, 16));

            if (streamingMessageIdRef.current !== assistantMessageId) {
                return;
            }
        }
    };

    const handleSend = async (text: string) => {
        if (!text.trim()) return;

        const ID = Math.random().toString(36).substring(2) + Date.now().toString(36);

        const userMsg: Message = {
            id: ID,
            role: "user",
            content: text,
        };
        const assistantMsgId = ID + "-assistant";
        streamBufferRef.current = "";
        streamingMessageIdRef.current = assistantMsgId;

        setMessages((prev) => [
            ...prev,
            userMsg,
            {
                id: assistantMsgId,
                role: "assistant",
                content: "",
                streaming: true,
            },
        ]);
        setLoading(true);

        try {
            const activeChatId = chatId ?? undefined;
            const res = await sendMessage(text, {
                chatId: activeChatId,
                onChunk: (chunk) => {
                    queueStreamChunk(assistantMsgId, chunk);
                },
            });

            await flushStreamingBuffer(assistantMsgId);

            if (res.chatId) {
                const resolvedChatId = res.chatId;
                setChatId(resolvedChatId);

                setChats((prev) => {
                    const existingChat = prev.find((chat) => chat.id === resolvedChatId);
                    const updatedChat: ChatPreview = existingChat
                        ? {
                            ...existingChat,
                            messages: existingChat.messages.length > 0
                                ? existingChat.messages
                                : [{ id: userMsg.id, content: text, role: "user" }],
                        }
                        : {
                            id: resolvedChatId,
                            createdAt: new Date().toISOString(),
                            summary: null,
                            messages: [{ id: userMsg.id, content: text, role: "user" }],
                        };

                    return [
                        updatedChat,
                        ...prev.filter((chat) => chat.id !== resolvedChatId),
                    ];
                });
            }

            setMessages((prev) =>
                prev.map((message) =>
                    message.id === assistantMsgId
                        ? {
                            ...message,
                            content: res.answer,
                            sources: res.sources,
                            streaming: false,
                        }
                        : message
                )
            );
        } catch {
            if (streamingIntervalRef.current) {
                clearInterval(streamingIntervalRef.current);
                streamingIntervalRef.current = null;
            }

            streamBufferRef.current = "";

            setMessages((prev) =>
                prev.map((message) =>
                    message.id === assistantMsgId
                        ? {
                            ...message,
                            content: "Sorry, I encountered an error. Please try again.",
                            streaming: false,
                        }
                        : message
                )
            );
        } finally {
            streamingMessageIdRef.current = null;
            setLoading(false);
        }
    };

    return (
        <div className="relative flex h-full w-full overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-gray-200">
                {sidebarOpen && (
                    <button
                        type="button"
                        aria-label="Close chat sidebar overlay"
                        onClick={() => setSidebarOpen(false)}
                        className="absolute inset-0 z-20 bg-gray-900/20 lg:hidden"
                    />
                )}

                <aside
                    className={`absolute inset-y-0 left-0 z-30 flex max-w-[85vw] shrink-0 flex-col overflow-hidden border-r border-gray-200 bg-gray-50/95 transition-[transform,width,opacity] duration-200 lg:relative lg:z-0 lg:max-w-none lg:bg-gray-50/80 ${
                        sidebarOpen
                            ? "w-80 translate-x-0 opacity-100 lg:w-80"
                            : "w-80 -translate-x-full opacity-100 lg:w-0 lg:translate-x-0 lg:border-r-0 lg:opacity-0"
                    }`}
                >
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

                    <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 lg:hidden">
                        <p className="text-sm font-semibold text-gray-900">Past chats</p>
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(false)}
                            className="rounded-lg border border-gray-200 px-2 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-white hover:text-gray-900"
                        >
                            Close
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
                                        <div
                                            key={chat.id}
                                            className={`w-full rounded-xl px-3 py-3 text-left transition-colors ${
                                                isActive
                                                    ? "bg-white shadow-sm ring-1 ring-indigo-200"
                                                    : "hover:bg-white"
                                            }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => void handleSelectChat(chat.id)}
                                                    className="min-w-0 flex-1 text-left"
                                                >
                                                    <p className="truncate text-sm font-medium text-gray-900">
                                                        {getChatLabel(chat)}
                                                    </p>
                                                    <p className="mt-1 text-xs text-gray-500">
                                                        {new Date(chat.createdAt).toLocaleDateString()}
                                                    </p>
                                                </button>

                                                <button
                                                    type="button"
                                                    aria-label="Delete chat"
                                                    disabled={deletingChatId === chat.id}
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        void handleDeleteChat(chat.id);
                                                    }}
                                                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    {deletingChatId === chat.id ? (
                                                        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 7.5h12m-9.75 0v-.75A1.5 1.5 0 019.75 5.25h4.5a1.5 1.5 0 011.5 1.5v.75m-8.25 0v9.75A1.5 1.5 0 009 18.75h6a1.5 1.5 0 001.5-1.5V7.5M10.5 11.25v3.75m3-3.75v3.75" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </aside>

                <div className="flex min-w-0 flex-1 flex-col">
                <header className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setSidebarOpen((prev) => !prev)}
                            className="rounded-xl border border-gray-200 p-2 text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
                            aria-label={sidebarOpen ? "Hide past chats" : "Show past chats"}
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 6h16.5m-16.5 6h16.5" />
                            </svg>
                        </button>
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
