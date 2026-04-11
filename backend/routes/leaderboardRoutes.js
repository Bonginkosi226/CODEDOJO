import express from 'express';
import { getLeaderboard, awardXP } from '../controllers/leaderboardController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getLeaderboard);
router.post('/xp', protect, awardXP);

export default router;
