import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ChatContainer from "../components/chat/ChatContainer";
import Navbar from "../components/Navbar";

export default async function ChatPage() {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30">
            <Navbar variant="app" currentPage="chat" />

            <div className="mx-auto flex h-[calc(100vh-73px)] max-w-4xl items-center justify-center p-4 sm:p-6">
                <ChatContainer />
            </div>
        </div>
    );
}
