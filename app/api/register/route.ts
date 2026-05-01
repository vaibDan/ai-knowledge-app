import { NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});


const prisma = new PrismaClient({adapter});

export async function POST(req: Request) {
    const { email, password, name } = await req.json();

    if (!email || !password) {
        return NextResponse.json(
            { error: "Email and password required" },
            { status: 400 }
        );
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        return NextResponse.json(
            { error: "User already exists" },
            { status: 400 }
        );
    }

    // Hash password — never store plain text
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: { email, name, password: hashedPassword },
    });

    return NextResponse.json({ id: user.id, email: user.email });
}
