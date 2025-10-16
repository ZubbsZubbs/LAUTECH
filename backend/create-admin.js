const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./dist/models/User.js').default;
const dotenv = require('dotenv');

dotenv.config();

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lautech-hospital');
    console.log('Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@lautech.edu.ng' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = new User({
      email: 'admin@lautech.edu.ng',
      firstName: 'Admin',
      lastName: 'User',
      password: hashedPassword,
      role: 'ADMIN',
      verified: true
    });

    await adminUser.save();
    console.log('Admin user created successfully:');
    console.log('Email: admin@lautech.edu.ng');
    console.log('Password: admin123');
    console.log('Role: ADMIN');

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

createAdminUser();
