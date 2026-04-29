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