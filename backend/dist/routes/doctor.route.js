"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const doctor_controller_1 = require("../controllers/doctor.controller");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// Simple auth middleware for now
const requireAuth = (req, res, next) => {
    // For now, just pass through - in production, implement proper auth
    next();
};
const router = express_1.default.Router();
// Rate limiting for doctor creation
const doctorLimiter = (0, express_rate_limit_1.default)({
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
    (0, express_validator_1.body)('firstName').trim().notEmpty().withMessage('First name is required'),
    (0, express_validator_1.body)('lastName').trim().notEmpty().withMessage('Last name is required'),
    (0, express_validator_1.body)('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('phone').trim().notEmpty().withMessage('Phone number is required'),
    (0, express_validator_1.body)('department').isIn([
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
        'General Surgery'
    ]).withMessage('Valid department is required'),
    (0, express_validator_1.body)('specialization').trim().notEmpty().withMessage('Specialization is required'),
    (0, express_validator_1.body)('qualifications').trim().notEmpty().withMessage('Qualifications are required'),
    (0, express_validator_1.body)('experience').trim().notEmpty().withMessage('Experience is required'),
    (0, express_validator_1.body)('education').trim().notEmpty().withMessage('Education is required'),
    (0, express_validator_1.body)('status').optional().isIn(['active', 'inactive', 'on_leave']).withMessage('Invalid status'),
    (0, express_validator_1.body)('rating').optional().isFloat({ min: 0, max: 5 }).withMessage('Rating must be between 0 and 5'),
    (0, express_validator_1.body)('patients').optional().isInt({ min: 0 }).withMessage('Patient count cannot be negative'),
    (0, express_validator_1.body)('appointments').optional().isInt({ min: 0 }).withMessage('Appointment count cannot be negative')
];
// Public routes
router.get('/', doctor_controller_1.getAllDoctors);
router.get('/stats', doctor_controller_1.getDoctorStats);
router.get('/search', doctor_controller_1.searchDoctors);
router.get('/:id', doctor_controller_1.getDoctorById);
// Protected routes (Admin only)
router.post('/', requireAuth, doctorLimiter, validateDoctor, doctor_controller_1.createDoctor);
router.put('/:id', requireAuth, validateDoctor, doctor_controller_1.updateDoctor);
router.patch('/:id/status', requireAuth, doctor_controller_1.updateDoctorStatus);
router.delete('/:id', requireAuth, doctor_controller_1.deleteDoctor);
exports.default = router;
