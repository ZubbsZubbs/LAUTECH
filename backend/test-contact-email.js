const fetch = require('node-fetch');

async function testContactForm() {
  try {
    console.log('🧪 Testing Contact Form Email...');
    console.log('=====================================');

    const contactData = {
      name: 'Test User',
      email: 'test@example.com',
      message: 'This is a test contact form submission to verify email functionality.',
      subject: 'Test Contact Form'
    };

    const response = await fetch('http://localhost:9000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData)
    });

    const result = await response.json();
    
    console.log('Response Status:', response.status);
    console.log('Response:', JSON.stringify(result, null, 2));
    
    if (response.ok) {
      console.log('✅ Contact form submitted successfully');
      console.log('📧 Check the logs directory for email logs');
    } else {
      console.log('❌ Contact form submission failed');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testContactForm();
