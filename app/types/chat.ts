export type Message = {
    id: string;
    role: "user" | "assistant";
    content: string;
    sources?: Source[];
};

// type Message = {
//     role: "user" | "assistant";
//     content: string;
//     sources?: {
//         content: string;
//         distance: number;
//         score?: number;
//         title?: string;
//     }[];
// };

export type Source = {
    id: string;
    content: string;
    score: number;
};

export type ChatPreview = {
    id: string;
    createdAt: string;
    summary?: string | null;
    messages: Pick<Message, "id" | "content" | "role">[];
};

export type ChatDetail = {
    id: string;
    createdAt: string;
    summary?: string | null;
    messages: Message[];
};
