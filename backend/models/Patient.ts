import mongoose, { Document, Schema } from 'mongoose';

export interface IPatient extends Document {
  firstName: string;
  lastName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  email: string;
  phone: string;
  address: string;
  bloodType: 'O+' | 'O-' | 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-';
  allergies: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalHistory: string[];
  currentMedications: string[];
  insuranceProvider?: string;
  insuranceNumber?: string;
  department?: string;
  doctor?: string;
  status: 'active' | 'inactive' | 'discharged' | 'critical';
  lastVisit?: Date;
  nextAppointment?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PatientSchema = new Schema<IPatient>({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [0, 'Age must be positive'],
    max: [150, 'Age must be realistic']
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ['Male', 'Female', 'Other']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  bloodType: {
    type: String,
    required: [true, 'Blood type is required'],
    enum: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']
  },
  allergies: [{
    type: String,
    trim: true
  }],
  emergencyContact: {
    name: {
      type: String,
      required: [true, 'Emergency contact name is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Emergency contact phone is required'],
      trim: true
    },
    relationship: {
      type: String,
      required: [true, 'Emergency contact relationship is required'],
      trim: true
    }
  },
  medicalHistory: [{
    type: String,
    trim: true
  }],
  currentMedications: [{
    type: String,
    trim: true
  }],
  insuranceProvider: {
    type: String,
    trim: true
  },
  insuranceNumber: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    trim: true
  },
  doctor: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: ['active', 'inactive', 'discharged', 'critical'],
    default: 'active'
  },
  lastVisit: {
    type: Date
  },
  nextAppointment: {
    type: Date
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Virtual for full name
PatientSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtual fields are serialized
PatientSchema.set('toJSON', {
  virtuals: true
});

export default mongoose.model<IPatient>('Patient', PatientSchema);
