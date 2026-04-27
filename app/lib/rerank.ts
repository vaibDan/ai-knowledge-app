import  { CohereClientV2 } from "cohere-ai";

const cohere = new CohereClientV2({
    token: process.env.COHERE_API_KEY!,
});

export async function rerankChunks(query: string, chunks: any[]) {
    try {
        const response = await cohere.rerank({
            model: "rerank-english-v3.0",
            query,
            documents: chunks.map((c) => c.content),
            topN: 3,
        });

        // Map ranked results back to original chunks
        const reranked = response.results.map((r) => ({
            ...chunks[r.index],
            relevanceScore: r.relevanceScore,
        }));

        return reranked;
    } catch (err) {
        console.error("Rerank error:", err);
        return chunks.slice(0, 3); // fallback
    }
}