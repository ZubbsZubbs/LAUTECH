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
import departmentRoutes from './routes/department.route';
import uploadRoutes from './routes/upload.route';
import settingsRoutes from './routes/settings.route';

import { errorHandler } from './middleware/error_handler.middleware';
import path from 'path';
import fs from 'fs';

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.DOMAIN_FIREBASE_API_KEY,
  authDomain: process.env.DOMAIN_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.DOMAIN_FIREBASE_PROJECT_ID,
};

initializeApp(firebaseConfig);

const app = express();

const corsOptions = {
  origin: (origin: any, callback: any) => {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000', 
      'http://localhost:3001', 
      'http://localhost:3002',
      process.env.FRONTEND_URL,
      'https://lautech-edu-ng.onrender.com'
    ].filter(Boolean);
    
    // Allow any origin that includes lautech or is localhost
    if (allowedOrigins.indexOf(origin) !== -1 || 
        origin.includes('localhost') || 
        origin.includes('lautech') ||
        origin.includes('vercel.app') ||
        origin.includes('netlify.app') ||
        origin.includes('render.com')) {
      callback(null, true);
    } else {
      callback(null, true); // For now, allow all origins in production
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Disposition']
};

app.use(cors(corsOptions));
app.use('/public', express.static(path.join(__dirname, 'public')));
// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:", "https://lautech-edu-ng.onrender.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      scriptSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
}));
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
app.use('/api/departments', departmentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/settings', settingsRoutes);

// Serve uploaded files with proper headers
// Try multiple possible upload directories (for development and production)
const uploadsPaths = [
  path.join(__dirname, 'uploads'),           // When running from dist/
  path.join(__dirname, '..', 'uploads'),     // When running from dist/ (go up one level)
  path.join(process.cwd(), 'uploads'),       // From project root
  path.join(process.cwd(), 'backend', 'uploads') // From project root with backend folder
];

// Find the first existing uploads directory
let uploadsPath = uploadsPaths[0];
for (const testPath of uploadsPaths) {
  if (fs.existsSync(testPath)) {
    uploadsPath = testPath;
    console.log('✅ Found uploads directory at:', uploadsPath);
    break;
  }
}

console.log('📁 Using uploads directory:', uploadsPath);
console.log('📁 Current __dirname:', __dirname);
console.log('📁 Current process.cwd():', process.cwd());

app.use('/uploads', (req, res, next) => {
  console.log('📁 Upload request:', {
    url: req.url,
    path: req.path,
    fullPath: path.join(uploadsPath, req.path)
  });
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  res.header('Cross-Origin-Embedder-Policy', 'unsafe-none');
  res.header('Cache-Control', 'public, max-age=31536000');
  next();
}, express.static(uploadsPath, {
  setHeaders: (res, filePath) => {
    console.log('📄 Serving file:', filePath);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
  }
}));

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

// Email diagnostic endpoint (quick check - no actual email sent)
app.get('/test-email-config', (req, res) => {
  try {
    const diagnostics = {
      emailConfigured: !!(process.env.EMAIL_USER && process.env.EMAIL_PASS),
      emailUser: process.env.EMAIL_USER ? '✅ SET' : '❌ NOT SET',
      emailUserValue: process.env.EMAIL_USER || 'NOT SET',
      emailPass: process.env.EMAIL_PASS ? '✅ SET (length: ' + process.env.EMAIL_PASS?.length + ')' : '❌ NOT SET',
      emailFrom: process.env.EMAIL_FROM || 'Not set',
      frontendUrl: process.env.FRONTEND_URL || 'Not set',
      nodeEnv: process.env.NODE_ENV || 'Not set'
    };
    
    res.json(diagnostics);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Email diagnostic endpoint with actual send (use ?send=true to test)
app.get('/test-email', async (req, res) => {
  try {
    const sendTest = req.query.send === 'true';
    
    const diagnostics = {
      emailConfigured: !!(process.env.EMAIL_USER && process.env.EMAIL_PASS),
      emailUser: process.env.EMAIL_USER ? '✅ SET' : '❌ NOT SET',
      emailPass: process.env.EMAIL_PASS ? '✅ SET (hidden)' : '❌ NOT SET',
      emailFrom: process.env.EMAIL_FROM || 'Not set',
      testResult: null as any
    };
    
    // Only send test email if explicitly requested
    if (sendTest && diagnostics.emailConfigured) {
      const EmailService = require('./email/email.service').default;
      
      // Set a timeout to prevent hanging
      const emailPromise = EmailService.sendEmail(
        process.env.EMAIL_USER,
        'Test Email from Live Server',
        'This is a test email to verify email configuration on production.',
        '<h2>Test Email</h2><p>This is a test email to verify email configuration on production.</p>'
      );
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Email test timeout after 10 seconds')), 10000)
      );
      
      try {
        const result = await Promise.race([emailPromise, timeoutPromise]) as any;
        diagnostics.testResult = {
          status: 'SUCCESS',
          messageId: result.messageId,
          response: result.response
        };
      } catch (emailError) {
        diagnostics.testResult = {
          status: 'FAILED',
          error: emailError instanceof Error ? emailError.message : 'Unknown error'
        };
      }
    } else if (!sendTest) {
      diagnostics.testResult = {
        status: 'NOT_TESTED',
        message: 'Add ?send=true to URL to actually send test email'
      };
    } else {
      diagnostics.testResult = {
        status: 'SKIPPED',
        reason: 'Email credentials not configured'
      };
    }
    
    res.json(diagnostics);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Uploads directory diagnostic endpoint
app.get('/test-uploads', (req, res) => {
  const testFile = req.query.file as string || 'birthCertificate-1760282176496-60228965.pdf';
  const testPath = req.query.path as string || 'applications';
  
  const diagnostics = {
    requestedFile: testFile,
    requestedPath: testPath,
    __dirname: __dirname,
    processCwd: process.cwd(),
    uploadsPath: uploadsPath,
    possiblePaths: uploadsPaths,
    fileChecks: {} as any
  };
  
  // Check if file exists in various locations
  const possibleFilePaths = [
    path.join(uploadsPath, testPath, testFile),
    path.join(__dirname, 'uploads', testPath, testFile),
    path.join(__dirname, '..', 'uploads', testPath, testFile),
    path.join(process.cwd(), 'uploads', testPath, testFile),
    path.join(process.cwd(), 'backend', 'uploads', testPath, testFile)
  ];
  
  possibleFilePaths.forEach((filePath, index) => {
    diagnostics.fileChecks[`path${index + 1}`] = {
      path: filePath,
      exists: fs.existsSync(filePath),
      isFile: fs.existsSync(filePath) ? fs.statSync(filePath).isFile() : false
    };
  });
  
  // List files in uploads directory
  try {
    const uploadsDir = path.join(uploadsPath, testPath);
    if (fs.existsSync(uploadsDir)) {
      diagnostics.fileChecks.filesInDirectory = fs.readdirSync(uploadsDir).slice(0, 10); // First 10 files
    }
  } catch (error) {
    diagnostics.fileChecks.directoryError = error instanceof Error ? error.message : 'Unknown error';
  }
  
  res.json(diagnostics);
});

// Error handling
app.use(errorHandler);

export default app;