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
const PatientSchema = new mongoose_1.Schema({
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
PatientSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});
// Ensure virtual fields are serialized
PatientSchema.set('toJSON', {
    virtuals: true
});
exports.default = mongoose_1.default.model('Patient', PatientSchema);
