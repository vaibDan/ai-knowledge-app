"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";

interface AuthButtonProps {
    session: { user?: { name?: string | null; email?: string | null } | null } | null;
}

export default function AuthButton({ session }: AuthButtonProps) {
    if (session?.user) {
        return (
            <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-600">
                    {session.user.name || session.user.email}
                </span>
                <button
                    onClick={() => signOut()}
                    className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
                >
                    Sign Out
                </button>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-4">
            <Link
                href="/login"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
                Sign In
            </Link>
            <Link
                href="/login"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
            >
                Get Started
            </Link>
        </div>
    );
}