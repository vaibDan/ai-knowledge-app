"use client";

import { useState, KeyboardEvent } from "react";

interface ChatInputProps {
    onSend: (text: string) => void;
    loading: boolean;
}

export default function ChatInput({ onSend, loading }: ChatInputProps) {
    const [input, setInput] = useState("");

    const handleSubmit = () => {
        if (!input.trim() || loading) return;
        onSend(input);
        setInput("");
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="border-t border-gray-200 bg-white p-4">
            <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:ring-indigo-500/20 transition-all">
                <input
                    className="flex-1 resize-none border-0 bg-transparent py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0 disabled:opacity-50"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask anything about your documents..."
                    disabled={loading}
                />
                <button
                    onClick={handleSubmit}
                    disabled={loading || !input.trim()}
                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Send message"
                >
                    {loading ? (
                        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                    ) : (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    )}
                </button>
            </div>
            <p className="mt-2 text-center text-xs text-gray-400">Press Enter to send, Shift+Enter for new line</p>
        </div>
    );
}