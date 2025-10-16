"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPatientStats = exports.deletePatient = exports.updatePatient = exports.createPatient = exports.getPatientById = exports.getAllPatients = void 0;
const Patient_1 = __importDefault(require("../models/Patient"));
const express_validator_1 = require("express-validator");
// Get all patients
const getAllPatients = async (req, res) => {
    try {
        const { search, status, department, page = 1, limit = 10 } = req.query;
        // Build filter object
        const filter = {};
        if (search) {
            filter.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } }
            ];
        }
        if (status && status !== 'all') {
            filter.status = status;
        }
        if (department) {
            filter.department = department;
        }
        // Calculate pagination
        const skip = (Number(page) - 1) * Number(limit);
        // Get patients with pagination
        const patients = await Patient_1.default.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))
            .lean();
        // Get total count for pagination
        const total = await Patient_1.default.countDocuments(filter);
        res.status(200).json({
            success: true,
            data: {
                patients,
                pagination: {
                    current: Number(page),
                    pages: Math.ceil(total / Number(limit)),
                    total
                }
            }
        });
        return;
    }
    catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch patients'
        });
        return;
    }
};
exports.getAllPatients = getAllPatients;
// Get patient by ID
const getPatientById = async (req, res) => {
    try {
        const { id } = req.params;
        const patient = await Patient_1.default.findById(id);
        if (!patient) {
            res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: { patient }
        });
        return;
    }
    catch (error) {
        console.error('Error fetching patient:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch patient'
        });
        return;
    }
};
exports.getPatientById = getPatientById;
// Create new patient
const createPatient = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
            return;
        }
        const { firstName, lastName, age, gender, email, phone, address, bloodType, allergies = [], emergencyContact, medicalHistory = [], currentMedications = [], insuranceProvider, insuranceNumber, department, doctor, status = 'active', notes } = req.body;
        // Check if patient with email already exists
        const existingPatient = await Patient_1.default.findOne({ email });
        if (existingPatient) {
            res.status(400).json({
                success: false,
                message: 'Patient with this email already exists'
            });
            return;
        }
        const patient = new Patient_1.default({
            firstName,
            lastName,
            age,
            gender,
            email,
            phone,
            address,
            bloodType,
            allergies: Array.isArray(allergies) ? allergies : allergies.split(',').map((a) => a.trim()).filter((a) => a),
            emergencyContact,
            medicalHistory: Array.isArray(medicalHistory) ? medicalHistory : medicalHistory.split(',').map((h) => h.trim()).filter((h) => h),
            currentMedications: Array.isArray(currentMedications) ? currentMedications : currentMedications.split(',').map((m) => m.trim()).filter((m) => m),
            insuranceProvider,
            insuranceNumber,
            department,
            doctor,
            status,
            notes
        });
        await patient.save();
        res.status(201).json({
            success: true,
            message: 'Patient created successfully',
            data: { patient }
        });
        return;
    }
    catch (error) {
        console.error('Error creating patient:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create patient'
        });
        return;
    }
};
exports.createPatient = createPatient;
// Update patient
const updatePatient = async (req, res) => {
    try {
        const { id } = req.params;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
            return;
        }
        const updateData = { ...req.body };
        // Handle array fields
        if (updateData.allergies && typeof updateData.allergies === 'string') {
            updateData.allergies = updateData.allergies.split(',').map((a) => a.trim()).filter((a) => a);
        }
        if (updateData.medicalHistory && typeof updateData.medicalHistory === 'string') {
            updateData.medicalHistory = updateData.medicalHistory.split(',').map((h) => h.trim()).filter((h) => h);
        }
        if (updateData.currentMedications && typeof updateData.currentMedications === 'string') {
            updateData.currentMedications = updateData.currentMedications.split(',').map((m) => m.trim()).filter((m) => m);
        }
        const patient = await Patient_1.default.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!patient) {
            res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Patient updated successfully',
            data: { patient }
        });
        return;
    }
    catch (error) {
        console.error('Error updating patient:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update patient'
        });
        return;
    }
};
exports.updatePatient = updatePatient;
// Delete patient
const deletePatient = async (req, res) => {
    try {
        const { id } = req.params;
        const patient = await Patient_1.default.findByIdAndDelete(id);
        if (!patient) {
            res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Patient deleted successfully'
        });
        return;
    }
    catch (error) {
        console.error('Error deleting patient:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete patient'
        });
        return;
    }
};
exports.deletePatient = deletePatient;
// Get patient statistics
const getPatientStats = async (req, res) => {
    try {
        const totalPatients = await Patient_1.default.countDocuments();
        const activePatients = await Patient_1.default.countDocuments({ status: 'active' });
        const criticalPatients = await Patient_1.default.countDocuments({ status: 'critical' });
        const dischargedPatients = await Patient_1.default.countDocuments({ status: 'discharged' });
        // Get patients by department
        const patientsByDepartment = await Patient_1.default.aggregate([
            { $match: { department: { $exists: true, $ne: null } } },
            { $group: { _id: '$department', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        // Get patients by blood type
        const patientsByBloodType = await Patient_1.default.aggregate([
            { $group: { _id: '$bloodType', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        res.status(200).json({
            success: true,
            data: {
                totalPatients,
                activePatients,
                criticalPatients,
                dischargedPatients,
                patientsByDepartment,
                patientsByBloodType
            }
        });
        return;
    }
    catch (error) {
        console.error('Error fetching patient stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch patient statistics'
        });
        return;
    }
};
exports.getPatientStats = getPatientStats;
