"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDepartmentStatus = exports.getDepartmentStats = exports.deleteDepartment = exports.updateDepartment = exports.createDepartment = exports.getDepartmentById = exports.getAllDepartments = void 0;
const express_validator_1 = require("express-validator");
const Department_1 = __importDefault(require("../models/Department"));
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const customError_1 = __importDefault(require("../utils/customError"));
// Get all departments with filtering and pagination
exports.getAllDepartments = (0, asyncHandler_1.default)(async (req, res) => {
    const { page = 1, limit = 10, search = '', status = '', sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    // Build filter object
    const filter = {};
    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: 'i' } },
            { head: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
    }
    if (status && status !== 'all') {
        filter.status = status;
    }
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    const departments = await Department_1.default.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .select('-__v');
    const total = await Department_1.default.countDocuments(filter);
    res.status(200).json({
        success: true,
        message: 'Departments retrieved successfully',
        data: {
            departments,
            pagination: {
                currentPage: pageNum,
                totalPages: Math.ceil(total / limitNum),
                totalDepartments: total,
                hasNext: pageNum < Math.ceil(total / limitNum),
                hasPrev: pageNum > 1
            }
        }
    });
});
// Get department by ID
exports.getDepartmentById = (0, asyncHandler_1.default)(async (req, res) => {
    const { id } = req.params;
    const department = await Department_1.default.findById(id).select('-__v');
    if (!department) {
        throw new customError_1.default('Department not found', 404);
    }
    res.status(200).json({
        success: true,
        message: 'Department retrieved successfully',
        data: { department }
    });
});
// Create new department
exports.createDepartment = (0, asyncHandler_1.default)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new customError_1.default('Validation failed', 400);
    }
    const { name, description, head, status = 'active', color, icon, doctors = 0, patients = 0, appointments = 0 } = req.body;
    // Check if department already exists
    const existingDepartment = await Department_1.default.findOne({ name });
    if (existingDepartment) {
        throw new customError_1.default('Department with this name already exists', 400);
    }
    const department = await Department_1.default.create({
        name,
        description,
        head,
        status,
        color,
        icon,
        doctors,
        patients,
        appointments
    });
    res.status(201).json({
        success: true,
        message: 'Department created successfully',
        data: { department }
    });
});
// Update department
exports.updateDepartment = (0, asyncHandler_1.default)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new customError_1.default('Validation failed', 400);
    }
    const { id } = req.params;
    const updateData = req.body;
    // Check if department exists
    const existingDepartment = await Department_1.default.findById(id);
    if (!existingDepartment) {
        throw new customError_1.default('Department not found', 404);
    }
    // If name is being updated, check for duplicates
    if (updateData.name && updateData.name !== existingDepartment.name) {
        const duplicateDepartment = await Department_1.default.findOne({
            name: updateData.name,
            _id: { $ne: id }
        });
        if (duplicateDepartment) {
            throw new customError_1.default('Department with this name already exists', 400);
        }
    }
    const department = await Department_1.default.findByIdAndUpdate(id, { ...updateData, lastUpdated: new Date() }, { new: true, runValidators: true }).select('-__v');
    res.status(200).json({
        success: true,
        message: 'Department updated successfully',
        data: { department }
    });
});
// Delete department
exports.deleteDepartment = (0, asyncHandler_1.default)(async (req, res) => {
    const { id } = req.params;
    const department = await Department_1.default.findById(id);
    if (!department) {
        throw new customError_1.default('Department not found', 404);
    }
    await Department_1.default.findByIdAndDelete(id);
    res.status(200).json({
        success: true,
        message: 'Department deleted successfully'
    });
});
// Get department statistics
exports.getDepartmentStats = (0, asyncHandler_1.default)(async (req, res) => {
    const totalDepartments = await Department_1.default.countDocuments();
    const activeDepartments = await Department_1.default.countDocuments({ status: 'active' });
    const inactiveDepartments = await Department_1.default.countDocuments({ status: 'inactive' });
    const maintenanceDepartments = await Department_1.default.countDocuments({ status: 'maintenance' });
    // Get total doctors, patients, and appointments across all departments
    const stats = await Department_1.default.aggregate([
        {
            $group: {
                _id: null,
                totalDoctors: { $sum: '$doctors' },
                totalPatients: { $sum: '$patients' },
                totalAppointments: { $sum: '$appointments' }
            }
        }
    ]);
    const aggregatedStats = stats.length > 0 ? stats[0] : {
        totalDoctors: 0,
        totalPatients: 0,
        totalAppointments: 0
    };
    res.status(200).json({
        success: true,
        message: 'Department statistics retrieved successfully',
        data: {
            totalDepartments,
            activeDepartments,
            inactiveDepartments,
            maintenanceDepartments,
            ...aggregatedStats
        }
    });
});
// Update department status
exports.updateDepartmentStatus = (0, asyncHandler_1.default)(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!['active', 'inactive', 'maintenance'].includes(status)) {
        throw new customError_1.default('Invalid status. Must be active, inactive, or maintenance', 400);
    }
    const department = await Department_1.default.findByIdAndUpdate(id, { status, lastUpdated: new Date() }, { new: true, runValidators: true }).select('-__v');
    if (!department) {
        throw new customError_1.default('Department not found', 404);
    }
    res.status(200).json({
        success: true,
        message: 'Department status updated successfully',
        data: { department }
    });
});
