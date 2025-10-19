"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../../../components/auth/ProtectedRoute';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  FileText, 
  Upload, 
  CheckCircle,
  ArrowLeft,
  Send,
  BookOpen,
  GraduationCap,
  Award,
  Heart
} from 'lucide-react';
import ButtonLoader from '../../../../components/ui/ButtonLoader';

export default function NursingApplicationPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  
  const [applicationData, setApplicationData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    middleName: '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
    stateOfOrigin: '',
    lga: '',
    phoneNumber: '',
    email: '',
    address: '',
    
    // Academic Information
    program: 'BSc Nursing - 4 years',
    jambScore: '',
    jambRegNumber: '',
    olevelResults: '',
    olevelYear: '',
    previousSchool: '',
    previousQualification: '',
    
    // Health Information
    bloodGroup: '',
    genotype: '',
    medicalCondition: '',
    allergies: '',
    
    // Emergency Contact
    emergencyName: '',
    emergencyPhone: '',
    emergencyRelationship: '',
    emergencyAddress: '',
    
    // Documents
    passportPhoto: null,
    olevelCertificate: null,
    jambResult: null,
    birthCertificate: null,
    medicalReport: null,
    
    // Additional Information
    motivation: '',
    careerGoals: '',
    previousNursingExperience: '',
    references: {
      referee1: { name: '', phone: '', email: '', relationship: '' },
      referee2: { name: '', phone: '', email: '', relationship: '' }
    }
  });

  const programs = [
    { value: 'BSc Nursing - 4 years', label: 'BSc Nursing - 4 years' },
    { value: 'MSc Nursing - 2 years', label: 'MSc Nursing - 2 years' },
    { value: 'PhD Nursing - 3-5 years', label: 'PhD Nursing - 3-5 years' },
    { value: 'Postgraduate Diploma - 1 year', label: 'Postgraduate Diploma - 1 year' }
  ];

  const steps = [
    { id: 1, title: 'Personal Information', icon: User },
    { id: 2, title: 'Academic Information', icon: BookOpen },
    { id: 3, title: 'Health Information', icon: Heart },
    { id: 4, title: 'Emergency Contact', icon: Phone },
    { id: 5, title: 'Documents', icon: FileText },
    { id: 6, title: 'Additional Information', icon: GraduationCap },
    { id: 7, title: 'Review & Submit', icon: Send }
  ];

  const handleInputChange = (field, value) => {
    setApplicationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleReferenceChange = (referee, field, value) => {
    setApplicationData(prev => ({
      ...prev,
      references: {
        ...prev.references,
        [referee]: {
          ...prev.references[referee],
          [field]: value
        }
      }
    }));
  };

  const handleFileUpload = (field, file) => {
    setApplicationData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      const formData = new FormData();
      
      // Add all application data to FormData
      Object.keys(applicationData).forEach(key => {
        if (key === 'references') {
          formData.append('references', JSON.stringify(applicationData[key]));
        } else if (applicationData[key] instanceof File) {
          formData.append(key, applicationData[key]);
        } else {
          formData.append(key, applicationData[key]);
        }
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applications/nursing`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        setApplicationSubmitted(true);
      } else {
        const errorData = await response.json();
        alert(`Application failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Application error:', error);
      alert('An error occurred while submitting your application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (applicationSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted Successfully!</h1>
            <p className="text-lg text-gray-600 mb-6">
              Thank you for your interest in the School of Nursing at LAUTECH. Your application has been received and is being processed.
            </p>
            <div className="bg-green-50 rounded-2xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What happens next?</h3>
              <ul className="text-left space-y-2 text-gray-600">
                <li>• You will receive a confirmation email within 24 hours</li>
                <li>• Your application will be reviewed by our admissions committee</li>
                <li>• You will be contacted for any additional requirements</li>
                <li>• Admission decisions will be communicated within 2-3 weeks</li>
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/student/dashboard')}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <User className="w-5 h-5" />
                <span>View My Applications</span>
              </button>
              <button
                onClick={() => router.push('/schools/nursing')}
                className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
              >
                Back to School of Nursing
              </button>
              <button
                onClick={() => router.push('/')}
                className="border-2 border-green-600 text-green-600 px-6 py-3 rounded-xl font-semibold hover:bg-green-50 transition-colors"
              >
                Go to Homepage
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-900 via-green-800 to-green-700 text-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={() => router.push('/schools/nursing')}
              className="flex items-center space-x-2 text-green-200 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to School of Nursing</span>
            </button>
          </div>
          <h1 className="text-4xl font-bold mb-4">Nursing School Application</h1>
          <p className="text-xl text-green-200">
            Apply to the School of Nursing at LAUTECH Teaching Hospital
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
                    isActive ? 'bg-green-100 text-green-700' : 
                    isCompleted ? 'bg-green-50 text-green-600' : 
                    'bg-gray-100 text-gray-500'
                  }`}>
                    <Icon className="w-5 h-5" />
                    <span className="hidden sm:inline text-sm font-medium">{step.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-2 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Application Form */}
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-lg p-8">
            
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
                    <input
                      type="text"
                      value={applicationData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name *</label>
                    <input
                      type="text"
                      value={applicationData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Middle Name</label>
                    <input
                      type="text"
                      value={applicationData.middleName}
                      onChange={(e) => handleInputChange('middleName', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth *</label>
                    <input
                      type="date"
                      value={applicationData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Gender *</label>
                    <select
                      value={applicationData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nationality *</label>
                    <input
                      type="text"
                      value={applicationData.nationality}
                      onChange={(e) => handleInputChange('nationality', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">State of Origin *</label>
                    <input
                      type="text"
                      value={applicationData.stateOfOrigin}
                      onChange={(e) => handleInputChange('stateOfOrigin', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">LGA *</label>
                    <input
                      type="text"
                      value={applicationData.lga}
                      onChange={(e) => handleInputChange('lga', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      value={applicationData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      value={applicationData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Home Address *</label>
                  <textarea
                    value={applicationData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 2: Academic Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Academic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Program of Interest *</label>
                    <select
                      value={applicationData.program}
                      onChange={(e) => handleInputChange('program', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      {programs.map((program) => (
                        <option key={program.value} value={program.value}>{program.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">JAMB Score *</label>
                    <input
                      type="number"
                      value={applicationData.jambScore}
                      onChange={(e) => handleInputChange('jambScore', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">JAMB Registration Number *</label>
                    <input
                      type="text"
                      value={applicationData.jambRegNumber}
                      onChange={(e) => handleInputChange('jambRegNumber', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">O'Level Results *</label>
                    <input
                      type="text"
                      value={applicationData.olevelResults}
                      onChange={(e) => handleInputChange('olevelResults', e.target.value)}
                      placeholder="e.g., A1, B2, B3, C4, C5"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">O'Level Year *</label>
                    <input
                      type="number"
                      value={applicationData.olevelYear}
                      onChange={(e) => handleInputChange('olevelYear', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Previous School</label>
                    <input
                      type="text"
                      value={applicationData.previousSchool}
                      onChange={(e) => handleInputChange('previousSchool', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Previous Qualification</label>
                  <input
                    type="text"
                    value={applicationData.previousQualification}
                    onChange={(e) => handleInputChange('previousQualification', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Health Information */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Health Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Blood Group *</label>
                    <select
                      value={applicationData.bloodGroup}
                      onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Genotype *</label>
                    <select
                      value={applicationData.genotype}
                      onChange={(e) => handleInputChange('genotype', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Genotype</option>
                      <option value="AA">AA</option>
                      <option value="AS">AS</option>
                      <option value="SS">SS</option>
                      <option value="AC">AC</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Medical Conditions</label>
                  <textarea
                    value={applicationData.medicalCondition}
                    onChange={(e) => handleInputChange('medicalCondition', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Please list any medical conditions (if any)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Allergies</label>
                  <textarea
                    value={applicationData.allergies}
                    onChange={(e) => handleInputChange('allergies', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Please list any allergies (if any)"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Emergency Contact */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Emergency Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Emergency Contact Name *</label>
                    <input
                      type="text"
                      value={applicationData.emergencyName}
                      onChange={(e) => handleInputChange('emergencyName', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      value={applicationData.emergencyPhone}
                      onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Relationship *</label>
                    <select
                      value={applicationData.emergencyRelationship}
                      onChange={(e) => handleInputChange('emergencyRelationship', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Relationship</option>
                      <option value="Parent">Parent</option>
                      <option value="Guardian">Guardian</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Emergency Contact Address *</label>
                  <textarea
                    value={applicationData.emergencyAddress}
                    onChange={(e) => handleInputChange('emergencyAddress', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 5: Documents */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Required Documents</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Passport Photo *</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload('passportPhoto', e.target.files[0])}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">O'Level Certificate *</label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload('olevelCertificate', e.target.files[0])}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">JAMB Result *</label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload('jambResult', e.target.files[0])}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Birth Certificate *</label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload('birthCertificate', e.target.files[0])}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Medical Report</label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload('medicalReport', e.target.files[0])}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Additional Information */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Information</h2>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Motivation for Nursing *</label>
                  <textarea
                    value={applicationData.motivation}
                    onChange={(e) => handleInputChange('motivation', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Why do you want to study nursing?"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Career Goals *</label>
                  <textarea
                    value={applicationData.careerGoals}
                    onChange={(e) => handleInputChange('careerGoals', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="What are your career goals in nursing?"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Previous Nursing Experience</label>
                  <textarea
                    value={applicationData.previousNursingExperience}
                    onChange={(e) => handleInputChange('previousNursingExperience', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Describe any previous nursing or healthcare experience"
                  />
                </div>
                
                {/* References */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">References</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-700">Reference 1</h4>
                      <input
                        type="text"
                        placeholder="Name"
                        value={applicationData.references.referee1.name}
                        onChange={(e) => handleReferenceChange('referee1', 'name', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <input
                        type="tel"
                        placeholder="Phone"
                        value={applicationData.references.referee1.phone}
                        onChange={(e) => handleReferenceChange('referee1', 'phone', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={applicationData.references.referee1.email}
                        onChange={(e) => handleReferenceChange('referee1', 'email', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="Relationship"
                        value={applicationData.references.referee1.relationship}
                        onChange={(e) => handleReferenceChange('referee1', 'relationship', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-700">Reference 2</h4>
                      <input
                        type="text"
                        placeholder="Name"
                        value={applicationData.references.referee2.name}
                        onChange={(e) => handleReferenceChange('referee2', 'name', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <input
                        type="tel"
                        placeholder="Phone"
                        value={applicationData.references.referee2.phone}
                        onChange={(e) => handleReferenceChange('referee2', 'phone', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={applicationData.references.referee2.email}
                        onChange={(e) => handleReferenceChange('referee2', 'email', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="Relationship"
                        value={applicationData.references.referee2.relationship}
                        onChange={(e) => handleReferenceChange('referee2', 'relationship', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 7: Review & Submit */}
            {currentStep === 7 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Your Application</h2>
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Name:</span> {applicationData.firstName} {applicationData.lastName}
                    </div>
                    <div>
                      <span className="font-medium">Program:</span> {applicationData.program}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {applicationData.email}
                    </div>
                    <div>
                      <span className="font-medium">Phone:</span> {applicationData.phoneNumber}
                    </div>
                    <div>
                      <span className="font-medium">JAMB Score:</span> {applicationData.jambScore}
                    </div>
                    <div>
                      <span className="font-medium">Blood Group:</span> {applicationData.bloodGroup}
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-2">Important Notice</h3>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Please ensure all information is accurate and complete</li>
                    <li>• You will receive a confirmation email after submission</li>
                    <li>• Application fee payment instructions will be sent via email</li>
                    <li>• Admission decisions will be communicated within 2-3 weeks</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {currentStep < steps.length ? (
                <button
                  onClick={nextStep}
                  className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <ButtonLoader size="sm" color="white" />
                      <span className="ml-2">Submitting...</span>
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}
