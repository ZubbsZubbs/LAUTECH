import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || process.env.DB_URL || 'mongodb://localhost:27017/lautech-hospital';
    
    // Add connection options to prevent timeouts
    const options = {
      serverSelectionTimeoutMS: 30000, // 30 seconds
      socketTimeoutMS: 45000, // 45 seconds
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 30000,
      retryWrites: true
    };
    
    await mongoose.connect(mongoURI, options);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.log('Server will continue without database connection. Please install MongoDB or configure MONGODB_URI environment variable.');
    // Don't exit the process, let the server start without database
  }
};

export { connectDB }; 