import  prisma  from "@/app/lib/db";
import { generateEmbedding } from "@/app/lib/embedding";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(req: Request) {
    const { question } = await req.json();

    if (!question) {
        return NextResponse.json({ error: "Question required" }, { status: 400 });
    }

    // 1. Embed user query
    const embedding = await generateEmbedding(question);
    const vector = `[${embedding.join(",")}]`;

    // 2. Retrieve relevant documents
    const results = await prisma.$queryRaw`
    SELECT content
    FROM "Chunk"
    ORDER BY embedding <-> ${vector}::vector
    LIMIT 5;
  ` as { content: string }[];

    console.log("Retrieved chunks:", results);

    // 3. Build context
    const context = results.map(r => r.content).join("\n\n");
    console.log("Top chunks:", results);

    // 4. Build prompt
    const prompt = `
You are an AI assistant with access to the following knowledge,
Answer ONLY using the provided context.
Do NOT add external knowledge.
If unsure, say "I don't know".



${context}

Question: ${question}

Answer clearly and concisely.

`;

    // 5. Call LLM
    const model = genAI.getGenerativeModel({ model: "gemma-4-31b-it" });

    const result = await model.generateContent(prompt);
    const response = await result.response;

    return NextResponse.json({
        answer: response.text(),
    });
}