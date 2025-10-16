import { Router } from "express";
import rateLimit from "express-rate-limit";
import { register, login, firebaseEmailSignIn, createAdmin, createAdditionalAdmin, getProfile, forgotPassword, resetPassword } from "../controllers/auth.controller";

const router = Router();

// Rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: "Too many authentication attempts, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const strictAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // limit each IP to 3 requests per windowMs for login
  message: {
    success: false,
    message: "Too many login attempts, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // limit each IP to 3 password reset requests per 15 minutes
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
