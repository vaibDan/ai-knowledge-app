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
    const docs = await prisma.$queryRaw`
    SELECT content
    FROM "Document"
    ORDER BY embedding <-> ${vector}::vector
    LIMIT 5;
  ` as { content: string }[];

    // 3. Build context
    const context = docs.map(d => d.content).join("\n\n");

    // 4. Build prompt
    const prompt = `
You are an AI assistant with access to the following knowledge:

${context}

Answer the question based only on the above context.
If the answer is not present, say "I don't know".

Question: ${question}
`;

    // 5. Call LLM
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;

    return NextResponse.json({
        answer: response.text(),
    });
}