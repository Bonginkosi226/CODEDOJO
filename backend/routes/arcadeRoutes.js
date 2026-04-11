import express from 'express';
import { arcadeChat } from '../controllers/arcadeController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/chat', arcadeChat);

export default router;
