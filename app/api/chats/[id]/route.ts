import { auth } from "@/auth";
import prisma from "@/app/lib/db";

export async function GET(
    _request: Request,
    context: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const chat = await prisma.chat.findFirst({
        where: {
            id,
            userId,
        },
        include: {
            messages: {
                orderBy: { createdAt: "asc" },
            },
        },
    });

    if (!chat) {
        return Response.json({ error: "Chat not found" }, { status: 404 });
    }

    return Response.json(chat);
}

export async function DELETE(
    _request: Request,
    context: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const chat = await prisma.chat.findFirst({
        where: {
            id,
            userId,
        },
        select: {
            id: true,
        },
    });

    if (!chat) {
        return Response.json({ error: "Chat not found" }, { status: 404 });
    }

    await prisma.$transaction([
        prisma.message.deleteMany({
            where: { chatId: id },
        }),
        prisma.chat.delete({
            where: { id },
        }),
    ]);

    return Response.json({ success: true });
}
