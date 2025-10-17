"use client";

import { useState } from "react";
import { X, Download, FileText, CheckCircle, Loader2 } from "lucide-react";

const FormsModal = ({ isOpen, onClose }) => {
  const [downloading, setDownloading] = useState(null);

  const forms = [
    {
      id: 'new-patient',
      title: 'New Patient Registration',
      description: 'Complete this form before your first visit',
      color: 'blue',
      icon: '📋'
    },
    {
      id: 'medical-history',
      title: 'Medical History Form',
      description: 'Detailed medical history questionnaire',
      color: 'green',
      icon: '🏥'
    },
    {
      id: 'medication-list',
      title: 'Medication List',
      description: 'Current medications and dosages',
      color: 'purple',
      icon: '💊'
    },
    {
      id: 'consent-forms',
      title: 'Consent Forms',
      description: 'Treatment consent and authorization',
      color: 'orange',
      icon: '📝'
    },
    {
      id: 'insurance-info',
      title: 'Insurance Information',
      description: 'Insurance and billing information',
      color: 'indigo',
      icon: '💳'
    },
    {
      id: 'emergency-contact',
      title: 'Emergency Contact',
      description: 'Emergency contact information',
      color: 'red',
      icon: '🚨'
    }
  ];

  const handleDownload = async (formId) => {
    setDownloading(formId);
    
    try {
      // Call the real API endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/forms/download/${formId}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to download form');
      }

      // Get the filename from the response headers or use a default
      const contentDisposition = response.headers.get('content-disposition');
      const filename = contentDisposition 
        ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
        : `${formId}.pdf`;

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      // Show success notification
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
      toast.innerHTML = `
        <div class='flex items-center space-x-3'>
          <div class='w-6 h-6 bg-green-400 rounded-full flex items-center justify-center'>
            <svg class='w-4 h-4 text-white' fill='currentColor' viewBox='0 0 20 20'>
              <path fill-rule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clip-rule='evenodd'></path>
            </svg>
          </div>
          <div>
            <p class='font-semibold'>Download Started!</p>
            <p class='text-sm text-green-100'>${forms.find(f => f.id === formId)?.title}</p>
          </div>
        </div>
      `;
      document.body.appendChild(toast);
      
      // Animate toast in
      setTimeout(() => {
        toast.classList.remove('translate-x-full');
      }, 100);
      
      // Auto remove toast after 4 seconds
      setTimeout(() => {
        toast.classList.add('translate-x-full');
        setTimeout(() => {
          if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
          }
        }, 300);
      }, 4000);
      
    } catch (error) {
      console.error('Download error:', error);
      alert(`Download failed: ${error.message}`);
    } finally {
      setDownloading(null);
    }
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 text-blue-600',
      green: 'bg-green-50 border-green-200 text-green-600',
      purple: 'bg-purple-50 border-purple-200 text-purple-600',
      orange: 'bg-orange-50 border-orange-200 text-orange-600',
      indigo: 'bg-indigo-50 border-indigo-200 text-indigo-600',
      red: 'bg-red-50 border-red-200 text-red-600'
    };
    return colors[color] || colors.blue;
  };

  const getButtonColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-600 hover:bg-blue-700',
      green: 'bg-green-600 hover:bg-green-700',
      purple: 'bg-purple-600 hover:bg-purple-700',
      orange: 'bg-orange-600 hover:bg-orange-700',
      indigo: 'bg-indigo-600 hover:bg-indigo-700',
      red: 'bg-red-600 hover:bg-red-700'
    };
    return colors[color] || colors.blue;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Download Patient Forms</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          {forms.map((form) => (
            <div key={form.id} className={`p-4 rounded-lg border ${getColorClasses(form.color)}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <span className="text-lg mr-2">{form.icon}</span>
                    {form.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">{form.description}</p>
                </div>
                <button
                  onClick={() => handleDownload(form.id)}
                  disabled={downloading === form.id}
                  className={`${getButtonColorClasses(form.color)} text-white px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center`}
                >
                  {downloading === form.id ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-center pt-6 mt-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormsModal;
