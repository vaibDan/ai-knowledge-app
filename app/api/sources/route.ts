import { generateEmbedding } from "@/app/lib/embedding";
import prisma from "@/app/lib/db";



export async function POST(req: Request) {
    const { question } = await req.json();

    const embedding = await generateEmbedding(question);
    const vector = `[${embedding.join(",")}]`;

    const results = await prisma.$queryRaw`
    SELECT c.content,
        c.embedding <-> ${vector}::vector AS distance,
        d.title
    FROM "Chunk" c
    JOIN "Document" d ON c."documentId" = d.id
    ORDER BY embedding <-> ${vector}::vector
    LIMIT 3;
  `;

    return Response.json({
        sources: results,
    });
}
