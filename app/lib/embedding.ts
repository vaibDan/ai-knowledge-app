import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function generateEmbedding(text: string) {
    const model = genAI.getGenerativeModel({
        model: "gemini-embedding-001",
    });

    const result = await model.embedContent(text);

    return result.embedding.values;
}

// const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";

// export async function generateEmbedding(text: string): Promise<number[]> {
//     const res = await fetch(`${OLLAMA_URL}/api/embeddings`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//             model: "nomic-embed-text",
//             prompt: text,
//         }),
//     });

//     const data = await res.json();
//     return data.embedding;
// }