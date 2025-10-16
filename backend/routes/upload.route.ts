import express from 'express';
import { upload, uploadImage, uploadMultipleImages, deleteImage } from '../controllers/upload.controller';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiting for uploads
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 upload requests per windowMs
  message: {
    success: false,
    message: "Too many upload requests, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Upload routes
router.post('/single', uploadLimiter, upload.single('image'), uploadImage);
router.post('/multiple', uploadLimiter, upload.array('images', 5), uploadMultipleImages);
router.delete('/:filename', deleteImage);

export default router;
