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
exports.getApplicationStats = exports.startApplicationReview = exports.updateApplicationStatus = exports.getStudentApplications = exports.getApplicationById = exports.getAllApplications = exports.createNursingApplication = void 0;
const Application_1 = __importStar(require("../models/Application"));
const User_1 = __importDefault(require("../models/User"));
const notification_service_1 = require("../services/notification.service");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const application_status_emails_1 = require("../email/application_status_emails");
const email_service_1 = __importDefault(require("../email/email.service"));
// Create nursing application
const createNursingApplication = async (req, res) => {
    try {
        console.log('Request body:', req.body);
        console.log('Request files:', req.files);
        console.log('Content-Type:', req.get('Content-Type'));
        const applicationData = req.body;
        // Parse JSON fields
        if (applicationData.references && typeof applicationData.references === 'string') {
            try {
                applicationData.references = JSON.parse(applicationData.references);
            }
            catch (error) {
                console.error('Error parsing references JSON:', error);
                return res.status(400).json({
                    success: false,
                    message: 'Invalid references data format'
                });
            }
        }
        // Validate required fields
        if (!applicationData || !applicationData.firstName) {
            console.error('Missing required fields:', {
                hasBody: !!applicationData,
                hasFirstName: !!applicationData?.firstName,
                bodyKeys: applicationData ? Object.keys(applicationData) : 'no body'
            });
            return res.status(400).json({
                success: false,
                message: 'Missing required fields. Please ensure all form data is properly submitted.',
                error: 'firstName is required'
            });
        }
        // Handle file uploads
        const files = req.files;
        if (files) {
            if (files.passportPhoto) {
                applicationData.passportPhoto = files.passportPhoto[0].filename;
            }
            if (files.olevelCertificate) {
                applicationData.olevelCertificate = files.olevelCertificate[0].filename;
            }
            if (files.jambResult) {
                applicationData.jambResult = files.jambResult[0].filename;
            }
            if (files.birthCertificate) {
                applicationData.birthCertificate = files.birthCertificate[0].filename;
            }
            if (files.medicalReport) {
                applicationData.medicalReport = files.medicalReport[0].filename;
            }
        }
        // Generate application number
        const year = new Date().getFullYear();
        const randomNum = Math.floor(Math.random() * 900000) + 100000;
        const randomSuffix = Math.floor(Math.random() * 900) + 100;
        applicationData.applicationNumber = `LAUTECH-NUR-${year}-${randomNum}-${randomSuffix}`;
        // Set application status and dates
        applicationData.status = Application_1.ApplicationStatus.PENDING;
        applicationData.submittedAt = new Date();
        applicationData.applicationType = 'undergraduate';
        // Create application
        const application = new Application_1.default(applicationData);
        await application.save();
        // Send confirmation email to applicant (checking notification preferences)
        try {
            await notification_service_1.NotificationService.sendNotification({
                userId: application.email, // Use email as identifier
                email: application.email,
                subject: `Application Submitted Successfully - ${application.applicationNumber}`,
                text: `Application Submitted Successfully - ${application.applicationNumber}`,
                html: await generateApplicationConfirmationHTML(application),
                type: 'application'
            });
        }
        catch (emailError) {
            console.error('Failed to send confirmation email:', emailError);
        }
        // Send notification email to admin
        try {
            await sendAdminNotificationEmail(application);
        }
        catch (emailError) {
            console.error('Failed to send admin notification email:', emailError);
        }
        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            data: { application }
        });
    }
    catch (error) {
        console.error('Create application error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit application',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.createNursingApplication = createNursingApplication;
// Get all applications (Admin only)
const getAllApplications = async (req, res) => {
    try {
        const applications = await Application_1.default.find()
            .sort({ submittedAt: -1 })
            .select('-__v');
        res.status(200).json({
            success: true,
            data: {
                applications: applications
            }
        });
    }
    catch (error) {
        console.error('Get applications error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get applications',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getAllApplications = getAllApplications;
// Get application by ID (Admin only)
const getApplicationById = async (req, res) => {
    try {
        const { id } = req.params;
        const application = await Application_1.default.findById(id).select('-__v');
        if (!application) {
            res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }
        else {
            res.status(200).json({
                success: true,
                data: application
            });
        }
    }
    catch (error) {
        console.error('Get application error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get application',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getApplicationById = getApplicationById;
// Get applications for a specific student
const getStudentApplications = async (req, res) => {
    try {
        console.log('Student applications - Headers:', req.headers);
        console.log('Student applications - Authorization:', req.headers.authorization);
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('Student applications - No valid auth header');
            return res.status(401).json({
                success: false,
                message: 'Access token required'
            });
        }
        const token = authHeader.split(' ')[1];
        console.log('Student applications - Token:', token);
        // Verify token
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your-secret-key');
            console.log('Student applications - Decoded token:', decoded);
        }
        catch (jwtError) {
            console.log('Student applications - JWT verification failed:', jwtError);
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }
        // Get user from token
        const user = await User_1.default.findById(decoded.userId);
        console.log('Student applications - User found:', user);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        // Get applications for this user
        const applications = await Application_1.default.find({ email: user.email })
            .sort({ submittedAt: -1 })
            .select('-__v');
        console.log('Student applications - Found applications:', applications.length);
        console.log('Student applications - User email:', user.email);
        res.status(200).json({
            success: true,
            data: {
                applications: applications
            }
        });
    }
    catch (error) {
        console.error('Get student applications error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch applications',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getStudentApplications = getStudentApplications;
// Update application status (Admin only)
const updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes, admissionDecision } = req.body;
        const application = await Application_1.default.findById(id);
        if (!application) {
            res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }
        else {
            const previousStatus = application.status;
            application.status = status;
            application.reviewedAt = new Date();
            application.reviewedBy = req.user?.id;
            if (notes)
                application.notes = notes;
            if (admissionDecision)
                application.admissionDecision = admissionDecision;
            await application.save();
            // Send enhanced status update email to applicant
            try {
                await (0, application_status_emails_1.sendApplicationStatusEmail)(application);
            }
            catch (emailError) {
                console.error('Failed to send status update email:', emailError);
                // Fallback to basic email if enhanced email fails
                try {
                    await sendStatusUpdateEmail(application);
                }
                catch (fallbackError) {
                    console.error('Failed to send fallback status update email:', fallbackError);
                }
            }
            res.status(200).json({
                success: true,
                message: 'Application status updated successfully',
                data: application
            });
        }
    }
    catch (error) {
        console.error('Update application error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update application',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.updateApplicationStatus = updateApplicationStatus;
// Start review process (Admin only) - automatically sets status to under_review
const startApplicationReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { notes } = req.body;
        const application = await Application_1.default.findById(id);
        if (!application) {
            res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }
        else {
            application.status = Application_1.ApplicationStatus.UNDER_REVIEW;
            application.reviewedAt = new Date();
            application.reviewedBy = req.user?.id;
            if (notes)
                application.notes = notes;
            await application.save();
            // Send under review email to applicant
            try {
                await (0, application_status_emails_1.sendApplicationStatusEmail)(application);
            }
            catch (emailError) {
                console.error('Failed to send under review email:', emailError);
            }
            res.status(200).json({
                success: true,
                message: 'Application review started successfully',
                data: application
            });
        }
    }
    catch (error) {
        console.error('Start review error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to start application review',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.startApplicationReview = startApplicationReview;
// Get application statistics (Admin only)
const getApplicationStats = async (req, res) => {
    try {
        const totalApplications = await Application_1.default.countDocuments();
        const pendingApplications = await Application_1.default.countDocuments({ status: Application_1.ApplicationStatus.PENDING });
        const underReviewApplications = await Application_1.default.countDocuments({ status: Application_1.ApplicationStatus.UNDER_REVIEW });
        const approvedApplications = await Application_1.default.countDocuments({ status: Application_1.ApplicationStatus.APPROVED });
        const rejectedApplications = await Application_1.default.countDocuments({ status: Application_1.ApplicationStatus.REJECTED });
        const programStats = await Application_1.default.aggregate([
            {
                $group: {
                    _id: '$program',
                    count: { $sum: 1 }
                }
            }
        ]);
        res.status(200).json({
            success: true,
            data: {
                total: totalApplications,
                pending: pendingApplications,
                underReview: underReviewApplications,
                approved: approvedApplications,
                rejected: rejectedApplications,
                programStats
            }
        });
    }
    catch (error) {
        console.error('Get application stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get application statistics',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getApplicationStats = getApplicationStats;
// Email functions
const generateApplicationConfirmationHTML = async (application) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #1a202c; text-align: center; margin-bottom: 20px;">Application Submitted Successfully</h2>
      <p style="color: #4a5568; line-height: 1.6;">Dear ${application.firstName} ${application.lastName},</p>
      <p style="color: #4a5568; line-height: 1.6;">Thank you for submitting your nursing application to LAUTECH Teaching Hospital.</p>
      
      <div style="background-color: #f7fafc; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #2d3748; margin-top: 0;">Application Details:</h3>
        <p style="margin: 5px 0;"><strong>Application Number:</strong> ${application.applicationNumber}</p>
        <p style="margin: 5px 0;"><strong>Program:</strong> ${application.program}</p>
        <p style="margin: 5px 0;"><strong>JAMB Score:</strong> ${application.jambScore}</p>
        <p style="margin: 5px 0;"><strong>Status:</strong> <span style="background-color: #fef5e7; color: #d69e2e; padding: 2px 6px; border-radius: 3px; font-size: 12px;">Under Review</span></p>
        <p style="margin: 5px 0;"><strong>Submitted:</strong> ${new Date(application.submittedAt).toLocaleDateString()}</p>
      </div>
      
      <p style="color: #4a5568; line-height: 1.6;">We will review your application and contact you within 7-10 business days with the results.</p>
      <p style="color: #4a5568; line-height: 1.6;">If you have any questions, please don't hesitate to contact us.</p>
      
      <p style="color: #4a5568; line-height: 1.6;">Best regards,<br>LAUTECH Teaching Hospital</p>
    </div>
  `;
};
const sendApplicationConfirmationEmail = async (application) => {
    const subject = 'Application Submitted Successfully - LAUTECH School of Nursing';
    const text = `Application submitted successfully for ${application.firstName} ${application.lastName}`;
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #059669;">Application Submitted Successfully!</h2>
      <p>Dear ${application.firstName} ${application.lastName},</p>
      <p>Thank you for your interest in the School of Nursing at LAUTECH Teaching Hospital. Your application has been received and is being processed.</p>
      
      <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #1e40af;">Application Details</h3>
        <p><strong>Application Number:</strong> ${application.applicationNumber}</p>
        <p><strong>Program:</strong> ${application.program}</p>
        <p><strong>Status:</strong> ${application.status}</p>
        <p><strong>Submitted:</strong> ${new Date(application.submittedAt).toLocaleDateString()}</p>
      </div>
      
      <h3 style="color: #059669;">What happens next?</h3>
      <ul>
        <li>Your application will be reviewed by our admissions committee</li>
        <li>You will be contacted for any additional requirements</li>
        <li>Admission decisions will be communicated within 2-3 weeks</li>
        <li>You will receive updates via email</li>
      </ul>
      
      <p>If you have any questions, please contact us at nursing@lautech.edu.ng</p>
      
      <p>Best regards,<br>
      LAUTECH School of Nursing Admissions Team</p>
    </div>
  `;
    await email_service_1.default.sendEmail(application.email, subject, text, html);
};
const sendAdminNotificationEmail = async (application) => {
    const subject = `New Nursing Application - ${application.applicationNumber}`;
    const text = `New nursing application received from ${application.firstName} ${application.lastName}`;
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #059669;">New Nursing Application Received</h2>
      
      <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #1e40af;">Application Details</h3>
        <p><strong>Application Number:</strong> ${application.applicationNumber}</p>
        <p><strong>Name:</strong> ${application.firstName} ${application.lastName}</p>
        <p><strong>Email:</strong> ${application.email}</p>
        <p><strong>Phone:</strong> ${application.phoneNumber}</p>
        <p><strong>Program:</strong> ${application.program}</p>
        <p><strong>JAMB Score:</strong> ${application.jambScore}</p>
        <p><strong>Submitted:</strong> ${new Date(application.submittedAt).toLocaleDateString()}</p>
      </div>
      
      <p>Please review this application in the admin dashboard.</p>
      
      <p>Best regards,<br>
      LAUTECH Application System</p>
    </div>
  `;
    await email_service_1.default.sendEmail(process.env.EMAIL_USER || 'admin@lautech.edu.ng', subject, text, html);
};
const sendStatusUpdateEmail = async (application) => {
    const subject = `Application Status Update - ${application.applicationNumber}`;
    const text = `Application status update for ${application.firstName} ${application.lastName}`;
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #059669;">Application Status Update</h2>
      <p>Dear ${application.firstName} ${application.lastName},</p>
      
      <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #1e40af;">Application Details</h3>
        <p><strong>Application Number:</strong> ${application.applicationNumber}</p>
        <p><strong>Status:</strong> ${application.status}</p>
        <p><strong>Updated:</strong> ${new Date(application.reviewedAt).toLocaleDateString()}</p>
        ${application.notes ? `<p><strong>Notes:</strong> ${application.notes}</p>` : ''}
        ${application.admissionDecision ? `<p><strong>Decision:</strong> ${application.admissionDecision}</p>` : ''}
      </div>
      
      <p>If you have any questions, please contact us at nursing@lautech.edu.ng</p>
      
      <p>Best regards,<br>
      LAUTECH School of Nursing Admissions Team</p>
    </div>
  `;
    await email_service_1.default.sendEmail(application.email, subject, text, html);
};
