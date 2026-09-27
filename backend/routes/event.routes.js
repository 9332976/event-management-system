import { Router } from 'express';
import {
  getAllEvents,
  getEventById,
  getRecommendedEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventRegistrations,
  getEventAttendees,
  getFeaturedEvents,
  getRecentEvents,
} from '../controllers/event.controller.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/', getAllEvents);
router.get('/featured', getFeaturedEvents);
router.get('/recent', getRecentEvents);
router.get('/recommended', protect, getRecommendedEvents);

router.get('/:id', getEventById);

router.post('/', protect, requireRole('admin'), createEvent);
router.patch('/:id', protect, requireRole('admin'), updateEvent);
router.delete('/:id', protect, requireRole('admin'), deleteEvent);

router.get('/:eventId/registrations', protect, requireRole('admin'), getEventRegistrations);
router.get('/:eventId/attendees', protect, requireRole('admin'), getEventAttendees);

export default router;
