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
const DepartmentSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Department name is required'],
        unique: true,
        trim: true,
        maxlength: [100, 'Department name cannot exceed 100 characters']
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
        maxlength: [100, 'Department head name cannot exceed 100 characters']
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
    doctors: {
        type: Number,
        default: 0,
        min: [0, 'Doctor count cannot be negative']
    },
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
// Index for better query performance
DepartmentSchema.index({ name: 1 });
DepartmentSchema.index({ status: 1 });
DepartmentSchema.index({ head: 1 });
// Virtual for department ID - removed due to TypeScript issues
// The _id field will be automatically converted to string in JSON responses
// Pre-save middleware to update lastUpdated
DepartmentSchema.pre('save', function (next) {
    this.lastUpdated = new Date();
    next();
});
exports.default = mongoose_1.default.model('Department', DepartmentSchema);
