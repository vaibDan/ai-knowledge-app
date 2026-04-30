"use client";

import { useState, KeyboardEvent } from "react";
import Link from "next/link";

export default function IngestPage() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const handleSubmit = async () => {
        if (!title || !content) {
            setMessage({ type: "error", text: "Title and content are required" });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const res = await fetch("/api/ingest", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title, content }),
            });

            const data = await res.json();

            if (data.success) {
                setMessage({ type: "success", text: "Document added successfully!" });
                setTitle("");
                setContent("");
            } else {
                setMessage({ type: "error", text: "Failed to add document" });
            }
        } catch {
            setMessage({ type: "error", text: "An error occurred. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && e.ctrlKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30">
            <div className="mx-auto flex h-screen max-w-2xl items-center justify-center p-4 sm:p-6">
                <div className="flex w-full flex-col rounded-2xl bg-white shadow-xl ring-1 ring-gray-200">
                    <header className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-lg font-semibold text-gray-900">Add Document</h1>
                                <p className="text-xs text-gray-500">Ingest into knowledge base</p>
                            </div>
                        </div>
                        <Link
                            href="/chat"
                            className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                            </svg>
                            Go to Chat
                        </Link>
                    </header>

                    <div className="p-6">
                        <div className="space-y-5">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Document Title
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., Company FAQ, Product Documentation"
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-indigo-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:ring-indigo-500/20"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Content
                                </label>
                                <textarea
                                    placeholder="Paste your document content here..."
                                    className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-indigo-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:ring-indigo-500/20"
                                    rows={8}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                                <p className="mt-2 text-xs text-gray-400">Press Ctrl+Enter to submit</p>
                            </div>

                            {message && (
                                <div
                                    className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${
                                        message.type === "success"
                                            ? "bg-emerald-50 text-emerald-700"
                                            : "bg-red-50 text-red-700"
                                    }`}
                                >
                                    {message.type === "success" ? (
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    )}
                                    {message.text}
                                </div>
                            )}

                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Adding Document...
                                    </>
                                ) : (
                                    <>
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                        </svg>
                                        Add Document
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}