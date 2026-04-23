"use client";

import { useEffect, useRef, useState } from "react";

type Message = {
    role: "user" | "assistant";
    content: string;
};

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage: Message = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);

        const currentInput = input;
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                body: JSON.stringify({ question: currentInput }),
            });

            if (!res.ok) {
                throw new Error("Failed to send message");
            }

            const reader = res.body?.getReader();
            const decoder = new TextDecoder();

            let aiText = "";

            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "" },
            ]);

            while (true) {
                const { done, value } = await reader!.read();
                if (done) break;

                const chunk = decoder.decode(value);
                aiText += chunk;

                setMessages((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1].content = aiText;
                    return updated;
                });
            }
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
                        {msg.content}
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
