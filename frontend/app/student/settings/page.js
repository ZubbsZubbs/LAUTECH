'use client';

import { useState, useEffect } from 'react';
import { 
  Save, 
  User, 
  Mail, 
  Phone, 
  Bell, 
  Check,
  X,
  AlertCircle,
  Settings as SettingsIcon,
  Loader2,
  RefreshCw
} from 'lucide-react';
import {
  getSettings,
  updateNotificationSettings
} from '../../../services/settingsService';
import { useTheme } from '../../../contexts/ThemeContext';
import { useSelector, useDispatch } from 'react-redux';
import { restoreAuth } from '../../../store/authSlice';

const StudentSettingsPage = () => {
  const { theme, changeTheme } = useTheme();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    appointmentReminders: true,
    emergencyAlerts: true,
    systemUpdates: true,
    weeklyReports: true,
    monthlyReports: true
  });

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadSettings();
    }
  }, [isAuthenticated, user?.id]);

  const loadSettings = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await getSettings(user.id);
      
      if (response.success) {
        const settings = response.data;
        
        // Update notification settings
        if (settings.notifications) {
          setNotificationSettings(settings.notifications);
        }
        
        setLastUpdated(new Date(settings.updatedAt));
      } else {
        throw new Error(response.message || 'Failed to load settings');
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      setError(`Failed to load settings: ${error.message}`);
      
      // Try to load from localStorage as backup
      try {
        const savedNotifications = localStorage.getItem('notificationSettings');
        if (savedNotifications) {
          setNotificationSettings(JSON.parse(savedNotifications));
        }
      } catch (localError) {
        console.error('Error loading from localStorage:', localError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setNotificationSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    
    try {
      const userId = user?.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      const response = await updateNotificationSettings(userId, notificationSettings);
      
      if (response.success) {
        // Save to localStorage as backup
        localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
        
        setLastUpdated(new Date());
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        throw new Error(response.message || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setError(`Failed to save settings: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const ToggleSwitch = ({ value, onChange, disabled = false }) => (
    <button
      onClick={() => !disabled && onChange(!value)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        value ? 'bg-blue-600' : 'bg-gray-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          value ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <SettingsIcon className="h-6 w-6 mr-3 text-blue-600" />
                Notification Settings
              </h1>
              <p className="text-gray-600 mt-1">
                Manage how you receive notifications from LAUTECH Teaching Hospital
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Last updated</p>
              <p className="text-sm font-medium text-gray-900">
                {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Never'}
              </p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
            <Check className="h-5 w-5 text-green-600 mr-3" />
            <p className="text-green-800">Settings saved successfully!</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Notification Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
          <p className="text-gray-600 mb-6">
            Choose how you want to receive notifications from our hospital system.
          </p>
          
          <div className="space-y-6">
            {Object.entries(notificationSettings).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">
                    {key === 'emailNotifications' && 'Receive notifications via email'}
                    {key === 'smsNotifications' && 'Receive notifications via SMS (coming soon)'}
                    {key === 'pushNotifications' && 'Receive push notifications in browser'}
                    {key === 'appointmentReminders' && 'Get reminders for upcoming appointments'}
                    {key === 'emergencyAlerts' && 'Receive emergency alerts and urgent notifications'}
                    {key === 'systemUpdates' && 'Get notified about system updates and maintenance'}
                    {key === 'weeklyReports' && 'Receive weekly performance reports'}
                    {key === 'monthlyReports' && 'Receive monthly summary reports'}
                  </p>
                </div>
                <ToggleSwitch
                  value={value}
                  onChange={(newValue) => handleInputChange(key, newValue)}
                  disabled={key === 'smsNotifications'} // Disable SMS for now
                />
              </div>
            ))}
          </div>

          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Bell className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">About Notifications</h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>Email notifications are sent to your registered email address</li>
                  <li>Emergency alerts are always sent regardless of your preferences</li>
                  <li>You can change these settings at any time</li>
                  <li>SMS notifications will be available soon</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSettingsPage;






