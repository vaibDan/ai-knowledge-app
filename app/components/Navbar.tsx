"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import AuthButton from "./AuthButton";

type NavbarProps = {
    variant?: "home" | "app";
    currentPage?: "chat" | "ingest";
};

function linkClasses(isActive: boolean) {
    return isActive
        ? "text-sm font-medium text-gray-900"
        : "text-sm font-medium text-gray-600 transition-colors hover:text-gray-900";
}

export default function Navbar({
    variant = "home",
    currentPage,
}: NavbarProps) {
    const { data: session } = useSession();
    const isAppNav = variant === "app";

    return (
        <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
                            AI
                        </div>
                        <span className="text-lg font-semibold text-gray-900">Knowledge</span>
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    {isAppNav ? (
                        <>
                            <Link href="/chat" className={linkClasses(currentPage === "chat")}>
                                Chat
                            </Link>
                            <Link href="/ingest" className={linkClasses(currentPage === "ingest")}>
                                Add Documents
                            </Link>
                        </>
                    ) : (
                        <Link
                            href="#features"
                            className="hidden text-sm font-medium text-gray-600 hover:text-gray-900 sm:inline"
                        >
                            Features
                        </Link>
                    )}

                    <AuthButton session={session} />
                </div>
            </div>
        </nav>
    );
}
