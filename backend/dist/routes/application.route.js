"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const application_controller_1 = require("../controllers/application.controller");
// Simple middleware for now - we'll implement proper auth later
const requireAuth = (req, res, next) => {
    // For now, just pass through - we'll add proper auth later
    next();
};
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const router = (0, express_1.Router)();
// Ensure uploads directory exists
const uploadsDir = 'uploads/applications/';
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
// Configure multer for file uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        console.log('Multer fileFilter - File:', file.fieldname, file.originalname, file.mimetype);
        if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
            cb(null, true);
        }
        else {
            cb(new Error('Only images and PDF files are allowed'));
        }
    }
});
// Public routes
router.post('/nursing', (req, res, next) => {
    console.log('Before multer - Content-Type:', req.get('Content-Type'));
    console.log('Before multer - Request body:', req.body);
    next();
}, upload.fields([
    { name: 'passportPhoto', maxCount: 1 },
    { name: 'olevelCertificate', maxCount: 1 },
    { name: 'jambResult', maxCount: 1 },
    { name: 'birthCertificate', maxCount: 1 },
    { name: 'medicalReport', maxCount: 1 }
]), (req, res, next) => {
    console.log('After multer - Request body:', req.body);
    console.log('After multer - Request files:', req.files);
    next();
}, application_controller_1.createNursingApplication);
// Student routes
router.get('/student', application_controller_1.getStudentApplications);
// Public routes for stats (for reports)
router.get('/stats', application_controller_1.getApplicationStats);
// Protected routes (Admin only) - simplified for now
router.get('/', requireAuth, application_controller_1.getAllApplications);
router.put('/:id/status', requireAuth, application_controller_1.updateApplicationStatus);
router.put('/:id/start-review', requireAuth, application_controller_1.startApplicationReview);
router.get('/:id', requireAuth, application_controller_1.getApplicationById);
exports.default = router;
