import mongoose, { Document, Schema } from 'mongoose';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export interface IUser extends Document {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: UserRole;
  verified: boolean;
  phoneNumber?: string;
  profileImg?: string;
  firebaseUid?: string;
  googleId?: string;
  facebookId?: string;
  linkedinId?: string;
  username?: string;
  bankDetails?: any[];
  skills?: any[];
  certificates?: any[];
  experience?: any[];
  project?: any[];
  subscriptions?: any[];
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  failedLoginAttempts?: number;
  accountLockedUntil?: Date;
  passwordHistory?: string[]; // Store last 5 password hashes
  passwordChangedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: false // Make password optional for Firebase users
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.USER
  },
  verified: {
    type: Boolean,
    default: false
  },
  phoneNumber: String,
  profileImg: String,
  firebaseUid: String,
  googleId: String,
  facebookId: String,
  linkedinId: String,
  failedLoginAttempts: {
    type: Number,
    default: 0
  },
  accountLockedUntil: Date,
  passwordHistory: {
    type: [String],
    default: []
  },
  passwordChangedAt: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', userSchema);
