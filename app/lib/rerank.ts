import { CohereClientV2 } from "cohere-ai";

const cohere = new CohereClientV2({
    token: process.env.COHERE_API_KEY!,
});

interface Chunk {
    id: string;
    content: string;
    title: string;
}

export async function rerankChunks(query: string, chunks: Chunk[]) {
    try {
        const response = await cohere.rerank({
            model: "rerank-english-v3.0",
            query,
            documents: chunks.map((c) => c.content),
            topN: 3,
        });

        const reranked = response.results.map((r) => ({
            ...chunks[r.index],
            relevanceScore: r.relevanceScore,
        }));

        return reranked;
    } catch {
        console.error("Rerank error");
        return chunks.slice(0, 3);
    }
}