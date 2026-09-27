import { Router } from 'express';
import {
  registerForEvent,
  getMyRegistrations,
  getOrganizerRoster,
  getAllRegistrations,
  getRegistrationByPass,
  cancelRegistration,
  cancelRegistrationAdmin,
  setAttendeeAttendance,
  scanPass,
  updatePaymentStatus,
  reviewRegistration,
} from '../controllers/registration.controller.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/me', getMyRegistrations);
router.get('/me/pass/:passId', getRegistrationByPass);
router.get('/organizer-roster', requireRole('admin'), getOrganizerRoster);
router.get('/', requireRole('admin'), getAllRegistrations);

router.post('/scan', requireRole('admin'), scanPass);

router.delete('/admin/:registrationId', requireRole('admin'), cancelRegistrationAdmin);
router.delete('/:registrationId', cancelRegistration);

router.patch('/:id/attendance', requireRole('admin'), setAttendeeAttendance);
router.patch('/:registrationId/payment', requireRole('admin'), updatePaymentStatus);
router.patch('/:registrationId/review', requireRole('admin'), reviewRegistration);

router.post('/events/:eventId/register', registerForEvent);

export default router;