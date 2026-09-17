import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

// Validate API key (warn at startup, throw at call time)
if (!process.env.GEMINI_API_KEY) {
  console.warn('⚠️  WARNING: GEMINI_API_KEY is not set. AI features will fail.');
}

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

const ensureAI = () => {
  if (!genAI) {
    throw new Error('GEMINI_API_KEY is not configured. Please set it in your .env file.');
  }
  return genAI;
};

/**
 * Generate flashcards from text
 * @param {string} text - Document text
 * @param {number} count - Number of flashcards to generate
 * @returns {Promise<Array<{question: string, answer: string, difficulty: string}>>}
 */
export const generateFlashcards = async (text, count = 10) => {
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
      const model = ensureAI().getGenerativeModel({ model: "gemini-flash-latest" });
      
      const response = await Promise.race([
        model.generateContent(prompt),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('AI timeout')), 15000)
        )
      ]);

      const result = await response.response;
      const rawText = result.text().trim();

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
      console.error('Gemini API error:', error);
      if (attempt === maxRetries) {
        throw new Error(error.message || 'Failed to generate flashcards');
      }
    }
  }
};

/**
 * Generate quiz questions from text
 * @param {string} text - Document text
 * @param {number} numQuestions - Number of questions
 * @returns {Promise<Array>}
 */
export const generateQuiz = async (text, numQuestions = 5) => {
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
    const model = ensureAI().getGenerativeModel({ model: "gemini-flash-latest" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedText = response.text();

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
    console.error('Gemini API error:', error);
    throw new Error(error.message || 'Failed to generate quiz');
  }
};

/**
 * Generate document summary
 * @param {string} text - Document text
 * @returns {Promise<string>}
 */
export const generateSummary = async (text) => {
  const prompt = `
Provide a concise summary of the following text.
Highlight key ideas and important points clearly.

Text:
${text.substring(0, 20000)}
`;

  try {
    const model = ensureAI().getGenerativeModel({ model: "gemini-flash-latest" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error(error.message || 'Failed to generate summary');
  }
};

/**
 * Chat with document context
 * @param {string} question - User question
 * @param {Array<{content: string}>} chunks - Relevant document chunks
 * @returns {Promise<string>}
 */
export const chatWithContext = async (question, chunks) => {
  const context = chunks
    .map((c, i) => `[Chunk ${i + 1}]\n${c.content}`)
    .join('\n\n');

  const prompt = `
Based on the following document context, answer the user's question.
If the answer is not present, say so clearly.

Context:
${context}

Question:
${question}

Answer:
`;

  try {
    const model = ensureAI().getGenerativeModel({ model: "gemini-flash-latest" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error(error.message || 'Failed to process chat request');
  }
};

/**
 * Sensei mentor chat (Arcade). Uses Gemini's systemInstruction + multi-turn
 * chat history (roles: "user" / "model") — not a hand-formatted text prompt.
 * @param {string} systemPrompt - Sensei persona + curriculum reference
 * @param {string} question - The student's current question
 * @param {Array<{role: string, content: string}>} history - Prior turns (role: "user" | "assistant")
 * @returns {Promise<string>}
 */
export const senseiChat = async (systemPrompt, question, history = []) => {
  const model = ensureAI().getGenerativeModel({
    model: 'gemini-flash-latest',
    systemInstruction: systemPrompt,
  });

  const chatHistory = history.map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));

  const chatSession = model.startChat({ history: chatHistory });

  const result = await Promise.race([
    chatSession.sendMessage(question),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Gemini timeout')), 15000)),
  ]);

  const text = result.response.text();
  if (!text || !text.trim()) {
    throw new Error('Gemini returned an empty response');
  }
  return text.trim();
};

/**
 * Explain a specific concept
 * @param {string} concept - Concept to explain
 * @param {string} context - Relevant context
 * @returns {Promise<string>}
 */
export const explainConcept = async (concept, context) => {
  const prompt = `
Explain the concept of "${concept}" using the context below.
Make it clear and easy to understand. Use examples if helpful.

Context:
${context.substring(0, 10000)}
`;

  try {
    const model = ensureAI().getGenerativeModel({ model: "gemini-flash-latest" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error(error.message || 'Failed to explain concept');
  }
};



