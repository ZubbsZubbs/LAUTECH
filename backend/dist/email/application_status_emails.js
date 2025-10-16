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
exports.sendApplicationStatusEmail = exports.sendWaitlistEmail = exports.sendRejectionEmail = exports.sendApprovalEmail = exports.sendUnderReviewEmail = void 0;
const dotenv = __importStar(require("dotenv"));
const Application_1 = require("../models/Application");
const email_service_1 = __importDefault(require("./email.service"));
dotenv.config();
// Email template for application under review
const sendUnderReviewEmail = async (application) => {
    const subject = `Application Under Review - ${application.applicationNumber}`;
    const text = `Application under review for ${application.firstName} ${application.lastName}`;
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #1e40af; margin: 0;">LAUTECH School of Nursing</h1>
        <p style="color: #6b7280; margin: 5px 0;">Admissions Office</p>
      </div>
      
      <div style="background: linear-gradient(135deg, #3b82f6, #1e40af); color: white; padding: 20px; border-radius: 10px; margin-bottom: 30px;">
        <h2 style="margin: 0; text-align: center;">Application Under Review</h2>
      </div>
      
      <p style="font-size: 16px; line-height: 1.6;">Dear ${application.firstName} ${application.lastName},</p>
      
      <p style="font-size: 16px; line-height: 1.6;">
        We are pleased to inform you that your nursing program application has been received and is currently under review by our admissions committee.
      </p>
      
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; margin: 20px 0;">
        <h3 style="color: #1e40af; margin-top: 0;">Application Details</h3>
        <p><strong>Application Number:</strong> ${application.applicationNumber}</p>
        <p><strong>Program:</strong> ${application.program}</p>
        <p><strong>Status:</strong> <span style="color: #3b82f6; font-weight: bold;">Under Review</span></p>
        <p><strong>Submitted:</strong> ${new Date(application.submittedAt).toLocaleDateString()}</p>
        <p><strong>Review Started:</strong> ${new Date().toLocaleDateString()}</p>
      </div>
      
      <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0;">
        <h4 style="color: #92400e; margin-top: 0;">What happens next?</h4>
        <ul style="color: #92400e; margin: 10px 0;">
          <li>Our admissions committee will carefully review your application</li>
          <li>We will verify all submitted documents and qualifications</li>
          <li>You will be notified of the final decision within 2-3 weeks</li>
          <li>Please ensure your contact information is up to date</li>
        </ul>
      </div>
      
      <p style="font-size: 16px; line-height: 1.6;">
        If you have any questions or need to provide additional information, please don't hesitate to contact us.
      </p>
      
      <div style="text-align: center; margin: 30px 0;">
        <p style="color: #6b7280; font-size: 14px;">
          <strong>Contact Information:</strong><br>
          Email: nursing@lautech.edu.ng<br>
          Phone: +234 (0) 803 123 4567<br>
          Address: LAUTECH School of Nursing, Ogbomoso, Oyo State
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px; margin: 0;">
          Best regards,<br>
          <strong>LAUTECH School of Nursing Admissions Team</strong>
        </p>
      </div>
    </div>
  `;
    await email_service_1.default.sendEmail(application.email, subject, text, html);
};
exports.sendUnderReviewEmail = sendUnderReviewEmail;
// Email template for application approval
const sendApprovalEmail = async (application) => {
    const subject = `🎉 Congratulations! Application Approved - ${application.applicationNumber}`;
    const text = `Application approved for ${application.firstName} ${application.lastName}`;
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #059669; margin: 0;">LAUTECH School of Nursing</h1>
        <p style="color: #6b7280; margin: 5px 0;">Admissions Office</p>
      </div>
      
      <div style="background: linear-gradient(135deg, #059669, #047857); color: white; padding: 20px; border-radius: 10px; margin-bottom: 30px; text-align: center;">
        <h2 style="margin: 0;">🎉 Congratulations!</h2>
        <p style="margin: 10px 0 0 0; font-size: 18px;">Your Application Has Been Approved</p>
      </div>
      
      <p style="font-size: 16px; line-height: 1.6;">Dear ${application.firstName} ${application.lastName},</p>
      
      <p style="font-size: 16px; line-height: 1.6;">
        We are delighted to inform you that your application for admission to the LAUTECH School of Nursing has been <strong style="color: #059669;">APPROVED</strong>!
      </p>
      
      <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; border-left: 4px solid #059669; margin: 20px 0;">
        <h3 style="color: #047857; margin-top: 0;">Application Details</h3>
        <p><strong>Application Number:</strong> ${application.applicationNumber}</p>
        <p><strong>Program:</strong> ${application.program}</p>
        <p><strong>Status:</strong> <span style="color: #059669; font-weight: bold;">APPROVED ✅</span></p>
        <p><strong>Approved On:</strong> ${new Date(application.reviewedAt).toLocaleDateString()}</p>
        ${application.admissionDecision ? `<p><strong>Admission Decision:</strong> ${application.admissionDecision}</p>` : ''}
      </div>
      
      <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; margin: 20px 0;">
        <h4 style="color: #1e40af; margin-top: 0;">Next Steps</h4>
        <ol style="color: #1e40af; margin: 10px 0;">
          <li>You will receive a formal admission letter via email within 48 hours</li>
          <li>Complete the acceptance process by the specified deadline</li>
          <li>Pay the required admission fees</li>
          <li>Submit any additional required documents</li>
          <li>Attend the orientation program (details will be provided)</li>
        </ol>
      </div>
      
      ${application.notes ? `
      <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0;">
        <h4 style="color: #92400e; margin-top: 0;">Additional Notes</h4>
        <p style="color: #92400e; margin: 0;">${application.notes}</p>
      </div>
      ` : ''}
      
      <p style="font-size: 16px; line-height: 1.6;">
        We look forward to welcoming you to the LAUTECH School of Nursing family. If you have any questions about the next steps, please don't hesitate to contact us.
      </p>
      
      <div style="text-align: center; margin: 30px 0;">
        <p style="color: #6b7280; font-size: 14px;">
          <strong>Contact Information:</strong><br>
          Email: nursing@lautech.edu.ng<br>
          Phone: +234 (0) 803 123 4567<br>
          Address: LAUTECH School of Nursing, Ogbomoso, Oyo State
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px; margin: 0;">
          Congratulations again!<br>
          <strong>LAUTECH School of Nursing Admissions Team</strong>
        </p>
      </div>
    </div>
  `;
    await email_service_1.default.sendEmail(application.email, subject, text, html);
};
exports.sendApprovalEmail = sendApprovalEmail;
// Email template for application rejection
const sendRejectionEmail = async (application) => {
    const subject = `Application Update - ${application.applicationNumber}`;
    const text = `Application update for ${application.firstName} ${application.lastName}`;
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #dc2626; margin: 0;">LAUTECH School of Nursing</h1>
        <p style="color: #6b7280; margin: 5px 0;">Admissions Office</p>
      </div>
      
      <div style="background: linear-gradient(135deg, #dc2626, #991b1b); color: white; padding: 20px; border-radius: 10px; margin-bottom: 30px; text-align: center;">
        <h2 style="margin: 0;">Application Update</h2>
        <p style="margin: 10px 0 0 0; font-size: 18px;">Decision Notification</p>
      </div>
      
      <p style="font-size: 16px; line-height: 1.6;">Dear ${application.firstName} ${application.lastName},</p>
      
      <p style="font-size: 16px; line-height: 1.6;">
        Thank you for your interest in the LAUTECH School of Nursing. After careful consideration of your application, we regret to inform you that we are unable to offer you admission at this time.
      </p>
      
      <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; border-left: 4px solid #dc2626; margin: 20px 0;">
        <h3 style="color: #991b1b; margin-top: 0;">Application Details</h3>
        <p><strong>Application Number:</strong> ${application.applicationNumber}</p>
        <p><strong>Program:</strong> ${application.program}</p>
        <p><strong>Status:</strong> <span style="color: #dc2626; font-weight: bold;">Not Approved</span></p>
        <p><strong>Decision Date:</strong> ${new Date(application.reviewedAt).toLocaleDateString()}</p>
        ${application.admissionDecision ? `<p><strong>Decision Details:</strong> ${application.admissionDecision}</p>` : ''}
      </div>
      
      <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0;">
        <h4 style="color: #92400e; margin-top: 0;">What you can do next</h4>
        <ul style="color: #92400e; margin: 10px 0;">
          <li>Consider applying for other programs that may be suitable</li>
          <li>Improve your qualifications and reapply in the next admission cycle</li>
          <li>Contact our admissions office for feedback on your application</li>
          <li>Explore alternative pathways to nursing education</li>
        </ul>
      </div>
      
      ${application.notes ? `
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; border-left: 4px solid #6b7280; margin: 20px 0;">
        <h4 style="color: #374151; margin-top: 0;">Feedback</h4>
        <p style="color: #374151; margin: 0;">${application.notes}</p>
      </div>
      ` : ''}
      
      <p style="font-size: 16px; line-height: 1.6;">
        We encourage you to continue pursuing your nursing education goals. If you have any questions about this decision or would like feedback on your application, please don't hesitate to contact us.
      </p>
      
      <div style="text-align: center; margin: 30px 0;">
        <p style="color: #6b7280; font-size: 14px;">
          <strong>Contact Information:</strong><br>
          Email: nursing@lautech.edu.ng<br>
          Phone: +234 (0) 803 123 4567<br>
          Address: LAUTECH School of Nursing, Ogbomoso, Oyo State
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px; margin: 0;">
          Best regards,<br>
          <strong>LAUTECH School of Nursing Admissions Team</strong>
        </p>
      </div>
    </div>
  `;
    await email_service_1.default.sendEmail(application.email, subject, text, html);
};
exports.sendRejectionEmail = sendRejectionEmail;
// Email template for application waitlisted
const sendWaitlistEmail = async (application) => {
    const subject = `Application Waitlisted - ${application.applicationNumber}`;
    const text = `Application waitlisted for ${application.firstName} ${application.lastName}`;
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #f59e0b; margin: 0;">LAUTECH School of Nursing</h1>
        <p style="color: #6b7280; margin: 5px 0;">Admissions Office</p>
      </div>
      
      <div style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 20px; border-radius: 10px; margin-bottom: 30px; text-align: center;">
        <h2 style="margin: 0;">Application Waitlisted</h2>
        <p style="margin: 10px 0 0 0; font-size: 18px;">You're on our Waitlist</p>
      </div>
      
      <p style="font-size: 16px; line-height: 1.6;">Dear ${application.firstName} ${application.lastName},</p>
      
      <p style="font-size: 16px; line-height: 1.6;">
        Thank you for your application to the LAUTECH School of Nursing. We are pleased to inform you that your application has been placed on our waitlist.
      </p>
      
      <div style="background-color: #fffbeb; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0;">
        <h3 style="color: #d97706; margin-top: 0;">Application Details</h3>
        <p><strong>Application Number:</strong> ${application.applicationNumber}</p>
        <p><strong>Program:</strong> ${application.program}</p>
        <p><strong>Status:</strong> <span style="color: #f59e0b; font-weight: bold;">Waitlisted</span></p>
        <p><strong>Waitlisted On:</strong> ${new Date(application.reviewedAt).toLocaleDateString()}</p>
      </div>
      
      <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; margin: 20px 0;">
        <h4 style="color: #1e40af; margin-top: 0;">What this means</h4>
        <ul style="color: #1e40af; margin: 10px 0;">
          <li>Your application met our minimum requirements</li>
          <li>You may be offered admission if spots become available</li>
          <li>We will contact you immediately if a spot opens up</li>
          <li>You can remain on the waitlist for the current admission cycle</li>
        </ul>
      </div>
      
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; border-left: 4px solid #6b7280; margin: 20px 0;">
        <h4 style="color: #374151; margin-top: 0;">Important Notes</h4>
        <ul style="color: #374151; margin: 10px 0;">
          <li>Keep your contact information updated</li>
          <li>Respond promptly if contacted about admission</li>
          <li>Consider backup options while waiting</li>
          <li>You can reapply in the next admission cycle</li>
        </ul>
      </div>
      
      <p style="font-size: 16px; line-height: 1.6;">
        We appreciate your patience and continued interest in our nursing program. If you have any questions, please don't hesitate to contact us.
      </p>
      
      <div style="text-align: center; margin: 30px 0;">
        <p style="color: #6b7280; font-size: 14px;">
          <strong>Contact Information:</strong><br>
          Email: nursing@lautech.edu.ng<br>
          Phone: +234 (0) 803 123 4567<br>
          Address: LAUTECH School of Nursing, Ogbomoso, Oyo State
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px; margin: 0;">
          Best regards,<br>
          <strong>LAUTECH School of Nursing Admissions Team</strong>
        </p>
      </div>
    </div>
  `;
    await email_service_1.default.sendEmail(application.email, subject, text, html);
};
exports.sendWaitlistEmail = sendWaitlistEmail;
// Main function to send appropriate email based on status
const sendApplicationStatusEmail = async (application) => {
    try {
        switch (application.status) {
            case Application_1.ApplicationStatus.UNDER_REVIEW:
                await (0, exports.sendUnderReviewEmail)(application);
                break;
            case Application_1.ApplicationStatus.APPROVED:
                await (0, exports.sendApprovalEmail)(application);
                break;
            case Application_1.ApplicationStatus.REJECTED:
                await (0, exports.sendRejectionEmail)(application);
                break;
            case Application_1.ApplicationStatus.WAITLISTED:
                await (0, exports.sendWaitlistEmail)(application);
                break;
            default:
                console.log(`No specific email template for status: ${application.status}`);
        }
    }
    catch (error) {
        console.error('Error sending application status email:', error);
        throw error;
    }
};
exports.sendApplicationStatusEmail = sendApplicationStatusEmail;
