import prisma from "@/app/lib/db";
import { generateEmbedding } from "@/app/lib/embedding";
import { chunkText } from "@/app/lib/chunk";
import { auth } from "@/auth"
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    const { title, content } = await req.json();

    if (!title || !content) {
        return NextResponse.json(
            { success: false, error: "Missing fields" },
            { status: 400 }
        );
    }

    const doc = await prisma.document.create({
        data: { title, content, userId },
    });

    const chunks = chunkText(content);

    for (const chunk of chunks) {
        const embedding = await generateEmbedding(chunk);
        const vector = `[${embedding.join(",")}]`;

        await prisma.$executeRaw`
      INSERT INTO "Chunk" (id, content, embedding, "documentId", "createdAt", fts)
      VALUES (
        gen_random_uuid(),
        ${chunk},
        ${vector}::vector,
        ${doc.id},
        NOW(),
        to_tsvector('english', ${chunk})
      )
    `;
    }

    return NextResponse.json({ success: true });
}
