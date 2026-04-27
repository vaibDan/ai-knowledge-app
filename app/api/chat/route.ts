import prisma from "@/app/lib/db";
import { generateEmbedding } from "@/app/lib/embedding";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const RECENT_MESSAGE_LIMIT = 6;

export async function POST(req: Request) {
    const { question, chatId } = await req.json();

    if (!question) {
        return NextResponse.json({ error: "Question required" }, { status: 400 });
    }
    const chat = await prisma.chat.upsert({ // update the chat before adding the message
        where: { id: chatId },
        update: {},
        create: { id: chatId },
    });
    await prisma.message.create({
        data: {
            role: "user",
            content: question,
            chatId,
        },
    });

    const history = await prisma.message.findMany({
        where: { chatId },
        orderBy: { createdAt: "asc" },
        // We keep the full chat history here so we can summarize older turns
        // once the conversation grows beyond the recent window.
    });

    const recent = history.slice(-RECENT_MESSAGE_LIMIT);
    const older = history.slice(0, -RECENT_MESSAGE_LIMIT);

    let summary = chat.summary || "";

    if (older.length > 0) {
        const textToSummarize = older
            .map((m) => `${m.role}: ${m.content}`)
            .join("\n");

        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
        const result = await model.generateContent(`
    Summarize this conversation briefly for memory:

    ${textToSummarize}
  `);
        const response = await result.response;
        summary = await response.text();

        await prisma.chat.update({
            where: { id: chatId },
            data: { summary },
        });
    }
    // 1. Embed user query
    const embedding = await generateEmbedding(question);
    const vector = `[${embedding.join(",")}]`;

    // 2. Retrieve relevant documents
    const results = await prisma.$queryRaw`
    SELECT c.content,
        c.embedding <-> ${vector}::vector AS distance,
        d.title
    FROM "Chunk" c
    JOIN "Document" d ON c."documentId" = d.id
    ORDER BY embedding <-> ${vector}::vector
    LIMIT 3;
    ` as { content: string; distance: number; title: string }[];

    console.log("Retrieved chunks:", results);
    console.log(results)

    // 3. Build context
    const context = results.map(r => r.content).join("\n\n");

    // 3. Improve context for Hybrid search by including only chunks that have keyword match or are very close in vector space
    // const context = results
    //     .slice(0, 5)
    //     .map(r => r.content)
    //     .join("\n\n");
    // console.log("Top chunks:", results);


    const recentText = recent
        .map((m) => `${m.role}: ${m.content}`)
        .join("\n");


    // 4. Build prompt
    const prompt = `
You are an AI assistant with access to the following knowledge,

If the context is relevant, use it.
If the context is empty or irrelevant, answer normally.

Summary of conversation:
${summary}

Recent conversation:
${recentText}

Context:${context}

Question: ${question}

Answer clearly and concisely.

`;

    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
    const stream = await model.generateContentStream(prompt);

    const encoder = new TextEncoder();
    let fullAnswer = "";

    const readable = new ReadableStream({
        async start(controller) {
            try {
                for await (const chunk of stream.stream) {
                    const text = chunk.text();
                    fullAnswer += text;
                    controller.enqueue(encoder.encode(text));
                }

                await prisma.message.create({
                    data: {
                        role: "assistant",
                        content: fullAnswer,
                        chatId,
                    },
                });
            } catch (error) {
                console.error("Chat streaming failed:", error);
                controller.error(error);
                return;
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
