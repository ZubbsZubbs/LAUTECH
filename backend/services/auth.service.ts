// services/auth.service.ts
import { UserRole, IUser } from "../models/User";
import User from "../models/User";
import * as jwt from "jsonwebtoken";
import axios from "axios";
import * as admin from "firebase-admin";
import crypto from "crypto";
import bcrypt from "bcrypt";
import "../config/firebase";
import { sendPasswordLink } from "../email/email.forgot_password";
import * as speakeasy from "speakeasy";
import emailService from "../email/email.service";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export class AuthService {
  async firebaseEmailSignIn(idToken: string, firstName?: string, lastName?: string): Promise<{ otpSent: boolean }> {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const email = decodedToken.email;

    if (!email) {
        throw new Error("Email not found in token");
      }

      let user = await User.findOne({ email });

    if (!user) {
        // Create new user
        user = new User({
          email,
          firstName: firstName || "User",
          lastName: lastName || "Name",
          password: crypto.randomBytes(16).toString('hex'), // Temporary password
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
    } catch (error) {
      console.error("Firebase email signin error:", error);
      throw error;
    }
  }

  async registerUser(userData: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  }): Promise<{ user: IUser; token: string }> {
    try {
      const { email, firstName, lastName, password } = userData;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error("User already exists");
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = new User({
      email,
      firstName,
      lastName,
        password: hashedPassword,
        role: UserRole.USER,
        verified: false
      });

      await user.save();

      // Generate token
      const token = this.generateToken(user);

      return { user, token };
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  async loginUser(email: string, password: string): Promise<{ user: IUser; token: string }> {
    try {
      const user = await User.findOne({ email });
    if (!user) {
        throw new Error("Invalid credentials");
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error("Invalid credentials");
    }

    const token = this.generateToken(user);
      const userWithoutPassword = { ...user.toObject(), password: undefined };

      return { user: userWithoutPassword as any, token };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async verifyEmail(email: string, otp: string): Promise<{ token: string; user: IUser }> {
    try {
      const user = await User.findOne({ email });
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

      return { token, user: userWithoutSensitive as any };
    } catch (error) {
      console.error("Email verification error:", error);
      throw error;
    }
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    try {
      const user = await User.findOne({ email });
    if (!user) {
        throw new Error("User not found");
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
      await user.save();

      // Send reset email
      const frontendUrl = process.env.FRONTEND_URL || process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://localhost:9000';
      const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;
      await sendPasswordLink(email, email, resetUrl);

      return { message: "Password reset link sent to your email" };
    } catch (error) {
      console.error("Forgot password error:", error);
      throw error;
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    try {
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
      });

      if (!user) {
        throw new Error("Invalid or expired reset token");
      }

      // Hash new password with high salt rounds
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      
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
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
    }
  }

  async googleSignIn(idToken: string): Promise<{ token: string; user: IUser }> {
    try {
      const response = await axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${idToken}`);
      const { email, given_name, family_name, sub } = response.data;

      let user = await User.findOne({ email });
    if (!user) {
        user = new User({
        email,
          firstName: given_name,
          lastName: family_name,
          password: crypto.randomBytes(16).toString('hex'),
          googleId: sub,
          verified: true
        });
        await user.save();
      }

      const token = this.generateToken(user);
      const userWithoutPassword = { ...user.toObject(), password: undefined };

      return { token, user: userWithoutPassword as any };
    } catch (error) {
      console.error("Google signin error:", error);
      throw error;
    }
  }

  async facebookSignIn(accessToken: string): Promise<{ token: string; user: IUser }> {
    try {
      const response = await axios.get(`https://graph.facebook.com/me?fields=id,email,first_name,last_name&access_token=${accessToken}`);
      const { email, first_name, last_name, id } = response.data;

      let user = await User.findOne({ email });
    if (!user) {
        user = new User({
          email,
          firstName: first_name,
          lastName: last_name,
          password: crypto.randomBytes(16).toString('hex'),
          facebookId: id,
          verified: true
        });
        await user.save();
      }

      const token = this.generateToken(user);
      const userWithoutPassword = { ...user.toObject(), password: undefined };

      return { token, user: userWithoutPassword as any };
    } catch (error) {
      console.error("Facebook signin error:", error);
      throw error;
    }
  }

  async linkedinSignIn(accessToken: string): Promise<{ token: string; user: IUser }> {
    try {
      const response = await axios.get(`https://api.linkedin.com/v2/people/~:(id,firstName,lastName,emailAddress)?oauth2_access_token=${accessToken}`);
      const { emailAddress, firstName, lastName, id } = response.data;

      let user = await User.findOne({ email: emailAddress });
    if (!user) {
        user = new User({
          email: emailAddress,
          firstName: firstName.localized.en_US,
          lastName: lastName.localized.en_US,
          password: crypto.randomBytes(16).toString('hex'),
          linkedinId: id,
          verified: true
        });
        await user.save();
      }

      const token = this.generateToken(user);
      const userWithoutPassword = { ...user.toObject(), password: undefined };

      return { token, user: userWithoutPassword as any };
    } catch (error) {
      console.error("LinkedIn signin error:", error);
      throw error;
    }
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<{ message: string }> {
    try {
      const user = await User.findById(userId);
            if (!user) {
        throw new Error("User not found");
      }

      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        throw new Error("Current password is incorrect");
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedNewPassword;
      await user.save();

      return { message: "Password changed successfully" };
    } catch (error) {
      console.error("Change password error:", error);
      throw error;
    }
  }

  async updateProfile(userId: string, updateData: Partial<IUser>): Promise<{ user: IUser }> {
    try {
      const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
      if (!user) {
        throw new Error("User not found");
      }

      const userWithoutPassword = { ...user.toObject(), password: undefined };
      return { user: userWithoutPassword as any };
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  }

  async deleteAccount(userId: string): Promise<{ message: string }> {
    try {
      await User.findByIdAndDelete(userId);
      return { message: "Account deleted successfully" };
    } catch (error) {
      console.error("Delete account error:", error);
      throw error;
    }
  }

  private generateToken(user: IUser): string {
    return jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
  }
}