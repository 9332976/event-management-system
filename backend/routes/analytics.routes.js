import { Router } from 'express';
import { getAdminAnalytics } from '../controllers/analytics.controller.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/admin', protect, requireRole('admin'), getAdminAnalytics);

export default router;
