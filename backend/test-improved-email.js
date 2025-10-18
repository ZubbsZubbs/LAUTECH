// Test the improved email service
require('dotenv').config();

console.log('=== TESTING IMPROVED EMAIL SERVICE ===\n');

async function testImprovedEmail() {
  // Import the compiled email service
  const EmailService = require('./dist/email/email.service').default;
  
  console.log('Testing email service with multiple configurations and retries...\n');
  
  try {
    const result = await EmailService.sendEmail(
      process.env.EMAIL_USER,
      'Test Email from LAUTECH - Improved Service',
      'This is a test email using the improved email service with multiple configurations and retries.',
      '<h2>Test Email</h2><p>This is a test email using the improved email service with <strong>multiple configurations and retries</strong>.</p>'
    );
    
    console.log('\n✅ SUCCESS! Email sent:');
    console.log('Message ID:', result.messageId);
    console.log('Response:', result.response);
    console.log('\nCheck your inbox:', process.env.EMAIL_USER);
    
  } catch (error) {
    console.log('\n❌ FAILED:');
    console.log('Error:', error.message);
    console.log('\nThis error suggests one of the following:');
    console.log('1. Gmail App Password is incorrect');
    console.log('2. Network/Firewall is blocking SMTP connections');
    console.log('3. Gmail account has security restrictions');
    console.log('\nSolutions:');
    console.log('- Verify App Password: https://myaccount.google.com/apppasswords');
    console.log('- Check if "Less secure app access" is enabled (if using regular password)');
    console.log('- Try from a different network');
    console.log('- Check backend/logs/emails.log for detailed logs');
  }
}

testImprovedEmail();

