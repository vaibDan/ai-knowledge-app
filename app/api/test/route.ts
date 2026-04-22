import prisma from "@/app/lib/db";
import { generateEmbedding } from "@/app/lib/embedding";
import { NextResponse } from "next/server";

export async function GET() {
    const content = "This is a test document for AI knowledge system";

    // 1. Generate embedding
    const embedding = await generateEmbedding(content);

    // 2. Convert to vector format
    const vector = `[${embedding.join(",")}]`;

    // 3. Insert using raw SQL
    await prisma.$executeRaw`
    INSERT INTO "Document" (id, title, content, embedding, "createdAt", "updatedAt")
    VALUES (
    gen_random_uuid(),
    ${"Test Doc"},
    ${content},
    ${vector}::vector,
    NOW(),
    NOW()
    )
`;

    return NextResponse.json({
        success: true,
        message: "Document + embedding stored",
    });
}