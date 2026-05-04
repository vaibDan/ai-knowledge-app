// app/api/chats/route.ts
import { auth } from "@/auth";
import prisma from "@/app/lib/db";

export async function GET() {
    const session = await auth();

    const userId = session?.user?.id;

    if (!userId) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const chats = await prisma.chat.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: {
            messages: {
                take: 1,
                orderBy: { createdAt: "asc" },
            },
        },
    });

    return Response.json(chats);
}
