import express from 'express';
import {
  getOverview,
  getStudents,
  getStudentDetail,
  getStruggles,
  createAnnouncement,
} from '../controllers/adminController.js';
import protect from '../middleware/auth.js';
import adminOnly from '../middleware/adminOnly.js';

const router = express.Router();

// Every admin route: must be logged in AND have role "admin" in the database.
router.use(protect, adminOnly);

router.get('/overview', getOverview);
router.get('/students', getStudents);
router.get('/students/:id', getStudentDetail);
router.get('/struggles', getStruggles);
router.post('/announcements', createAnnouncement);

export default router;
