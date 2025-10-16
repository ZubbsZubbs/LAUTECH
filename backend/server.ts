import app from './app';
import { connectDB } from './config/database';

const PORT = process.env.PORT || 9000;

const startServer = async () => {
  try {
    // Initialize database connection
    await connectDB();

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();