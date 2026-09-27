import { Router } from 'express';
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/category.controller.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/', getAllCategories);
router.post('/', protect, requireRole('admin'), createCategory);
router.patch('/:slug', protect, requireRole('admin'), updateCategory);
router.delete('/:slug', protect, requireRole('admin'), deleteCategory);

export default router;