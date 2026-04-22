import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const result = await prisma.$queryRaw`SELECT 1 AS connected`;

        return NextResponse.json({
            success: true,
            message: "Database connection is working",
            data: result,
        });
    } catch (error) {
        console.error("Database connection test failed:", error);

        const message =
            error instanceof Error ? error.message : "Unknown database error";
        const code =
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            typeof error.code === "string"
                ? error.code
                : "UNKNOWN";

        return NextResponse.json(
            {
                success: false,
                error: "Database connection failed",
                code,
                details: message,
            },
            { status: 500 }
        );
    }
}
