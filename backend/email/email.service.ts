import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

// Check if email credentials are configured
const hasEmailConfig = process.env.EMAIL_USER && process.env.EMAIL_PASS;

console.log('📧 Email Configuration Check:');
console.log('EMAIL_USER exists:', !!process.env.EMAIL_USER);
console.log('EMAIL_PASS exists:', !!process.env.EMAIL_PASS);
console.log('hasEmailConfig:', hasEmailConfig);

let transporter: any = null;

if (hasEmailConfig) {
  console.log('✅ Email credentials found, creating transporter...');
  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
} else {
  console.log('❌ No email credentials found, will log emails to console');
}

class EmailService {
  async sendEmail(to: string, subject: string, text: string, html?: string) {
    try {
      // If no email config, just log the email content
      if (!hasEmailConfig) {
        this.logEmailToFile(to, subject, text, 'NO_CONFIG', html);
        return {
          messageId: `mock-${Date.now()}`,
          accepted: [to],
          rejected: [],
          pending: [],
          response: 'Email logged to file (no SMTP configured)'
        };
      }

      // Try different configurations if the first one fails
      const configs = [
        {
          name: 'Gmail SMTP 587',
          config: {
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
            tls: {
              rejectUnauthorized: false
            }
          }
        },
        {
          name: 'Gmail Simple',
          config: {
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            }
          }
        },
        {
          name: 'Gmail SMTP 465',
          config: {
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
            tls: {
              rejectUnauthorized: false
            }
          }
        }
      ];

      const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to,
        subject,
        text,
        html,
      };

      let lastError: Error | null = null;

      // Try each configuration
      for (const { name, config } of configs) {
        try {
          console.log(`🔄 Trying ${name} for email to ${to}...`);
          const testTransporter = nodemailer.createTransport(config);
          
          // Set a timeout for the email sending (increased to 30 seconds for production)
          const emailPromise = testTransporter.sendMail(mailOptions);
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Email sending timeout')), 30000)
          );

          const info = await Promise.race([emailPromise, timeoutPromise]) as any;
          console.log(`✅ Email sent successfully using ${name}:`, info.messageId);
          
          // Also log to file for backup
          this.logEmailToFile(to, subject, text, 'SENT', html, info.messageId);
          
          return info;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          console.log(`❌ ${name} failed:`, errorMessage);
          lastError = error instanceof Error ? error : new Error('Unknown error');
        }
      }

      // If all configurations failed, throw the last error
      throw lastError || new Error('All email configurations failed');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Error sending email:', errorMessage);
      
      // Log to file as fallback
      this.logEmailToFile(to, subject, text, 'FAILED', html, errorMessage);
      
      // Don't throw error, just log it
      return {
        messageId: `failed-${Date.now()}`,
        accepted: [],
        rejected: [to],
        pending: [],
        response: `Email sending failed: ${errorMessage}`
      };
    }
  }

  private logEmailToFile(to: string, subject: string, text: string, status: string, html?: string, messageId?: string) {
    const fs = require('fs');
    const path = require('path');
    
    const logEntry = {
      timestamp: new Date().toISOString(),
      status,
      messageId,
      to,
      subject,
      text,
      html: html ? html.substring(0, 500) + '...' : undefined
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

export default new EmailService();