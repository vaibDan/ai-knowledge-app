import { CohereClientV2 } from "cohere-ai";

const cohere = new CohereClientV2({
    token: process.env.COHERE_API_KEY!,
});

interface Chunk {
    id: string;
    content: string;
    title: string;
    relevanceScore?: number;
}

export async function rerankChunks(query: string, chunks: Chunk[]) {
    if (chunks.length === 0) return []; 
    try {
        const response = await cohere.rerank({
            model: "rerank-english-v3.0",
            query,
            documents: chunks.map((c) => c.content),
            topN: Math.min(3, chunks.length),
        });

        const reranked = response.results.map((r) => ({
            ...chunks[r.index],
            relevanceScore: r.relevanceScore,
        }));

        return reranked;
    } catch (error) {
        console.error("Rerank error", error);
        return chunks.slice(0, 3).map((chunk) => ({
            ...chunk,
            relevanceScore: 1,
        }));
    }
}