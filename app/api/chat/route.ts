import prisma from "@/app/lib/db";
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
    console.log(results)

    // 3. Build context
    // const context = results.map(r => r.content).join("\n\n");
    // 3. Improve context for Hybrid search by including only chunks that have keyword match or are very close in vector space
    const context = results
        .slice(0, 5)
        .map(r => r.content)
        .join("\n\n");
    console.log("Top chunks:", results);

    // 4. Build prompt
    const prompt = `
You are an AI assistant with access to the following knowledge,

If the context is relevant, use it.
If the context is empty or irrelevant, answer normally.



${context}

Question: ${question}

Answer clearly and concisely.

`;

    //     // 5. Call LLM
    //     const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });

    //     const result = await model.generateContent(prompt);
    //     const response = await result.response;

    //     return NextResponse.json({
    //         answer: response.text(),
    //     });
    // }

    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    // 3. Stream response
    const stream = await model.generateContentStream(prompt);

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
        async start(controller) {
            for await (const chunk of stream.stream) {
                const text = chunk.text();
                controller.enqueue(encoder.encode(text));
            }
            controller.close();
        },
    });

    return new Response(readable, {
        headers: {
            "Content-Type": "text/plain",
        },
    });
}