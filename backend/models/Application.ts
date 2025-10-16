import mongoose, { Document, Schema } from 'mongoose';

export enum ApplicationStatus {
  PENDING = 'pending',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  WAITLISTED = 'waitlisted'
}

export enum ProgramType {
  BSC_NURSING = 'BSc Nursing - 4 years',
  MSC_NURSING = 'MSc Nursing - 2 years',
  PHD_NURSING = 'PhD Nursing - 3-5 years',
  POSTGRADUATE_DIPLOMA = 'Postgraduate Diploma - 1 year'
}

export interface IApplication extends Document {
  // Personal Information
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: Date;
  gender: string;
  nationality: string;
  stateOfOrigin: string;
  lga: string;
  phoneNumber: string;
  email: string;
  address: string;
  
  // Academic Information
  program: ProgramType;
  jambScore: number;
  jambRegNumber: string;
  olevelResults: string;
  olevelYear: number;
  previousSchool?: string;
  previousQualification?: string;
  
  // Health Information
  bloodGroup: string;
  genotype: string;
  medicalCondition?: string;
  allergies?: string;
  
  // Emergency Contact
  emergencyName: string;
  emergencyPhone: string;
  emergencyRelationship: string;
  emergencyAddress: string;
  
  // Documents
  passportPhoto?: string;
  olevelCertificate?: string;
  jambResult?: string;
  birthCertificate?: string;
  medicalReport?: string;
  
  // Additional Information
  motivation: string;
  careerGoals: string;
  previousNursingExperience?: string;
  references: {
    referee1: {
      name: string;
      phone: string;
      email: string;
      relationship: string;
    };
    referee2: {
      name: string;
      phone: string;
      email: string;
      relationship: string;
    };
  };
  
  // Application Management
  status: ApplicationStatus;
  applicationNumber: string;
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  notes?: string;
  admissionDecision?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema<IApplication>({
  // Personal Information
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  middleName: String,
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female']
  },
  nationality: {
    type: String,
    required: true
  },
  stateOfOrigin: {
    type: String,
    required: true
  },
  lga: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  address: {
    type: String,
    required: true
  },
  
  // Academic Information
  program: {
    type: String,
    required: true,
    enum: Object.values(ProgramType)
  },
  jambScore: {
    type: Number,
    required: true
  },
  jambRegNumber: {
    type: String,
    required: true
  },
  olevelResults: {
    type: String,
    required: true
  },
  olevelYear: {
    type: Number,
    required: true
  },
  previousSchool: String,
  previousQualification: String,
  
  // Health Information
  bloodGroup: {
    type: String,
    required: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  genotype: {
    type: String,
    required: true,
    enum: ['AA', 'AS', 'SS', 'AC']
  },
  medicalCondition: String,
  allergies: String,
  
  // Emergency Contact
  emergencyName: {
    type: String,
    required: true
  },
  emergencyPhone: {
    type: String,
    required: true
  },
  emergencyRelationship: {
    type: String,
    required: true
  },
  emergencyAddress: {
    type: String,
    required: true
  },
  
  // Documents
  passportPhoto: String,
  olevelCertificate: String,
  jambResult: String,
  birthCertificate: String,
  medicalReport: String,
  
  // Additional Information
  motivation: {
    type: String,
    required: true
  },
  careerGoals: {
    type: String,
    required: true
  },
  previousNursingExperience: String,
  references: {
    referee1: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
      relationship: { type: String, required: true }
    },
    referee2: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
      relationship: { type: String, required: true }
    }
  },
  
  // Application Management
  status: {
    type: String,
    enum: Object.values(ApplicationStatus),
    default: ApplicationStatus.PENDING
  },
  applicationNumber: {
    type: String,
    unique: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: Date,
  reviewedBy: String,
  notes: String,
  admissionDecision: String
}, {
  timestamps: true
});

// Generate application number before saving
applicationSchema.pre('save', function(next) {
  if (!this.applicationNumber) {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.applicationNumber = `LAUTECH-NUR-${year}-${randomNum}`;
  }
  next();
});

export default mongoose.model<IApplication>('Application', applicationSchema);
