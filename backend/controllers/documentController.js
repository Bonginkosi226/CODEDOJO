import Document from '../models/Document.js';
import Flashcard from '../models/Flashcard.js';
import Quiz from '../models/Quiz.js';
import { extractTextFromPDF } from '../utils/pdfParser.js';
import { chunkText } from '../utils/textChunker.js';
import fs from 'fs/promises';

// @desc    Upload PDF document
// @route   POST /api/documents/upload
// @access  Private
export const uploadDocument = async (req, res, next) => {
  try {
    console.log('UPLOAD REQUEST:', {
      file: req.file,
      body: req.body,
      user: req.user?._id
    });

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        error: 'User not authorized',
        statusCode: 401
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please upload a PDF file',
        statusCode: 400
      });
    }

    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a document title',
        statusCode: 400
      });
    }

    const document = await Document.create({
      userId: req.user._id,
      title: title.trim(),
      fileName: req.file.originalname,
      filePath: req.file.path.replace(/\\/g, '/'),
      fileSize: req.file.size,
      status: 'processing'
    });

    processPDF(document._id, req.file.path).catch(async (err) => {
      console.error('PDF processing error:', err);

      try {
        await Document.findByIdAndUpdate(document._id, {
          status: 'failed'
        });
      } catch (updateError) {
        console.error('Failed to update document status:', updateError);
      }
    });

    res.status(201).json({
      success: true,
      data: document,
      message: 'Document uploaded successfully. Processing in progress...'
    });
  } catch (error) {
    console.error('UPLOAD ERROR:', error);
    next(error);
  }
};

// Helper function to process PDF
const processPDF = async (documentId, filePath) => {
  try {
    console.log('PROCESSING PDF:', { documentId, filePath });

    const { text } = await extractTextFromPDF(filePath);

    if (!text || !text.trim()) {
      throw new Error('No text could be extracted from the PDF');
    }

    const chunks = chunkText(text, 500, 50);

    await Document.findByIdAndUpdate(documentId, {
      extractedText: text,
      chunks,
      status: 'ready'
    });

    console.log(`Document ${documentId} processed successfully`);
  } catch (error) {
    console.error(`Error processing document ${documentId}:`, error);

    await Document.findByIdAndUpdate(documentId, {
      status: 'failed'
    });
  }
};

// @desc    Reprocess a failed document (retry PDF extraction)
// @route   POST /api/documents/:id/reprocess
// @access  Private
export const reprocessDocument = async (req, res, next) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found',
        statusCode: 404
      });
    }

    if (document.status === 'ready' && document.extractedText) {
      return res.status(400).json({
        success: false,
        error: 'Document is already processed',
        statusCode: 400
      });
    }

    // Check if the file still exists
    try {
      await fs.access(document.filePath);
    } catch {
      return res.status(400).json({
        success: false,
        error: 'Original PDF file not found. Please re-upload the document.',
        statusCode: 400
      });
    }

    // Reset status and reprocess
    await Document.findByIdAndUpdate(document._id, { status: 'processing' });

    console.log(`[Reprocess] Retrying PDF processing for document ${document._id}`);

    processPDF(document._id, document.filePath).catch(async (err) => {
      console.error(`[Reprocess] Failed for document ${document._id}:`, err.message);
      try {
        await Document.findByIdAndUpdate(document._id, { status: 'failed' });
      } catch (updateError) {
        console.error('[Reprocess] Failed to update status:', updateError);
      }
    });

    res.status(200).json({
      success: true,
      message: 'Document reprocessing started. Check back shortly.'
    });
  } catch (error) {
    console.error('[Reprocess] Error:', error.message);
    next(error);
  }
};

// @desc    Get all user documents
// @route   GET /api/documents
// @access  Private
export const getDocuments = async (req, res, next) => {
  try {
    const documents = await Document.aggregate([
      {
        $match: { userId: req.user._id }
      },
      {
        $lookup: {
          from: 'flashcards',
          localField: '_id',
          foreignField: 'documentId',
          as: 'flashcardSets'
        }
      },
      {
        $lookup: {
          from: 'quizzes',
          localField: '_id',
          foreignField: 'documentId',
          as: 'quizSets'
        }
      },
      {
        $addFields: {
          flashcardCount: { $size: '$flashcardSets' },
          quizCount: { $size: '$quizSets' }
        }
      },
      {
        $project: {
          extractedText: 0,
          chunks: 0,
          flashcardSets: 0,
          quizSets: 0
        }
      },
      {
        $sort: { uploadDate: -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user document
// @route   GET /api/documents/:id
// @access  Private
export const getDocument = async (req, res, next) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found',
        statusCode: 404
      });
    }

    const flashcardCount = await Flashcard.countDocuments({
      documentId: document._id,
      userId: req.user._id
    });

    const quizCount = await Quiz.countDocuments({
      documentId: document._id,
      userId: req.user._id
    });

    document.lastAccessed = Date.now();
    await document.save();

    const documentData = document.toObject();
    documentData.flashcardCount = flashcardCount;
    documentData.quizCount = quizCount;

    res.status(200).json({
      success: true,
      data: documentData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete document
// @route   DELETE /api/documents/:id
// @access  Private
export const deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found',
        statusCode: 404
      });
    }

    await fs.unlink(document.filePath).catch(() => {});

    await document.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};