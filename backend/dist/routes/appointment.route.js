"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const appointment_controller_1 = require("../controllers/appointment.controller");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const router = (0, express_1.Router)();
// Rate limiting for appointment creation
const appointmentLimiter = (0, express_rate_limit_1.default)({
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
const requireAuth = (req, res, next) => {
    // For now, just pass through - we'll add proper auth later
    next();
};
// Public routes
router.post('/', appointmentLimiter, appointment_controller_1.createAppointment);
// Public routes for stats (for reports)
router.get('/stats', appointment_controller_1.getAppointmentStats);
// Protected routes (Admin only)
router.get('/', requireAuth, appointment_controller_1.getAllAppointments);
router.get('/:id', requireAuth, appointment_controller_1.getAppointmentById);
router.put('/:id', requireAuth, appointment_controller_1.updateAppointment);
router.put('/:id/status', requireAuth, appointment_controller_1.updateAppointmentStatus);
router.delete('/:id', requireAuth, appointment_controller_1.deleteAppointment);
router.delete('/test', appointment_controller_1.deleteTestAppointments);
exports.default = router;
