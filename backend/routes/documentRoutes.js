import express from 'express';
import {
    uploadDocument,
    getDocuments,
    getDocument,
    deleteDocument,
    reprocessDocument
} from '../controllers/documentController.js';

import protect from '../middleware/auth.js';
import upload from '../config/multer.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Upload document
router.post('/upload', upload.single('file'), uploadDocument);

// Get all documents
router.get('/', getDocuments);

// Get single document
router.get('/:id', getDocument);

// Delete document
router.delete('/:id', deleteDocument);

// Reprocess a failed document
router.post('/:id/reprocess', reprocessDocument);

export default router;
