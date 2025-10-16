"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactMessage = contactMessage;
const email_service_1 = __importDefault(require("./email.service"));
async function contactMessage(user_email, full_name, body, to) {
    const subject = 'Message from Contact Form';
    const html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Message from Contact Form</title>
                </head>
                <body>
                    <p>${body}</p>
                    <p>Email: ${user_email}</p>
                    <p>Email: ${full_name}</p>
                </body>
                </html>
        `;
    return email_service_1.default.sendEmail(to, subject, html);
}
