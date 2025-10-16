require('dotenv').config();
const EmailService = require('./dist/email/email.service').default;

async function testDirectEmail() {
  try {
    console.log('🧪 Testing Direct Email Service...');
    console.log('=====================================');
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'SET' : 'NOT SET');
    console.log('EMAIL_FROM:', process.env.EMAIL_FROM);
    console.log('=====================================');

    const testEmail = {
      to: 'toadevs@gmail.com', // Send to your email
      subject: 'LAUTECH Email Service Test - Direct',
      text: 'This is a direct test of the LAUTECH email service.',
      html: `
        <h2>LAUTECH Email Service Test</h2>
        <p>This is a direct test of the LAUTECH email service.</p>
        <p><strong>Time:</strong> ${new Date().toISOString()}</p>
        <p><strong>Status:</strong> Testing direct email service</p>
        <p>If you receive this email, the service is working!</p>
      `
    };

    console.log('📧 Sending test email...');
    const result = await EmailService.sendEmail(
      testEmail.to,
      testEmail.subject,
      testEmail.text,
      testEmail.html
    );

    console.log('✅ Email service result:');
    console.log('Message ID:', result.messageId);
    console.log('Accepted:', result.accepted);
    console.log('Rejected:', result.rejected);
    console.log('Response:', result.response);

  } catch (error) {
    console.error('❌ Direct email test failed:', error.message);
  }
}

testDirectEmail();
