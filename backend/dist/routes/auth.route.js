"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const auth_controller_1 = require("../controllers/auth.controller");
const router = (0, express_1.Router)();
// Rate limiting for authentication endpoints
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: {
        success: false,
        message: "Too many authentication attempts, please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false,
});
const strictAuthLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // limit each IP to 3 requests per windowMs for login
    message: {
        success: false,
        message: "Too many login attempts, please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false,
});
const passwordResetLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // limit each IP to 3 password reset requests per 15 minutes
    message: {
        success: false,
        message: "Too many password reset attempts, please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false,
});
router.post("/signup", authLimiter, auth_controller_1.register);
router.post("/login", strictAuthLimiter, auth_controller_1.login);
router.post("/firebase-email-signin", authLimiter, auth_controller_1.firebaseEmailSignIn);
router.post("/create-admin", authLimiter, auth_controller_1.createAdmin);
router.post("/create-additional-admin", authLimiter, auth_controller_1.createAdditionalAdmin);
router.get("/profile", auth_controller_1.getProfile);
// Password reset routes
router.post("/forgot-password", passwordResetLimiter, auth_controller_1.forgotPassword);
router.post("/reset-password", passwordResetLimiter, auth_controller_1.resetPassword);
exports.default = router;
