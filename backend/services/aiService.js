import { callGemini } from '../utils/geminiService.js';
import { callMistral } from '../utils/mistralService.js';

export class AIServiceError extends Error {}

const GEMINI_TIMEOUT_MS = 20000;
const MISTRAL_TIMEOUT_MS = 20000;
const RETRY_DELAY_MS = 2000;

// Worth retrying: rate-limited, server-side/transient provider errors, or our own timeout.
const isRetryable = (err) => /429|500|503/.test(err.message) || /timed out/i.test(err.message);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * The one place every AI feature goes through. Tries Gemini (with one retry
 * after ~2s if the failure looks transient), then falls back to Mistral.
 * Only throws AIServiceError if BOTH providers fail — callers never see a
 * raw provider error.
 * @param {Object} params
 * @param {string} params.systemPrompt
 * @param {string} params.question
 * @param {Array<{role: string, content: string}>} [params.history]
 * @returns {Promise<string>}
 */
export const chat = async ({ systemPrompt, question, history = [] }) => {
  let lastError;

  if (process.env.GEMINI_API_KEY) {
    try {
      const text = await callGemini({ systemPrompt, question, history, timeoutMs: GEMINI_TIMEOUT_MS });
      console.log('[AIService] answered via: gemini');
      return text;
    } catch (err) {
      console.error('[AIService] Gemini attempt 1 failed:', err.message);
      lastError = err;

      if (isRetryable(err)) {
        await sleep(RETRY_DELAY_MS);
        try {
          const text = await callGemini({ systemPrompt, question, history, timeoutMs: GEMINI_TIMEOUT_MS });
          console.log('[AIService] answered via: gemini (retry)');
          return text;
        } catch (err2) {
          console.error('[AIService] Gemini attempt 2 failed:', err2.message);
          lastError = err2;
        }
      }
    }
  }

  if (process.env.MISTRAL_API_KEY) {
    try {
      const text = await callMistral({ systemPrompt, question, history, timeoutMs: MISTRAL_TIMEOUT_MS });
      console.log('[AIService] answered via: mistral (gemini fallback)');
      return text;
    } catch (err) {
      console.error('[AIService] Mistral fallback failed:', err.message);
      lastError = err;
    }
  }

  console.error('[AIService] Both providers failed. Last error:', lastError?.message);
  throw new AIServiceError('The AI is busy right now. Please try again in a moment.');
};

// ─────────────────────────── Feature-level helpers ───────────────────────────
// Every AI feature builds its prompt here and goes through chat() above —
// no controller (or any other module) should import geminiService/mistralService directly.

export const generateSummary = async (text) => {
  const systemPrompt = `You are a study assistant. Provide a concise, well-organized summary of the document text the user sends you.
Highlight key ideas and important points clearly. Do not copy sentences verbatim; paraphrase in your own words.`;

  return chat({ systemPrompt, question: text.substring(0, 20000) });
};

export const explainConcept = async (concept, context) => {
  const systemPrompt = `You are a study assistant. Explain the concept the user asks about, using ONLY the context below.
Make it clear and easy to understand, with an example if helpful. If the context doesn't cover it, say so.

Context:
${context.substring(0, 10000)}`;

  return chat({ systemPrompt, question: `Explain the concept of "${concept}".` });
};

const extractJsonArray = (raw) => {
  const start = raw.indexOf('[');
  const end = raw.lastIndexOf(']');
  if (start === -1 || end === -1) {
    throw new Error('Invalid JSON format');
  }
  return JSON.parse(raw.substring(start, end + 1));
};

export const generateFlashcards = async (text, count = 10) => {
  const systemPrompt = `You MUST generate EXACTLY ${count} flashcards from the text the user sends you.
Return ONLY valid JSON. Do NOT add markdown. Do NOT add explanation. Do NOT add extra text.

Format STRICTLY like this:
[
  {
    "question": "string",
    "answer": "string",
    "difficulty": "easy | medium | hard"
  }
]`;

  const maxRetries = 2;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const raw = await chat({ systemPrompt, question: text.substring(0, 15000) });
      let flashcards = extractJsonArray(raw);

      if (!Array.isArray(flashcards)) {
        throw new Error('Response is not an array');
      }

      flashcards = flashcards
        .filter((card) => card.question && card.answer)
        .map((card) => ({
          question: card.question.trim(),
          answer: card.answer.trim(),
          difficulty: ['easy', 'medium', 'hard'].includes((card.difficulty || '').toLowerCase())
            ? card.difficulty.toLowerCase()
            : 'medium',
        }));

      if (flashcards.length === count) {
        return flashcards;
      }

      if (attempt === maxRetries) {
        throw new Error('AI did not return exact number of cards');
      }
    } catch (error) {
      if (error instanceof AIServiceError) throw error;
      console.error(`[AIService] Flashcard generation attempt ${attempt} failed:`, error.message);
      if (attempt === maxRetries) {
        throw new Error(error.message || 'Failed to generate flashcards');
      }
    }
  }
};

export const generateQuiz = async (text, numQuestions = 5) => {
  const systemPrompt = `Generate exactly ${numQuestions} multiple choice questions from the text the user sends you.

STRICT FORMAT:
Q: question
1: option
2: option
3: option
4: option
C: correct option
E: explanation
D: easy/medium/hard

Separate each question with ---`;

  const generatedText = await chat({ systemPrompt, question: text.substring(0, 8000) });

  const questions = [];
  const blocks = generatedText.split(/---+/).filter((b) => b.trim());

  for (const block of blocks) {
    const lines = block.trim().split('\n');

    let question = '';
    let options = [];
    let correctAnswer = '';
    let explanation = '';
    let difficulty = 'medium';

    for (const line of lines) {
      const trimmed = line.trim().toLowerCase();

      if (trimmed.startsWith('q:')) {
        question = line.substring(2).trim();
      } else if (/^\d+\s*[:.)-]/.test(trimmed)) {
        options.push(line.replace(/^\d+\s*[:.)-]/, '').trim());
      } else if (trimmed.startsWith('c:')) {
        correctAnswer = line.substring(2).trim();
      } else if (trimmed.startsWith('e:')) {
        explanation = line.substring(2).trim();
      } else if (trimmed.startsWith('d:')) {
        const diff = line.substring(2).trim().toLowerCase();
        if (['easy', 'medium', 'hard'].includes(diff)) {
          difficulty = diff;
        }
      }
    }

    if (question && options.length >= 4 && correctAnswer) {
      questions.push({
        question,
        options: options.slice(0, 4),
        correctAnswer,
        explanation,
        difficulty,
      });
    }
  }

  return questions.slice(0, numQuestions);
};
