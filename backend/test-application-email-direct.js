const { sendUnderReviewEmail, sendApprovalEmail, sendRejectionEmail, sendWaitlistEmail } = require('./dist/email/application_status_emails');

async function testApplicationEmails() {
  try {
    console.log('🧪 Testing Application Status Emails...');
    console.log('=====================================');

    const testApplication = {
      applicationNumber: 'LAUTECH-NUR-2025-TEST-001',
      firstName: 'Test',
      lastName: 'User',
      email: 'toadevs@gmail.com', // Send to your email for testing
      program: 'BSc Nursing - 4 years',
      submittedAt: new Date(),
      reviewedAt: new Date(),
      status: 'under_review',
      notes: 'This is a test application email.',
      admissionDecision: 'Test decision'
    };

    console.log('Testing Under Review Email...');
    await sendUnderReviewEmail(testApplication);
    console.log('✅ Under Review Email sent successfully');

    console.log('\nTesting Approval Email...');
    testApplication.status = 'approved';
    await sendApprovalEmail(testApplication);
    console.log('✅ Approval Email sent successfully');

    console.log('\nTesting Rejection Email...');
    testApplication.status = 'rejected';
    await sendRejectionEmail(testApplication);
    console.log('✅ Rejection Email sent successfully');

    console.log('\nTesting Waitlist Email...');
    testApplication.status = 'waitlisted';
    await sendWaitlistEmail(testApplication);
    console.log('✅ Waitlist Email sent successfully');

    console.log('\n🎉 All application status emails tested successfully!');
    console.log('📧 Check your email inbox for the test emails.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Full error:', error);
  }
}

testApplicationEmails();
