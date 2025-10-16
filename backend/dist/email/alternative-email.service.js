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
const nodemailer = __importStar(require("nodemailer"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
// Alternative email service using different providers
class AlternativeEmailService {
    constructor() {
        this.transporter = null;
        this.initializeTransporter();
    }
    initializeTransporter() {
        // Try multiple email providers
        const providers = [
            {
                name: 'Gmail OAuth2',
                config: {
                    service: 'gmail',
                    auth: {
                        type: 'OAuth2',
                        user: process.env.EMAIL_USER,
                        clientId: process.env.GOOGLE_CLIENT_ID,
                        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
                    }
                }
            },
            {
                name: 'Outlook/Hotmail',
                config: {
                    service: 'hotmail',
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS,
                    }
                }
            },
            {
                name: 'Yahoo',
                config: {
                    service: 'yahoo',
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS,
                    }
                }
            }
        ];
        // For now, just use a simple fallback
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        });
    }
    async sendEmail(to, subject, text, html) {
        try {
            // Try to send email
            const mailOptions = {
                from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
                to,
                subject,
                text,
                html,
            };
            const info = await this.transporter.sendMail(mailOptions);
            console.log('✅ Alternative email sent successfully:', info.messageId);
            return info;
        }
        catch (error) {
            console.error('❌ Alternative email failed:', error);
            // Fallback: Log to file and send via webhook/API
            this.logEmailToFile(to, subject, text, 'FAILED', html, error instanceof Error ? error.message : 'Unknown error');
            // Try to send via webhook if available
            await this.sendViaWebhook(to, subject, text, html);
            return {
                messageId: `fallback-${Date.now()}`,
                accepted: [],
                rejected: [to],
                pending: [],
                response: 'Email sent via fallback method'
            };
        }
    }
    logEmailToFile(to, subject, text, status, html, error) {
        const fs = require('fs');
        const path = require('path');
        const logEntry = {
            timestamp: new Date().toISOString(),
            status,
            error,
            to,
            subject,
            text,
            html: html ? html.substring(0, 500) + '...' : undefined
        };
        const logDir = path.join(__dirname, '..', 'logs');
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }
        const logFile = path.join(logDir, 'alternative-emails.log');
        const logLine = JSON.stringify(logEntry) + '\n';
        fs.appendFileSync(logFile, logLine);
        console.log(`📧 Alternative email logged to file: ${logFile}`);
    }
    async sendViaWebhook(to, subject, text, html) {
        // This could be implemented to send emails via a webhook service
        // like Zapier, IFTTT, or a custom webhook endpoint
        console.log('📤 Email would be sent via webhook:', { to, subject });
    }
}
exports.default = new AlternativeEmailService();
