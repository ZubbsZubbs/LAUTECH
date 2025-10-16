const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/lautech-hospital');

// Import the Doctor model
const Doctor = require('./dist/models/Doctor').default;

async function cleanupInvalidImages() {
  try {
    console.log('Starting cleanup of invalid images...');
    
    // Get all doctors
    const doctors = await Doctor.find({});
    console.log(`Found ${doctors.length} doctors`);
    
    const uploadsDir = path.join(__dirname, 'uploads');
    
    for (const doctor of doctors) {
      if (doctor.image && doctor.image.startsWith('/uploads/')) {
        const filename = path.basename(doctor.image);
        const filePath = path.join(uploadsDir, filename);
        
        // Check if file exists
        if (!fs.existsSync(filePath)) {
          console.log(`❌ File not found for ${doctor.name}: ${filename}`);
          console.log(`   Removing invalid image path: ${doctor.image}`);
          
          // Remove the invalid image path
          doctor.image = '';
          await doctor.save();
          console.log(`✅ Updated ${doctor.name} - removed invalid image path`);
        } else {
          console.log(`✅ ${doctor.name} - image file exists: ${filename}`);
        }
      } else if (doctor.image && doctor.image.startsWith('http')) {
        console.log(`✅ ${doctor.name} - external image URL: ${doctor.image.substring(0, 50)}...`);
      } else {
        console.log(`ℹ️  ${doctor.name} - no image`);
      }
    }
    
    console.log('✅ Cleanup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    process.exit(1);
  }
}

cleanupInvalidImages();






