import User from '../models/User';

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

export interface LockoutResult {
  isLocked: boolean;
  remainingTime?: number;
  attemptsRemaining?: number;
}

export class AccountLockoutManager {
  /**
   * Check if account is currently locked
   */
  static async isAccountLocked(userId: string): Promise<LockoutResult> {
    const user = await User.findById(userId);
    
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
  static async recordFailedAttempt(userId: string): Promise<LockoutResult> {
    const user = await User.findById(userId);
    
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
  static async resetFailedAttempts(userId: string): Promise<void> {
    await User.findByIdAndUpdate(userId, {
      failedLoginAttempts: 0,
      accountLockedUntil: undefined
    });
  }

  /**
   * Get lockout status by email
   */
  static async getLockoutStatusByEmail(email: string): Promise<LockoutResult & { userId?: string }> {
    const user = await User.findOne({ email });
    
    if (!user) {
      return { isLocked: false };
    }

    const status = await this.isAccountLocked((user._id as any).toString());
    return {
      ...status,
      userId: (user._id as any).toString()
    };
  }

  /**
   * Record failed attempt by email
   */
  static async recordFailedAttemptByEmail(email: string): Promise<LockoutResult> {
    const user = await User.findOne({ email });
    
    if (!user) {
      return { isLocked: false };
    }

    return await this.recordFailedAttempt((user._id as any).toString());
  }

  /**
   * Reset failed attempts by email
   */
  static async resetFailedAttemptsByEmail(email: string): Promise<void> {
    const user = await User.findOne({ email });
    
    if (user) {
      await this.resetFailedAttempts((user._id as any).toString());
    }
  }
}
