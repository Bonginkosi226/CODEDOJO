import axios from "axios";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

/** 
 * Extract text from PDF (supports Cloudinary URL)
 */
export const extractTextFromPDF = async (fileUrl) => {
  try {
    // Ôùç Download file from Cloudinary
    const response = await axios.get(fileUrl, {
      responseType: "arraybuffer",
    });

    const data = await pdf(response.data);

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