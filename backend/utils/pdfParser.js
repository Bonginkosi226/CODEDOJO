import axios from "axios";
import fs from "fs/promises";
import path from "path";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

/**
 * Clean raw PDF-extracted text: strip bullet glyphs, rejoin words that were
 * hyphenated across a line-wrap, and collapse extra whitespace, without
 * merging separate paragraphs into one line.
 * @param {string} text - Raw text from pdf-parse
 * @returns {string}
 */
export const cleanExtractedText = (text) => {
  if (!text) return '';

  return text
    .replace(/\r\n/g, '\n')
    // Rejoin a word split across a line-wrap hyphen: "inter-\naction" -> "interaction"
    .replace(/(\w)-\n(\w)/g, '$1$2')
    // Remove common bullet glyphs used in slide decks
    .replace(/[•·◦▪‣∙●○]/g, '')
    // Trim trailing spaces/tabs at end of each line
    .replace(/[ \t]+\n/g, '\n')
    // Collapse runs of spaces/tabs
    .replace(/[ \t]{2,}/g, ' ')
    // Collapse 3+ consecutive blank lines down to a single paragraph break
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

/**
 * Extract text from PDF (supports local file path or remote URL)
 */
export const extractTextFromPDF = async (fileSource) => {
  try {
    let buffer;

    // Check if the source is a URL or a local file path
    if (fileSource.startsWith('http://') || fileSource.startsWith('https://')) {
      // Remote URL (e.g. Cloudinary)
      const response = await axios.get(fileSource, {
        responseType: "arraybuffer",
      });
      buffer = response.data;
    } else {
      // Local file path — resolve relative to project root
      const absolutePath = path.resolve(fileSource);
      buffer = await fs.readFile(absolutePath);
    }

    const data = await pdf(buffer);

    return {
      text: data.text,
      numPages: data.numpages,
      info: data.info,
    };

  } catch (error) {
    console.error("PDF parsing error:", error);
    throw new Error("Failed to extract text from PDF");
  }
};