"use client";

import { useState } from "react";
import { 
  X, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Clock, 
  AlertCircle,
  Send
} from "lucide-react";
import ButtonLoader from "./ui/ButtonLoader";

const StatusUpdateModal = ({ 
  isOpen, 
  onClose, 
  application, 
  onStatusUpdate, 
  loading = false 
}) => {
  const [selectedStatus, setSelectedStatus] = useState(application?.status || 'pending');
  const [notes, setNotes] = useState('');
  const [admissionDecision, setAdmissionDecision] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const statusOptions = [
    {
      value: 'pending',
      label: 'Pending',
      description: 'Application is waiting to be reviewed',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    {
      value: 'under_review',
      label: 'Under Review',
      description: 'Application is currently being reviewed',
      icon: Eye,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      value: 'approved',
      label: 'Approved',
      description: 'Application has been approved for admission',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      value: 'rejected',
      label: 'Rejected',
      description: 'Application has been rejected',
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      value: 'waitlisted',
      label: 'Waitlisted',
      description: 'Application is on the waitlist',
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  ];

  const handleStatusUpdate = () => {
    if (selectedStatus === application?.status) {
      onClose();
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmStatusUpdate = () => {
    onStatusUpdate(application._id, selectedStatus, notes, admissionDecision);
    setShowConfirmModal(false);
  };

  const getStatusInfo = (status) => {
    return statusOptions.find(option => option.value === status) || statusOptions[0];
  };

  const currentStatusInfo = getStatusInfo(application?.status);
  const newStatusInfo = getStatusInfo(selectedStatus);

  if (!isOpen) return null;

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-4 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 xl:w-2/5 shadow-lg rounded-md bg-white">
          <div className="mt-3">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Update Application Status
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {application?.firstName} {application?.lastName} - {application?.applicationNumber}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Current Status */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Current Status
              </label>
              <div className={`inline-flex items-center px-4 py-2 rounded-lg border-2 ${currentStatusInfo.bgColor} ${currentStatusInfo.borderColor}`}>
                <currentStatusInfo.icon className={`w-5 h-5 ${currentStatusInfo.color} mr-2`} />
                <span className={`font-medium ${currentStatusInfo.color}`}>
                  {currentStatusInfo.label}
                </span>
              </div>
            </div>

            {/* Status Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                New Status
              </label>
              <div className="space-y-3">
                {statusOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = selectedStatus === option.value;
                  const isCurrentStatus = application?.status === option.value;
                  
                  return (
                    <div
                      key={option.value}
                      onClick={() => !isCurrentStatus && setSelectedStatus(option.value)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        isSelected
                          ? `${option.bgColor} ${option.borderColor} ring-2 ring-offset-2 ring-blue-500`
                          : isCurrentStatus
                          ? 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-50'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center">
                        <Icon className={`w-5 h-5 ${isSelected ? option.color : 'text-gray-400'} mr-3`} />
                        <div className="flex-1">
                          <div className={`font-medium ${isSelected ? option.color : 'text-gray-900'}`}>
                            {option.label}
                            {isCurrentStatus && <span className="ml-2 text-xs text-gray-500">(Current)</span>}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {option.description}
                          </div>
                        </div>
                        {isSelected && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Notes Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about this status change..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
              />
              <p className="text-xs text-gray-500 mt-1">
                These notes will be included in the email notification to the applicant.
              </p>
            </div>

            {/* Admission Decision (for approved/rejected) */}
            {(selectedStatus === 'approved' || selectedStatus === 'rejected') && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admission Decision Details
                </label>
                <textarea
                  value={admissionDecision}
                  onChange={(e) => setAdmissionDecision(e.target.value)}
                  placeholder={`Add specific details about the ${selectedStatus === 'approved' ? 'approval' : 'rejection'}...`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-1">
                  This will be included in the email notification to the applicant.
                </p>
              </div>
            )}

            {/* Email Notification Info */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start">
                <Send className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900 mb-1">
                    Email Notification
                  </h4>
                  <p className="text-sm text-blue-700">
                    The applicant will receive a professional email notification about this status change at <strong>{application?.email}</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                disabled={loading || selectedStatus === application?.status}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <ButtonLoader size="sm" color="white" />
                    <span className="ml-2">Updating...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Update Status
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-60">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center mb-4">
                <AlertCircle className="w-6 h-6 text-yellow-600 mr-3" />
                <h3 className="text-lg font-medium text-gray-900">
                  Confirm Status Update
                </h3>
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-4">
                  Are you sure you want to change the application status from{' '}
                  <span className="font-medium">{currentStatusInfo.label}</span> to{' '}
                  <span className="font-medium">{newStatusInfo.label}</span>?
                </p>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">What will happen:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Application status will be updated in the system</li>
                    <li>• Applicant will receive an email notification</li>
                    <li>• Status change will be logged with timestamp</li>
                    {notes && <li>• Your notes will be included in the email</li>}
                  </ul>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmStatusUpdate}
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <ButtonLoader size="sm" color="white" />
                      <span className="ml-2">Updating...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Confirm Update
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StatusUpdateModal;
