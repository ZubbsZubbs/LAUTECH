import mongoose, { Document, Schema } from 'mongoose';

export interface IDoctor extends Document {
  firstName: string;
  lastName: string;
  name: string; // Computed field
  email: string;
  phone: string;
  department: string;
  specialization: string;
  qualifications: string;
  experience: string;
  education: string;
  certifications: string[];
  languages: string[];
  status: 'active' | 'inactive' | 'on_leave';
  rating: number;
  patients: number;
  appointments: number;
  image?: string;
  address?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DoctorSchema = new Schema<IDoctor>({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
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
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    enum: [
      'Cardiology',
      'Pediatrics', 
      'Neurology',
      'Orthopedics',
      'Ophthalmology',
      'Dentistry',
      'Pulmonology',
      'Emergency Medicine',
      'Internal Medicine',
      'Pathology',
      'Radiology',
      'Oncology',
      'Dermatology',
      'Psychiatry',
      'Gynecology',
      'Urology',
      'Anesthesiology',
      'General Surgery'
    ]
  },
  specialization: {
    type: String,
    required: [true, 'Specialization is required'],
    trim: true,
    maxlength: [100, 'Specialization cannot exceed 100 characters']
  },
  qualifications: {
    type: String,
    required: [true, 'Qualifications are required'],
    trim: true,
    maxlength: [200, 'Qualifications cannot exceed 200 characters']
  },
  experience: {
    type: String,
    required: [true, 'Experience is required'],
    trim: true,
    maxlength: [50, 'Experience cannot exceed 50 characters']
  },
  education: {
    type: String,
    required: [true, 'Education is required'],
    trim: true,
    maxlength: [200, 'Education cannot exceed 200 characters']
  },
  certifications: [{
    type: String,
    trim: true,
    maxlength: [100, 'Certification cannot exceed 100 characters']
  }],
  languages: [{
    type: String,
    trim: true,
    maxlength: [50, 'Language cannot exceed 50 characters']
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'on_leave'],
    default: 'active'
  },
  rating: {
    type: Number,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot be more than 5'],
    default: 0
  },
  patients: {
    type: Number,
    min: [0, 'Patient count cannot be negative'],
    default: 0
  },
  appointments: {
    type: Number,
    min: [0, 'Appointment count cannot be negative'],
    default: 0
  },
  image: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true,
    maxlength: [500, 'Address cannot exceed 500 characters']
  },
  bio: {
    type: String,
    trim: true,
    maxlength: [1000, 'Bio cannot exceed 1000 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
DoctorSchema.virtual('name').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Index for search functionality
DoctorSchema.index({ 
  firstName: 'text', 
  lastName: 'text', 
  specialization: 'text', 
  department: 'text' 
});

// Index for common queries
DoctorSchema.index({ department: 1, status: 1 });
DoctorSchema.index({ email: 1 });

export default mongoose.model<IDoctor>('Doctor', DoctorSchema);
