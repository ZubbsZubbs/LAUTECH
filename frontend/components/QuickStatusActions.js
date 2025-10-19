"use client";

import { useState } from "react";
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  Clock, 
  MoreHorizontal
} from "lucide-react";
import ButtonLoader from "./ui/ButtonLoader";

const QuickStatusActions = ({ 
  application, 
  onStatusUpdate, 
  loading = false 
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const quickActions = [
    {
      id: 'start_review',
      label: 'Start Review',
      icon: Eye,
      color: 'text-blue-600',
      bgColor: 'hover:bg-blue-50',
      status: 'under_review',
      description: 'Begin reviewing this application',
      show: application?.status === 'pending'
    },
    {
      id: 'approve',
      label: 'Approve',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'hover:bg-green-50',
      status: 'approved',
      description: 'Approve this application',
      show: application?.status === 'under_review' || application?.status === 'pending'
    },
    {
      id: 'reject',
      label: 'Reject',
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'hover:bg-red-50',
      status: 'rejected',
      description: 'Reject this application',
      show: application?.status === 'under_review' || application?.status === 'pending'
    },
    {
      id: 'waitlist',
      label: 'Waitlist',
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'hover:bg-purple-50',
      status: 'waitlisted',
      description: 'Add to waitlist',
      show: application?.status === 'under_review' || application?.status === 'pending'
    }
  ];

  const visibleActions = quickActions.filter(action => action.show);

  const handleQuickAction = (action) => {
    const defaultNotes = {
      'start_review': 'Application review has been initiated',
      'approve': 'Congratulations! Your application has been approved.',
      'reject': 'Thank you for your application. Unfortunately, we cannot offer you admission at this time.',
      'waitlist': 'Your application has been placed on our waitlist.'
    };

    onStatusUpdate(application._id, action.status, defaultNotes[action.id]);
    setShowDropdown(false);
  };

  const hasActions = visibleActions.length > 0;

  return (
    <div className="relative">
      <button
        onClick={() => hasActions && setShowDropdown(!showDropdown)}
        disabled={loading || !hasActions}
        className="inline-flex items-center justify-center w-8 h-8 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title={!hasActions ? "No actions available" : "Quick actions"}
      >
        {loading ? (
          <ButtonLoader size="sm" color="gray" />
        ) : (
          <MoreHorizontal className="w-4 h-4" />
        )}
      </button>

      {showDropdown && hasActions && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowDropdown(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20">
            <div className="py-1">
              {visibleActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={() => handleQuickAction(action)}
                    disabled={loading}
                    className={`w-full text-left px-4 py-3 text-sm flex items-center ${action.color} ${action.bgColor} disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    <div>
                      <div className="font-medium">{action.label}</div>
                      <div className="text-xs text-gray-500">{action.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default QuickStatusActions;
