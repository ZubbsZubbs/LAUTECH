"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { restoreAuth } from "../../../store/authSlice";
import ProtectedRoute from "../../../components/auth/ProtectedRoute";
import { useTheme } from "../../../contexts/ThemeContext";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Download,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  AlertCircle,
  RefreshCw,
  Settings,
  Bell,
  Search,
  Filter,
  Plus,
  TrendingUp,
  Award,
  BookOpen,
  Shield,
  Star,
  ChevronRight,
  Activity,
  Target,
  Zap,
  Sparkles,
  Heart,
  MessageCircle,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Edit3,
  Trash2,
  Copy,
  Share2,
  ExternalLink
} from "lucide-react";
import Loader from "../../../components/ui/Loader";

export default function StudentDashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, token, isAuthenticated } = useSelector((state) => state.auth);
  const { theme, changeTheme } = useTheme();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    applicationUpdates: true,
    deadlineReminders: true
  });

  const handleSaveSettings = async () => {
    try {
      // Save settings to localStorage
      localStorage.setItem('studentSettings', JSON.stringify(settings));
      
      // Save settings to backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token || localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user?.id || user?._id,
          ...settings
        })
      });

      if (response.ok) {
        console.log('Settings saved successfully');
        // Show success message
        alert('Settings saved successfully!');
      } else {
        console.error('Failed to save settings to backend');
        alert('Settings saved locally, but failed to sync with server');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Settings saved locally, but failed to sync with server');
    }
  };

  const handleThemeChange = (newTheme) => {
    // Use the global theme context
    changeTheme(newTheme);
  };

  const handleChangePassword = () => {
    const newPassword = prompt('Enter new password:');
    if (newPassword && newPassword.length >= 8) {
      // Here you would call the change password API
      console.log('Password change requested');
      alert('Password change feature coming soon!');
    } else if (newPassword) {
      alert('Password must be at least 8 characters long');
    }
  };

  const handleUpdateProfile = () => {
    // Here you would open a profile update modal or navigate to profile page
    console.log('Profile update requested');
    alert('Profile update feature coming soon!');
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Here you would call the delete account API
      console.log('Account deletion requested');
      alert('Account deletion feature coming soon!');
    }
  };
  const [notifications] = useState([
    { id: 1, type: 'success', message: 'Application submitted successfully', time: '2 hours ago' },
    { id: 2, type: 'info', message: 'Your application is under review', time: '1 day ago' },
    { id: 3, type: 'warning', message: 'Please upload missing documents', time: '3 days ago' }
  ]);

  useEffect(() => {
    // Restore auth state from localStorage
    dispatch(restoreAuth());
    
    // Load saved settings
    const savedSettings = localStorage.getItem('studentSettings');
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setSettings(parsedSettings);
    }
  }, [dispatch]);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications && !event.target.closest('.notification-dropdown')) {
        setShowNotifications(false);
      }
      if (showSettings && !event.target.closest('.settings-panel') && !event.target.closest('.settings-toggle')) {
        setShowSettings(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications, showSettings]);

  useEffect(() => {
    if (token) {
      fetchApplications();
    } else {
      // If no token after a delay, try to fetch anyway (fallback)
      const timer = setTimeout(() => {
        console.log('Student dashboard - No token after delay, trying fallback fetch');
        fetchApplications();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [token]);

  // Loading timeout effect
  useEffect(() => {
    if (loading) {
      const timeout = setTimeout(() => {
        console.log('Student dashboard - Loading timeout reached');
        setLoadingTimeout(true);
        setError('Request timed out. Please try refreshing the page.');
        setLoading(false);
      }, 10000); // 10 second timeout
      
      return () => clearTimeout(timeout);
    }
  }, [loading]);

  const fetchApplications = async () => {
    console.log('Student dashboard - fetchApplications called');
    try {
      setLoading(true);
      setError(null);
      
      console.log('Student dashboard - Redux token:', token);
      console.log('Student dashboard - Redux user:', user);
      console.log('Student dashboard - Redux isAuthenticated:', isAuthenticated);
      
      // Check localStorage as fallback
      const authToken = localStorage.getItem('authToken');
      const localToken = localStorage.getItem('token');
      const userData = localStorage.getItem('userData');
      
      console.log('Student dashboard - localStorage authToken:', authToken);
      console.log('Student dashboard - localStorage token:', localToken);
      console.log('Student dashboard - localStorage userData:', userData);
      console.log('Student dashboard - All localStorage keys:', Object.keys(localStorage));
      
      // Try to parse userData to get token
      let parsedUserData = null;
      if (userData && userData !== 'undefined' && userData !== 'null') {
        try {
          parsedUserData = JSON.parse(userData);
          console.log('Student dashboard - parsed userData:', parsedUserData);
        } catch (e) {
          console.error('Student dashboard - Error parsing userData:', e);
        }
      } else {
        console.log('Student dashboard - userData is invalid:', userData);
      }
      
      // Use Redux token first, then localStorage fallback
      const finalToken = token || authToken || localToken || (parsedUserData && parsedUserData.token);
      
      console.log('Student dashboard - final token:', finalToken);
      console.log('Student dashboard - API URL:', `${process.env.NEXT_PUBLIC_API_URL}/api/applications/student`);
      
      if (!finalToken) {
        console.error('Student dashboard - No token found');
        
        // Clear invalid localStorage data
        if (userData === 'undefined' || userData === 'null') {
          console.log('Student dashboard - Clearing invalid localStorage data');
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
        }
        
        setError('Authentication required. Please login again.');
        setLoading(false);
        
        // Redirect to login after a delay
        setTimeout(() => {
          router.push('/auth/login?redirect=/student/dashboard');
        }, 2000);
        
        return;
      }
      
      console.log('Student dashboard - Making API call...');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applications/student`, {
        headers: {
          'Authorization': `Bearer ${finalToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Student dashboard - response status:', response.status);
      console.log('Student dashboard - response ok:', response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log('Student dashboard - response data:', data);
        setApplications(data.data.applications || []);
        console.log('Student dashboard - Applications set:', data.data.applications?.length || 0);
      } else {
        const errorData = await response.json();
        console.error('Student dashboard - API error:', errorData);
        setError('Failed to fetch applications: ' + (errorData.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Student dashboard - fetchApplications error:', err);
      setError('Error loading applications: ' + err.message);
    } finally {
      console.log('Student dashboard - fetchApplications completed, setting loading to false');
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'under_review': return 'text-blue-600 bg-blue-100';
      case 'accepted': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'waitlisted': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'under_review': return <Eye className="w-4 h-4" />;
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'waitlisted': return <AlertCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader size="md" text="Loading your applications..." />
            <div className="space-y-2">
              <button
                onClick={() => {
                  console.log('Student dashboard - Manual refresh clicked');
                  setLoading(false);
                  setLoadingTimeout(false);
                  setError(null);
                  fetchApplications();
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mr-2"
              >
                Debug: Force Refresh
              </button>
              {loadingTimeout && (
                <div className="space-y-2">
                  <p className="text-red-600 text-sm">Loading is taking longer than expected.</p>
                  <button
                    onClick={() => {
                      setLoading(false);
                      setLoadingTimeout(false);
                      setError(null);
                      fetchApplications();
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Get user initials for avatar
  const getUserInitials = (user) => {
    if (!user) return 'U';
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  };

  // Get status color and icon
  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return { color: 'text-yellow-600 bg-yellow-100', icon: Clock, text: 'Under Review' };
      case 'approved':
        return { color: 'text-green-600 bg-green-100', icon: CheckCircle, text: 'Approved' };
      case 'rejected':
        return { color: 'text-red-600 bg-red-100', icon: XCircle, text: 'Rejected' };
      default:
        return { color: 'text-gray-600 bg-gray-100', icon: Clock, text: 'Unknown' };
    }
  };

  // Filter applications based on search and status
  const filteredApplications = applications.filter(application => {
    const matchesSearch = application.program.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         application.applicationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         application.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         application.lastName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || application.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Get notification icon
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'info': return Bell;
      case 'warning': return AlertCircle;
      default: return Bell;
    }
  };

  // Get notification color
  const getNotificationColor = (type) => {
    switch (type) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'info': return 'text-blue-600 bg-blue-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 relative z-10 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Student Dashboard
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Welcome back, {user?.firstName || 'Student'}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <div className="relative z-20">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {notifications.length}
                      </span>
                    )}
                  </button>
                  
                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="notification-dropdown absolute right-0 top-full mt-2 w-80 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 z-[9999] transform translate-y-0">
                      <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.map((notification) => {
                          const Icon = getNotificationIcon(notification.type);
                          return (
                            <div key={notification.id} className="p-4 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-100/50 dark:border-gray-700/50 last:border-b-0">
                              <div className="flex items-start space-x-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getNotificationColor(notification.type)}`}>
                                  <Icon className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm text-gray-900 dark:text-gray-100">{notification.message}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Section */}
                <div className="flex items-center space-x-3 px-4 py-2">
                  <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {getUserInitials(user)}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => router.push('/schools/nursing/apply')}
                    className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-black transition-colors flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">New Application</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-0">
          <div className="flex gap-6">
            {/* Settings Sidebar */}
            <div className={`${showSettings ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden`}>
              <div className="settings-panel bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Settings</h3>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <XCircle className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Notification Settings */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Notifications</h4>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 dark:text-gray-300">Email Notifications</span>
                        <input
                          type="checkbox"
                          checked={settings.emailNotifications}
                          onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                          className="w-4 h-4 text-gray-900 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-gray-900"
                        />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 dark:text-gray-300">SMS Notifications</span>
                        <input
                          type="checkbox"
                          checked={settings.smsNotifications}
                          onChange={(e) => setSettings({...settings, smsNotifications: e.target.checked})}
                          className="w-4 h-4 text-gray-900 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-gray-900"
                        />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 dark:text-gray-300">Application Updates</span>
                        <input
                          type="checkbox"
                          checked={settings.applicationUpdates}
                          onChange={(e) => setSettings({...settings, applicationUpdates: e.target.checked})}
                          className="w-4 h-4 text-gray-900 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-gray-900"
                        />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 dark:text-gray-300">Deadline Reminders</span>
                        <input
                          type="checkbox"
                          checked={settings.deadlineReminders}
                          onChange={(e) => setSettings({...settings, deadlineReminders: e.target.checked})}
                          className="w-4 h-4 text-gray-900 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-gray-900"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Theme Settings */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Appearance</h4>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 dark:text-gray-300">Theme</span>
                        <select
                          value={theme}
                          onChange={(e) => handleThemeChange(e.target.value)}
                          className="px-3 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                        >
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                        </select>
                      </label>
                    </div>
                  </div>

                  {/* Account Settings */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Account</h4>
                    <div className="space-y-3">
                      <button 
                        onClick={handleChangePassword}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        Change Password
                      </button>
                      <button 
                        onClick={handleUpdateProfile}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        Update Profile
                      </button>
                      <button 
                        onClick={handleDeleteAccount}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>

                  {/* Save Button */}
                  <button 
                    onClick={handleSaveSettings}
                    className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-black transition-colors"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Applications */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-gray-900 dark:text-gray-100" />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{applications.length}</p>
            </div>
            
            {/* Under Review */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-gray-900 dark:text-gray-100" />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Under Review</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {applications.filter(app => app.status === 'pending').length}
              </p>
            </div>
            
            {/* Approved */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-gray-900 dark:text-gray-100" />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Approved</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {applications.filter(app => app.status === 'approved').length}
              </p>
            </div>
            
            {/* Success Rate */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-gray-900 dark:text-gray-100" />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {applications.length > 0 ? Math.round((applications.filter(app => app.status === 'approved').length / applications.length) * 100) : 0}%
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50/80 dark:bg-red-900/20 backdrop-blur-sm border border-red-200 dark:border-red-800 rounded-2xl p-6 mb-8 shadow-lg">
              <div className="flex items-center">
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-3" />
                <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
              </div>
            </div>
          )}

          {applications.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10 text-gray-900 dark:text-gray-100" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">No Applications Yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                You haven't submitted any applications yet. Start your journey to becoming a nurse today!
              </p>
              <button
                onClick={() => router.push('/schools/nursing/apply')}
                className="bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-black transition-colors flex items-center space-x-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                <span>Start Your Application</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Your Applications
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage and track your nursing school applications</p>
                </div>
                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-none">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search applications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 w-full sm:w-64"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Under Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
              
              {filteredApplications.map((application) => {
                const statusInfo = getStatusInfo(application.status);
                const StatusIcon = statusInfo.icon;
                
                return (
                  <div key={application._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                              {application.program}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">#{application.applicationNumber}</p>
                          </div>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                            <StatusIcon className="w-4 h-4 mr-1" />
                            {statusInfo.text}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Applicant</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{application.firstName} {application.lastName}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Email</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{application.email}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Submitted</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{formatDate(application.submittedAt)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Last updated: {formatDate(application.updatedAt)}
                      </p>
                      <button
                        onClick={() => setSelectedApplication(application)}
                        className="inline-flex items-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-black transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
            </div>
          </div>
        </div>

        {/* Application Details Modal */}
        {selectedApplication && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200/50">
              <div className="p-8">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <FileText className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        Application Details
                      </h2>
                      <p className="text-gray-600 text-lg font-medium">#{selectedApplication.applicationNumber}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedApplication(null)}
                    className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors"
                  >
                    <XCircle className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Full Name</label>
                        <p className="text-gray-900">{selectedApplication.firstName} {selectedApplication.lastName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Email</label>
                        <p className="text-gray-900">{selectedApplication.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Phone</label>
                        <p className="text-gray-900">{selectedApplication.phoneNumber}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                        <p className="text-gray-900">{formatDate(selectedApplication.dateOfBirth)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Academic Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Program</label>
                        <p className="text-gray-900">{selectedApplication.program}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">JAMB Score</label>
                        <p className="text-gray-900">{selectedApplication.jambScore || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Application Type</label>
                        <p className="text-gray-900 capitalize">{selectedApplication.applicationType}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Status</label>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedApplication.status)}`}>
                          {getStatusIcon(selectedApplication.status)}
                          <span className="ml-1 capitalize">{selectedApplication.status.replace('_', ' ')}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Submitted Documents</h3>
                  
                  {/* Debug: Show application data structure */}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Check for direct document fields (new structure) */}
                    {selectedApplication.passportPhoto && (
                      <div className="border rounded-lg p-3">
                        <h4 className="font-medium text-gray-900 mb-2">Passport Photo</h4>
                        <div className="flex items-center space-x-2">
                          <img
                            src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/applications/${selectedApplication.passportPhoto}`}
                            alt="Passport Photo"
                            className="w-16 h-16 object-cover rounded"
                          />
                          <a
                            href={`${process.env.NEXT_PUBLIC_API_URL}/uploads/applications/${selectedApplication.passportPhoto}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-700 text-sm"
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
                            className="text-green-600 hover:text-green-700 text-sm"
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
                          <div className="w-16 h-16 bg-red-100 rounded border flex items-center justify-center">
                            <span className="text-red-600 text-xs">PDF</span>
                          </div>
                          <a
                            href={`${process.env.NEXT_PUBLIC_API_URL}/uploads/applications/${selectedApplication.jambResult}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-700 text-sm"
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
                          <div className="w-16 h-16 bg-red-100 rounded border flex items-center justify-center">
                            <span className="text-red-600 text-xs">PDF</span>
                          </div>
                          <a
                            href={`${process.env.NEXT_PUBLIC_API_URL}/uploads/applications/${selectedApplication.birthCertificate}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-700 text-sm"
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
                          <div className="w-16 h-16 bg-red-100 rounded border flex items-center justify-center">
                            <span className="text-red-600 text-xs">PDF</span>
                          </div>
                          <a
                            href={`${process.env.NEXT_PUBLIC_API_URL}/uploads/applications/${selectedApplication.medicalReport}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-700 text-sm"
                          >
                            Download PDF
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {/* Check for nested documents structure (old structure) */}
                    {selectedApplication.documents && (
                      <>
                        {selectedApplication.documents.recommendationLetters && selectedApplication.documents.recommendationLetters.length > 0 && (
                          <div className="border rounded-lg p-3">
                            <h4 className="font-medium text-gray-900 mb-2">Recommendation Letters</h4>
                            <div className="space-y-2">
                              {selectedApplication.documents.recommendationLetters.map((doc, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <div className="w-16 h-16 bg-red-100 rounded border flex items-center justify-center">
                                    <span className="text-red-600 text-xs">PDF</span>
                                  </div>
                                  <a
                                    href={`${process.env.NEXT_PUBLIC_API_URL}/uploads/applications/${doc}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-green-600 hover:text-green-700 text-sm"
                                  >
                                    Download Letter {index + 1}
                                  </a>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {selectedApplication.documents.otherDocuments && selectedApplication.documents.otherDocuments.length > 0 && (
                          <div className="border rounded-lg p-3">
                            <h4 className="font-medium text-gray-900 mb-2">Other Documents</h4>
                            <div className="space-y-2">
                              {selectedApplication.documents.otherDocuments.map((doc, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <div className="w-16 h-16 bg-red-100 rounded border flex items-center justify-center">
                                    <span className="text-red-600 text-xs">PDF</span>
                                  </div>
                                  <a
                                    href={`${process.env.NEXT_PUBLIC_API_URL}/uploads/applications/${doc}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-green-600 hover:text-green-700 text-sm"
                                  >
                                    Download Document {index + 1}
                                  </a>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    
                    {/* Show message if no documents found */}
                    {!selectedApplication.passportPhoto && 
                     !selectedApplication.olevelCertificate && 
                     !selectedApplication.jambResult && 
                     !selectedApplication.birthCertificate && 
                     !selectedApplication.medicalReport && 
                     (!selectedApplication.documents || 
                      (selectedApplication.documents.recommendationLetters.length === 0 && 
                       selectedApplication.documents.otherDocuments.length === 0)) && (
                      <div className="col-span-2 text-center py-8 text-gray-500">
                        <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                        <p>No documents were submitted with this application.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Timeline */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Timeline</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Application Submitted</p>
                        <p className="text-xs text-gray-500">{formatDate(selectedApplication.submittedAt)}</p>
                      </div>
                    </div>
                    {selectedApplication.status === 'under_review' && (
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Under Review</p>
                          <p className="text-xs text-gray-500">Your application is being reviewed by the admissions committee</p>
                        </div>
                      </div>
                    )}
                    {selectedApplication.status === 'accepted' && (
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Accepted</p>
                          <p className="text-xs text-gray-500">Congratulations! Your application has been accepted</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Floating Settings Toggle Button */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`settings-toggle fixed bottom-6 left-6 z-50 p-4 rounded-full shadow-lg transition-all duration-300 ${
            showSettings 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
          title={`Settings ${showSettings ? '(Close)' : '(Open)'} - Theme: ${settings.theme}`}
        >
          <Settings className="w-6 h-6" />
        </button>

        {/* Theme Indicator */}
        {settings.theme === 'dark' && (
          <div className="fixed top-4 right-4 z-50 bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
            🌙 Dark Mode
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
