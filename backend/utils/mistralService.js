import 'dotenv/config';
import { ChatMistralAI } from '@langchain/mistralai';
import { SystemMessage, HumanMessage, AIMessage } from '@langchain/core/messages';

// Fixed model name from .env — never a "-latest" alias, so the model in use
// doesn't silently change. Falls back to a known-good pinned model.
export const MISTRAL_MODEL = process.env.MISTRAL_MODEL || 'mistral-small-2603';

export const ensureKey = () => {
  if (!process.env.MISTRAL_API_KEY) {
    throw new Error('MISTRAL_API_KEY is not configured. Please set it in your .env file.');
  }
};

/**
 * Single low-level call to Mistral via ChatMistralAI (the real chat-completions
 * class — not the base MistralAI completion class, which mishandles chat
 * roles). One attempt, no retry — that orchestration lives in services/aiService.js.
 * Throws on any failure, including an empty response.
 * @param {Object} params
 * @param {string} params.systemPrompt
 * @param {string} params.question
 * @param {Array<{role: string, content: string}>} [params.history] - role: "user" | "assistant"
 * @param {number} [params.timeoutMs]
 * @returns {Promise<string>}
 */
export const callMistral = async ({ systemPrompt, question, history = [], timeoutMs = 20000 }) => {
  ensureKey();

  const chat = new ChatMistralAI({
    model: MISTRAL_MODEL,
    temperature: 0.7,
    apiKey: process.env.MISTRAL_API_KEY,
  });

  const messages = [new SystemMessage(systemPrompt)];
  for (const msg of history) {
    messages.push(msg.role === 'assistant' ? new AIMessage(msg.content) : new HumanMessage(msg.content));
  }
  messages.push(new HumanMessage(question));

  const response = await Promise.race([
    chat.invoke(messages),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Mistral timed out')), timeoutMs)),
  ]);

  const text = typeof response === 'string' ? response : response?.content;
  if (!text || !text.trim()) {
    throw new Error('Mistral returned an empty response');
  }
  return text.trim();
};
