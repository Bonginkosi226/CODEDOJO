import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

// Validate API key (warn at startup, throw at call time)
if (!process.env.GEMINI_API_KEY) {
  console.warn('⚠️  WARNING: GEMINI_API_KEY is not set. AI features will fail.');
}

// Fixed model name from .env — never a "-latest" alias, so the model in use
// doesn't silently change. Falls back to a known-good pinned model.
export const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite';

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

/**
 * Single low-level call to Gemini. One attempt, no retry, no fallback —
 * that orchestration lives in services/aiService.js. Throws on any failure,
 * including an empty response.
 * @param {Object} params
 * @param {string} params.systemPrompt
 * @param {string} params.question
 * @param {Array<{role: string, content: string}>} [params.history] - role: "user" | "assistant"
 * @param {number} [params.timeoutMs]
 * @returns {Promise<string>}
 */
export const callGemini = async ({ systemPrompt, question, history = [], timeoutMs = 20000 }) => {
  if (!genAI) {
    throw new Error('GEMINI_API_KEY is not configured. Please set it in your .env file.');
  }

  const model = genAI.getGenerativeModel({
    model: GEMINI_MODEL,
    systemInstruction: systemPrompt,
  });

  const chatHistory = history.map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));

  const chatSession = model.startChat({ history: chatHistory });

  const result = await Promise.race([
    chatSession.sendMessage(question),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Gemini timed out')), timeoutMs)),
  ]);

  const text = result.response.text();
  if (!text || !text.trim()) {
    throw new Error('Gemini returned an empty response');
  }
  return text.trim();
};
