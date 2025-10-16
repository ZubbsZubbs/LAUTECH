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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const ProfileSettingsSchema = new mongoose_1.Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    bio: { type: String, default: '' },
    avatar: { type: String, default: '' }
}, { _id: false });
const HospitalSettingsSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    website: { type: String, default: '' },
    license: { type: String, default: '' },
    established: { type: String, default: '' },
    capacity: { type: String, default: '' },
    specialties: { type: String, default: '' },
    accreditation: { type: String, default: '' }
}, { _id: false });
const NotificationSettingsSchema = new mongoose_1.Schema({
    emailNotifications: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: false },
    pushNotifications: { type: Boolean, default: true },
    appointmentReminders: { type: Boolean, default: true },
    emergencyAlerts: { type: Boolean, default: true },
    systemUpdates: { type: Boolean, default: true },
    weeklyReports: { type: Boolean, default: true },
    monthlyReports: { type: Boolean, default: true }
}, { _id: false });
const SecuritySettingsSchema = new mongoose_1.Schema({
    twoFactorAuth: { type: Boolean, default: false },
    sessionTimeout: { type: String, default: '30' },
    passwordExpiry: { type: String, default: '90' },
    loginAttempts: { type: String, default: '5' },
    ipWhitelist: { type: Boolean, default: false },
    auditLogs: { type: Boolean, default: true }
}, { _id: false });
const SystemSettingsSchema = new mongoose_1.Schema({
    timezone: { type: String, default: 'Africa/Lagos' },
    dateFormat: { type: String, default: 'DD/MM/YYYY' },
    currency: { type: String, default: 'NGN' },
    language: { type: String, default: 'en' },
    theme: { type: String, default: 'light' },
    backupFrequency: { type: String, default: 'daily' },
    maintenanceMode: { type: Boolean, default: false },
    debugMode: { type: Boolean, default: false }
}, { _id: false });
const SettingsSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    profile: {
        type: ProfileSettingsSchema,
        required: true
    },
    hospital: {
        type: HospitalSettingsSchema,
        required: true
    },
    notifications: {
        type: NotificationSettingsSchema,
        required: true
    },
    security: {
        type: SecuritySettingsSchema,
        required: true
    },
    system: {
        type: SystemSettingsSchema,
        required: true
    }
}, {
    timestamps: true
});
// Create index on userId for faster queries
SettingsSchema.index({ userId: 1 });
exports.default = mongoose_1.default.model('Settings', SettingsSchema);
