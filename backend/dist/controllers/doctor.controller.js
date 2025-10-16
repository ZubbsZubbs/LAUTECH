"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchDoctors = exports.updateDoctorStatus = exports.getDoctorStats = exports.deleteDoctor = exports.updateDoctor = exports.createDoctor = exports.getDoctorById = exports.getAllDoctors = void 0;
const express_validator_1 = require("express-validator");
const Doctor_1 = __importDefault(require("../models/Doctor"));
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const customError_1 = __importDefault(require("../utils/customError"));
// Get all doctors with filtering and pagination
exports.getAllDoctors = (0, asyncHandler_1.default)(async (req, res) => {
    const { page = 1, limit = 10, search = '', department = '', status = '', sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    // Build filter object
    const filter = {};
    if (search) {
        filter.$or = [
            { firstName: { $regex: search, $options: 'i' } },
            { lastName: { $regex: search, $options: 'i' } },
            { specialization: { $regex: search, $options: 'i' } },
            { department: { $regex: search, $options: 'i' } }
        ];
    }
    if (department && department !== 'all') {
        filter.department = department;
    }
    if (status && status !== 'all') {
        filter.status = status;
    }
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    const doctors = await Doctor_1.default.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .select('-__v');
    const total = await Doctor_1.default.countDocuments(filter);
    res.status(200).json({
        success: true,
        message: 'Doctors retrieved successfully',
        data: {
            doctors,
            pagination: {
                currentPage: pageNum,
                totalPages: Math.ceil(total / limitNum),
                totalDoctors: total,
                hasNext: pageNum < Math.ceil(total / limitNum),
                hasPrev: pageNum > 1
            }
        }
    });
});
// Get doctor by ID
exports.getDoctorById = (0, asyncHandler_1.default)(async (req, res) => {
    const { id } = req.params;
    const doctor = await Doctor_1.default.findById(id).select('-__v');
    if (!doctor) {
        throw new customError_1.default('Doctor not found', 404);
    }
    res.status(200).json({
        success: true,
        message: 'Doctor retrieved successfully',
        data: { doctor }
    });
});
// Create new doctor
exports.createDoctor = (0, asyncHandler_1.default)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
        return;
    }
    const { firstName, lastName, email, phone, department, specialization, qualifications, experience, education, certifications = [], languages = [], status = 'active', image, address, bio } = req.body;
    // Check if doctor with email already exists
    const existingDoctor = await Doctor_1.default.findOne({ email });
    if (existingDoctor) {
        throw new customError_1.default('Doctor with this email already exists', 400);
    }
    const doctor = new Doctor_1.default({
        firstName,
        lastName,
        email,
        phone,
        department,
        specialization,
        qualifications,
        experience,
        education,
        certifications: Array.isArray(certifications) ? certifications : certifications.split(',').map((c) => c.trim()).filter((c) => c),
        languages: Array.isArray(languages) ? languages : languages.split(',').map((l) => l.trim()).filter((l) => l),
        status,
        image,
        address,
        bio
    });
    await doctor.save();
    res.status(201).json({
        success: true,
        message: 'Doctor created successfully',
        data: { doctor }
    });
});
// Update doctor
exports.updateDoctor = (0, asyncHandler_1.default)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
        return;
    }
    const { id } = req.params;
    const updateData = req.body;
    // If email is being updated, check for duplicates
    if (updateData.email) {
        const existingDoctor = await Doctor_1.default.findOne({
            email: updateData.email,
            _id: { $ne: id }
        });
        if (existingDoctor) {
            throw new customError_1.default('Doctor with this email already exists', 400);
        }
    }
    // Handle array fields
    if (updateData.certifications && typeof updateData.certifications === 'string') {
        updateData.certifications = updateData.certifications.split(',').map((c) => c.trim()).filter((c) => c);
    }
    if (updateData.languages && typeof updateData.languages === 'string') {
        updateData.languages = updateData.languages.split(',').map((l) => l.trim()).filter((l) => l);
    }
    const doctor = await Doctor_1.default.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).select('-__v');
    if (!doctor) {
        throw new customError_1.default('Doctor not found', 404);
    }
    res.status(200).json({
        success: true,
        message: 'Doctor updated successfully',
        data: { doctor }
    });
});
// Delete doctor
exports.deleteDoctor = (0, asyncHandler_1.default)(async (req, res) => {
    const { id } = req.params;
    const doctor = await Doctor_1.default.findByIdAndDelete(id);
    if (!doctor) {
        throw new customError_1.default('Doctor not found', 404);
    }
    res.status(200).json({
        success: true,
        message: 'Doctor deleted successfully'
    });
});
// Get doctor statistics
exports.getDoctorStats = (0, asyncHandler_1.default)(async (req, res) => {
    const totalDoctors = await Doctor_1.default.countDocuments();
    const activeDoctors = await Doctor_1.default.countDocuments({ status: 'active' });
    const inactiveDoctors = await Doctor_1.default.countDocuments({ status: 'inactive' });
    const onLeaveDoctors = await Doctor_1.default.countDocuments({ status: 'on_leave' });
    // Get department-wise statistics
    const departmentStats = await Doctor_1.default.aggregate([
        {
            $group: {
                _id: '$department',
                count: { $sum: 1 },
                activeCount: {
                    $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
                }
            }
        },
        {
            $sort: { count: -1 }
        }
    ]);
    // Get average rating
    const avgRatingResult = await Doctor_1.default.aggregate([
        {
            $group: {
                _id: null,
                averageRating: { $avg: '$rating' }
            }
        }
    ]);
    const averageRating = avgRatingResult.length > 0 ? avgRatingResult[0].averageRating : 0;
    res.status(200).json({
        success: true,
        message: 'Doctor statistics retrieved successfully',
        data: {
            totalDoctors,
            activeDoctors,
            inactiveDoctors,
            onLeaveDoctors,
            departmentStats,
            averageRating: Math.round(averageRating * 10) / 10
        }
    });
});
// Update doctor status
exports.updateDoctorStatus = (0, asyncHandler_1.default)(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!['active', 'inactive', 'on_leave'].includes(status)) {
        throw new customError_1.default('Invalid status. Must be active, inactive, or on_leave', 400);
    }
    const doctor = await Doctor_1.default.findByIdAndUpdate(id, { status }, { new: true, runValidators: true }).select('-__v');
    if (!doctor) {
        throw new customError_1.default('Doctor not found', 404);
    }
    res.status(200).json({
        success: true,
        message: 'Doctor status updated successfully',
        data: { doctor }
    });
});
// Search doctors
exports.searchDoctors = (0, asyncHandler_1.default)(async (req, res) => {
    const { q, department, status } = req.query;
    if (!q || q.trim().length < 2) {
        throw new customError_1.default('Search query must be at least 2 characters long', 400);
    }
    const filter = {
        $or: [
            { firstName: { $regex: q, $options: 'i' } },
            { lastName: { $regex: q, $options: 'i' } },
            { specialization: { $regex: q, $options: 'i' } },
            { department: { $regex: q, $options: 'i' } }
        ]
    };
    if (department && department !== 'all') {
        filter.department = department;
    }
    if (status && status !== 'all') {
        filter.status = status;
    }
    const doctors = await Doctor_1.default.find(filter)
        .select('-__v')
        .limit(20);
    res.status(200).json({
        success: true,
        message: 'Search completed successfully',
        data: { doctors }
    });
});
