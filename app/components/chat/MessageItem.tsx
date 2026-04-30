import ReactMarkdown from "react-markdown";
import { Message } from "../../types/chat";
import SourcesList from "./Sources";

interface MessageItemProps {
    message: Message;
}

export default function MessageItem({ message }: MessageItemProps) {
    const isUser = message.role === "user";

    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
            <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    isUser
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-gray-900 shadow-sm ring-1 ring-gray-200"
                }`}
            >
                <div className={`text-sm leading-relaxed ${isUser ? "prose prose-invert" : "prose"}`}>
                    {isUser ? (
                        <p>{message.content}</p>
                    ) : (
                        <ReactMarkdown
                            components={{
                                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                a: ({ href, children }) => (
                                    <a href={href} className="text-indigo-600 hover:underline">
                                        {children}
                                    </a>
                                ),
                                code: ({ children }) => (
                                    <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs">
                                        {children}
                                    </code>
                                ),
                                pre: ({ children }) => (
                                    <pre className="mb-2 overflow-x-auto rounded-lg bg-gray-100 p-3">
                                        {children}
                                    </pre>
                                ),
                                ul: ({ children }) => <ul className="mb-2 list-disc pl-4">{children}</ul>,
                                ol: ({ children }) => <ol className="mb-2 list-decimal pl-4">{children}</ol>,
                                li: ({ children }) => <li className="mb-1">{children}</li>,
                            }}
                        >
                            {message.content}
                        </ReactMarkdown>
                    )}
                </div>

                {!isUser && message.sources && message.sources.length > 0 && (
                    <SourcesList sources={message.sources} />
                )}
            </div>
        </div>
    );
}