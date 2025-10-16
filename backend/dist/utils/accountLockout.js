"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountLockoutManager = void 0;
const User_1 = __importDefault(require("../models/User"));
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds
class AccountLockoutManager {
    /**
     * Check if account is currently locked
     */
    static async isAccountLocked(userId) {
        const user = await User_1.default.findById(userId);
        if (!user) {
            return { isLocked: false };
        }
        // Check if account is locked
        if (user.accountLockedUntil && user.accountLockedUntil > new Date()) {
            const remainingTime = Math.ceil((user.accountLockedUntil.getTime() - Date.now()) / 1000);
            return {
                isLocked: true,
                remainingTime
            };
        }
        // If lockout period has expired, reset the lockout
        if (user.accountLockedUntil && user.accountLockedUntil <= new Date()) {
            await this.resetFailedAttempts(userId);
        }
        const attemptsRemaining = MAX_FAILED_ATTEMPTS - (user.failedLoginAttempts || 0);
        return {
            isLocked: false,
            attemptsRemaining: Math.max(0, attemptsRemaining)
        };
    }
    /**
     * Record a failed login attempt
     */
    static async recordFailedAttempt(userId) {
        const user = await User_1.default.findById(userId);
        if (!user) {
            return { isLocked: false };
        }
        const newFailedAttempts = (user.failedLoginAttempts || 0) + 1;
        // Update failed attempts count
        user.failedLoginAttempts = newFailedAttempts;
        // Lock account if max attempts reached
        if (newFailedAttempts >= MAX_FAILED_ATTEMPTS) {
            user.accountLockedUntil = new Date(Date.now() + LOCKOUT_DURATION);
            await user.save();
            return {
                isLocked: true,
                remainingTime: Math.ceil(LOCKOUT_DURATION / 1000)
            };
        }
        await user.save();
        const attemptsRemaining = MAX_FAILED_ATTEMPTS - newFailedAttempts;
        return {
            isLocked: false,
            attemptsRemaining
        };
    }
    /**
     * Reset failed attempts after successful login
     */
    static async resetFailedAttempts(userId) {
        await User_1.default.findByIdAndUpdate(userId, {
            failedLoginAttempts: 0,
            accountLockedUntil: undefined
        });
    }
    /**
     * Get lockout status by email
     */
    static async getLockoutStatusByEmail(email) {
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return { isLocked: false };
        }
        const status = await this.isAccountLocked(user._id.toString());
        return {
            ...status,
            userId: user._id.toString()
        };
    }
    /**
     * Record failed attempt by email
     */
    static async recordFailedAttemptByEmail(email) {
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return { isLocked: false };
        }
        return await this.recordFailedAttempt(user._id.toString());
    }
    /**
     * Reset failed attempts by email
     */
    static async resetFailedAttemptsByEmail(email) {
        const user = await User_1.default.findOne({ email });
        if (user) {
            await this.resetFailedAttempts(user._id.toString());
        }
    }
}
exports.AccountLockoutManager = AccountLockoutManager;
