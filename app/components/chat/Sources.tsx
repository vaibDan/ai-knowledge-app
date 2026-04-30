import { Source } from "../../types/chat";

interface SourcesProps {
    sources: Source[];
}

function normalizeScore(distance: number) {
    // convert distance → similarity (0 to 1 range approx)
    return 1 / (1 + distance);
}

function getRelevanceLabel(score: number): { label: string; color: string } {
    if (score >= 0.7) return { label: "High", color: "text-emerald-600" };
    if (score >= 0.4) return { label: "Medium", color: "text-amber-600" };
    return { label: "Low", color: "text-gray-500" };
}

export default function SourcesList({ sources }: SourcesProps) {
    return (
        <div className="mt-4 border-t border-gray-100 pt-4">
            <div className="mb-3 flex items-center gap-2">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Sources</span>
            </div>
            <div className="space-y-2">
                {sources.map((s) => {
                    const similarity = normalizeScore(s.score);
                    const relevance = getRelevanceLabel(similarity);
                    return (
                        <div
                            key={s.id}
                            className="rounded-xl border border-gray-100 bg-gray-50 p-3 transition-colors hover:bg-gray-100"
                        >
                            <p className="line-clamp-2 mb-2 text-xs leading-relaxed text-gray-700">
                                {s.content}
                            </p>
                            <div className="flex items-center justify-between">
                                <span className={`text-xs font-medium ${relevance.color}`}>
                                    {relevance.label} • {(similarity * 100).toFixed(0)}% match
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}