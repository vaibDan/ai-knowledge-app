import prisma from "@/app/lib/db";
import { generateEmbedding } from "@/app/lib/embedding";
import { chunkText } from "@/app/lib/chunk";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { title, content } = await req.json();

    // 1. Create document
    const doc = await prisma.document.create({
        data: { title, content },
    });

    // 2. Chunk text
    const chunks = chunkText(content);

    // 3. Store each chunk
    for (const chunk of chunks) {
        const embedding = await generateEmbedding(chunk);
        const vector = `[${embedding.join(",")}]`;

        await prisma.$executeRaw`
      INSERT INTO "Chunk" (id, content, embedding, "documentId", "createdAt")
      VALUES (
        gen_random_uuid(),
        ${chunk},
        ${vector}::vector,
        ${doc.id},
        NOW()
      )
    `;
    }

    return NextResponse.json({ success: true });
}