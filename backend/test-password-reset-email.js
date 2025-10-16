const { sendPasswordLink } = require('./dist/email/email.forgot_password');

async function testPasswordResetEmail() {
  try {
    console.log('🧪 Testing Password Reset Email...');
    console.log('=====================================');

    const testEmail = 'toadevs@gmail.com'; // Send to your email for testing
    const testToken = 'test-reset-token-12345';
    const resetLink = `http://localhost:3000/reset-password?token=${testToken}`;

    console.log('Sending password reset email...');
    console.log('To:', testEmail);
    console.log('Reset Link:', resetLink);

    await sendPasswordLink(testEmail, testEmail, resetLink);
    
    console.log('✅ Password reset email sent successfully!');
    console.log('📧 Check your email inbox for the password reset email.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Full error:', error);
  }
}

testPasswordResetEmail();
