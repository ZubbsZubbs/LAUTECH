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
exports.resetPassword = exports.forgotPassword = exports.createAdditionalAdmin = exports.createAdmin = exports.getProfile = exports.firebaseEmailSignIn = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = __importStar(require("../models/User"));
const Settings_1 = __importDefault(require("../models/Settings"));
const notification_service_1 = require("../services/notification.service");
const validation_1 = require("../utils/validation");
const accountLockout_1 = require("../utils/accountLockout");
const auth_service_1 = require("../services/auth.service");
// Generate JWT token
const generateToken = (userId) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }
    return jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
};
// Create default settings for new user
const createDefaultUserSettings = async (userId, userRole) => {
    try {
        const defaultSettings = {
            userId,
            profile: {
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                position: '',
                department: '',
                bio: '',
                avatar: ''
            },
            hospital: {
                name: 'LAUTECH Teaching Hospital',
                address: 'Ladoke Akintola University of Technology, Ogbomoso, Oyo State, Nigeria',
                phone: '+234 (803) 123-4567',
                email: 'info@lautech.edu.ng',
                website: 'https://lautech.edu.ng',
                license: 'HTH-2024-001',
                established: '2020',
                capacity: '500',
                specialties: '12',
                accreditation: 'Nigerian Medical and Dental Council'
            },
            notifications: notification_service_1.NotificationService.getDefaultNotificationSettings(),
            security: {
                twoFactorAuth: false,
                sessionTimeout: '30',
                passwordExpiry: '90',
                loginAttempts: '5',
                ipWhitelist: false,
                auditLogs: true
            },
            system: {
                timezone: 'Africa/Lagos',
                dateFormat: 'DD/MM/YYYY',
                currency: 'NGN',
                language: 'en',
                theme: 'light',
                backupFrequency: 'daily',
                maintenanceMode: false,
                debugMode: false
            }
        };
        const settings = new Settings_1.default(defaultSettings);
        await settings.save();
        console.log(`✅ Default settings created for user ${userId}`);
    }
    catch (error) {
        console.error('Error creating default settings:', error);
        // Don't fail user creation if settings creation fails
    }
};
// Register user (Admin only - for creating new admin accounts)
const register = async (req, res) => {
    try {
        // Validate input
        const { error, value } = validation_1.registrationSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }
        const { email, firstName, lastName, password } = value;
        // Sanitize email
        const sanitizedEmail = (0, validation_1.validateAndSanitizeEmail)(email);
        // Enable public registration for students
        // This allows students to create accounts for application submission
        // Check if user already exists
        try {
            const existingUser = await User_1.default.findOne({ email: sanitizedEmail });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'User already exists with this email'
                });
            }
        }
        catch (dbError) {
            console.error('Database error during registration:', dbError);
            return res.status(500).json({
                success: false,
                message: 'Registration failed. Please try again later.'
            });
        }
        // Hash password
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        // Create user with USER role for public registration
        const user = new User_1.default({
            email: sanitizedEmail,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            password: hashedPassword,
            role: User_1.UserRole.USER,
            verified: true
        });
        await user.save();
        // Create default settings for the new user
        await createDefaultUserSettings(user._id.toString(), User_1.UserRole.USER);
        // Generate token
        const token = generateToken(user._id.toString());
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role
                },
                token
            }
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed. Please try again later.'
        });
    }
};
exports.register = register;
// Login user
const login = async (req, res) => {
    try {
        // Validate input
        const { error, value } = validation_1.loginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }
        const { email, password } = value;
        const sanitizedEmail = (0, validation_1.validateAndSanitizeEmail)(email);
        // Check account lockout status
        const lockoutStatus = await accountLockout_1.AccountLockoutManager.getLockoutStatusByEmail(sanitizedEmail);
        if (lockoutStatus.isLocked) {
            return res.status(423).json({
                success: false,
                message: `Account is temporarily locked due to too many failed login attempts. Please try again in ${Math.ceil((lockoutStatus.remainingTime || 0) / 60)} minutes.`
            });
        }
        // Find user with timeout handling
        const user = await User_1.default.findOne({ email: sanitizedEmail }).maxTimeMS(10000); // 10 second timeout
        if (!user) {
            // Record failed attempt even for non-existent users to prevent enumeration
            await accountLockout_1.AccountLockoutManager.recordFailedAttemptByEmail(sanitizedEmail);
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        // Check if user has a password (not Firebase user)
        if (!user.password) {
            // Record failed attempt
            await accountLockout_1.AccountLockoutManager.recordFailedAttempt(user._id.toString());
            return res.status(401).json({
                success: false,
                message: 'This account was created with Firebase. Please use Firebase login.'
            });
        }
        // Check password
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            // Record failed attempt
            const lockoutResult = await accountLockout_1.AccountLockoutManager.recordFailedAttempt(user._id.toString());
            if (lockoutResult.isLocked) {
                return res.status(423).json({
                    success: false,
                    message: `Account is temporarily locked due to too many failed login attempts. Please try again in ${Math.ceil((lockoutResult.remainingTime || 0) / 60)} minutes.`
                });
            }
            return res.status(401).json({
                success: false,
                message: `Invalid credentials. ${lockoutResult.attemptsRemaining} attempts remaining.`
            });
        }
        // Reset failed attempts on successful login
        await accountLockout_1.AccountLockoutManager.resetFailedAttempts(user._id.toString());
        // Generate token
        const token = generateToken(user._id.toString());
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role
                },
                token
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed. Please try again later.'
        });
    }
};
exports.login = login;
// Firebase email signin (for frontend integration)
const firebaseEmailSignIn = async (req, res) => {
    try {
        const { idToken, firstName, lastName, email } = req.body;
        // Validate required fields
        if (!idToken || !email) {
            return res.status(400).json({
                success: false,
                message: 'Firebase token and email are required'
            });
        }
        // Verify Firebase token
        let decodedToken;
        try {
            const admin = require('firebase-admin');
            decodedToken = await admin.auth().verifyIdToken(idToken);
        }
        catch (firebaseError) {
            console.error('Firebase token verification failed:', firebaseError);
            return res.status(401).json({
                success: false,
                message: 'Invalid Firebase token'
            });
        }
        // Extract user info from verified token
        const firebaseUid = decodedToken.uid;
        const verifiedEmail = decodedToken.email;
        const firebaseName = decodedToken.name || '';
        // Ensure email matches
        if (verifiedEmail !== email) {
            return res.status(400).json({
                success: false,
                message: 'Email does not match Firebase token'
            });
        }
        // Sanitize email
        const sanitizedEmail = (0, validation_1.validateAndSanitizeEmail)(email);
        let user = await User_1.default.findOne({ email: sanitizedEmail });
        if (!user) {
            // Create new user with verified Firebase data
            user = new User_1.default({
                email: sanitizedEmail,
                firstName: firstName?.trim() || firebaseName.split(' ')[0] || 'User',
                lastName: lastName?.trim() || firebaseName.split(' ').slice(1).join(' ') || 'Name',
                firebaseUid: firebaseUid,
                verified: true
            });
            await user.save();
            // Create default settings for the new user
            await createDefaultUserSettings(user._id.toString(), User_1.UserRole.USER);
        }
        else {
            // Update existing user with Firebase UID if not set
            if (!user.firebaseUid) {
                user.firebaseUid = firebaseUid;
                await user.save();
            }
        }
        // Generate token
        const token = generateToken(user._id.toString());
        res.status(200).json({
            success: true,
            message: 'Authentication successful',
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role
                },
                token
            }
        });
    }
    catch (error) {
        console.error('Firebase auth error:', error);
        res.status(500).json({
            success: false,
            message: 'Authentication failed',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.firebaseEmailSignIn = firebaseEmailSignIn;
// Get user profile
const getProfile = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.status(200).json({
            success: true,
            data: { user }
        });
    }
    catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get profile',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getProfile = getProfile;
// Create admin account (for initial setup or admin-created accounts)
const createAdmin = async (req, res) => {
    try {
        const { email, firstName, lastName, password, adminKey } = req.body;
        // SECURITY: Check if this is the first admin creation
        const existingAdmins = await User_1.default.countDocuments({ role: 'ADMIN' });
        if (existingAdmins === 0) {
            // First admin creation - require special key
            if (!process.env.FIRST_ADMIN_KEY) {
                return res.status(500).json({
                    success: false,
                    message: 'Server configuration error. Admin key not configured.'
                });
            }
            const requiredKey = process.env.FIRST_ADMIN_KEY;
            if (adminKey !== requiredKey) {
                return res.status(403).json({
                    success: false,
                    message: 'Invalid admin key. Contact system administrator for initial setup.'
                });
            }
        }
        else {
            // Not first admin - require existing admin authentication
            return res.status(403).json({
                success: false,
                message: 'First admin already exists. Use the admin dashboard to create additional admins.'
            });
        }
        // Validate required fields
        if (!email || !firstName || !lastName || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }
        // Check if user already exists
        const existingUser = await User_1.default.findOne({ email }).maxTimeMS(10000);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }
        // Hash password
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        // Create admin user
        const user = new User_1.default({
            email,
            firstName,
            lastName,
            password: hashedPassword,
            role: User_1.UserRole.ADMIN,
            verified: true
        });
        await user.save();
        // Create default settings for the new admin
        await createDefaultUserSettings(user._id.toString(), User_1.UserRole.ADMIN);
        // Generate token
        const token = generateToken(user._id.toString());
        res.status(201).json({
            success: true,
            message: 'Admin account created successfully',
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role
                },
                token
            }
        });
    }
    catch (error) {
        console.error('Create admin error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create admin account',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.createAdmin = createAdmin;
// Create additional admin (requires existing admin authentication)
const createAdditionalAdmin = async (req, res) => {
    try {
        // Check if user is authenticated and is admin
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        // Verify token and check if user is admin
        try {
            const jwt = require('jsonwebtoken');
            if (!process.env.JWT_SECRET) {
                return res.status(500).json({
                    success: false,
                    message: 'Server configuration error'
                });
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const currentUser = await User_1.default.findById(decoded.userId);
            if (!currentUser || currentUser.role !== 'ADMIN') {
                return res.status(403).json({
                    success: false,
                    message: 'Admin access required'
                });
            }
        }
        catch (jwtError) {
            console.error('JWT verification error:', jwtError);
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }
        const { email, firstName, lastName, password } = req.body;
        // Validate required fields
        if (!email || !firstName || !lastName || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }
        // Check if user already exists
        const existingUser = await User_1.default.findOne({ email }).maxTimeMS(10000);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }
        // Hash password
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        // Create admin user
        const user = new User_1.default({
            email,
            firstName,
            lastName,
            password: hashedPassword,
            role: User_1.UserRole.ADMIN,
            verified: true
        });
        await user.save();
        // Create default settings for the new admin
        await createDefaultUserSettings(user._id.toString(), User_1.UserRole.ADMIN);
        res.status(201).json({
            success: true,
            message: 'Admin account created successfully',
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role
                }
            }
        });
    }
    catch (error) {
        console.error('Create additional admin error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create admin account',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.createAdditionalAdmin = createAdditionalAdmin;
// Forgot password - send reset link
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }
        // Validate email format
        const sanitizedEmail = (0, validation_1.validateAndSanitizeEmail)(email);
        const authService = new auth_service_1.AuthService();
        const result = await authService.forgotPassword(sanitizedEmail);
        res.status(200).json({
            success: true,
            message: result.message
        });
    }
    catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process password reset request',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.forgotPassword = forgotPassword;
// Reset password with token
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Token and new password are required'
            });
        }
        // Validate password strength
        const passwordValidation = (0, validation_1.validatePasswordStrength)(newPassword);
        if (!passwordValidation.isValid) {
            return res.status(400).json({
                success: false,
                message: passwordValidation.errors.join(', ')
            });
        }
        const authService = new auth_service_1.AuthService();
        const result = await authService.resetPassword(token, newPassword);
        res.status(200).json({
            success: true,
            message: result.message
        });
    }
    catch (error) {
        console.error('Reset password error:', error);
        res.status(400).json({
            success: false,
            message: 'Failed to reset password',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.resetPassword = resetPassword;
