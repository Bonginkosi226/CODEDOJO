import 'dotenv/config';
import { MistralAI, ChatMistralAI } from '@langchain/mistralai';
import { SystemMessage, HumanMessage, AIMessage } from '@langchain/core/messages';

const TIMEOUT_MS = 30000;

/**
 * Wrap a promise with a timeout
 */
const withTimeout = (promise, ms, label = 'Operation') => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${ms / 1000}s`)), ms)
    )
  ]);
};

const ensureKey = () => {
  if (!process.env.MISTRAL_API_KEY) {
    throw new Error('MISTRAL_API_KEY is not configured. Please set it in your .env file.');
  }
};

const getModel = (temperature = 0.3) =>
  new MistralAI({
    model: 'mistral-small-latest',
    temperature,
    apiKey: process.env.MISTRAL_API_KEY,
  });

/**
 * Generate flashcards from text
 * @param {string} text - Document text
 * @param {number} count - Number of flashcards to generate
 * @returns {Promise<Array<{question: string, answer: string, difficulty: string}>>}
 */
export const generateFlashcards = async (text, count = 10) => {
  ensureKey();

  const prompt = `
You MUST generate EXACTLY ${count} flashcards.
Return ONLY valid JSON.
Do NOT add markdown.
Do NOT add explanation.
Do NOT add extra text.

Format STRICTLY like this:
[
  {
    "question": "string",
    "answer": "string",
    "difficulty": "easy | medium | hard"
  }
]

Text:
${text.substring(0, 15000)}
`;

  const maxRetries = 2;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const model = getModel(0.3);

      const rawText = await withTimeout(
        model.invoke([{ role: 'user', content: prompt }]),
        TIMEOUT_MS,
        'Mistral flashcards'
      );

      // 🛑 Extract JSON safely
      const jsonStart = rawText.indexOf('[');
      const jsonEnd = rawText.lastIndexOf(']');

      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error('Invalid JSON format');
      }

      const jsonString = rawText.substring(jsonStart, jsonEnd + 1);
      let flashcards = JSON.parse(jsonString);

      if (!Array.isArray(flashcards)) {
        throw new Error('Response is not array');
      }

      // 🧠 Validate structure
      flashcards = flashcards
        .filter(card => card.question && card.answer)
        .map(card => ({
          question: card.question.trim(),
          answer: card.answer.trim(),
          difficulty: ['easy', 'medium', 'hard']
            .includes((card.difficulty || '').toLowerCase())
            ? card.difficulty.toLowerCase()
            : 'medium'
        }));

      if (flashcards.length === count) {
        return flashcards;
      }

      if (attempt === maxRetries) {
        throw new Error('AI did not return exact number of cards');
      }
    } catch (error) {
      console.error('Mistral API error (flashcards):', error.message);
      if (attempt === maxRetries) {
        throw new Error(error.message || 'Failed to generate flashcards');
      }
    }
  }
};

/**
 * Sensei mentor chat (Arcade). Uses ChatMistralAI (the chat-completions class)
 * with real SystemMessage/HumanMessage/AIMessage instances — not the base
 * MistralAI completion class, which coerces role-labeled input into a single
 * raw text prompt and can return hallucinated role prefixes or empty replies.
 * @param {string} systemPrompt - Sensei persona + curriculum reference
 * @param {string} question - The student's current question
 * @param {Array<{role: string, content: string}>} history - Prior turns (role: "user" | "assistant")
 * @returns {Promise<string>}
 */
export const senseiChat = async (systemPrompt, question, history = []) => {
  ensureKey();

  const chat = new ChatMistralAI({
    model: 'codestral-latest',
    temperature: 0.7,
    apiKey: process.env.MISTRAL_API_KEY,
  });

  const messages = [new SystemMessage(systemPrompt)];
  for (const msg of history) {
    messages.push(msg.role === 'assistant' ? new AIMessage(msg.content) : new HumanMessage(msg.content));
  }
  messages.push(new HumanMessage(question));

  const response = await withTimeout(chat.invoke(messages), TIMEOUT_MS, 'Mistral chat');
  const text = typeof response === 'string' ? response : response?.content;

  if (!text || !text.trim()) {
    throw new Error('Mistral returned an empty response');
  }
  return text.trim();
};

/**
 * Generate quiz questions from text
 * @param {string} text - Document text
 * @param {number} numQuestions - Number of questions
 * @returns {Promise<Array>}
 */
export const generateQuiz = async (text, numQuestions = 5) => {
  ensureKey();

  const prompt = `
Generate exactly ${numQuestions} multiple choice questions.

STRICT FORMAT:
Q: question
1: option
2: option
3: option
4: option
C: correct option
E: explanation
D: easy/medium/hard

Separate with ---
Text:
${text.substring(0, 8000)}
`;

  try {
    const model = getModel(0.3);

    const generatedText = await withTimeout(
      model.invoke([{ role: 'user', content: prompt }]),
      TIMEOUT_MS,
      'Mistral quiz'
    );

    console.log("RAW OUTPUT:\n", generatedText);

    const questions = [];
    const blocks = generatedText.split(/---+/).filter(b => b.trim());

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
          difficulty
        });
      }
    }

    return questions.slice(0, numQuestions);
  } catch (error) {
    console.error('Mistral API error (quiz):', error.message);
    throw new Error(error.message || 'Failed to generate quiz');
  }
};
