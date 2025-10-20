import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
import ResendEmailService from './resend-email.service';

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
      // Try Resend first (works with Render free tier)
      console.log('🔄 [EmailService] Attempting to send via Resend first...');
      const resendResult = await ResendEmailService.sendEmail(to, subject, text, html);
      
      if (resendResult) {
        console.log('✅ Email sent successfully via Resend');
        return resendResult;
      }

      console.log('⚠️ Resend failed or not configured, falling back to SMTP...');

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
      // Optimized for Render/production environments
      const configs = [
        {
          name: 'Gmail SMTP 587 (Production Optimized)',
          config: {
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
            tls: {
              rejectUnauthorized: false,
              minVersion: 'TLSv1.2'
            },
            connectionTimeout: 15000,
            greetingTimeout: 15000,
            socketTimeout: 30000,
            pool: false,
            maxConnections: 1,
            debug: true,
            logger: true
          }
        },
        {
          name: 'Gmail SMTP 465 (SSL)',
          config: {
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
            tls: {
              rejectUnauthorized: false,
              minVersion: 'TLSv1.2'
            },
            connectionTimeout: 15000,
            greetingTimeout: 15000,
            socketTimeout: 30000,
            pool: false,
            maxConnections: 1
          }
        },
        {
          name: 'Gmail Simple Service',
          config: {
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
            tls: {
              rejectUnauthorized: false
            },
            pool: false
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

      // Try each configuration with retries
      for (const { name, config } of configs) {
        let attempts = 0;
        const maxAttempts = 3; // Increased to 3 attempts
        
        while (attempts < maxAttempts) {
          try {
            attempts++;
            console.log(`🔄 [${new Date().toISOString()}] Trying ${name} for email to ${to}... (Attempt ${attempts}/${maxAttempts})`);
            
            const testTransporter = nodemailer.createTransport(config);
            
            // Verify connection before sending (with timeout)
            try {
              const verifyPromise = testTransporter.verify();
              const verifyTimeout = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Verification timeout')), 10000)
              );
              await Promise.race([verifyPromise, verifyTimeout]);
              console.log(`✅ SMTP connection verified for ${name}`);
            } catch (verifyError) {
              const verifyMsg = verifyError instanceof Error ? verifyError.message : 'Unknown';
              console.log(`⚠️ SMTP verification failed for ${name}: ${verifyMsg}, but will try sending anyway`);
            }
            
            // Set a timeout for the email sending (30 seconds)
            const emailPromise = testTransporter.sendMail(mailOptions);
            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Email sending timeout after 30 seconds')), 30000)
            );

            const info = await Promise.race([emailPromise, timeoutPromise]) as any;
            console.log(`✅ [${new Date().toISOString()}] Email sent successfully using ${name}:`, info.messageId);
            
            // Close the connection
            try {
              testTransporter.close();
            } catch (closeError) {
              console.log('⚠️ Error closing transporter (non-critical)');
            }
            
            // Also log to file for backup
            this.logEmailToFile(to, subject, text, 'SENT', html, info.messageId);
            
            return info;
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            const errorStack = error instanceof Error ? error.stack : '';
            console.log(`❌ ${name} attempt ${attempts} failed:`, errorMessage);
            console.log(`   Error details:`, errorStack?.split('\n')[0]);
            lastError = error instanceof Error ? error : new Error('Unknown error');
            
            // Wait before retry (exponential backoff)
            if (attempts < maxAttempts) {
              const waitTime = attempts * 3000; // 3s, 6s, 9s
              console.log(`⏳ Waiting ${waitTime/1000} seconds before retry...`);
              await new Promise(resolve => setTimeout(resolve, waitTime));
            }
          }
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