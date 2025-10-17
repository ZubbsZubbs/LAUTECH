// Send a fresh password reset email
async function sendFreshReset() {
  try {
    console.log('📧 Sending Fresh Password Reset Email...');
    console.log('========================================');

    const response = await fetch('https://lautech-edu-ng.onrender.com/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email: 'quotesbible99@gmail.com' 
      }),
    });

    const data = await response.json();
    console.log('Response:', data);

    if (data.success) {
      console.log('✅ Fresh password reset email sent!');
      console.log('📧 Check your email for the new reset link.');
      console.log('');
      console.log('🔗 The new reset link will be:');
      console.log('http://localhost:3000/auth/login?token=NEW_TOKEN_HERE');
      console.log('');
      console.log('📝 This link will:');
      console.log('1. Take you to the login page');
      console.log('2. Automatically open the Forgot Password modal');
      console.log('3. Pre-fill the token field');
      console.log('4. Allow you to enter your new password');
    } else {
      console.log('❌ Failed:', data.message);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

sendFreshReset();
