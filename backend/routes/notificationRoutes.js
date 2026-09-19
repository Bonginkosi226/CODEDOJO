import express from 'express';
import {
  getNotifications,
  markAllRead,
  markRead,
  deleteNotification,
  clearNotifications,
} from '../controllers/notificationController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getNotifications);
router.patch('/read-all', markAllRead);
router.patch('/:id/read', markRead);
router.delete('/:id', deleteNotification);
router.delete('/', clearNotifications);

export default router;
