import 'dotenv/config';
import { findRelevantChunks, chunkText } from '../utils/textChunker.js';
import { chat } from './aiService.js';

// Small talk never touches retrieval or the AI provider.
const GREETING_RE = /^(hi+|hey+|hello+|hy+|yo|sup|thanks?( you)?|thx|ok(ay)?|cool|nice|great|good)[\s!.,]*$/i;

const SYSTEM_PROMPT = `You are the CodeDojo Assistant, a helpful study aid answering questions about one specific document.

Rules:
- Answer using ONLY the context below, but ALWAYS in your own plain words — never copy or quote sentences verbatim from the context, and never paste bullet lists straight from the source.
- Keep answers short: 2-4 sentences unless the student explicitly asks for more detail.
- If the context does not contain the answer, say so clearly instead of guessing or inventing one.
- Use the recent conversation history to understand follow-ups like "I don't know" or "explain more" — they refer back to what was just discussed.

Context from the document:
{CONTEXT}`;

/**
 * Answer a question about a document. Retrieval is whole-word, case-insensitive
 * keyword matching over the document's chunks (see findRelevantChunks) — never
 * embedding similarity over the raw text, and the raw chunks are never returned
 * to the user directly; they are only ever sent to the AI as context.
 *
 * The actual AI call (timeout/retry/Gemini->Mistral fallback/friendly errors)
 * lives in services/aiService.js — this module only owns retrieval + prompt.
 *
 * @param {Object} params
 * @param {string} params.question - The user's message
 * @param {Array<{content: string, chunkIndex: number, pageNumber: number}>} [params.chunks] - Pre-computed document chunks
 * @param {string} [params.text] - Full document text, used to chunk on the fly if `chunks` is empty
 * @param {Array<{role: string, content: string}>} [params.history] - Prior turns (role: "user" | "assistant"), most recent last
 * @returns {Promise<string>} the answer
 */
export const askQuestionFromText = async ({ question, chunks = [], text = '', history = [] }) => {
  if (!question || !question.trim()) {
    return "Please ask a question about the document.";
  }

  const trimmedQuestion = question.trim();

  if (GREETING_RE.test(trimmedQuestion)) {
    console.log('[Chat] source: greeting (no AI call)');
    return "Hey! I'm ready when you are — ask me anything about this document, like \"explain X\" or \"summarize section Y\".";
  }

  const effectiveChunks = chunks.length > 0 ? chunks : chunkText(text);
  const relevant = findRelevantChunks(effectiveChunks, trimmedQuestion, 5);
  const context = relevant.length > 0
    ? relevant.map((c) => c.content).join('\n\n---\n\n')
    : '(No matching content was found in the document for this question.)';

  const systemPrompt = SYSTEM_PROMPT.replace('{CONTEXT}', context);

  const answer = await chat({ systemPrompt, question: trimmedQuestion, history });

  console.log('[Chat] matched chunks:', relevant.length);
  return answer;
};
