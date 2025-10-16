import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Doctor from '../models/Doctor';
import asyncHandler from '../utils/asyncHandler';
import CustomError from '../utils/customError';

// Get all doctors with filtering and pagination
export const getAllDoctors = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const {
    page = 1,
    limit = 10,
    search = '',
    department = '',
    status = '',
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const skip = (pageNum - 1) * limitNum;

  // Build filter object
  const filter: any = {};

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
  const sort: any = {};
  sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

  const doctors = await Doctor.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limitNum)
    .select('-__v');

  const total = await Doctor.countDocuments(filter);

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
export const getDoctorById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const doctor = await Doctor.findById(id).select('-__v');

  if (!doctor) {
    throw new CustomError('Doctor not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Doctor retrieved successfully',
    data: { doctor }
  });
});

// Create new doctor
export const createDoctor = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
    return;
  }

  const {
    firstName,
    lastName,
    email,
    phone,
    department,
    specialization,
    qualifications,
    experience,
    education,
    certifications = [],
    languages = [],
    status = 'active',
    image,
    address,
    bio
  } = req.body;

  // Check if doctor with email already exists
  const existingDoctor = await Doctor.findOne({ email });
  if (existingDoctor) {
    throw new CustomError('Doctor with this email already exists', 400);
  }

  const doctor = new Doctor({
    firstName,
    lastName,
    email,
    phone,
    department,
    specialization,
    qualifications,
    experience,
    education,
    certifications: Array.isArray(certifications) ? certifications : certifications.split(',').map((c: string) => c.trim()).filter((c: string) => c),
    languages: Array.isArray(languages) ? languages : languages.split(',').map((l: string) => l.trim()).filter((l: string) => l),
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
export const updateDoctor = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
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
    const existingDoctor = await Doctor.findOne({ 
      email: updateData.email, 
      _id: { $ne: id } 
    });
    if (existingDoctor) {
      throw new CustomError('Doctor with this email already exists', 400);
    }
  }

  // Handle array fields
  if (updateData.certifications && typeof updateData.certifications === 'string') {
    updateData.certifications = updateData.certifications.split(',').map((c: string) => c.trim()).filter((c: string) => c);
  }
  if (updateData.languages && typeof updateData.languages === 'string') {
    updateData.languages = updateData.languages.split(',').map((l: string) => l.trim()).filter((l: string) => l);
  }

  const doctor = await Doctor.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  ).select('-__v');

  if (!doctor) {
    throw new CustomError('Doctor not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Doctor updated successfully',
    data: { doctor }
  });
});

// Delete doctor
export const deleteDoctor = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const doctor = await Doctor.findByIdAndDelete(id);

  if (!doctor) {
    throw new CustomError('Doctor not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Doctor deleted successfully'
  });
});

// Get doctor statistics
export const getDoctorStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const totalDoctors = await Doctor.countDocuments();
  const activeDoctors = await Doctor.countDocuments({ status: 'active' });
  const inactiveDoctors = await Doctor.countDocuments({ status: 'inactive' });
  const onLeaveDoctors = await Doctor.countDocuments({ status: 'on_leave' });

  // Get department-wise statistics
  const departmentStats = await Doctor.aggregate([
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
  const avgRatingResult = await Doctor.aggregate([
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
export const updateDoctorStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['active', 'inactive', 'on_leave'].includes(status)) {
    throw new CustomError('Invalid status. Must be active, inactive, or on_leave', 400);
  }

  const doctor = await Doctor.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  ).select('-__v');

  if (!doctor) {
    throw new CustomError('Doctor not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Doctor status updated successfully',
    data: { doctor }
  });
});

// Search doctors
export const searchDoctors = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { q, department, status } = req.query;

  if (!q || (q as string).trim().length < 2) {
    throw new CustomError('Search query must be at least 2 characters long', 400);
  }

  const filter: any = {
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

  const doctors = await Doctor.find(filter)
    .select('-__v')
    .limit(20);

  res.status(200).json({
    success: true,
    message: 'Search completed successfully',
    data: { doctors }
  });
});
