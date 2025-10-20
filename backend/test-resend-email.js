const { Resend } = require('resend');
require('dotenv').config();

async function testResendEmail() {
  console.log('🧪 Testing Resend Email Service...');
  
  // Check if Resend API key is configured
  if (!process.env.RESEND_API_KEY) {
    console.log('❌ RESEND_API_KEY not found in environment variables');
    console.log('Please add RESEND_API_KEY to your .env file or environment');
    return;
  }

  console.log('✅ RESEND_API_KEY found');
  
  const resend = new Resend(process.env.RESEND_API_KEY);
  
  try {
    console.log('📧 Sending test email...');
    
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'LAUTECH Teaching Hospital <noreply@lautech.edu.ng>',
      to: ['toadevs@gmail.com'],
      subject: 'Test Email from LAUTECH Hospital',
      html: `
        <h2>Test Email</h2>
        <p>This is a test email from the LAUTECH Teaching Hospital system.</p>
        <p>If you receive this, the Resend integration is working correctly!</p>
        <hr>
        <p><em>Sent at: ${new Date().toISOString()}</em></p>
      `,
    });

    if (error) {
      console.error('❌ Resend email failed:', error);
      return;
    }

    console.log('✅ Email sent successfully!');
    console.log('📧 Email ID:', data.id);
    console.log('📧 To:', 'toadevs@gmail.com');
    console.log('📧 Subject: Test Email from LAUTECH Hospital');
    
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
  }
}

testResendEmail();
