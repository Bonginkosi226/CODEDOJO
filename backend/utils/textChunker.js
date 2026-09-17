/**
 * Split text into chunks for better AI processing
 * @param {string} text - Full text to chunk
 * @param {number} chunkSize - Target size per chunk (in words)
 * @param {number} overlap - Number of words to overlap between chunks
 * @returns {Array<{content: string, chunkIndex: number, pageNumber: number}>}
 */
export const chunkText = (text, chunkSize = 500, overlap = 50) => {
    if (!text || text.trim().length === 0) {
        return [];
    }

    // Clean text while preserving paragraph structure
    const cleanedText = text
        .replace(/\r\n/g, '\n')
        .replace(/\s+/g, ' ')
        .replace(/\n /g, '\n')
        .replace(/ \n/g, '\n')
        .trim();

    // Split by paragraphs
    const paragraphs = cleanedText
        .split(/\n+/)
        .filter(p => p.trim().length > 0);

    const chunks = [];
    let currentChunk = [];
    let currentWordCount = 0;
    let chunkIndex = 0;

    for (const paragraph of paragraphs) {
        const paragraphWords = paragraph.trim().split(/\s+/);
        const paragraphWordCount = paragraphWords.length;

        // If paragraph itself is larger than chunk size
        if (paragraphWordCount > chunkSize) {
            // Save existing chunk first
            if (currentChunk.length > 0) {
                chunks.push({
                    content: currentChunk.join('\n\n'),
                    chunkIndex: chunkIndex++,
                    pageNumber: 0
                });

                currentChunk = [];
                currentWordCount = 0;
            }

            // Split large paragraph into word chunks
            for (let i = 0; i < paragraphWords.length; i += (chunkSize - overlap)) {
                const chunkWords = paragraphWords.slice(i, i + chunkSize);

                chunks.push({
                    content: chunkWords.join(' '),
                    chunkIndex: chunkIndex++,
                    pageNumber: 0
                });

                if (i + chunkSize >= paragraphWords.length) break;
            }

            continue;
        }

        // If adding paragraph exceeds chunk size
        if (currentWordCount + paragraphWordCount > chunkSize && currentChunk.length > 0) {
            chunks.push({
                content: currentChunk.join('\n\n'),
                chunkIndex: chunkIndex++,
                pageNumber: 0
            });

            // Create overlap
            const prevWords = currentChunk.join(' ').split(/\s+/);
            const overlapText = prevWords
                .slice(-Math.min(overlap, prevWords.length))
                .join(' ');

            currentChunk = overlapText ? [overlapText, paragraph.trim()] : [paragraph.trim()];
            currentWordCount =
                overlapText.split(/\s+/).length + paragraphWordCount;
        } else {
            currentChunk.push(paragraph.trim());
            currentWordCount += paragraphWordCount;
        }
    }

    // Push last chunk
    if (currentChunk.length > 0) {
        chunks.push({
            content: currentChunk.join('\n\n'),
            chunkIndex: chunkIndex,
            pageNumber: 0
        });
    }

    // Fallback: word-based split
    if (chunks.length === 0 && cleanedText.length > 0) {
        const allWords = cleanedText.split(/\s+/);

        for (let i = 0; i < allWords.length; i += (chunkSize - overlap)) {
            const chunkWords = allWords.slice(i, i + chunkSize);

            chunks.push({
                content: chunkWords.join(' '),
                chunkIndex: chunkIndex++,
                pageNumber: 0
            });

            if (i + chunkSize >= allWords.length) break;
        }
    }

    return chunks;
};


const STOP_WORDS = new Set([
    'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but',
    'in', 'with', 'to', 'for', 'of', 'as', 'by', 'this', 'that', 'it',
    'was', 'are', 'be', 'been', 'have', 'has', 'had', 'do', 'does',
    'did', 'not', 'no', 'you', 'your', 'i', 'me', 'my', 'we', 'our',
    'they', 'them', 'their', 'he', 'she', 'his', 'her', 'can', 'could',
    'would', 'should', 'will', 'about', 'from', 'so', 'if', 'than'
]);

// Escape a string for use inside a RegExp
const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Find relevant chunks by whole-word, case-insensitive matching only —
 * never matches a query word as a substring of a longer word (so "hy"
 * cannot match inside "Hyperlink"). Stop words and tokens shorter than
 * 3 characters are ignored as search terms.
 * @param {Array<Object>} chunks - Array of chunks
 * @param {string} query - Search query
 * @param {number} maxChunks - Maximum chunks to return
 * @returns {Array<Object>}
 */
export const findRelevantChunks = (chunks, query, maxChunks = 5) => {
    if (!chunks || chunks.length === 0 || !query) {
        return [];
    }

    const queryWords = query
        .toLowerCase()
        .split(/\s+/)
        .map(w => w.replace(/[^\w'-]/g, ''))
        .filter(w => w.length >= 3 && !STOP_WORDS.has(w));

    // No usable search terms (e.g. only stop words / short tokens like "hy")
    // — there is nothing to rank against, so return nothing rather than an
    // arbitrary slice of the document.
    if (queryWords.length === 0) {
        return [];
    }

    const scoredChunks = chunks.map((chunk) => {
        const content = chunk.content.toLowerCase();
        const contentWordCount = content.split(/\s+/).length;
        let score = 0;
        let matchedWords = 0;

        for (const word of queryWords) {
            const wordRegex = new RegExp(`\\b${escapeRegExp(word)}\\b`, 'g');
            const matches = (content.match(wordRegex) || []).length;
            if (matches > 0) {
                score += matches * 3;
                matchedWords += 1;
            }
        }

        if (matchedWords > 1) {
            score += matchedWords * 2;
        }

        const normalizedScore = score / Math.sqrt(contentWordCount);

        return {
            content: chunk.content,
            chunkIndex: chunk.chunkIndex,
            pageNumber: chunk.pageNumber,
            _id: chunk._id,
            score: normalizedScore,
            matchedWords
        };
    });

    return scoredChunks
        .filter(chunk => chunk.score > 0)
        .sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            if (b.matchedWords !== a.matchedWords) return b.matchedWords - a.matchedWords;
            return a.chunkIndex - b.chunkIndex;
        })
        .slice(0, maxChunks);
};
