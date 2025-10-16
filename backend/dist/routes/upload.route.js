"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const upload_controller_1 = require("../controllers/upload.controller");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const router = express_1.default.Router();
// Rate limiting for uploads
const uploadLimiter = (0, express_rate_limit_1.default)({
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
router.post('/single', uploadLimiter, upload_controller_1.upload.single('image'), upload_controller_1.uploadImage);
router.post('/multiple', uploadLimiter, upload_controller_1.upload.array('images', 5), upload_controller_1.uploadMultipleImages);
router.delete('/:filename', upload_controller_1.deleteImage);
exports.default = router;
