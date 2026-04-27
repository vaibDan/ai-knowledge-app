import prisma from "@/app/lib/db";
import { generateEmbedding } from "@/app/lib/embedding";
import { rerankChunks } from "@/app/lib/rerank";
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
    // const initialResults = await prisma.$queryRaw`
    // SELECT c.content,
    //     c.embedding <-> ${vector}::vector AS distance,
    //     d.title
    // FROM "Chunk" c
    // JOIN "Document" d ON c."documentId" = d.id
    // ORDER BY embedding <-> ${vector}::vector
    // LIMIT 6;
    // ` as { content: string; distance: number; title: string }[];

    const initialResults = await prisma.$queryRaw<{
        id: string;
        content: string;
        title: string;
        semantic_score: number;
        keyword_score: number;
    }[]>`
SELECT *
FROM (
  SELECT 
    c.id,
    c.content,
    d.title,

    (1 / (1 + (c.embedding <-> ${vector}::vector))) AS semantic_score,

    ts_rank(
      c.fts,
      plainto_tsquery('english', ${question})
    ) AS keyword_score

  FROM "Chunk" c
  JOIN "Document" d ON d.id = c."documentId"

) sub

ORDER BY 
  (sub.semantic_score * 0.7 + sub.keyword_score * 0.3) DESC

LIMIT 8;
`;
    const reranked = await rerankChunks(question, initialResults);
    const finalChunks = reranked.slice(0, 3);

    console.log("Retrieved chunks:", initialResults);
    console.log(initialResults.map(r => r.content));
    console.log(finalChunks);
    // 3. Build context
    const context = finalChunks.map(r => r.content).join("\n\n");

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
