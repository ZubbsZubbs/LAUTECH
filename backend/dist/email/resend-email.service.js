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
Object.defineProperty(exports, "__esModule", { value: true });
const resend_1 = require("resend");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
// Check if Resend API key is configured
const hasResendConfig = process.env.RESEND_API_KEY;
console.log('📧 Resend Email Configuration Check:');
console.log('RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
console.log('hasResendConfig:', hasResendConfig);
let resend = null;
if (hasResendConfig) {
    console.log('✅ Resend API key found, initializing Resend...');
    resend = new resend_1.Resend(process.env.RESEND_API_KEY);
}
else {
    console.log('❌ No Resend API key found, will fall back to SMTP');
}
class ResendEmailService {
    async sendEmail(to, subject, text, html) {
        try {
            // If no Resend config, return null to fall back to SMTP
            if (!hasResendConfig || !resend) {
                console.log('⚠️ Resend not configured, falling back to SMTP');
                return null;
            }
            console.log(`📧 [${new Date().toISOString()}] Sending email via Resend to ${to}...`);
            const { data, error } = await resend.emails.send({
                from: process.env.EMAIL_FROM || 'LAUTECH Teaching Hospital <noreply@lautech.edu.ng>',
                to: [to],
                subject,
                text,
                html,
            });
            if (error) {
                console.error('❌ Resend email failed:', error);
                throw new Error(`Resend error: ${error.message}`);
            }
            console.log(`✅ [${new Date().toISOString()}] Email sent successfully via Resend:`, data?.id);
            // Log to file for backup
            this.logEmailToFile(to, subject, text, 'SENT', html, data?.id);
            return {
                messageId: data?.id || `resend-${Date.now()}`,
                accepted: [to],
                rejected: [],
                pending: [],
                response: 'Email sent via Resend API'
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error('❌ Resend email error:', errorMessage);
            // Log to file as fallback
            this.logEmailToFile(to, subject, text, 'FAILED', html, errorMessage);
            // Return null to trigger SMTP fallback
            return null;
        }
    }
    logEmailToFile(to, subject, text, status, html, messageId) {
        const fs = require('fs');
        const path = require('path');
        const logEntry = {
            timestamp: new Date().toISOString(),
            status,
            messageId,
            to,
            subject,
            text,
            html: html ? html.substring(0, 500) + '...' : undefined,
            service: 'Resend'
        };
        const logDir = path.join(__dirname, '..', 'logs');
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }
        const logFile = path.join(logDir, 'emails.log');
        const logLine = JSON.stringify(logEntry) + '\n';
        fs.appendFileSync(logFile, logLine);
        console.log(`📧 Email logged to file: ${logFile}`);
        console.log(`Status: ${status}`);
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
    }
}
exports.default = new ResendEmailService();
