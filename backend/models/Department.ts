import mongoose, { Schema, Document } from 'mongoose';

// Doctor sub-schema
const doctorSchema = new Schema({
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  image: { type: String },
  email: { type: String },
  phone: { type: String },
  experience: { type: String },
  qualifications: { type: String }
}, { _id: false });

// Facility sub-schema
const facilitySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  equipment: [{ type: String }]
}, { _id: false });

// Procedure sub-schema
const procedureSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: String },
  cost: { type: String }
}, { _id: false });

// Condition sub-schema
const conditionSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  symptoms: [{ type: String }],
  treatment: { type: String }
}, { _id: false });

// Main department schema
const departmentSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Department name is required'],
    unique: true,
    trim: true,
    maxlength: [100, 'Department name cannot exceed 100 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Department description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  head: {
    type: String,
    required: [true, 'Department head is required'],
    trim: true,
    maxlength: [100, 'Head name cannot exceed 100 characters']
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  },
  color: {
    type: String,
    required: [true, 'Department color is required'],
    trim: true
  },
  icon: {
    type: String,
    required: [true, 'Department icon is required'],
    trim: true
  },
  doctors: [doctorSchema],
  facilities: [facilitySchema],
  procedures: [procedureSchema],
  conditions: [conditionSchema],
  patients: {
    type: Number,
    default: 0,
    min: [0, 'Patient count cannot be negative']
  },
  appointments: {
    type: Number,
    default: 0,
    min: [0, 'Appointment count cannot be negative']
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create slug from name before saving
departmentSchema.pre('save', function (next) {
  if (this.isModified('name') || this.isNew || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

// Index for better query performance
departmentSchema.index({ name: 1 });
departmentSchema.index({ slug: 1 });
departmentSchema.index({ status: 1 });

// Virtual for total doctors count
departmentSchema.virtual('totalDoctors').get(function () {
  return this.doctors.length;
});

// Virtual for total facilities count
departmentSchema.virtual('totalFacilities').get(function () {
  return this.facilities.length;
});

export interface IDepartment extends Document {
  name: string;
  slug: string;
  description: string;
  head: string;
  status: 'active' | 'inactive' | 'maintenance';
  color: string;
  icon: string;
  doctors: Array<{
    name: string;
    specialization: string;
    image?: string;
    email?: string;
    phone?: string;
    experience?: string;
    qualifications?: string;
  }>;
  facilities: Array<{
    name: string;
    description: string;
    image?: string;
    equipment: string[];
  }>;
  procedures: Array<{
    name: string;
    description: string;
    duration?: string;
    cost?: string;
  }>;
  conditions: Array<{
    name: string;
    description: string;
    symptoms: string[];
    treatment?: string;
  }>;
  patients: number;
  appointments: number;
  lastUpdated: Date;
  totalDoctors: number;
  totalFacilities: number;
  createdAt: Date;
  updatedAt: Date;
}

export default mongoose.model<IDepartment>('Department', departmentSchema);
