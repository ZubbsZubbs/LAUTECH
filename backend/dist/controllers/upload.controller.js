"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImage = exports.uploadMultipleImages = exports.uploadImage = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const customError_1 = __importDefault(require("../utils/customError"));
// Configure multer for image uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path_1.default.join(__dirname, '../uploads');
        // Ensure uploads directory exists
        if (!fs_1.default.existsSync(uploadPath)) {
            fs_1.default.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Generate unique filename with timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path_1.default.extname(file.originalname);
        cb(null, `doctor-${uniqueSuffix}${fileExtension}`);
    }
});
// File filter for images only
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    }
    else {
        cb(new customError_1.default('Only image files are allowed', 400));
    }
};
// Configure multer
exports.upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});
// Upload single image
exports.uploadImage = (0, asyncHandler_1.default)(async (req, res) => {
    if (!req.file) {
        throw new customError_1.default('No image file provided', 400);
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
exports.uploadMultipleImages = (0, asyncHandler_1.default)(async (req, res) => {
    if (!req.files || req.files.length === 0) {
        throw new customError_1.default('No image files provided', 400);
    }
    const files = req.files;
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
exports.deleteImage = (0, asyncHandler_1.default)(async (req, res) => {
    const { filename } = req.params;
    if (!filename) {
        throw new customError_1.default('Filename is required', 400);
    }
    const filePath = path_1.default.join(__dirname, '../uploads', filename);
    // Check if file exists
    if (!fs_1.default.existsSync(filePath)) {
        throw new customError_1.default('Image not found', 404);
    }
    // Delete the file
    fs_1.default.unlinkSync(filePath);
    res.status(200).json({
        success: true,
        message: 'Image deleted successfully'
    });
});
