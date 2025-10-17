import express from 'express';
import { body } from 'express-validator';
import {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorStats,
  updateDoctorStatus,
  searchDoctors
} from '../controllers/doctor.controller';
import rateLimit from 'express-rate-limit';

// Simple auth middleware for now
const requireAuth = (req: any, res: any, next: any) => {
  // For now, just pass through - in production, implement proper auth
  next();
};

const router = express.Router();

// Rate limiting for doctor creation
const doctorLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 doctor requests per windowMs
  message: {
    success: false,
    message: "Too many doctor requests, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Validation middleware for creating/updating doctors
const validateDoctor = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('department').isIn([
    'Cardiology',
    'Pediatrics', 
    'Neurology',
    'Orthopedics',
    'Ophthalmology',
    'Dentistry',
    'Pulmonology',
    'Emergency Medicine',
    'Internal Medicine',
    'Pathology',
    'Radiology',
    'Oncology',
    'Dermatology',
    'Psychiatry',
    'Gynecology',
    'Urology',
    'Anesthesiology',
    'General Surgery',
    'Microbiology'
  ]).withMessage('Valid department is required'),
  body('specialization').trim().notEmpty().withMessage('Specialization is required'),
  body('qualifications').trim().notEmpty().withMessage('Qualifications are required'),
  body('experience').trim().notEmpty().withMessage('Experience is required'),
  body('education').trim().notEmpty().withMessage('Education is required'),
  body('status').optional().isIn(['active', 'inactive', 'on_leave']).withMessage('Invalid status'),
  body('rating').optional().isFloat({ min: 0, max: 5 }).withMessage('Rating must be between 0 and 5'),
  body('patients').optional().isInt({ min: 0 }).withMessage('Patient count cannot be negative'),
  body('appointments').optional().isInt({ min: 0 }).withMessage('Appointment count cannot be negative')
];

// Public routes
router.get('/', getAllDoctors);
router.get('/stats', getDoctorStats);
router.get('/search', searchDoctors);
router.get('/:id', getDoctorById);

// Protected routes (Admin only)
router.post('/', requireAuth, doctorLimiter, validateDoctor, createDoctor);
router.put('/:id', requireAuth, validateDoctor, updateDoctor);
router.patch('/:id/status', requireAuth, updateDoctorStatus);
router.delete('/:id', requireAuth, deleteDoctor);

export default router;
