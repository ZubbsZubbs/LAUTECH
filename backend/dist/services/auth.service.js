"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
// services/auth.service.ts
const User_1 = require("../models/User");
const User_2 = __importDefault(require("../models/User"));
const jwt = __importStar(require("jsonwebtoken"));
const axios_1 = __importDefault(require("axios"));
const admin = __importStar(require("firebase-admin"));
const crypto_1 = __importDefault(require("crypto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
require("../config/firebase");
const email_forgot_password_1 = require("../email/email.forgot_password");
const speakeasy = __importStar(require("speakeasy"));
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
class AuthService {
    async firebaseEmailSignIn(idToken, firstName, lastName) {
        try {
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            const email = decodedToken.email;
            if (!email) {
                throw new Error("Email not found in token");
            }
            let user = await User_2.default.findOne({ email });
            if (!user) {
                // Create new user
                user = new User_2.default({
                    email,
                    firstName: firstName || "User",
                    lastName: lastName || "Name",
                    password: crypto_1.default.randomBytes(16).toString('hex'), // Temporary password
                    firebaseUid: decodedToken.uid,
                    verified: true
                });
                await user.save();
            }
            // Generate OTP
            const otp = speakeasy.totp({
                secret: JWT_SECRET,
                step: 300 // 5 minutes
            });
            // Send OTP email
            // await emailService.send2FACodeEmail(email, otp);
            return { otpSent: true };
        }
        catch (error) {
            console.error("Firebase email signin error:", error);
            throw error;
        }
    }
    async registerUser(userData) {
        try {
            const { email, firstName, lastName, password } = userData;
            // Check if user already exists
            const existingUser = await User_2.default.findOne({ email });
            if (existingUser) {
                throw new Error("User already exists");
            }
            // Hash password
            const hashedPassword = await bcrypt_1.default.hash(password, 10);
            // Create user
            const user = new User_2.default({
                email,
                firstName,
                lastName,
                password: hashedPassword,
                role: User_1.UserRole.USER,
                verified: false
            });
            await user.save();
            // Generate token
            const token = this.generateToken(user);
            return { user, token };
        }
        catch (error) {
            console.error("Registration error:", error);
            throw error;
        }
    }
    async loginUser(email, password) {
        try {
            const user = await User_2.default.findOne({ email });
            if (!user) {
                throw new Error("Invalid credentials");
            }
            const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error("Invalid credentials");
            }
            const token = this.generateToken(user);
            const userWithoutPassword = { ...user.toObject(), password: undefined };
            return { user: userWithoutPassword, token };
        }
        catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    }
    async verifyEmail(email, otp) {
        try {
            const user = await User_2.default.findOne({ email });
            if (!user) {
                throw new Error("User not found");
            }
            // Verify OTP
            const isValid = speakeasy.totp.verify({
                secret: JWT_SECRET,
                token: otp,
                step: 300
            });
            if (!isValid) {
                throw new Error("Invalid OTP");
            }
            // Update user as verified
            user.verified = true;
            await user.save();
            const token = this.generateToken(user);
            const userWithoutSensitive = { ...user.toObject(), password: undefined };
            return { token, user: userWithoutSensitive };
        }
        catch (error) {
            console.error("Email verification error:", error);
            throw error;
        }
    }
    async forgotPassword(email) {
        try {
            const user = await User_2.default.findOne({ email });
            if (!user) {
                throw new Error("User not found");
            }
            // Generate reset token
            const resetToken = crypto_1.default.randomBytes(32).toString('hex');
            user.resetPasswordToken = resetToken;
            user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
            await user.save();
            // Send reset email
            const frontendUrl = process.env.FRONTEND_URL || process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://lautech-edu-ng.onrender.com';
            const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;
            await (0, email_forgot_password_1.sendPasswordLink)(email, email, resetUrl);
            return { message: "Password reset link sent to your email" };
        }
        catch (error) {
            console.error("Forgot password error:", error);
            throw error;
        }
    }
    async resetPassword(token, newPassword) {
        try {
            const user = await User_2.default.findOne({
                resetPasswordToken: token,
                resetPasswordExpires: { $gt: Date.now() }
            });
            if (!user) {
                throw new Error("Invalid or expired reset token");
            }
            // Hash new password with high salt rounds
            const hashedPassword = await bcrypt_1.default.hash(newPassword, 12);
            // Update password history (keep last 5 passwords)
            const passwordHistory = user.passwordHistory || [];
            if (user.password) {
                passwordHistory.push(user.password); // Add current password to history
            }
            // Keep only last 5 passwords
            if (passwordHistory.length > 5) {
                passwordHistory.shift(); // Remove oldest password
            }
            user.password = hashedPassword;
            user.passwordHistory = passwordHistory;
            user.passwordChangedAt = new Date();
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();
            return { message: "Password reset successfully" };
        }
        catch (error) {
            console.error("Reset password error:", error);
            throw error;
        }
    }
    async googleSignIn(idToken) {
        try {
            const response = await axios_1.default.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${idToken}`);
            const { email, given_name, family_name, sub } = response.data;
            let user = await User_2.default.findOne({ email });
            if (!user) {
                user = new User_2.default({
                    email,
                    firstName: given_name,
                    lastName: family_name,
                    password: crypto_1.default.randomBytes(16).toString('hex'),
                    googleId: sub,
                    verified: true
                });
                await user.save();
            }
            const token = this.generateToken(user);
            const userWithoutPassword = { ...user.toObject(), password: undefined };
            return { token, user: userWithoutPassword };
        }
        catch (error) {
            console.error("Google signin error:", error);
            throw error;
        }
    }
    async facebookSignIn(accessToken) {
        try {
            const response = await axios_1.default.get(`https://graph.facebook.com/me?fields=id,email,first_name,last_name&access_token=${accessToken}`);
            const { email, first_name, last_name, id } = response.data;
            let user = await User_2.default.findOne({ email });
            if (!user) {
                user = new User_2.default({
                    email,
                    firstName: first_name,
                    lastName: last_name,
                    password: crypto_1.default.randomBytes(16).toString('hex'),
                    facebookId: id,
                    verified: true
                });
                await user.save();
            }
            const token = this.generateToken(user);
            const userWithoutPassword = { ...user.toObject(), password: undefined };
            return { token, user: userWithoutPassword };
        }
        catch (error) {
            console.error("Facebook signin error:", error);
            throw error;
        }
    }
    async linkedinSignIn(accessToken) {
        try {
            const response = await axios_1.default.get(`https://api.linkedin.com/v2/people/~:(id,firstName,lastName,emailAddress)?oauth2_access_token=${accessToken}`);
            const { emailAddress, firstName, lastName, id } = response.data;
            let user = await User_2.default.findOne({ email: emailAddress });
            if (!user) {
                user = new User_2.default({
                    email: emailAddress,
                    firstName: firstName.localized.en_US,
                    lastName: lastName.localized.en_US,
                    password: crypto_1.default.randomBytes(16).toString('hex'),
                    linkedinId: id,
                    verified: true
                });
                await user.save();
            }
            const token = this.generateToken(user);
            const userWithoutPassword = { ...user.toObject(), password: undefined };
            return { token, user: userWithoutPassword };
        }
        catch (error) {
            console.error("LinkedIn signin error:", error);
            throw error;
        }
    }
    async changePassword(userId, currentPassword, newPassword) {
        try {
            const user = await User_2.default.findById(userId);
            if (!user) {
                throw new Error("User not found");
            }
            const isCurrentPasswordValid = await bcrypt_1.default.compare(currentPassword, user.password);
            if (!isCurrentPasswordValid) {
                throw new Error("Current password is incorrect");
            }
            const hashedNewPassword = await bcrypt_1.default.hash(newPassword, 10);
            user.password = hashedNewPassword;
            await user.save();
            return { message: "Password changed successfully" };
        }
        catch (error) {
            console.error("Change password error:", error);
            throw error;
        }
    }
    async updateProfile(userId, updateData) {
        try {
            const user = await User_2.default.findByIdAndUpdate(userId, updateData, { new: true });
            if (!user) {
                throw new Error("User not found");
            }
            const userWithoutPassword = { ...user.toObject(), password: undefined };
            return { user: userWithoutPassword };
        }
        catch (error) {
            console.error("Update profile error:", error);
            throw error;
        }
    }
    async deleteAccount(userId) {
        try {
            await User_2.default.findByIdAndDelete(userId);
            return { message: "Account deleted successfully" };
        }
        catch (error) {
            console.error("Delete account error:", error);
            throw error;
        }
    }
    generateToken(user) {
        return jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    }
}
exports.AuthService = AuthService;
