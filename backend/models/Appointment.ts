import mongoose, { Document, Schema } from 'mongoose';

export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  NO_SHOW = 'no_show'
}

export interface IAppointment extends Document {
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  department: string;
  preferredDate: Date;
  reason: string;
  status: AppointmentStatus;
  notes?: string;
  confirmedAt?: Date;
  cancelledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const appointmentSchema = new Schema<IAppointment>({
  patientName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  patientEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  patientPhone: {
    type: String,
    required: true,
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  department: {
    type: String,
    required: true,
    trim: true,
    enum: [
      'Cardiology',
      'Emergency', 
      'General Medicine',
      'Pediatrics',
      'Orthopedics',
      'Neurology',
      'Dermatology',
      'Ophthalmology',
      'ENT',
      'Gynecology',
      'Urology',
      'Psychiatry'
    ]
  },
  preferredDate: {
    type: Date,
    required: true,
    validate: {
      validator: function(value: Date) {
        return value > new Date();
      },
      message: 'Preferred date must be in the future'
    }
  },
  reason: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  status: {
    type: String,
    enum: Object.values(AppointmentStatus),
    default: AppointmentStatus.PENDING
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  confirmedAt: Date,
  cancelledAt: Date
}, {
  timestamps: true
});

// Index for better query performance
appointmentSchema.index({ patientEmail: 1, preferredDate: 1 });
appointmentSchema.index({ department: 1, status: 1 });
appointmentSchema.index({ preferredDate: 1 });

export default mongoose.model<IAppointment>('Appointment', appointmentSchema);
