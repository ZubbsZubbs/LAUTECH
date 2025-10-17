import { Router } from "express";
import rateLimit from "express-rate-limit";
import { register, login, firebaseEmailSignIn, createAdmin, createAdditionalAdmin, getProfile, forgotPassword, resetPassword } from "../controllers/auth.controller";

const router = Router();

// Rate limiting for authentication endpoints
// ⚠️ TEMPORARILY DISABLED FOR TESTING - RE-ENABLE IN PRODUCTION
const authLimiter = rateLimit({
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
const strictAuthLimiter = rateLimit({
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
const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // ⚠️ INCREASED FOR TESTING - Original was 3
  message: {
    success: false,
    message: "Too many password reset attempts, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/signup", authLimiter, register as any);
router.post("/login", strictAuthLimiter, login as any);
router.post("/firebase-email-signin", authLimiter, firebaseEmailSignIn as any);
router.post("/create-admin", authLimiter, createAdmin as any);
router.post("/create-additional-admin", authLimiter, createAdditionalAdmin as any);
router.get("/profile", getProfile as any);

// Password reset routes
router.post("/forgot-password", passwordResetLimiter, forgotPassword as any);
router.post("/reset-password", passwordResetLimiter, resetPassword as any);

export default router;
