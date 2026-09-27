import { Router } from 'express';
import {
  getMe,
  updateMe,
  getAllUsers,
  getUserById,
  getUser360,
  updateUserStatus,
  deleteUser,
} from '../controllers/user.controller.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/me', getMe);
router.patch('/me', updateMe);

router.get('/', requireRole('admin'), getAllUsers);
router.get('/:id/360', requireRole('admin'), getUser360);
router.get('/:id', requireRole('admin'), getUserById);
router.patch('/:id/status', requireRole('admin'), updateUserStatus);
router.delete('/:id', requireRole('admin'), deleteUser);

export default router;