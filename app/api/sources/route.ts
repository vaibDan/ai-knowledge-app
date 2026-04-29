import { generateEmbedding } from "@/app/lib/embedding";
import prisma from "@/app/lib/db";

export async function POST(req: Request) {
    const { question } = await req.json();

    if (!question) {
        return Response.json({ error: "Question required" }, { status: 400 });
    }

    const embedding = await generateEmbedding(question);
    const vector = `[${embedding.join(",")}]`;

    const results = await prisma.$queryRaw<{ id: string; content: string; title: string; distance: number }[]>`
        SELECT c.id, c.content, d.title,
            c.embedding <-> ${vector}::vector AS distance
        FROM "Chunk" c
        JOIN "Document" d ON c."documentId" = d.id
        ORDER BY c.embedding <-> ${vector}::vector
        LIMIT 3;
    `;

    const sources = results.map((r) => ({
        id: r.id,
        content: r.content,
        score: 1 / (1 + r.distance),
    }));

    return Response.json({ sources });
}
