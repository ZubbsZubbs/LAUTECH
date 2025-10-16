import mongoose, { Document, Schema } from 'mongoose';

export interface IProfileSettings {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  bio: string;
  avatar?: string;
}

export interface IHospitalSettings {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  license: string;
  established: string;
  capacity: string;
  specialties: string;
  accreditation: string;
}

export interface INotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  appointmentReminders: boolean;
  emergencyAlerts: boolean;
  systemUpdates: boolean;
  weeklyReports: boolean;
  monthlyReports: boolean;
}

export interface ISecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: string;
  passwordExpiry: string;
  loginAttempts: string;
  ipWhitelist: boolean;
  auditLogs: boolean;
}

export interface ISystemSettings {
  timezone: string;
  dateFormat: string;
  currency: string;
  language: string;
  theme: string;
  backupFrequency: string;
  maintenanceMode: boolean;
  debugMode: boolean;
}

export interface ISettings extends Document {
  userId: string;
  profile: IProfileSettings;
  hospital: IHospitalSettings;
  notifications: INotificationSettings;
  security: ISecuritySettings;
  system: ISystemSettings;
  createdAt: Date;
  updatedAt: Date;
}

const ProfileSettingsSchema = new Schema<IProfileSettings>({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },
  position: { type: String, required: true, trim: true },
  department: { type: String, required: true, trim: true },
  bio: { type: String, default: '' },
  avatar: { type: String, default: '' }
}, { _id: false });

const HospitalSettingsSchema = new Schema<IHospitalSettings>({
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

const NotificationSettingsSchema = new Schema<INotificationSettings>({
  emailNotifications: { type: Boolean, default: true },
  smsNotifications: { type: Boolean, default: false },
  pushNotifications: { type: Boolean, default: true },
  appointmentReminders: { type: Boolean, default: true },
  emergencyAlerts: { type: Boolean, default: true },
  systemUpdates: { type: Boolean, default: true },
  weeklyReports: { type: Boolean, default: true },
  monthlyReports: { type: Boolean, default: true }
}, { _id: false });

const SecuritySettingsSchema = new Schema<ISecuritySettings>({
  twoFactorAuth: { type: Boolean, default: false },
  sessionTimeout: { type: String, default: '30' },
  passwordExpiry: { type: String, default: '90' },
  loginAttempts: { type: String, default: '5' },
  ipWhitelist: { type: Boolean, default: false },
  auditLogs: { type: Boolean, default: true }
}, { _id: false });

const SystemSettingsSchema = new Schema<ISystemSettings>({
  timezone: { type: String, default: 'Africa/Lagos' },
  dateFormat: { type: String, default: 'DD/MM/YYYY' },
  currency: { type: String, default: 'NGN' },
  language: { type: String, default: 'en' },
  theme: { type: String, default: 'light' },
  backupFrequency: { type: String, default: 'daily' },
  maintenanceMode: { type: Boolean, default: false },
  debugMode: { type: Boolean, default: false }
}, { _id: false });

const SettingsSchema = new Schema<ISettings>({
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

export default mongoose.model<ISettings>('Settings', SettingsSchema);
