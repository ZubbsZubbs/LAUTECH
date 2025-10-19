"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { 
  FileText, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye,
  Filter,
  Search,
  Download,
  Send,
  Edit3,
  AlertCircle,
  X
} from "lucide-react";
import StatusUpdateModal from "../../../components/StatusUpdateModal";
import QuickStatusActions from "../../../components/QuickStatusActions";
import Loader from "../../../components/ui/Loader";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    program: '',
    search: ''
  });
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    underReview: 0,
    approved: 0,
    rejected: 0
  });
  
  const { token, isAuthenticated } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    console.log('Applications page - token:', token);
    console.log('Applications page - isAuthenticated:', isAuthenticated);
    console.log('Applications page - localStorage token:', localStorage.getItem('authToken'));
    console.log('Applications page - localStorage userData:', localStorage.getItem('userData'));
    
    // Since backend doesn't require auth for now, fetch data regardless of token
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      console.log('Fetching applications with token:', token);
      console.log('API URL:', `${process.env.NEXT_PUBLIC_API_URL}/api/applications`);
      
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.program) queryParams.append('program', filters.program);
      if (filters.search) queryParams.append('search', filters.search);
      
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/applications?${queryParams}`;
      console.log('Full URL:', url);
      
      const response = await fetch(url, {
        // No auth headers needed for now since backend doesn't require auth
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log('Applications data:', data);
        console.log('First application:', data.data.applications[0]);
        if (data.data.applications[0]) {
          console.log('Document fields in first application:');
          console.log('passportPhoto:', data.data.applications[0].passportPhoto);
          console.log('olevelCertificate:', data.data.applications[0].olevelCertificate);
          console.log('jambResult:', data.data.applications[0].jambResult);
          console.log('birthCertificate:', data.data.applications[0].birthCertificate);
          console.log('medicalReport:', data.data.applications[0].medicalReport);
        }
        setApplications(data.data.applications);
        // Calculate stats from applications data
        calculateStats(data.data.applications);
      } else {
        const errorData = await response.json();
        console.error('API Error:', errorData);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (applications) => {
    const stats = {
      total: applications.length,
      pending: applications.filter(app => app.status === 'pending').length,
      underReview: applications.filter(app => app.status === 'under_review').length,
      approved: applications.filter(app => app.status === 'approved').length,
      rejected: applications.filter(app => app.status === 'rejected').length
    };
    console.log('Calculated stats:', stats);
    setStats(stats);
  };

  const updateApplicationStatus = async (applicationId, status, notes = '', admissionDecision = '') => {
    setStatusUpdateLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applications/${applicationId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, notes, admissionDecision }),
      });

      if (response.ok) {
        await fetchApplications();
        setShowModal(false);
        setShowStatusModal(false);
        setSelectedApplication(null);
        
        // Show success notification
        setNotification({
          type: 'success',
          message: 'Application status updated successfully! The applicant has been notified via email.',
          show: true
        });
        
        // Auto-hide notification after 5 seconds
        setTimeout(() => {
          setNotification(null);
        }, 5000);
      } else {
        const errorData = await response.json();
        setNotification({
          type: 'error',
          message: `Failed to update application status: ${errorData.message || 'Unknown error'}`,
          show: true
        });
      }
    } catch (error) {
      console.error('Error updating application:', error);
      setNotification({
        type: 'error',
        message: 'An error occurred while updating the application. Please try again.',
        show: true
      });
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const startApplicationReview = async (applicationId, notes = '') => {
    setStatusUpdateLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applications/${applicationId}/start-review`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ notes }),
      });

      if (response.ok) {
        await fetchApplications();
        setNotification({
          type: 'success',
          message: 'Application review started! The applicant has been notified via email.',
          show: true
        });
        
        setTimeout(() => {
          setNotification(null);
        }, 5000);
      } else {
        const errorData = await response.json();
        setNotification({
          type: 'error',
          message: `Failed to start review: ${errorData.message || 'Unknown error'}`,
          show: true
        });
      }
    } catch (error) {
      console.error('Error starting review:', error);
      setNotification({
        type: 'error',
        message: 'An error occurred while starting the review. Please try again.',
        show: true
      });
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'waitlisted': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'under_review': return <Eye className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'waitlisted': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return <Loader text="Loading applications..." fullScreen />;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Nursing Applications</h1>
        <p className="text-gray-600">Manage and review nursing school applications</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Under Review</p>
              <p className="text-2xl font-bold text-gray-900">{stats.underReview || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">{stats.approved || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">{stats.rejected || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="waitlisted">Waitlisted</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Program</label>
            <select
              value={filters.program}
              onChange={(e) => setFilters({...filters, program: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Programs</option>
              <option value="BSc Nursing">BSc Nursing</option>
              <option value="MSc Nursing">MSc Nursing</option>
              <option value="PhD Nursing">PhD Nursing</option>
              <option value="Postgraduate Diploma">Postgraduate Diploma</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              placeholder="Search by name or email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={fetchApplications}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Application
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Program
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Documents
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((application, index) => (
                <tr key={application._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-500">
                      {index + 1}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {application.applicationNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {application.firstName} {application.lastName}
                    </div>
                    <div className="text-sm text-gray-500">{application.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {application.program}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                      {getStatusIcon(application.status)}
                      <span className="ml-1 capitalize">{application.status.replace('_', ' ')}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex flex-wrap gap-1">
                      {application.passportPhoto && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Photo
                        </span>
                      )}
                      {application.olevelCertificate && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          O'Level
                        </span>
                      )}
                      {application.jambResult && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          JAMB
                        </span>
                      )}
                      {application.birthCertificate && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Birth Cert
                        </span>
                      )}
                      {application.medicalReport && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Medical
                        </span>
                      )}
                      {!application.passportPhoto && 
                       !application.olevelCertificate &&
                       !application.jambResult && 
                       !application.birthCertificate && 
                       !application.medicalReport && (
                        <span className="text-gray-400 text-xs">No documents</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(application.submittedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-1">
                      <button
                        onClick={() => {
                          setSelectedApplication(application);
                          setShowModal(true);
                        }}
                        className="inline-flex items-center justify-center w-8 h-8 text-blue-600 hover:text-blue-900 rounded-md hover:bg-blue-50 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedApplication(application);
                          setShowStatusModal(true);
                        }}
                        className="inline-flex items-center justify-center w-8 h-8 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-50 transition-colors"
                        title="Update Status"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <QuickStatusActions
                        application={application}
                        onStatusUpdate={updateApplicationStatus}
                        loading={statusUpdateLoading}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Application Details Modal */}
      {showModal && selectedApplication && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Application Details - {selectedApplication.applicationNumber}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="text-sm text-gray-900">
                      {selectedApplication.firstName} {selectedApplication.lastName}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-sm text-gray-900">{selectedApplication.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="text-sm text-gray-900">{selectedApplication.phoneNumber}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Program</label>
                    <p className="text-sm text-gray-900">{selectedApplication.program}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">JAMB Score</label>
                    <p className="text-sm text-gray-900">{selectedApplication.jambScore}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedApplication.status)}`}>
                      {getStatusIcon(selectedApplication.status)}
                      <span className="ml-1 capitalize">{selectedApplication.status.replace('_', ' ')}</span>
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Motivation</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedApplication.motivation}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Career Goals</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedApplication.careerGoals}</p>
                </div>
                
                {/* Documents Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Submitted Documents</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedApplication.passportPhoto && (
                      <div className="border rounded-lg p-3">
                        <h4 className="font-medium text-gray-900 mb-2">Passport Photo</h4>
                        <div className="flex items-center space-x-2">
                          <img 
                            src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/applications/${selectedApplication.passportPhoto}`}
                            alt="Passport Photo"
                            className="w-16 h-16 object-cover rounded border"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'block';
                            }}
                          />
                          <div style={{display: 'none'}} className="w-16 h-16 bg-gray-200 rounded border flex items-center justify-center text-xs text-gray-500">
                            Image
                          </div>
                          <a 
                            href={`${process.env.NEXT_PUBLIC_API_URL}/uploads/applications/${selectedApplication.passportPhoto}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            View Full Size
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {selectedApplication.olevelCertificate && (
                      <div className="border rounded-lg p-3">
                        <h4 className="font-medium text-gray-900 mb-2">O'Level Certificate</h4>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 h-16 bg-red-100 rounded border flex items-center justify-center">
                            <span className="text-red-600 text-xs">PDF</span>
                          </div>
                          <a 
                            href={`${process.env.NEXT_PUBLIC_API_URL}/uploads/applications/${selectedApplication.olevelCertificate}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Download PDF
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {selectedApplication.jambResult && (
                      <div className="border rounded-lg p-3">
                        <h4 className="font-medium text-gray-900 mb-2">JAMB Result</h4>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 h-16 bg-blue-100 rounded border flex items-center justify-center">
                            <span className="text-blue-600 text-xs">PDF</span>
                          </div>
                          <a 
                            href={`${process.env.NEXT_PUBLIC_API_URL}/uploads/applications/${selectedApplication.jambResult}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Download PDF
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {selectedApplication.birthCertificate && (
                      <div className="border rounded-lg p-3">
                        <h4 className="font-medium text-gray-900 mb-2">Birth Certificate</h4>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 h-16 bg-green-100 rounded border flex items-center justify-center">
                            <span className="text-green-600 text-xs">PDF</span>
                          </div>
                          <a 
                            href={`${process.env.NEXT_PUBLIC_API_URL}/uploads/applications/${selectedApplication.birthCertificate}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Download PDF
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {selectedApplication.medicalReport && (
                      <div className="border rounded-lg p-3">
                        <h4 className="font-medium text-gray-900 mb-2">Medical Report</h4>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 h-16 bg-purple-100 rounded border flex items-center justify-center">
                            <span className="text-purple-600 text-xs">PDF</span>
                          </div>
                          <a 
                            href={`${process.env.NEXT_PUBLIC_API_URL}/uploads/applications/${selectedApplication.medicalReport}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Download PDF
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {!selectedApplication.passportPhoto && 
                     !selectedApplication.olevelCertificate &&
                     !selectedApplication.jambResult && 
                     !selectedApplication.birthCertificate && 
                     !selectedApplication.medicalReport && (
                      <div className="col-span-2 text-center py-8 text-gray-500">
                        No documents submitted
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setShowStatusModal(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      <StatusUpdateModal
        isOpen={showStatusModal}
        onClose={() => {
          setShowStatusModal(false);
          setSelectedApplication(null);
        }}
        application={selectedApplication}
        onStatusUpdate={updateApplicationStatus}
        loading={statusUpdateLoading}
      />

      {/* Notification */}
      {notification && (
        <div className="fixed inset-x-0 top-20 z-50 flex justify-center px-4">
          <div className={`w-full max-w-2xl bg-white shadow-2xl rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-visible ${
            notification.type === 'success' ? 'border-l-4 border-green-400' : 'border-l-4 border-red-400'
          }`}>
            <div className="p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {notification.type === 'success' ? (
                    <CheckCircle className="h-6 w-6 text-green-400" />
                  ) : (
                    <AlertCircle className="h-6 w-6 text-red-400" />
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <p className={`text-base font-semibold ${
                    notification.type === 'success' ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {notification.type === 'success' ? 'Success!' : 'Error!'}
                  </p>
                  <p className={`mt-1 text-sm ${
                    notification.type === 'success' ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {notification.message}
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <button
                    className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => setNotification(null)}
                  >
                    <span className="sr-only">Close</span>
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
