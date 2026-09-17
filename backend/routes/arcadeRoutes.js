import express from 'express';
import { arcadeChat, getProgress, updateProgress, submitLesson } from '../controllers/arcadeController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/progress', getProgress);
router.post('/progress', updateProgress);
router.post('/chat', arcadeChat);
router.post('/lessons/:id/submit', submitLesson);

export default router;
