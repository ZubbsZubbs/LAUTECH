import express from 'express';
import {
  getAllDepartments,
  getDepartmentById,
  getDepartmentBySlug,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentStats,
  updateDepartmentStatus
} from '../controllers/department.controller';
import { body } from 'express-validator';
import rateLimit from 'express-rate-limit';

// Rate limiting for department creation
const departmentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 department requests per windowMs
  message: {
    success: false,
    message: "Too many department requests, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Validation middleware for creating/updating departments
const validateDepartment = [
  body('name').trim().notEmpty().withMessage('Department name is required'),
  body('description').trim().notEmpty().withMessage('Department description is required'),
  body('head').trim().notEmpty().withMessage('Department head is required'),
  body('status').optional().isIn(['active', 'inactive', 'maintenance']).withMessage('Invalid status'),
  body('color').trim().notEmpty().withMessage('Department color is required'),
  body('icon').trim().notEmpty().withMessage('Department icon is required'),
  body('doctors').optional().isArray().withMessage('Doctors must be an array'),
  body('facilities').optional().isArray().withMessage('Facilities must be an array'),
  body('procedures').optional().isArray().withMessage('Procedures must be an array'),
  body('conditions').optional().isArray().withMessage('Conditions must be an array'),
  body('patients').optional().isInt({ min: 0 }).withMessage('Patient count cannot be negative'),
  body('appointments').optional().isInt({ min: 0 }).withMessage('Appointment count cannot be negative')
];

const router = express.Router();

// Public routes
router.get('/', getAllDepartments);
router.get('/stats', getDepartmentStats);
router.get('/slug/:slug', getDepartmentBySlug);
router.get('/:id', getDepartmentById);

// Protected routes (Admin only) - Note: You'll need to add authentication middleware
router.post('/', departmentLimiter, validateDepartment, createDepartment);
router.put('/:id', validateDepartment, updateDepartment);
router.delete('/:id', deleteDepartment);
router.patch('/:id/status', updateDepartmentStatus);

export default router;
