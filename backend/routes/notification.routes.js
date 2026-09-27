import { Router } from 'express';
import {
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  clearNotifications,
} from '../controllers/notification.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/', protect, getMyNotifications);
router.patch('/read-all', protect, markAllNotificationsRead);
router.delete('/', protect, clearNotifications);
router.patch('/:id/read', protect, markNotificationRead);

export default router;