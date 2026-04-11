import express from 'express';
import { arcadeChat, getProgress, updateProgress } from '../controllers/arcadeController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/progress', getProgress);
router.post('/progress', updateProgress);
router.post('/chat', arcadeChat);

export default router;
