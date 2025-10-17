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
// Doctor sub-schema
const doctorSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    specialization: { type: String, required: true },
    image: { type: String },
    email: { type: String },
    phone: { type: String },
    experience: { type: String },
    qualifications: { type: String }
}, { _id: false });
// Facility sub-schema
const facilitySchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    equipment: [{ type: String }]
}, { _id: false });
// Procedure sub-schema
const procedureSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: String },
    cost: { type: String }
}, { _id: false });
// Condition sub-schema
const conditionSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    symptoms: [{ type: String }],
    treatment: { type: String }
}, { _id: false });
// Main department schema
const departmentSchema = new mongoose_1.Schema({
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
exports.default = mongoose_1.default.model('Department', departmentSchema);
