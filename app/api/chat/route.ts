import prisma from "@/app/lib/db";
import { generateEmbedding } from "@/app/lib/embedding";
import { rerankChunks } from "@/app/lib/rerank";
import { auth } from "@/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const RECENT_MESSAGE_LIMIT = 6;

export async function POST(req: Request) {
    const session = await auth();

    const userId = session?.user?.id;

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { question, chatId } = await req.json();


    // Create new chat if no chatId provided
    let chat;
    if (!chatId) {
        chat = await prisma.chat.create({
            data: {
                userId,
            },
        });
    } else {
        chat = await prisma.chat.findUnique({ where: { id: chatId } });

        if (!chat || chat.userId !== userId) {
            return Response.json({ error: "Forbidden" }, { status: 403 });
        }
    }

    if (!question) {
        return NextResponse.json({ error: "Question required" }, { status: 400 });
    }

    const resolvedChatId = chat.id;

    await prisma.message.create({
        data: {
            role: "user",
            content: question,
            chatId: resolvedChatId,
        },
    });

    const history = await prisma.message.findMany({
        where: { chatId: resolvedChatId },
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
            where: { id: resolvedChatId },
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

    (1 / (1 + (c.embedding <=> ${vector}::vector))) AS semantic_score,

    ts_rank(
      c.fts,
      plainto_tsquery('english', ${question})
    ) AS keyword_score

  FROM "Chunk" c
  JOIN "Document" d ON d.id = c."documentId"
   WHERE d."userId" = ${userId}

) sub

ORDER BY 
  (sub.semantic_score * 0.7 + sub.keyword_score * 0.3) DESC

LIMIT 8;
`;

    if (initialResults.length === 0) {
        const emptyMessage = "You have no documents uploaded yet. Please add documents first to use the knowledge assistant.";

        await prisma.message.create({
            data: {
                role: "assistant",
                content: emptyMessage,
                chatId: resolvedChatId,
            },
        });

        return new Response(emptyMessage, {
            headers: {
                "Content-Type": "text/plain",
                "X-Chat-Id": resolvedChatId,
            },
        });
    }

    const reranked = await rerankChunks(question, initialResults);
    const finalChunks = reranked
        .slice(0, 3)
        .filter(chunk => chunk.relevanceScore > 0.3);

    // console.log("finalChunks after filter:", finalChunks.length);

    // console.log("Embedding length:", embedding.length);
    // console.log("Embedding sample:", embedding.slice(0, 5));
    // // Should see actual numbers like [0.023, -0.14, 0.87, ...]
    // // Not all zeros like [0, 0, 0, 0, 0]
    // console.log("Retrieved chunks:", initialResults);
    // console.log(initialResults.map(r => r.content));
    // console.log("finalchunks:", finalChunks);
    // // console.log(userId);
    // console.log("userId:", userId);
    // console.log("initialResults count:", initialResults.length);
    // console.log(initialResults.map(r => r.semantic_score));

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
                        chatId: resolvedChatId,
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

    // After finalChunks is computed
    const sourcesPayload = Buffer.from(
        JSON.stringify(
            finalChunks.map(c => ({
                id: c.id,
                content: c.content,
                title: c.title,
                score: c.relevanceScore,
            }))
        )
    ).toString("base64");


    return new Response(readable, {
        headers: {
            "Content-Type": "text/plain",
            "X-Chat-Id": resolvedChatId,
            "X-Sources": sourcesPayload,
        },
    });
}
