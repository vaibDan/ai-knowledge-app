import { ChatDetail, ChatPreview } from "../types/chat";

type SendMessageOptions = {
    chatId?: string;
    onChunk?: (chunk: string, fullText: string) => void;
};

export async function sendMessage(message: string, options: SendMessageOptions = {}) {
    const { chatId, onChunk } = options;

    const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: message, chatId }),
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ error: "API error" }));
        throw new Error(error.error || "API error");
    }

    const resolvedChatId = res.headers.get("X-Chat-Id") ?? chatId ?? null;

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    let answer = "";

    if (!reader) {
        throw new Error("No response body");
    }

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        answer += chunk;
        onChunk?.(chunk, answer);
    }

    answer += decoder.decode();

    const sourcesRes = await fetch("/api/sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: message }),
    });

    const sourcesData = await sourcesRes.json();

    return { answer, sources: sourcesData.sources || [], chatId: resolvedChatId };
}

export async function fetchChats() {
    const res = await fetch("/api/chats", {
        method: "GET",
        cache: "no-store",
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ error: "Failed to fetch chats" }));
        throw new Error(error.error || "Failed to fetch chats");
    }

    return res.json() as Promise<ChatPreview[]>;
}

export async function fetchChat(chatId: string) {
    const res = await fetch(`/api/chats/${chatId}`, {
        method: "GET",
        cache: "no-store",
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ error: "Failed to fetch chat" }));
        throw new Error(error.error || "Failed to fetch chat");
    }

    return res.json() as Promise<ChatDetail>;
}
