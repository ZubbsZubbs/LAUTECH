import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { initializeApp } from "firebase/app";
import userRoutes from './routes/user.route';
import authRoutes from './routes/auth.route';
import contactRoutes from './routes/contact.route';
import applicationRoutes from './routes/application.route';
import appointmentRoutes from './routes/appointment.route';
import formsRoutes from './routes/forms.route';
import patientRoutes from './routes/patient.route';
import doctorRoutes from './routes/doctor.route';
import uploadRoutes from './routes/upload.route';
import settingsRoutes from './routes/settings.route';

import { errorHandler } from './middleware/error_handler.middleware';
import path from 'path';

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.DOMAIN_FIREBASE_API_KEY,
  authDomain: process.env.DOMAIN_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.DOMAIN_FIREBASE_PROJECT_ID,
};

initializeApp(firebaseConfig);

const app = express();

app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://localhost:3001', 
    'http://localhost:3002', 
    'http://localhost:3000/linkedin-callback',
    process.env.FRONTEND_URL || 'http://localhost:3000'
  ],
  credentials: true
}));
app.use('/public', express.static(path.join(__dirname, 'public')));
// Middleware
app.use(helmet());
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/forms', formsRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/settings', settingsRoutes);

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((req, res, next) => {
  console.log('Request received:', {
    method: req.method,
    path: req.path,
    originalUrl: req.originalUrl,
    baseUrl: req.baseUrl,
    url: req.url
  });
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Database test endpoint
app.get('/test-db', async (req, res) => {
  try {
    const User = require('./models/User').default;
    const userCount = await User.countDocuments().maxTimeMS(5000);
    res.json({ 
      status: 'OK', 
      database: 'Connected',
      userCount: userCount,
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      database: 'Connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString() 
    });
  }
});

// Error handling
app.use(errorHandler);

export default app;