import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import asyncHandler from '../utils/asyncHandler';
import CustomError from '../utils/customError';

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
    // Ensure uploads directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    cb(null, `doctor-${uniqueSuffix}${fileExtension}`);
  }
});

// File filter for images only
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new CustomError('Only image files are allowed', 400));
  }
};

// Configure multer
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Upload single image
export const uploadImage = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    throw new CustomError('No image file provided', 400);
  }

  // Return the file path relative to the public directory
  const imagePath = `/uploads/${req.file.filename}`;
  
  res.status(200).json({
    success: true,
    message: 'Image uploaded successfully',
    data: {
      imagePath: imagePath,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    }
  });
});

// Upload multiple images
export const uploadMultipleImages = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
    throw new CustomError('No image files provided', 400);
  }

  const files = req.files as Express.Multer.File[];
  const imagePaths = files.map(file => ({
    imagePath: `/uploads/${file.filename}`,
    filename: file.filename,
    originalName: file.originalname,
    size: file.size
  }));
  
  res.status(200).json({
    success: true,
    message: 'Images uploaded successfully',
    data: {
      images: imagePaths
    }
  });
});

// Delete image
export const deleteImage = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { filename } = req.params;
  
  if (!filename) {
    throw new CustomError('Filename is required', 400);
  }

  const filePath = path.join(__dirname, '../uploads', filename);
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    throw new CustomError('Image not found', 404);
  }

  // Delete the file
  fs.unlinkSync(filePath);
  
  res.status(200).json({
    success: true,
    message: 'Image deleted successfully'
  });
});
