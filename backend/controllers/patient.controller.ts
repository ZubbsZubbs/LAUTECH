import { Request, Response } from 'express';
import Patient, { IPatient } from '../models/Patient';
import { validationResult } from 'express-validator';

// Get all patients
export const getAllPatients = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, status, department, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const filter: any = {};
    
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
    const patients = await Patient.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    // Get total count for pagination
    const total = await Patient.countDocuments(filter);

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
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch patients'
    });
    return;
  }
};

// Get patient by ID
export const getPatientById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const patient = await Patient.findById(id);
    
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
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch patient'
    });
    return;
  }
};

// Create new patient
export const createPatient = async (req: Request, res: Response): Promise<void> => {
  try {
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
      age,
      gender,
      email,
      phone,
      address,
      bloodType,
      allergies = [],
      emergencyContact,
      medicalHistory = [],
      currentMedications = [],
      insuranceProvider,
      insuranceNumber,
      department,
      doctor,
      status = 'active',
      notes
    } = req.body;

    // Check if patient with email already exists
    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) {
      res.status(400).json({
        success: false,
        message: 'Patient with this email already exists'
      });
      return;
    }

    const patient = new Patient({
      firstName,
      lastName,
      age,
      gender,
      email,
      phone,
      address,
      bloodType,
      allergies: Array.isArray(allergies) ? 
        allergies.filter((a: string) => a && a.toLowerCase() !== 'none') : 
        allergies.split(',').map((a: string) => a.trim()).filter((a: string) => a && a.toLowerCase() !== 'none'),
      emergencyContact,
      medicalHistory: Array.isArray(medicalHistory) ? medicalHistory : medicalHistory.split(',').map((h: string) => h.trim()).filter((h: string) => h),
      currentMedications: Array.isArray(currentMedications) ? currentMedications : currentMedications.split(',').map((m: string) => m.trim()).filter((m: string) => m),
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
  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create patient'
    });
    return;
  }
};

// Update patient
export const updatePatient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const errors = validationResult(req);
    
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
      updateData.allergies = updateData.allergies.split(',').map((a: string) => a.trim()).filter((a: string) => a && a.toLowerCase() !== 'none');
    }
    if (updateData.medicalHistory && typeof updateData.medicalHistory === 'string') {
      updateData.medicalHistory = updateData.medicalHistory.split(',').map((h: string) => h.trim()).filter((h: string) => h);
    }
    if (updateData.currentMedications && typeof updateData.currentMedications === 'string') {
      updateData.currentMedications = updateData.currentMedications.split(',').map((m: string) => m.trim()).filter((m: string) => m);
    }

    const patient = await Patient.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

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
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update patient'
    });
    return;
  }
};

// Delete patient
export const deletePatient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const patient = await Patient.findByIdAndDelete(id);
    
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
  } catch (error) {
    console.error('Error deleting patient:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete patient'
    });
    return;
  }
};

// Get patient statistics
export const getPatientStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalPatients = await Patient.countDocuments();
    const activePatients = await Patient.countDocuments({ status: 'active' });
    const criticalPatients = await Patient.countDocuments({ status: 'critical' });
    const dischargedPatients = await Patient.countDocuments({ status: 'discharged' });
    
    // Get patients by department
    const patientsByDepartment = await Patient.aggregate([
      { $match: { department: { $exists: true, $ne: null } } },
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get patients by blood type
    const patientsByBloodType = await Patient.aggregate([
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
  } catch (error) {
    console.error('Error fetching patient stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch patient statistics'
    });
    return;
  }
};
