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
// ⚠️ TEMPORARILY DISABLED FOR TESTING - RE-ENABLE IN PRODUCTION
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // ⚠️ INCREASED FOR TESTING - Original was 5
    message: {
        success: false,
        message: "Too many authentication attempts, please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false,
});
// ⚠️ TEMPORARILY DISABLED FOR TESTING - RE-ENABLE IN PRODUCTION
const strictAuthLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // ⚠️ INCREASED FOR TESTING - Original was 3
    message: {
        success: false,
        message: "Too many login attempts, please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false,
});
// ⚠️ TEMPORARILY DISABLED FOR TESTING - RE-ENABLE IN PRODUCTION
const passwordResetLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // ⚠️ INCREASED FOR TESTING - Original was 3
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
