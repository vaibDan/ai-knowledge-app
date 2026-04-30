
import ChatContainer from "../components/chat/ChatContainer";

export default function ChatPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30">
            <div className="mx-auto flex h-screen max-w-4xl items-center justify-center p-4 sm:p-6">
                <ChatContainer />
            </div>
        </div>
    );
}
