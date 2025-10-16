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
exports.ProgramType = exports.ApplicationStatus = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var ApplicationStatus;
(function (ApplicationStatus) {
    ApplicationStatus["PENDING"] = "pending";
    ApplicationStatus["UNDER_REVIEW"] = "under_review";
    ApplicationStatus["APPROVED"] = "approved";
    ApplicationStatus["REJECTED"] = "rejected";
    ApplicationStatus["WAITLISTED"] = "waitlisted";
})(ApplicationStatus || (exports.ApplicationStatus = ApplicationStatus = {}));
var ProgramType;
(function (ProgramType) {
    ProgramType["BSC_NURSING"] = "BSc Nursing - 4 years";
    ProgramType["MSC_NURSING"] = "MSc Nursing - 2 years";
    ProgramType["PHD_NURSING"] = "PhD Nursing - 3-5 years";
    ProgramType["POSTGRADUATE_DIPLOMA"] = "Postgraduate Diploma - 1 year";
})(ProgramType || (exports.ProgramType = ProgramType = {}));
const applicationSchema = new mongoose_1.Schema({
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
applicationSchema.pre('save', function (next) {
    if (!this.applicationNumber) {
        const year = new Date().getFullYear();
        const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        this.applicationNumber = `LAUTECH-NUR-${year}-${randomNum}`;
    }
    next();
});
exports.default = mongoose_1.default.model('Application', applicationSchema);
