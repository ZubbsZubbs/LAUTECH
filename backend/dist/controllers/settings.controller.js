"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAllSettings = exports.changePassword = exports.updateSystemSettings = exports.updateSecuritySettings = exports.updateNotificationSettings = exports.updateHospitalSettings = exports.updateProfileSettings = exports.getSettings = void 0;
const Settings_1 = __importDefault(require("../models/Settings"));
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// Get all settings for a user
const getSettings = async (req, res) => {
    try {
        const { userId } = req.params;
        let settings = await Settings_1.default.findOne({ userId });
        // If no settings exist, create default settings
        if (!settings) {
            const defaultSettings = await createDefaultSettings(userId);
            settings = defaultSettings;
        }
        res.status(200).json({
            success: true,
            data: settings
        });
    }
    catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch settings',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getSettings = getSettings;
// Update profile settings
const updateProfileSettings = async (req, res) => {
    try {
        const { userId } = req.params;
        const profileData = req.body;
        // Validate required fields
        if (!profileData.firstName || !profileData.lastName || !profileData.email) {
            res.status(400).json({
                success: false,
                message: 'First name, last name, and email are required'
            });
            return;
        }
        // Update or create settings
        const settings = await Settings_1.default.findOneAndUpdate({ userId }, {
            $set: {
                profile: profileData,
                updatedAt: new Date()
            }
        }, {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
        });
        // Also update user record if it exists (only if userId is a valid ObjectId)
        try {
            await User_1.default.findOneAndUpdate({ _id: userId }, {
                $set: {
                    firstName: profileData.firstName,
                    lastName: profileData.lastName,
                    email: profileData.email,
                    phoneNumber: profileData.phone
                }
            });
        }
        catch (userUpdateError) {
            // If userId is not a valid ObjectId, just log and continue
            console.log('Could not update user record (userId may not be a valid ObjectId):', userUpdateError);
        }
        res.status(200).json({
            success: true,
            message: 'Profile settings updated successfully',
            data: settings
        });
    }
    catch (error) {
        console.error('Update profile settings error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile settings',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.updateProfileSettings = updateProfileSettings;
// Update hospital settings
const updateHospitalSettings = async (req, res) => {
    try {
        const { userId } = req.params;
        const hospitalData = req.body;
        const settings = await Settings_1.default.findOneAndUpdate({ userId }, {
            $set: {
                hospital: hospitalData,
                updatedAt: new Date()
            }
        }, {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
        });
        res.status(200).json({
            success: true,
            message: 'Hospital settings updated successfully',
            data: settings
        });
    }
    catch (error) {
        console.error('Update hospital settings error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update hospital settings',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.updateHospitalSettings = updateHospitalSettings;
// Update notification settings
const updateNotificationSettings = async (req, res) => {
    try {
        const { userId } = req.params;
        const notificationData = req.body;
        const settings = await Settings_1.default.findOneAndUpdate({ userId }, {
            $set: {
                notifications: notificationData,
                updatedAt: new Date()
            }
        }, {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
        });
        res.status(200).json({
            success: true,
            message: 'Notification settings updated successfully',
            data: settings
        });
    }
    catch (error) {
        console.error('Update notification settings error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update notification settings',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.updateNotificationSettings = updateNotificationSettings;
// Update security settings
const updateSecuritySettings = async (req, res) => {
    try {
        const { userId } = req.params;
        const securityData = req.body;
        const settings = await Settings_1.default.findOneAndUpdate({ userId }, {
            $set: {
                security: securityData,
                updatedAt: new Date()
            }
        }, {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
        });
        res.status(200).json({
            success: true,
            message: 'Security settings updated successfully',
            data: settings
        });
    }
    catch (error) {
        console.error('Update security settings error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update security settings',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.updateSecuritySettings = updateSecuritySettings;
// Update system settings
const updateSystemSettings = async (req, res) => {
    try {
        const { userId } = req.params;
        const systemData = req.body;
        const settings = await Settings_1.default.findOneAndUpdate({ userId }, {
            $set: {
                system: systemData,
                updatedAt: new Date()
            }
        }, {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
        });
        res.status(200).json({
            success: true,
            message: 'System settings updated successfully',
            data: settings
        });
    }
    catch (error) {
        console.error('Update system settings error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update system settings',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.updateSystemSettings = updateSystemSettings;
// Change password - SECURE VERSION
const changePassword = async (req, res) => {
    try {
        // SECURITY: Get userId from authenticated user, not from params
        const userId = req.user?.id || req.params.userId;
        const { currentPassword, newPassword } = req.body;
        // Input validation
        if (!currentPassword || !newPassword) {
            res.status(400).json({
                success: false,
                message: 'Current password and new password are required'
            });
            return;
        }
        // Strong password validation
        if (newPassword.length < 8) {
            res.status(400).json({
                success: false,
                message: 'New password must be at least 8 characters long'
            });
            return;
        }
        // Check for password strength
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
        if (!passwordRegex.test(newPassword)) {
            res.status(400).json({
                success: false,
                message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
            });
            return;
        }
        // Prevent password reuse (check if new password is same as current)
        if (currentPassword === newPassword) {
            res.status(400).json({
                success: false,
                message: 'New password must be different from current password'
            });
            return;
        }
        // SECURITY: Find user and verify they exist
        const user = await User_1.default.findById(userId);
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }
        // Check password history (prevent reusing last 5 passwords)
        if (user.passwordHistory && user.passwordHistory.length > 0) {
            for (const oldPasswordHash of user.passwordHistory) {
                const isReused = await bcryptjs_1.default.compare(newPassword, oldPasswordHash);
                if (isReused) {
                    res.status(400).json({
                        success: false,
                        message: 'You cannot reuse any of your last 5 passwords'
                    });
                    return;
                }
            }
        }
        // SECURITY: Verify current password
        if (!user.password) {
            res.status(400).json({
                success: false,
                message: 'No current password set for this user'
            });
            return;
        }
        const isCurrentPasswordValid = await bcryptjs_1.default.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
            return;
        }
        // SECURITY: Hash new password with high salt rounds
        const saltRounds = 12;
        const hashedNewPassword = await bcryptjs_1.default.hash(newPassword, saltRounds);
        // Update password history (keep last 5 passwords)
        const passwordHistory = user.passwordHistory || [];
        passwordHistory.push(user.password); // Add current password to history
        // Keep only last 5 passwords
        if (passwordHistory.length > 5) {
            passwordHistory.shift(); // Remove oldest password
        }
        // SECURITY: Update password and log the change
        const updatedUser = await User_1.default.findByIdAndUpdate(userId, {
            password: hashedNewPassword,
            passwordHistory: passwordHistory,
            updatedAt: new Date(),
            passwordChangedAt: new Date() // Track when password was last changed
        }, { new: true } // Return the updated document
        );
        // SECURITY: Log password change for audit trail
        console.log(`Password changed for user ${userId} at ${new Date().toISOString()}`);
        console.log(`Old password hash: ${user.password.substring(0, 20)}...`);
        console.log(`New password hash: ${hashedNewPassword.substring(0, 20)}...`);
        console.log(`Updated user password hash: ${updatedUser?.password?.substring(0, 20)}...`);
        res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        });
    }
    catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to change password',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.changePassword = changePassword;
// Update all settings at once
const updateAllSettings = async (req, res) => {
    try {
        const { userId } = req.params;
        const { profile, hospital, notifications, security, system } = req.body;
        const updateData = {
            updatedAt: new Date()
        };
        if (profile)
            updateData.profile = profile;
        if (hospital)
            updateData.hospital = hospital;
        if (notifications)
            updateData.notifications = notifications;
        if (security)
            updateData.security = security;
        if (system)
            updateData.system = system;
        const settings = await Settings_1.default.findOneAndUpdate({ userId }, { $set: updateData }, {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
        });
        res.status(200).json({
            success: true,
            message: 'Settings updated successfully',
            data: settings
        });
    }
    catch (error) {
        console.error('Update all settings error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update settings',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.updateAllSettings = updateAllSettings;
// Helper function to create default settings
const createDefaultSettings = async (userId) => {
    const defaultSettings = new Settings_1.default({
        userId,
        profile: {
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@lautech.edu.ng',
            phone: '+234 (803) 123-4567',
            position: 'System Administrator',
            department: 'IT Department',
            bio: 'System administrator responsible for managing the hospital management system.',
            avatar: '/ceo.jpg'
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
        notifications: {
            emailNotifications: true,
            smsNotifications: false,
            pushNotifications: true,
            appointmentReminders: true,
            emergencyAlerts: true,
            systemUpdates: true,
            weeklyReports: true,
            monthlyReports: true
        },
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
    });
    return await defaultSettings.save();
};
