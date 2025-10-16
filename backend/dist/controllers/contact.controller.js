"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContacts = exports.createContact = void 0;
const Contact_1 = __importDefault(require("../models/Contact"));
const notification_service_1 = require("../services/notification.service");
// Create contact message
const createContact = async (req, res) => {
    try {
        const { name, email, message, subject, phoneNumber } = req.body;
        const contact = new Contact_1.default({
            name,
            email,
            message,
            subject,
            phoneNumber
        });
        await contact.save();
        // Send email notification (always send contact form emails)
        try {
            await notification_service_1.NotificationService.sendNotification({
                email: process.env.EMAIL_USER || 'admin@lautech.edu.ng',
                subject: `New Contact Form Submission: ${subject || 'No Subject'}`,
                text: `New Contact Form Submission from ${name}`,
                html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phoneNumber || 'Not provided'}</p>
          <p><strong>Subject:</strong> ${subject || 'No subject'}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
          <hr>
          <p><em>Sent from LAUTECH Teaching Hospital Contact Form</em></p>
        `,
                type: 'contact'
            });
            console.log('Contact form notification sent successfully');
        }
        catch (emailError) {
            console.error('Email sending failed:', emailError);
            // Don't fail the request if email fails
        }
        res.status(201).json({
            success: true,
            message: 'Contact message sent successfully',
            data: { contact }
        });
    }
    catch (error) {
        console.error('Create contact error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send contact message',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.createContact = createContact;
// Get all contact messages
const getContacts = async (req, res) => {
    try {
        const contacts = await Contact_1.default.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: contacts
        });
    }
    catch (error) {
        console.error('Get contacts error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get contacts',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getContacts = getContacts;
