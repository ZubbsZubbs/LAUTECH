"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const Settings_1 = __importDefault(require("../models/Settings"));
const email_service_1 = __importDefault(require("../email/email.service"));
class NotificationService {
    /**
     * Send notification based on user preferences
     */
    static async sendNotification(data) {
        try {
            // If no userId provided, send email directly (for contact forms, etc.)
            if (!data.userId) {
                return await this.sendEmail(data);
            }
            // Get user notification settings
            const settings = await Settings_1.default.findOne({ userId: data.userId });
            if (!settings) {
                // If no settings found, use default preferences (send email)
                console.log(`No notification settings found for user ${data.userId}, using defaults`);
                return await this.sendEmail(data);
            }
            const { notifications } = settings;
            // Check if user wants this type of notification
            if (!this.shouldSendNotification(notifications, data.type)) {
                console.log(`User ${data.userId} has disabled ${data.type} notifications`);
                return false;
            }
            // Send the notification
            return await this.sendEmail(data);
        }
        catch (error) {
            console.error('Error sending notification:', error);
            return false;
        }
    }
    /**
     * Check if notification should be sent based on user preferences
     */
    static shouldSendNotification(settings, type) {
        switch (type) {
            case 'appointment':
                return settings.emailNotifications && settings.appointmentReminders;
            case 'application':
                return settings.emailNotifications;
            case 'contact':
                return settings.emailNotifications;
            case 'system':
                return settings.emailNotifications && settings.systemUpdates;
            case 'emergency':
                return settings.emailNotifications && settings.emergencyAlerts;
            case 'report':
                return settings.emailNotifications && (settings.weeklyReports || settings.monthlyReports);
            default:
                return settings.emailNotifications;
        }
    }
    /**
     * Send email notification
     */
    static async sendEmail(data) {
        try {
            await email_service_1.default.sendEmail(data.email, data.subject, data.text, data.html);
            console.log(`✅ Notification sent to ${data.email}: ${data.subject}`);
            return true;
        }
        catch (error) {
            console.error(`❌ Failed to send notification to ${data.email}:`, error);
            return false;
        }
    }
    /**
     * Send bulk notifications to multiple users
     */
    static async sendBulkNotification(notifications) {
        let sent = 0;
        let failed = 0;
        for (const notification of notifications) {
            const success = await this.sendNotification(notification);
            if (success) {
                sent++;
            }
            else {
                failed++;
            }
        }
        return { sent, failed };
    }
    /**
     * Get user notification preferences
     */
    static async getUserNotificationSettings(userId) {
        try {
            const settings = await Settings_1.default.findOne({ userId });
            return settings?.notifications || this.getDefaultNotificationSettings();
        }
        catch (error) {
            console.error('Error getting user notification settings:', error);
            return this.getDefaultNotificationSettings();
        }
    }
    /**
     * Get default notification settings
     */
    static getDefaultNotificationSettings() {
        return {
            emailNotifications: true,
            smsNotifications: false,
            pushNotifications: true,
            appointmentReminders: true,
            emergencyAlerts: true,
            systemUpdates: true,
            weeklyReports: true,
            monthlyReports: true
        };
    }
}
exports.NotificationService = NotificationService;
