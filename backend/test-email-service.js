const nodemailer = require('nodemailer');
require('dotenv').config();

console.log('📧 Testing Email Service Configuration...');
console.log('=====================================');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'SET (hidden)' : 'NOT SET');
console.log('EMAIL_FROM:', process.env.EMAIL_FROM);
console.log('=====================================');

async function testEmailService() {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      },
      connectionTimeout: 30000, // 30 seconds
      greetingTimeout: 15000, // 15 seconds
      socketTimeout: 30000, // 30 seconds
    });

    console.log('✅ Transporter created successfully');

    // Test connection
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully');

    // Send test email
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to self for testing
      subject: 'LAUTECH Email Service Test',
      text: 'This is a test email from LAUTECH Teaching Hospital email service.',
      html: `
        <h2>LAUTECH Email Service Test</h2>
        <p>This is a test email from LAUTECH Teaching Hospital email service.</p>
        <p><strong>Time:</strong> ${new Date().toISOString()}</p>
        <p><strong>Status:</strong> Email service is working correctly!</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Accepted:', info.accepted);
    console.log('Rejected:', info.rejected);

  } catch (error) {
    console.error('❌ Email service test failed:');
    console.error('Error:', error.message);
    
    if (error.code === 'EAUTH') {
      console.error('🔐 Authentication failed. Please check:');
      console.error('1. EMAIL_USER is correct');
      console.error('2. EMAIL_PASS is correct (use App Password, not regular password)');
      console.error('3. 2-Factor Authentication is enabled on Gmail');
      console.error('4. App Password is generated correctly');
    } else if (error.code === 'ECONNECTION') {
      console.error('🌐 Connection failed. Please check:');
      console.error('1. Internet connection');
      console.error('2. Gmail SMTP settings');
      console.error('3. Firewall settings');
    }
  }
}

testEmailService();
