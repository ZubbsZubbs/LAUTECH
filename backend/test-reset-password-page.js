const fetch = require('node-fetch');

async function testResetPasswordPage() {
  try {
    console.log('🧪 Testing Reset Password Page...');
    console.log('=====================================');

    // Test 1: Check if the reset password page loads
    console.log('Testing reset password page accessibility...');
    
    const testUrl = 'http://localhost:3000/reset-password?token=test-token-123';
    
    try {
      const response = await fetch(testUrl);
      if (response.ok) {
        console.log('✅ Reset password page is accessible');
        console.log('Status:', response.status);
        console.log('URL:', testUrl);
      } else {
        console.log('❌ Reset password page returned error:', response.status);
      }
    } catch (error) {
      console.log('❌ Error accessing reset password page:', error.message);
    }

    // Test 2: Test password reset API endpoint
    console.log('\nTesting password reset API...');
    
    try {
      const response = await fetch('https://localhost:9000/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: 'invalid-token',
          newPassword: 'NewPassword123!'
        }),
      });

      const data = await response.json();
      console.log('API Response:', data);
      
      if (data.success === false) {
        console.log('✅ API correctly rejects invalid token');
      } else {
        console.log('❌ API should reject invalid token');
      }
    } catch (error) {
      console.log('❌ Error testing API:', error.message);
    }

    console.log('\n🎉 Reset password page tests completed!');
    console.log('📝 You can now test the full flow:');
    console.log('1. Go to http://localhost:3000/reset-password?token=test-token-123');
    console.log('2. Try to reset password with a valid token from email');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testResetPasswordPage();
