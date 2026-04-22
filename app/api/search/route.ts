import prisma from "@/app/lib/db";
import { generateEmbedding } from "@/app/lib/embedding";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query) {
        return NextResponse.json({ error: "Query missing" }, { status: 400 });
    }

    // 1. Generate embedding for query
    const embedding = await generateEmbedding(query);

    const vector = `[${embedding.join(",")}]`;

    // 2. Perform similarity search
    const results = await prisma.$queryRaw`
  SELECT content, "documentId",
        embedding <-> ${vector}::vector AS distance
  FROM "Chunk"
  WHERE embedding <-> ${vector}::vector < 0.6
  ORDER BY embedding <-> ${vector}::vector
  LIMIT 10;
`;

    return NextResponse.json({
        query,
        results,
    });
}