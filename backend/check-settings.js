// Quick script to check settings in database
const mongoose = require('mongoose');
const Settings = require('./models/Settings');

// Connect to MongoDB
async function checkSettings() {
  try {
    // Connect to your MongoDB database
    await mongoose.connect('mongodb://localhost:27017/lautech_hospital', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB');
    
    // Find all settings
    const allSettings = await Settings.find({});
    console.log('\n📊 All Settings in Database:');
    console.log('========================');
    
    allSettings.forEach((setting, index) => {
      console.log(`\n${index + 1}. User ID: ${setting.userId}`);
      console.log('   Notifications:', JSON.stringify(setting.notifications, null, 2));
      console.log('   Last Updated:', setting.updatedAt);
    });
    
    if (allSettings.length === 0) {
      console.log('❌ No settings found in database');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

checkSettings();






