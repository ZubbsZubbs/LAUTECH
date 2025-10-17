import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Department from '../models/Department';
import Patient from '../models/Patient';
import Doctor from '../models/Doctor';
import asyncHandler from '../utils/asyncHandler';
import CustomError from '../utils/customError';

// Get all departments with filtering and pagination
export const getAllDepartments = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { page = 1, limit = 10, search = '', status = '', sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const skip = (pageNum - 1) * limitNum;

  // Build filter object
  const filter: any = {};
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
  const sort: any = {};
  sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

  const departments = await Department.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limitNum)
    .select('-__v');

  const total = await Department.countDocuments(filter);

  // Calculate real-time patient and doctor counts
  const departmentsWithRealCounts = await Promise.all(
    departments.map(async (dept) => {
      const patientCount = await Patient.countDocuments({ 
        department: dept.name, 
        status: { $ne: 'discharged' } 
      });
      
      const doctorCount = await Doctor.countDocuments({
        department: dept.name,
        status: 'active'
      });
      
      const deptObj = dept.toObject();
      deptObj.patients = patientCount; // Override with real count
      deptObj.doctors = doctorCount > 0 ? Array(doctorCount).fill(null) : []; // Create array with length
      return deptObj;
    })
  );

  res.status(200).json({
    success: true,
    message: 'Departments retrieved successfully',
    data: {
      departments: departmentsWithRealCounts,
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
export const getDepartmentById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const department = await Department.findById(id).select('-__v');
  
  if (!department) {
    throw new CustomError('Department not found', 404);
  }

  // Calculate real-time patient and doctor counts
  const patientCount = await Patient.countDocuments({ 
    department: department.name, 
    status: { $ne: 'discharged' } 
  });

  const doctorCount = await Doctor.countDocuments({
    department: department.name,
    status: 'active'
  });

  const deptObj = department.toObject();
  deptObj.patients = patientCount; // Override with real count
  deptObj.doctors = doctorCount > 0 ? Array(doctorCount).fill(null) : []; // Create array with length

  res.status(200).json({
    success: true,
    message: 'Department retrieved successfully',
    data: { department: deptObj }
  });
});

// Get department by slug
export const getDepartmentBySlug = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { slug } = req.params;
  const department = await Department.findOne({ slug }).select('-__v');
  
  if (!department) {
    throw new CustomError('Department not found', 404);
  }

  // Calculate real-time patient and doctor counts
  const patientCount = await Patient.countDocuments({ 
    department: department.name, 
    status: { $ne: 'discharged' } 
  });

  const doctorCount = await Doctor.countDocuments({
    department: department.name,
    status: 'active'
  });

  // Clean up the department data to ensure arrays are properly formatted
  const cleanedDepartment = {
    ...department.toObject(),
    doctors: doctorCount > 0 ? Array(doctorCount).fill(null) : [], // Create array with length
    facilities: Array.isArray(department.facilities) ? department.facilities : [],
    procedures: Array.isArray(department.procedures) ? department.procedures : [],
    conditions: Array.isArray(department.conditions) ? department.conditions : [],
    patients: patientCount // Override with real count
  };

  res.status(200).json({
    success: true,
    message: 'Department retrieved successfully',
    data: { department: cleanedDepartment }
  });
});

// Create new department
export const createDepartment = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new CustomError('Validation failed', 400);
  }

  const { 
    name, 
    description, 
    head, 
    status = 'active', 
    color, 
    icon, 
    doctors = [], 
    facilities = [], 
    procedures = [], 
    conditions = [], 
    patients = 0, 
    appointments = 0 
  } = req.body;

  // Check if department already exists
  const existingDepartment = await Department.findOne({ name });
  if (existingDepartment) {
    throw new CustomError('Department with this name already exists', 400);
  }

  const department = await Department.create({
    name,
    description,
    head,
    status,
    color,
    icon,
    doctors,
    facilities,
    procedures,
    conditions,
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
export const updateDepartment = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new CustomError('Validation failed', 400);
  }

  const { id } = req.params;
  const updateData = req.body;

  // Check if department exists
  const existingDepartment = await Department.findById(id);
  if (!existingDepartment) {
    throw new CustomError('Department not found', 404);
  }

  // If name is being updated, check for duplicates
  if (updateData.name && updateData.name !== existingDepartment.name) {
    const duplicateDepartment = await Department.findOne({
      name: updateData.name,
      _id: { $ne: id }
    });
    if (duplicateDepartment) {
      throw new CustomError('Department with this name already exists', 400);
    }
  }

  const department = await Department.findByIdAndUpdate(
    id, 
    { ...updateData, lastUpdated: new Date() }, 
    { new: true, runValidators: true }
  ).select('-__v');

  res.status(200).json({
    success: true,
    message: 'Department updated successfully',
    data: { department }
  });
});

// Delete department
export const deleteDepartment = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const department = await Department.findById(id);
  
  if (!department) {
    throw new CustomError('Department not found', 404);
  }

  await Department.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: 'Department deleted successfully'
  });
});

// Get department statistics
export const getDepartmentStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const totalDepartments = await Department.countDocuments();
  const activeDepartments = await Department.countDocuments({ status: 'active' });
  const inactiveDepartments = await Department.countDocuments({ status: 'inactive' });
  const maintenanceDepartments = await Department.countDocuments({ status: 'maintenance' });

  // Get real-time patient count (excluding discharged patients)
  const totalPatients = await Patient.countDocuments({ status: { $ne: 'discharged' } });

  // Get total appointments and doctors from departments
  const stats = await Department.aggregate([
    {
      $group: {
        _id: null,
        totalAppointments: { $sum: '$appointments' },
        totalDoctors: { $sum: { $size: '$doctors' } }
      }
    }
  ]);

  const result = stats[0] || { totalAppointments: 0, totalDoctors: 0 };

  res.status(200).json({
    success: true,
    message: 'Department statistics retrieved successfully',
    data: {
      totalDepartments,
      activeDepartments,
      inactiveDepartments,
      maintenanceDepartments,
      totalPatients,
      ...result
    }
  });
});

// Update department status
export const updateDepartmentStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['active', 'inactive', 'maintenance'].includes(status)) {
    throw new CustomError('Invalid status. Must be active, inactive, or maintenance', 400);
  }

  const department = await Department.findByIdAndUpdate(
    id, 
    { status, lastUpdated: new Date() }, 
    { new: true, runValidators: true }
  ).select('-__v');

  if (!department) {
    throw new CustomError('Department not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Department status updated successfully',
    data: { department }
  });
});
