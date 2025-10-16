import { Router } from 'express';
import {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  updateAppointmentStatus,
  getAppointmentStats,
  deleteAppointment,
  deleteTestAppointments
} from '../controllers/appointment.controller';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiting for appointment creation
const appointmentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 appointment requests per windowMs
  message: {
    success: false,
    message: "Too many appointment requests, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Simple middleware for now - we'll implement proper auth later
const requireAuth = (req: any, res: any, next: any) => {
  // For now, just pass through - we'll add proper auth later
  next();
};

// Public routes
router.post('/', appointmentLimiter, createAppointment as any);

// Public routes for stats (for reports)
router.get('/stats', getAppointmentStats);

// Protected routes (Admin only)
router.get('/', requireAuth, getAllAppointments);
router.get('/:id', requireAuth, getAppointmentById);
router.put('/:id', requireAuth, updateAppointment as any);
router.put('/:id/status', requireAuth, updateAppointmentStatus as any);
router.delete('/:id', requireAuth, deleteAppointment);
router.delete('/test', deleteTestAppointments);

export default router;
