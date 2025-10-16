"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const department_controller_1 = require("../controllers/department.controller");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// Simple auth middleware for now
const requireAuth = (req, res, next) => {
    // For now, just pass through - in production, implement proper auth
    next();
};
const router = express_1.default.Router();
// Rate limiting for department creation
const departmentLimiter = (0, express_rate_limit_1.default)({
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
    (0, express_validator_1.body)('name').trim().notEmpty().withMessage('Department name is required'),
    (0, express_validator_1.body)('description').trim().notEmpty().withMessage('Department description is required'),
    (0, express_validator_1.body)('head').trim().notEmpty().withMessage('Department head is required'),
    (0, express_validator_1.body)('status').optional().isIn(['active', 'inactive', 'maintenance']).withMessage('Invalid status'),
    (0, express_validator_1.body)('color').trim().notEmpty().withMessage('Department color is required'),
    (0, express_validator_1.body)('icon').trim().notEmpty().withMessage('Department icon is required'),
    (0, express_validator_1.body)('doctors').optional().isInt({ min: 0 }).withMessage('Doctor count cannot be negative'),
    (0, express_validator_1.body)('patients').optional().isInt({ min: 0 }).withMessage('Patient count cannot be negative'),
    (0, express_validator_1.body)('appointments').optional().isInt({ min: 0 }).withMessage('Appointment count cannot be negative')
];
// Public routes
router.get('/', department_controller_1.getAllDepartments);
router.get('/stats', department_controller_1.getDepartmentStats);
router.get('/:id', department_controller_1.getDepartmentById);
// Protected routes (Admin only)
router.post('/', requireAuth, departmentLimiter, validateDepartment, department_controller_1.createDepartment);
router.put('/:id', requireAuth, validateDepartment, department_controller_1.updateDepartment);
router.patch('/:id/status', requireAuth, department_controller_1.updateDepartmentStatus);
router.delete('/:id', requireAuth, department_controller_1.deleteDepartment);
exports.default = router;
