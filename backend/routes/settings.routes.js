import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settings.controller.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/', protect, requireRole('admin'), getSettings);
router.put('/', protect, requireRole('admin'), updateSettings);

export default router;