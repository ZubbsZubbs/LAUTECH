import mongoose from 'mongoose';
import Application from './models/Application.js';
import dotenv from 'dotenv';

dotenv.config();

const fixApplicationNumbers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lautech-hospital');
    console.log('Connected to MongoDB');

    // Find applications with null or missing applicationNumber
    const applicationsWithNullNumber = await Application.find({
      $or: [
        { applicationNumber: null },
        { applicationNumber: { $exists: false } }
      ]
    });

    console.log(`Found ${applicationsWithNullNumber.length} applications with null applicationNumber`);

    // Update each application with a unique application number
    for (let i = 0; i < applicationsWithNullNumber.length; i++) {
      const application = applicationsWithNullNumber[i];
      
      // Generate unique application number
      const year = new Date().getFullYear();
      const timestamp = Date.now() + i; // Add index to ensure uniqueness
      const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      const applicationNumber = `LAUTECH-NUR-${year}-${timestamp}-${randomNum}`;
      
      // Update the application
      await Application.findByIdAndUpdate(application._id, {
        applicationNumber: applicationNumber
      });
      
      console.log(`Updated application ${application._id} with number: ${applicationNumber}`);
    }

    console.log('All applications have been updated with unique application numbers');

  } catch (error) {
    console.error('Error fixing application numbers:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

fixApplicationNumbers();
