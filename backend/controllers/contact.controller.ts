import { Request, Response } from 'express';
import Contact from '../models/Contact';
import { NotificationService } from '../services/notification.service';
import nodemailer from 'nodemailer';

// Create contact message
export const createContact = async (req: Request, res: Response) => {
  try {
    const { name, email, message, subject, phoneNumber } = req.body;

    const contact = new Contact({
      name,
      email,
      message,
      subject,
      phoneNumber
    });

    await contact.save();

    // Send email notification asynchronously (don't wait for it)
    // This prevents the request from timing out while email is being sent
    NotificationService.sendNotification({
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
    }).then(() => {
      console.log('✅ Contact form notification sent successfully');
    }).catch((emailError) => {
      console.error('❌ Email sending failed:', emailError);
    });

    // Respond immediately without waiting for email
    res.status(201).json({
      success: true,
      message: 'Contact message sent successfully',
      data: { contact }
    });
  } catch (error) {
    console.error('Create contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send contact message',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get all contact messages
export const getContacts = async (req: Request, res: Response) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: contacts
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get contacts',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
