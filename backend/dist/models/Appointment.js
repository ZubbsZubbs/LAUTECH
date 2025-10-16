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
exports.AppointmentStatus = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var AppointmentStatus;
(function (AppointmentStatus) {
    AppointmentStatus["PENDING"] = "pending";
    AppointmentStatus["CONFIRMED"] = "confirmed";
    AppointmentStatus["CANCELLED"] = "cancelled";
    AppointmentStatus["COMPLETED"] = "completed";
    AppointmentStatus["NO_SHOW"] = "no_show";
})(AppointmentStatus || (exports.AppointmentStatus = AppointmentStatus = {}));
const appointmentSchema = new mongoose_1.Schema({
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
            validator: function (value) {
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
exports.default = mongoose_1.default.model('Appointment', appointmentSchema);
