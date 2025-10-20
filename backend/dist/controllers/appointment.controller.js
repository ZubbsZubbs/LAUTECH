"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTestAppointments = exports.deleteAppointment = exports.getAppointmentStats = exports.updateAppointmentStatus = exports.updateAppointment = exports.getAppointmentById = exports.getAllAppointments = exports.createAppointment = void 0;
const Appointment_1 = __importStar(require("../models/Appointment"));
const email_service_1 = __importDefault(require("../email/email.service"));
const notification_service_1 = require("../services/notification.service");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
// Create appointment
const createAppointment = async (req, res) => {
    try {
        const { patientName, patientEmail, patientPhone, department, preferredDate, reason, notes } = req.body;
        // Validate required fields
        if (!patientName || !patientEmail || !patientPhone || !department || !preferredDate || !reason) {
            res.status(400).json({
                success: false,
                message: 'All required fields must be provided'
            });
            return;
        }
        // Validate email format
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(patientEmail)) {
            res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
            return;
        }
        // Validate phone format
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(patientPhone)) {
            res.status(400).json({
                success: false,
                message: 'Please provide a valid phone number'
            });
            return;
        }
        // Validate date is in the future
        const appointmentDate = new Date(preferredDate);
        if (appointmentDate <= new Date()) {
            res.status(400).json({
                success: false,
                message: 'Preferred date must be in the future'
            });
            return;
        }
        // Create appointment
        const appointment = new Appointment_1.default({
            patientName: patientName.trim(),
            patientEmail: patientEmail.trim().toLowerCase(),
            patientPhone: patientPhone.trim(),
            department: department.trim(),
            preferredDate: appointmentDate,
            reason: reason.trim(),
            notes: notes?.trim(),
            status: Appointment_1.AppointmentStatus.PENDING
        });
        await appointment.save();
        // Send confirmation email to patient asynchronously (don't wait)
        // Don't pass userId so it bypasses notification preference checks
        notification_service_1.NotificationService.sendNotification({
            email: appointment.patientEmail,
            subject: `Appointment Request Confirmation - ${appointment.department}`,
            text: `Appointment Request Confirmation - ${appointment.department}`,
            html: await generateAppointmentConfirmationHTML(appointment),
            type: 'appointment'
        }).then(() => {
            console.log('✅ Appointment confirmation email sent');
        }).catch((emailError) => {
            console.error('❌ Failed to send confirmation email:', emailError);
        });
        res.status(201).json({
            success: true,
            message: 'Appointment request submitted successfully',
            data: {
                appointmentId: appointment._id,
                status: appointment.status,
                preferredDate: appointment.preferredDate
            }
        });
        return;
    }
    catch (error) {
        console.error('Create appointment error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create appointment',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.createAppointment = createAppointment;
// Get all appointments (Admin only)
const getAllAppointments = async (req, res) => {
    try {
        const { status, department, page = 1, limit = 10 } = req.query;
        const filter = {};
        if (status)
            filter.status = status;
        if (department)
            filter.department = department;
        const appointments = await Appointment_1.default.find(filter)
            .sort({ preferredDate: 1, createdAt: -1 })
            .limit(Number(limit) * 1)
            .skip((Number(page) - 1) * Number(limit));
        const total = await Appointment_1.default.countDocuments(filter);
        res.status(200).json({
            success: true,
            data: {
                appointments,
                pagination: {
                    current: Number(page),
                    pages: Math.ceil(total / Number(limit)),
                    total
                }
            }
        });
        return;
    }
    catch (error) {
        console.error('Get appointments error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch appointments',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.getAllAppointments = getAllAppointments;
// Get appointment by ID
const getAppointmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await Appointment_1.default.findById(id);
        if (!appointment) {
            res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: appointment
        });
        return;
    }
    catch (error) {
        console.error('Get appointment error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch appointment',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.getAppointmentById = getAppointmentById;
// Update appointment
const updateAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const { patientName, patientEmail, patientPhone, department, preferredDate, reason, notes, status } = req.body;
        // Validate required fields
        if (!patientName || !patientEmail || !patientPhone || !department || !preferredDate || !reason) {
            res.status(400).json({
                success: false,
                message: 'All required fields must be provided'
            });
            return;
        }
        // Validate email format
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(patientEmail)) {
            res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
            return;
        }
        // Validate phone format
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(patientPhone)) {
            res.status(400).json({
                success: false,
                message: 'Please provide a valid phone number'
            });
            return;
        }
        // Validate date is in the future (only if date is being changed)
        if (preferredDate) {
            const appointmentDate = new Date(preferredDate);
            if (appointmentDate <= new Date()) {
                res.status(400).json({
                    success: false,
                    message: 'Preferred date must be in the future'
                });
                return;
            }
        }
        // Update appointment
        const updateData = {
            patientName: patientName.trim(),
            patientEmail: patientEmail.trim().toLowerCase(),
            patientPhone: patientPhone.trim(),
            department: department.trim(),
            preferredDate: preferredDate ? new Date(preferredDate) : undefined,
            reason: reason.trim(),
            notes: notes?.trim(),
            status: status || Appointment_1.AppointmentStatus.PENDING
        };
        const appointment = await Appointment_1.default.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!appointment) {
            res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
            return;
        }
        // Send status update email if status changed
        if (status && status !== 'pending') {
            try {
                await sendAppointmentStatusUpdateEmail(appointment, 'pending');
            }
            catch (emailError) {
                console.error('Failed to send status update email:', emailError);
                // Don't fail the update if email fails
            }
        }
        res.status(200).json({
            success: true,
            message: 'Appointment updated successfully',
            data: appointment
        });
        return;
    }
    catch (error) {
        console.error('Update appointment error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update appointment',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.updateAppointment = updateAppointment;
// Update appointment status (Admin only)
const updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;
        const appointment = await Appointment_1.default.findById(id);
        if (!appointment) {
            res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
            return;
        }
        const previousStatus = appointment.status;
        appointment.status = status;
        if (notes)
            appointment.notes = notes;
        // Set timestamps based on status
        if (status === Appointment_1.AppointmentStatus.CONFIRMED) {
            appointment.confirmedAt = new Date();
        }
        else if (status === Appointment_1.AppointmentStatus.CANCELLED) {
            appointment.cancelledAt = new Date();
        }
        await appointment.save();
        // Send status update email to patient asynchronously (don't wait)
        // Don't pass userId so it bypasses notification preference checks
        notification_service_1.NotificationService.sendNotification({
            email: appointment.patientEmail,
            subject: `Appointment Status Update - ${appointment.department}`,
            text: `Appointment Status Update - ${appointment.department}`,
            html: await generateAppointmentStatusUpdateHTML(appointment, previousStatus),
            type: 'appointment'
        }).then(() => {
            console.log('✅ Appointment status update email sent');
        }).catch((emailError) => {
            console.error('❌ Failed to send status update email:', emailError);
        });
        res.status(200).json({
            success: true,
            message: 'Appointment status updated successfully',
            data: appointment
        });
        return;
    }
    catch (error) {
        console.error('Update appointment error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update appointment',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.updateAppointmentStatus = updateAppointmentStatus;
// Get appointment statistics
const getAppointmentStats = async (req, res) => {
    try {
        const stats = await Appointment_1.default.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);
        const departmentStats = await Appointment_1.default.aggregate([
            {
                $group: {
                    _id: '$department',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);
        const totalAppointments = await Appointment_1.default.countDocuments();
        const todayAppointments = await Appointment_1.default.countDocuments({
            preferredDate: {
                $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                $lt: new Date(new Date().setHours(23, 59, 59, 999))
            }
        });
        res.status(200).json({
            success: true,
            data: {
                total: totalAppointments,
                today: todayAppointments,
                byStatus: stats,
                byDepartment: departmentStats
            }
        });
        return;
    }
    catch (error) {
        console.error('Get appointment stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch appointment statistics',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.getAppointmentStats = getAppointmentStats;
// Delete appointment
const deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await Appointment_1.default.findByIdAndDelete(id);
        if (!appointment) {
            res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Appointment deleted successfully'
        });
        return;
    }
    catch (error) {
        console.error('Delete appointment error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete appointment',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};
exports.deleteAppointment = deleteAppointment;
// Email functions
const sendAppointmentConfirmationEmail = async (appointment) => {
    const subject = `Appointment Request Confirmation - ${appointment.department}`;
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #1a202c; text-align: center; margin-bottom: 20px;">Appointment Request Received</h2>
      <p style="color: #4a5568; line-height: 1.6;">Dear ${appointment.patientName},</p>
      <p style="color: #4a5568; line-height: 1.6;">Thank you for requesting an appointment with our ${appointment.department} department.</p>
      
      <div style="background-color: #f7fafc; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #2d3748; margin-top: 0;">Appointment Details:</h3>
        <p style="margin: 5px 0;"><strong>Department:</strong> ${appointment.department}</p>
        <p style="margin: 5px 0;"><strong>Preferred Date:</strong> ${appointment.preferredDate.toLocaleDateString()}</p>
        <p style="margin: 5px 0;"><strong>Reason:</strong> ${appointment.reason}</p>
        <p style="margin: 5px 0;"><strong>Status:</strong> <span style="background-color: #fef5e7; color: #d69e2e; padding: 2px 6px; border-radius: 3px; font-size: 12px;">Pending Review</span></p>
      </div>
      
      <p style="color: #4a5568; line-height: 1.6;">We will review your request and contact you within 24 hours to confirm your appointment time.</p>
      <p style="color: #4a5568; line-height: 1.6;">If you have any questions, please don't hesitate to contact us.</p>
      
      <p style="color: #4a5568; line-height: 1.6;">Best regards,<br>LAUTECH Teaching Hospital</p>
    </div>
  `;
    const text = `Appointment Request Confirmation - ${appointment.department}\n\nDear ${appointment.patientName},\n\nThank you for requesting an appointment with our ${appointment.department} department.\n\nAppointment Details:\n- Department: ${appointment.department}\n- Preferred Date: ${appointment.preferredDate.toLocaleDateString()}\n- Reason: ${appointment.reason}\n- Status: Pending Review\n\nWe will review your request and contact you within 24 hours to confirm your appointment time.\n\nBest regards,\nLAUTECH Teaching Hospital`;
    await email_service_1.default.sendEmail(appointment.patientEmail, subject, text, html);
};
// Generate HTML for appointment confirmation
const generateAppointmentConfirmationHTML = async (appointment) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #1a202c; text-align: center; margin-bottom: 20px;">Appointment Request Received</h2>
      <p style="color: #4a5568; line-height: 1.6;">Dear ${appointment.patientName},</p>
      <p style="color: #4a5568; line-height: 1.6;">Thank you for requesting an appointment with our ${appointment.department} department.</p>
      
      <div style="background-color: #f7fafc; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #2d3748; margin-top: 0;">Appointment Details:</h3>
        <p style="margin: 5px 0;"><strong>Department:</strong> ${appointment.department}</p>
        <p style="margin: 5px 0;"><strong>Preferred Date:</strong> ${appointment.preferredDate.toLocaleDateString()}</p>
        <p style="margin: 5px 0;"><strong>Reason:</strong> ${appointment.reason}</p>
        <p style="margin: 5px 0;"><strong>Status:</strong> <span style="background-color: #fef5e7; color: #d69e2e; padding: 2px 6px; border-radius: 3px; font-size: 12px;">Pending Review</span></p>
      </div>
      
      <p style="color: #4a5568; line-height: 1.6;">We will review your request and contact you within 24 hours to confirm your appointment time.</p>
      <p style="color: #4a5568; line-height: 1.6;">If you have any questions, please don't hesitate to contact us.</p>
      
      <p style="color: #4a5568; line-height: 1.6;">Best regards,<br>LAUTECH Teaching Hospital</p>
    </div>
  `;
};
// Generate HTML for appointment status update
const generateAppointmentStatusUpdateHTML = async (appointment, previousStatus) => {
    const statusMessages = {
        [Appointment_1.AppointmentStatus.CONFIRMED]: {
            subject: 'Appointment Confirmed',
            message: 'Your appointment has been confirmed. Please arrive 15 minutes early.',
            color: '#38a169'
        },
        [Appointment_1.AppointmentStatus.CANCELLED]: {
            subject: 'Appointment Cancelled',
            message: 'Your appointment has been cancelled. Please contact us to reschedule.',
            color: '#e53e3e'
        },
        [Appointment_1.AppointmentStatus.COMPLETED]: {
            subject: 'Appointment Completed',
            message: 'Thank you for visiting us. We hope you had a good experience.',
            color: '#3182ce'
        }
    };
    const statusInfo = statusMessages[appointment.status];
    if (!statusInfo)
        return '';
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #1a202c; text-align: center; margin-bottom: 20px;">${statusInfo.subject}</h2>
      <p style="color: #4a5568; line-height: 1.6;">Dear ${appointment.patientName},</p>
      <p style="color: #4a5568; line-height: 1.6;">${statusInfo.message}</p>
      
      <div style="background-color: #f7fafc; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #2d3748; margin-top: 0;">Appointment Details:</h3>
        <p style="margin: 5px 0;"><strong>Department:</strong> ${appointment.department}</p>
        <p style="margin: 5px 0;"><strong>Date:</strong> ${appointment.preferredDate.toLocaleDateString()}</p>
        <p style="margin: 5px 0;"><strong>Status:</strong> <span style="background-color: ${statusInfo.color}20; color: ${statusInfo.color}; padding: 2px 6px; border-radius: 3px; font-size: 12px;">${appointment.status.replace('_', ' ').toUpperCase()}</span></p>
        ${appointment.notes ? `<p style="margin: 5px 0;"><strong>Notes:</strong> ${appointment.notes}</p>` : ''}
      </div>
      
      <p style="color: #4a5568; line-height: 1.6;">Best regards,<br>LAUTECH Teaching Hospital</p>
    </div>
  `;
};
const sendAppointmentStatusUpdateEmail = async (appointment, previousStatus) => {
    const statusMessages = {
        [Appointment_1.AppointmentStatus.CONFIRMED]: {
            subject: 'Appointment Confirmed',
            message: 'Your appointment has been confirmed. Please arrive 15 minutes early.',
            color: '#38a169'
        },
        [Appointment_1.AppointmentStatus.CANCELLED]: {
            subject: 'Appointment Cancelled',
            message: 'Your appointment has been cancelled. Please contact us to reschedule.',
            color: '#e53e3e'
        },
        [Appointment_1.AppointmentStatus.COMPLETED]: {
            subject: 'Appointment Completed',
            message: 'Thank you for visiting us. We hope you had a good experience.',
            color: '#3182ce'
        }
    };
    const statusInfo = statusMessages[appointment.status];
    if (!statusInfo)
        return;
    const subject = `${statusInfo.subject} - ${appointment.department}`;
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #1a202c; text-align: center; margin-bottom: 20px;">${statusInfo.subject}</h2>
      <p style="color: #4a5568; line-height: 1.6;">Dear ${appointment.patientName},</p>
      <p style="color: #4a5568; line-height: 1.6;">${statusInfo.message}</p>
      
      <div style="background-color: #f7fafc; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #2d3748; margin-top: 0;">Appointment Details:</h3>
        <p style="margin: 5px 0;"><strong>Department:</strong> ${appointment.department}</p>
        <p style="margin: 5px 0;"><strong>Date:</strong> ${appointment.preferredDate.toLocaleDateString()}</p>
        <p style="margin: 5px 0;"><strong>Status:</strong> <span style="background-color: ${statusInfo.color}20; color: ${statusInfo.color}; padding: 2px 6px; border-radius: 3px; font-size: 12px;">${appointment.status.replace('_', ' ').toUpperCase()}</span></p>
        ${appointment.notes ? `<p style="margin: 5px 0;"><strong>Notes:</strong> ${appointment.notes}</p>` : ''}
      </div>
      
      <p style="color: #4a5568; line-height: 1.6;">Best regards,<br>LAUTECH Teaching Hospital</p>
    </div>
  `;
    const text = `${statusInfo.subject} - ${appointment.department}\n\nDear ${appointment.patientName},\n\n${statusInfo.message}\n\nAppointment Details:\n- Department: ${appointment.department}\n- Date: ${appointment.preferredDate.toLocaleDateString()}\n- Status: ${appointment.status.replace('_', ' ').toUpperCase()}\n${appointment.notes ? `- Notes: ${appointment.notes}\n` : ''}\nBest regards,\nLAUTECH Teaching Hospital`;
    await email_service_1.default.sendEmail(appointment.patientEmail, subject, text, html);
};
// Delete test appointments (for cleanup)
const deleteTestAppointments = async (req, res) => {
    try {
        // Delete appointments with test emails or names
        const result = await Appointment_1.default.deleteMany({
            $or: [
                { patientEmail: { $regex: /test|example\.com/, $options: 'i' } },
                { patientName: { $regex: /test|john doe/i } }
            ]
        });
        res.status(200).json({
            success: true,
            message: `Deleted ${result.deletedCount} test appointments`,
            deletedCount: result.deletedCount
        });
        return;
    }
    catch (error) {
        console.error('Error deleting test appointments:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete test appointments'
        });
        return;
    }
};
exports.deleteTestAppointments = deleteTestAppointments;
