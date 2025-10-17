// Settings Testing Script
// Run with: node test-settings.js

const API_BASE_URL = 'https://lautech-edu-ng.onrender.com/api';

// Test configuration
const TEST_CONFIG = {
  userId: 'YOUR_USER_ID_HERE', // Replace with actual user ID
  authToken: 'YOUR_AUTH_TOKEN_HERE', // Replace with actual token
  baseUrl: API_BASE_URL
};

// Test notification settings
const testNotificationSettings = {
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: true,
  appointmentReminders: true,
  emergencyAlerts: true,
  systemUpdates: false,
  weeklyReports: true,
  monthlyReports: false
};

async function testSettingsAPI() {
  console.log('🧪 Starting Settings API Tests...\n');

  try {
    // Test 1: Get current settings
    console.log('1️⃣ Testing GET settings...');
    const getResponse = await fetch(`${TEST_CONFIG.baseUrl}/settings/${TEST_CONFIG.userId}`, {
      headers: {
        'Authorization': `Bearer ${TEST_CONFIG.authToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (getResponse.ok) {
      const settings = await getResponse.json();
      console.log('✅ GET settings successful');
      console.log('📊 Current notification settings:', settings.data?.notifications);
    } else {
      console.log('❌ GET settings failed:', getResponse.status, getResponse.statusText);
    }

    // Test 2: Update notification settings
    console.log('\n2️⃣ Testing PUT notification settings...');
    const putResponse = await fetch(`${TEST_CONFIG.baseUrl}/settings/${TEST_CONFIG.userId}/notifications`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${TEST_CONFIG.authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testNotificationSettings)
    });

    if (putResponse.ok) {
      const result = await putResponse.json();
      console.log('✅ PUT notification settings successful');
      console.log('📊 Updated settings:', result.data?.notifications);
    } else {
      console.log('❌ PUT notification settings failed:', putResponse.status, putResponse.statusText);
    }

    // Test 3: Verify changes were saved
    console.log('\n3️⃣ Verifying changes were saved...');
    const verifyResponse = await fetch(`${TEST_CONFIG.baseUrl}/settings/${TEST_CONFIG.userId}`, {
      headers: {
        'Authorization': `Bearer ${TEST_CONFIG.authToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (verifyResponse.ok) {
      const settings = await verifyResponse.json();
      const savedNotifications = settings.data?.notifications;
      
      // Compare with what we sent
      const matches = Object.keys(testNotificationSettings).every(key => 
        savedNotifications[key] === testNotificationSettings[key]
      );
      
      if (matches) {
        console.log('✅ Settings verification successful - all changes saved correctly');
      } else {
        console.log('❌ Settings verification failed - changes not saved correctly');
        console.log('Expected:', testNotificationSettings);
        console.log('Actual:', savedNotifications);
      }
    } else {
      console.log('❌ Verification failed:', verifyResponse.status, verifyResponse.statusText);
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }

  console.log('\n🏁 Settings API tests completed!');
}

// Test error scenarios
async function testErrorScenarios() {
  console.log('\n🚨 Testing Error Scenarios...\n');

  try {
    // Test without auth token
    console.log('1️⃣ Testing without auth token...');
    const noAuthResponse = await fetch(`${TEST_CONFIG.baseUrl}/settings/${TEST_CONFIG.userId}/notifications`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testNotificationSettings)
    });
    
    if (noAuthResponse.status === 401) {
      console.log('✅ Unauthorized access properly blocked');
    } else {
      console.log('❌ Unauthorized access not properly handled');
    }

    // Test with invalid user ID
    console.log('\n2️⃣ Testing with invalid user ID...');
    const invalidUserResponse = await fetch(`${TEST_CONFIG.baseUrl}/settings/invalid_user/notifications`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${TEST_CONFIG.authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testNotificationSettings)
    });
    
    console.log('Invalid user response status:', invalidUserResponse.status);

  } catch (error) {
    console.error('❌ Error scenario test failed:', error.message);
  }
}

// Run tests
async function runAllTests() {
  console.log('🚀 Starting Complete Settings Test Suite\n');
  console.log('⚠️  Make sure to update TEST_CONFIG with your actual user ID and auth token!\n');
  
  await testSettingsAPI();
  await testErrorScenarios();
  
  console.log('\n✨ All tests completed!');
}

// Export for use in other files
module.exports = {
  testSettingsAPI,
  testErrorScenarios,
  runAllTests
};

// Run if called directly
if (require.main === module) {
  runAllTests();
}






