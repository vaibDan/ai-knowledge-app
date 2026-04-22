import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const result = await prisma.$queryRaw`SELECT NOW() AS current_time`;

        return NextResponse.json({
            success: true,
            message: "Test route connected to the database",
            data: result,
        });
    } catch (error) {
        console.error("Test route database check failed:", error);

        return NextResponse.json(
            {
                success: false,
                error: "Database connection failed",
            },
            { status: 500 }
        );
    }
}
