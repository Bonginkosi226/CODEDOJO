import axios from "axios";
import fs from "fs/promises";
import path from "path";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

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