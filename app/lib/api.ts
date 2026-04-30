export async function sendMessage(message: string) {
    const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: message, chatId: crypto.randomUUID() }),
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ error: "API error" }));
        throw new Error(error.error || "API error");
    }

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    let answer = "";

    if (!reader) {
        throw new Error("No response body");
    }

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        answer += decoder.decode(value);
    }

    const sourcesRes = await fetch("/api/sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: message }),
    });

    const sourcesData = await sourcesRes.json();

    return { answer, sources: sourcesData.sources || [] };
}