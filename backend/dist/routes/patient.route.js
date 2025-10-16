"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const patient_controller_1 = require("../controllers/patient.controller");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// Simple auth middleware for now
const requireAuth = (req, res, next) => {
    // For now, just pass through - in production, implement proper auth
    next();
};
const router = express_1.default.Router();
// Rate limiting for patient creation
const patientLimiter = (0, express_rate_limit_1.default)({
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
    (0, express_validator_1.body)('firstName').trim().notEmpty().withMessage('First name is required'),
    (0, express_validator_1.body)('lastName').trim().notEmpty().withMessage('Last name is required'),
    (0, express_validator_1.body)('age').isInt({ min: 0, max: 150 }).withMessage('Age must be between 0 and 150'),
    (0, express_validator_1.body)('gender').isIn(['Male', 'Female', 'Other']).withMessage('Gender must be Male, Female, or Other'),
    (0, express_validator_1.body)('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('phone').trim().notEmpty().withMessage('Phone number is required'),
    (0, express_validator_1.body)('address').trim().notEmpty().withMessage('Address is required'),
    (0, express_validator_1.body)('bloodType').isIn(['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']).withMessage('Valid blood type is required'),
    (0, express_validator_1.body)('emergencyContact.name').trim().notEmpty().withMessage('Emergency contact name is required'),
    (0, express_validator_1.body)('emergencyContact.phone').trim().notEmpty().withMessage('Emergency contact phone is required'),
    (0, express_validator_1.body)('emergencyContact.relationship').trim().notEmpty().withMessage('Emergency contact relationship is required'),
    (0, express_validator_1.body)('status').optional().isIn(['active', 'inactive', 'discharged', 'critical']).withMessage('Invalid status')
];
// Public routes (for now, can be made protected later)
router.get('/', patient_controller_1.getAllPatients);
router.get('/stats', patient_controller_1.getPatientStats);
router.get('/:id', patient_controller_1.getPatientById);
// Protected routes (Admin only)
router.post('/', requireAuth, patientLimiter, validatePatient, patient_controller_1.createPatient);
router.put('/:id', requireAuth, validatePatient, patient_controller_1.updatePatient);
router.delete('/:id', requireAuth, patient_controller_1.deletePatient);
exports.default = router;
