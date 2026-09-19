import express from 'express';
import {
  arcadeChat,
  getProgress,
  updateProgress,
  submitLesson,
  listPractice,
  submitPractice,
} from '../controllers/arcadeController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/progress', getProgress);
router.post('/progress', updateProgress);
router.post('/chat', arcadeChat);
router.post('/lessons/:id/submit', submitLesson);
router.get('/lessons/:lessonId/practice', listPractice);
router.post('/lessons/:lessonId/practice/:practiceId/submit', submitPractice);

export default router;
