// One-off migration: re-clean extractedText for documents uploaded before
// cleanExtractedText() existed, and regenerate their chunks to match.
//
// Usage (from backend/):
//   node scripts/recleanDocumentText.mjs
//
// Safe to re-run — cleaning already-clean text is a no-op.

import 'dotenv/config';
import mongoose from 'mongoose';
import Document from '../models/Document.js';
import { cleanExtractedText } from '../utils/pdfParser.js';
import { chunkText } from '../utils/textChunker.js';

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log('Connected to MongoDB');

  const documents = await Document.find({
    extractedText: { $ne: '' }
  }).select('extractedText chunks title');

  console.log(`Found ${documents.length} document(s) with extracted text`);

  let updated = 0;

  for (const doc of documents) {
    const cleaned = cleanExtractedText(doc.extractedText);

    if (cleaned === doc.extractedText) {
      console.log(`  - "${doc.title}" already clean, skipping`);
      continue;
    }

    const chunks = chunkText(cleaned, 500, 50);

    await Document.updateOne(
      { _id: doc._id },
      { $set: { extractedText: cleaned, chunks } }
    );

    updated += 1;
    console.log(`  - "${doc.title}" re-cleaned (${doc.extractedText.length} -> ${cleaned.length} chars, ${chunks.length} chunks)`);
  }

  console.log(`\nDone. Updated ${updated}/${documents.length} document(s).`);
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
