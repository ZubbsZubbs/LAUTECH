"use client";

import { Phone, Mail, MapPin, Clock, X } from "lucide-react";

const ContactModal = ({ isOpen, onClose, department }) => {
  if (!isOpen || !department?.expandedDetails?.contact) return null;

  const contact = department.expandedDetails.contact;

  const handleCall = (phoneNumber) => {
    window.open(`tel:${phoneNumber}`, '_self');
  };

  const handleEmail = (email) => {
    window.open(`mailto:${email}`, '_self');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Contact Department</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Phone Numbers */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
              <Phone className="w-5 h-5 mr-2 text-green-600" />
              Phone Numbers
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Main Line</p>
                  <p className="font-medium text-gray-800">{contact.phone}</p>
                </div>
                <button
                  onClick={() => handleCall(contact.phone)}
                  className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700 transition-colors"
                >
                  Call
                </button>
              </div>
              {contact.emergencyPhone && (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Emergency</p>
                    <p className="font-medium text-gray-800">{contact.emergencyPhone}</p>
                  </div>
                  <button
                    onClick={() => handleCall(contact.emergencyPhone)}
                    className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-700 transition-colors"
                  >
                    Call
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
              <Mail className="w-5 h-5 mr-2 text-blue-600" />
              Email
            </h4>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Department Email</p>
                <p className="font-medium text-gray-800">{contact.email}</p>
              </div>
              <button
                onClick={() => handleEmail(contact.email)}
                className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition-colors"
              >
                Email
              </button>
            </div>
          </div>

          {/* Location */}
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-purple-600" />
              Location
            </h4>
            <p className="text-sm text-gray-600">{contact.location}</p>
            {contact.extension && (
              <p className="text-sm text-gray-500 mt-1">Extension: {contact.extension}</p>
            )}
          </div>

          {/* Hours */}
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-orange-600" />
              Hours
            </h4>
            <p className="text-sm text-gray-600">{contact.hours}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => handleCall(contact.phone)}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
            >
              <Phone className="w-4 h-4 mr-2" />
              Call Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
