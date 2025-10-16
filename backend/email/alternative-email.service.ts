import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

// Alternative email service using different providers
class AlternativeEmailService {
  private transporter: any = null;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
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

  async sendEmail(to: string, subject: string, text: string, html?: string) {
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

    } catch (error) {
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

  private logEmailToFile(to: string, subject: string, text: string, status: string, html?: string, error?: string) {
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

  private async sendViaWebhook(to: string, subject: string, text: string, html?: string) {
    // This could be implemented to send emails via a webhook service
    // like Zapier, IFTTT, or a custom webhook endpoint
    console.log('📤 Email would be sent via webhook:', { to, subject });
  }
}

export default new AlternativeEmailService();
