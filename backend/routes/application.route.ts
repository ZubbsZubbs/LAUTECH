import { Router } from 'express';
import {
  createNursingApplication,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  getApplicationStats,
  getStudentApplications,
  startApplicationReview
} from '../controllers/application.controller';
// Simple middleware for now - we'll implement proper auth later
const requireAuth = (req: any, res: any, next: any) => {
  // For now, just pass through - we'll add proper auth later
  next();
};
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

// Ensure uploads directory exists
const uploadsDir = 'uploads/applications/';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    cb(null, uploadsDir);
  },
  filename: (req: any, file: any, cb: any) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req: any, file: any, cb: any) => {
    console.log('Multer fileFilter - File:', file.fieldname, file.originalname, file.mimetype);
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only images and PDF files are allowed'));
    }
  }
});

// Public routes
router.post('/nursing', (req: any, res: any, next: any) => {
  console.log('Before multer - Content-Type:', req.get('Content-Type'));
  console.log('Before multer - Request body:', req.body);
  next();
}, upload.fields([
  { name: 'passportPhoto', maxCount: 1 },
  { name: 'olevelCertificate', maxCount: 1 },
  { name: 'jambResult', maxCount: 1 },
  { name: 'birthCertificate', maxCount: 1 },
  { name: 'medicalReport', maxCount: 1 }
]), (req: any, res: any, next: any) => {
  console.log('After multer - Request body:', req.body);
  console.log('After multer - Request files:', req.files);
  next();
}, createNursingApplication as any);

// Student routes
router.get('/student', getStudentApplications as any);

// Public routes for stats (for reports)
router.get('/stats', getApplicationStats);

// Protected routes (Admin only) - simplified for now
router.get('/', requireAuth, getAllApplications);
router.put('/:id/status', requireAuth, updateApplicationStatus);
router.put('/:id/start-review', requireAuth, startApplicationReview);
router.get('/:id', requireAuth, getApplicationById);

export default router;
