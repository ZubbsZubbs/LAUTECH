const fetch = require('node-fetch');

async function testApplicationEmail() {
  try {
    console.log('🧪 Testing Application Status Email...');
    console.log('=====================================');

    // Test the application status update email
    const applicationData = {
      applicationNumber: 'LAUTECH-NUR-2025-796069-337',
      firstName: 'Mary',
      lastName: 'Linn',
      email: 'toadevs@gmail.com', // Send to your email for testing
      status: 'approved',
      program: 'BSc Nursing - 4 years',
      notes: 'Congratulations! Your application has been approved.'
    };

    // Test the notification service directly
    const notificationData = {
      email: applicationData.email,
      subject: `Application Status Update - ${applicationData.applicationNumber}`,
      text: `Dear ${applicationData.firstName} ${applicationData.lastName},\n\nYour application status has been updated to: ${applicationData.status}\n\nApplication Number: ${applicationData.applicationNumber}\nProgram: ${applicationData.program}\n\nBest regards,\nLAUTECH School of Nursing Admissions Team`,
      html: `
        <h2>Application Status Update</h2>
        <p>Dear ${applicationData.firstName} ${applicationData.lastName},</p>
        
        <h3>Application Details</h3>
        <p><strong>Application Number:</strong> ${applicationData.applicationNumber}</p>
        <p><strong>Status:</strong> ${applicationData.status}</p>
        <p><strong>Program:</strong> ${applicationData.program}</p>
        <p><strong>Updated:</strong> ${new Date().toLocaleDateString()}</p>
        <p><strong>Notes:</strong> ${applicationData.notes}</p>
        
        <p>If you have any questions, please contact us at nursing@lautech.edu.ng</p>
        
        <p>Best regards,<br>
        LAUTECH School of Nursing Admissions Team</p>
      `,
      type: 'application'
    };

    // Test the notification service endpoint
    const response = await fetch('http://localhost:9000/api/notifications/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notificationData)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Notification sent successfully');
      console.log('Response:', JSON.stringify(result, null, 2));
    } else {
      console.log('❌ Notification failed');
      const error = await response.text();
      console.log('Error:', error);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testApplicationEmail();
