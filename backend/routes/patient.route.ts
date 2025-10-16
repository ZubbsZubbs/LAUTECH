import express from 'express';
import { body } from 'express-validator';
import {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  getPatientStats
} from '../controllers/patient.controller';
import rateLimit from 'express-rate-limit';

// Simple auth middleware for now
const requireAuth = (req: any, res: any, next: any) => {
  // For now, just pass through - in production, implement proper auth
  next();
};

const router = express.Router();

// Rate limiting for patient creation
const patientLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 patient requests per windowMs
  message: {
    success: false,
    message: "Too many patient requests, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Validation middleware
const validatePatient = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('age').isInt({ min: 0, max: 150 }).withMessage('Age must be between 0 and 150'),
  body('gender').isIn(['Male', 'Female', 'Other']).withMessage('Gender must be Male, Female, or Other'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('bloodType').isIn(['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']).withMessage('Valid blood type is required'),
  body('emergencyContact.name').trim().notEmpty().withMessage('Emergency contact name is required'),
  body('emergencyContact.phone').trim().notEmpty().withMessage('Emergency contact phone is required'),
  body('emergencyContact.relationship').trim().notEmpty().withMessage('Emergency contact relationship is required'),
  body('status').optional().isIn(['active', 'inactive', 'discharged', 'critical']).withMessage('Invalid status')
];

// Public routes (for now, can be made protected later)
router.get('/', getAllPatients);
router.get('/stats', getPatientStats);
router.get('/:id', getPatientById);

// Protected routes (Admin only)
router.post('/', requireAuth, patientLimiter, validatePatient, createPatient);
router.put('/:id', requireAuth, validatePatient, updatePatient);
router.delete('/:id', requireAuth, deletePatient);

export default router;
