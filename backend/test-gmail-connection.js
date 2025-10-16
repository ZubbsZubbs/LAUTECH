const nodemailer = require('nodemailer');
require('dotenv').config();

console.log('🔍 Gmail Connection Test');
console.log('========================');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 'NOT SET');
console.log('EMAIL_FROM:', process.env.EMAIL_FROM);
console.log('========================');

async function testGmailConnection() {
  // Test 1: Simple Gmail service
  console.log('\n🧪 Test 1: Simple Gmail Service');
  try {
    const transporter1 = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      }
    });
    
    await transporter1.verify();
    console.log('✅ Simple Gmail service works!');
    
    // Try to send a test email
    const info = await transporter1.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to self
      subject: 'Gmail Test - Simple Service',
      text: 'This is a test email using simple Gmail service.',
      html: '<h2>Gmail Test</h2><p>This is a test email using simple Gmail service.</p>'
    });
    
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    return true;
    
  } catch (error) {
    console.log('❌ Simple Gmail service failed:', error.message);
  }

  // Test 2: SMTP with different ports
  console.log('\n🧪 Test 2: SMTP Port 587');
  try {
    const transporter2 = nodemailer.createTransport({
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
    
    await transporter2.verify();
    console.log('✅ SMTP 587 works!');
    
    const info = await transporter2.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'Gmail Test - SMTP 587',
      text: 'This is a test email using SMTP port 587.',
      html: '<h2>Gmail Test</h2><p>This is a test email using SMTP port 587.</p>'
    });
    
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    return true;
    
  } catch (error) {
    console.log('❌ SMTP 587 failed:', error.message);
  }

  // Test 3: SMTP with port 465
  console.log('\n🧪 Test 3: SMTP Port 465');
  try {
    const transporter3 = nodemailer.createTransport({
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
    });
    
    await transporter3.verify();
    console.log('✅ SMTP 465 works!');
    
    const info = await transporter3.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'Gmail Test - SMTP 465',
      text: 'This is a test email using SMTP port 465.',
      html: '<h2>Gmail Test</h2><p>This is a test email using SMTP port 465.</p>'
    });
    
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    return true;
    
  } catch (error) {
    console.log('❌ SMTP 465 failed:', error.message);
  }

  console.log('\n❌ All Gmail configurations failed');
  console.log('\n🔧 Troubleshooting suggestions:');
  console.log('1. Check if 2-Factor Authentication is enabled on Gmail');
  console.log('2. Generate a new App Password');
  console.log('3. Check if your network blocks SMTP ports');
  console.log('4. Try from a different network');
  console.log('5. Check Gmail security settings');
  
  return false;
}

testGmailConnection();
