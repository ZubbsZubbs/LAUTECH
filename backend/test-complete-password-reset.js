const fetch = require('node-fetch');

async function testCompletePasswordReset() {
  try {
    console.log('🧪 Testing Complete Password Reset Flow...');
    console.log('==========================================');

    // Step 1: Request password reset
    console.log('Step 1: Requesting password reset...');
    const forgotPasswordResponse = await fetch('https://lautech-edu-ng.onrender.com/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: 'toadevs@gmail.com' }),
    });

    const forgotPasswordData = await forgotPasswordResponse.json();
    console.log('Forgot Password Response:', forgotPasswordData);

    if (forgotPasswordData.success) {
      console.log('✅ Password reset email sent successfully');
      console.log('📧 Check your email for the reset link');
      console.log('🔗 The reset link should now work and take you to the reset password page');
    } else {
      console.log('❌ Failed to send password reset email:', forgotPasswordData.message);
    }

    console.log('\n📝 Next steps:');
    console.log('1. Check your email inbox for the password reset email');
    console.log('2. Click the reset link in the email');
    console.log('3. You should be taken to: http://localhost:3000/reset-password?token=YOUR_TOKEN');
    console.log('4. Enter a new password and submit');
    console.log('5. You should be redirected to the login page');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testCompletePasswordReset();
