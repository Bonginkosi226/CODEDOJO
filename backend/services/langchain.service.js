import 'dotenv/config';
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MistralAIEmbeddings, MistralAI } from "@langchain/mistralai";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { Document } from "@langchain/core/documents";

const TIMEOUT_MS = 30000; // 30 second timeout

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

export const askQuestionFromText = async (text, question) => {
  // Validate API key
  if (!process.env.MISTRAL_API_KEY) {
    console.error('[LangChain] MISTRAL_API_KEY is not set');
    return "AI service is not configured. Please set MISTRAL_API_KEY.";
  }

  if (!text || !text.trim()) {
    console.error('[LangChain] No text provided for question answering');
    return "No document text available to answer from.";
  }

  try {
    console.log(`[LangChain] Processing question: "${question.substring(0, 80)}..."`);

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 100,
    });
    const docs = await splitter.createDocuments([text]);

    // 2️⃣ Embeddings
    const embeddings = new MistralAIEmbeddings({
      model: "mistral-embed",
      apiKey: process.env.MISTRAL_API_KEY,
    });

    // 3️⃣ Vector store (with timeout)
    const vectorStore = await withTimeout(
      MemoryVectorStore.fromDocuments(docs, embeddings),
      TIMEOUT_MS,
      'Embedding generation'
    );

    // 4️⃣ Retrieve top 3 relevant chunks
    const relevantDocs = await vectorStore.similaritySearch(question, 3);
    const context = relevantDocs.map(doc => doc.pageContent).join("\n\n");

    // 5️⃣ Chat model
    const chat = new MistralAI({
      model: "codestral-latest",
      temperature: 0,
      apiKey: process.env.MISTRAL_API_KEY,
    });

    // 6️⃣ Ask the model (with timeout)
    const response = await withTimeout(
      chat.invoke([
        { role: "system", content: "Answer ONLY using the context. If not found, say 'Answer not found'" },
        { role: "user", content: `Context:\n${text}\n\nQuestion:\n${question}` }
      ]),
      TIMEOUT_MS,
      'Mistral AI response'
    );
    
    const parts = response.split(/Answer:/i);
    const finalAnswer = (parts.length > 1 ? parts[1] : parts[0]).trim();

    console.log("[LangChain] Response generated successfully");

    return finalAnswer || "Answer not found";

  } catch (error) {
    console.error("[LangChain] Error:", error.message);
    
    if (error.message.includes('timed out')) {
      return "AI response timed out. Please try again.";
    }
    if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      return "AI authentication failed. Please check your MISTRAL_API_KEY.";
    }
    
    return "Answer not found";
  }
};