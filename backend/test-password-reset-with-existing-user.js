const fetch = require('node-fetch');

async function testPasswordResetWithExistingUser() {
  try {
    console.log('🧪 Testing Password Reset with Existing User...');
    console.log('==============================================');

    // First, let's try to create a test user or use an existing one
    console.log('Step 1: Creating/checking test user...');
    
    const testUser = {
      firstName: 'Test',
      lastName: 'User',
      email: 'testuser@example.com',
      password: 'TestPassword123!',
      role: 'user'
    };

    // Try to register the user first
    try {
      const registerResponse = await fetch('https://lautech-edu-ng.onrender.com/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testUser),
      });

      const registerData = await registerResponse.json();
      console.log('Register Response:', registerData);
      
      if (registerData.success) {
        console.log('✅ Test user created successfully');
      } else if (registerData.message && registerData.message.includes('already exists')) {
        console.log('✅ Test user already exists');
      } else {
        console.log('⚠️ User creation failed, but continuing with test...');
      }
    } catch (error) {
      console.log('⚠️ User creation failed:', error.message);
    }

    // Step 2: Request password reset for the test user
    console.log('\nStep 2: Requesting password reset...');
    const forgotPasswordResponse = await fetch('https://lautech-edu-ng.onrender.com/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: testUser.email }),
    });

    const forgotPasswordData = await forgotPasswordResponse.json();
    console.log('Forgot Password Response:', forgotPasswordData);

    if (forgotPasswordData.success) {
      console.log('✅ Password reset email sent successfully');
      console.log('📧 Check your email for the reset link');
      console.log('🔗 The reset link should now work and take you to the reset password page');
      console.log('\n📝 Test the complete flow:');
      console.log('1. Check your email inbox for the password reset email');
      console.log('2. Click the reset link in the email');
      console.log('3. You should be taken to: http://localhost:3000/reset-password?token=YOUR_TOKEN');
      console.log('4. Enter a new password and submit');
      console.log('5. You should be redirected to the login page');
    } else {
      console.log('❌ Failed to send password reset email:', forgotPasswordData.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testPasswordResetWithExistingUser();
