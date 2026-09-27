import { Router } from 'express';
import {
  getMyBookmarks,
  toggleBookmark,
  removeBookmark,
} from '../controllers/bookmark.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/', protect, getMyBookmarks);
router.post('/:eventId', protect, toggleBookmark);
router.delete('/:eventId', protect, removeBookmark);

export default router;