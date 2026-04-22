export function chunkText(text: string, size = 500, overlap = 100) {
    const chunks: string[] = [];

    let start = 0;

    while (start < text.length) {
        const end = start + size;
        chunks.push(text.slice(start, end));
        start += size - overlap;
    }

    return chunks;
}