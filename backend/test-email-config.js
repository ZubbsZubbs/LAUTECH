// Test email configuration
require('dotenv').config();

console.log('=== EMAIL CONFIGURATION TEST ===\n');

console.log('Environment Variables Check:');
console.log('✓ EMAIL_USER:', process.env.EMAIL_USER ? '✅ SET' : '❌ NOT SET');
console.log('✓ EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ SET' : '❌ NOT SET');
console.log('✓ EMAIL_FROM:', process.env.EMAIL_FROM || 'Not set (will use EMAIL_USER)');
console.log('✓ FRONTEND_URL:', process.env.FRONTEND_URL || 'Not set (will use fallback)');

console.log('\n=== Testing Email Service ===\n');

const nodemailer = require('nodemailer');

async function testEmail() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('❌ ERROR: EMAIL_USER and EMAIL_PASS must be set in .env file');
    console.log('\nPlease add to your .env file:');
    console.log('EMAIL_USER=your-email@gmail.com');
    console.log('EMAIL_PASS=your-app-password');
    return;
  }

  console.log('Creating email transporter...');
  
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
    }
  });

  console.log('Testing SMTP connection...');
  
  try {
    await transporter.verify();
    console.log('✅ SMTP connection successful!');
    
    console.log('\nSending test email...');
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to yourself
      subject: 'Test Email from LAUTECH Backend',
      text: 'This is a test email to verify email configuration is working.',
      html: '<h2>Test Email</h2><p>This is a test email to verify email configuration is working.</p>'
    });
    
    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('\nCheck your inbox:', process.env.EMAIL_USER);
    
  } catch (error) {
    console.log('❌ Email test failed:');
    console.log('Error:', error.message);
    
    if (error.message.includes('Invalid login')) {
      console.log('\n💡 TIP: Make sure you are using a Gmail App Password, not your regular password');
      console.log('   1. Enable 2FA on your Gmail account');
      console.log('   2. Go to: https://myaccount.google.com/apppasswords');
      console.log('   3. Generate an App Password for "Mail"');
      console.log('   4. Use that password in EMAIL_PASS');
    }
  }
}

testEmail();

