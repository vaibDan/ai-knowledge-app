"use client";

import { useState } from "react";

export default function IngestPage() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async () => {
        if (!title || !content) {
            setMessage("Title and content are required");
            return;
        }

        setLoading(true);
        setMessage("");

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
                setMessage("Document added successfully");
                setTitle("");
                setContent("");
            } else {
                setMessage("Failed to add document");
            }
        } catch (err) {
            setMessage("Error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-4">Add Knowledge</h1>

            <div className="space-y-4">
                <input
                    type="text"
                    placeholder="Title"
                    className="w-full border p-2 rounded"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <textarea
                    placeholder="Paste your content here..."
                    className="w-full border p-2 rounded h-40"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-black text-white px-4 py-2 rounded"
                >
                    {loading ? "Adding..." : "Add Document"}
                </button>

                {message && (
                    <p className="text-sm text-gray-600">{message}</p>
                )}
            </div>
        </div>
    );
}