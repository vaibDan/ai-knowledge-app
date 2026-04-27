"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

type Message = {
    role: "user" | "assistant";
    content: string;
    sources?: {
        content: string;
        distance: number;
        title?: string;
    }[];
};

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const [chatId] = useState(() => crypto.randomUUID());

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage: Message = { role: "user", content: input };
        const currentInput = input;
        const assistantIndex = messages.length + 1;

        setMessages((prev) => [
            ...prev,
            userMessage,
            { role: "assistant", content: "" },
        ]);
        setInput("");
        setLoading(true);


        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ question: currentInput, chatId }),
            });

            if (!res.ok) {
                throw new Error("Failed to send message");
            }
            // const data = await res.json();
            const reader = res.body?.getReader();
            const decoder = new TextDecoder();

            let aiText = "";
            // const aiMessage: Message = {
            //     role: "assistant",
            //     content: data.answer,
            //     sources: data.sources,
            // };
            // setMessages((prev) => [
            //     ...prev,
            //     aiMessage,
            // ]);


            while (true) {
                const { done, value } = await reader!.read();
                if (done) break;

                const chunk = decoder.decode(value);
                aiText += chunk;

                setMessages((prev) => {
                    const updated = [...prev];
                    updated[assistantIndex] = {
                        ...updated[assistantIndex],
                        content: aiText,
                    };
                    return updated;
                });
            }

            const srcRes = await fetch("/api/sources", {
                method: "POST",
                body: JSON.stringify({ question: currentInput }),
            });

            const srcData = await srcRes.json();

            setMessages((prev) => {
                const updated = [...prev];
                updated[assistantIndex] = {
                    ...updated[assistantIndex],
                    sources: srcData.sources,
                };
                return updated;
            });

        } catch (err) {
            console.error(err);
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "Something went wrong. Please try again.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto flex h-screen max-w-2xl flex-col p-4">
            <h1 className="mb-4 text-2xl font-semibold">AI Knowledge Chat</h1>

            <div className="mb-4 flex-1 space-y-3 overflow-y-auto rounded border p-4">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`rounded p-3 ${msg.role === "user"
                            ? "bg-blue-100 text-black text-right"
                            : "bg-gray-100 text-black text-left"
                            }`}
                    >
                        {msg.role === "user" ? (
                            msg.content
                        ) : (
                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                        )}
                        {msg.role === "assistant" && msg.sources && (
                            <div className="mt-2 text-sm space-y-2">
                                <p className="font-semibold text-black">Sources:</p>

                                {msg.sources.map((s, idx) => {
                                    const relevance =
                                        s.distance != null ? (1 / (1 + s.distance)).toFixed(2) : "n/a";

                                    let label = "Low";
                                    if (s.distance != null) {
                                        if (s.distance < 0.5) {
                                            label = "High";
                                        } else if (s.distance < 1.0) {
                                            label = "Medium";
                                        }
                                    }

                                    return (
                                        <div key={idx} className="rounded border bg-cyan-100 p-2">
                                            <p className="line-clamp-3">
                                                {s.content.slice(0, 120)}...
                                            </p>
                                            {s.title && (
                                                <p className="text-xs text-gray-400">
                                                    {s.title}
                                                </p>
                                            )}
                                            <p className="text-xs text-gray-700">
                                                Relevance: {label} ({relevance})
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ))}

                {loading && <div className="text-sm text-gray-500">Thinking...</div>}
                <div ref={bottomRef} />
            </div>

            <div className="flex gap-2">
                <input
                    className="flex-1 rounded border p-2"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask something..."
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            void sendMessage();
                        }
                    }}
                />
                <button
                    onClick={() => {
                        void sendMessage();
                    }}
                    className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
                    disabled={loading}
                >
                    Send
                </button>
            </div>
        </div>
    );
}
