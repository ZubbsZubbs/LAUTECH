import mongoose, { Document, Schema } from 'mongoose';

export enum ContactStatus {
  NEW = 'new',
  READ = 'read',
  REPLIED = 'replied'
}

export interface IContact extends Document {
  name: string;
  email: string;
  message: string;
  subject?: string;
  phoneNumber?: string;
  status: ContactStatus;
  createdAt: Date;
  updatedAt: Date;
}

const contactSchema = new Schema<IContact>({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  subject: String,
  phoneNumber: String,
  status: {
    type: String,
    enum: Object.values(ContactStatus),
    default: ContactStatus.NEW
  }
}, {
  timestamps: true
});

export default mongoose.model<IContact>('Contact', contactSchema);
