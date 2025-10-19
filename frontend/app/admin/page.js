'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Stethoscope, 
  Building2, 
  Calendar, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Clock,
  AlertCircle,
  CheckCircle,
  UserPlus,
  Calendar as CalendarIcon,
  DollarSign,
  Heart,
  Brain,
  Eye,
  Baby,
  Bone,
  Smile,
  Wind,
  Shield,
  Beaker,
  FileText,
  RefreshCw,
  Loader2
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalDepartments: 0,
    todayAppointments: 0,
    totalApplications: 0,
    pendingApplications: 0
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [departmentStats, setDepartmentStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch all stats in parallel
      const [patientsRes, doctorsRes, appointmentsRes, applicationsRes] = await Promise.all([
        fetch('https://lautech-edu-ng.onrender.com/api/patients/stats'),
        fetch('https://lautech-edu-ng.onrender.com/api/doctors/stats'),
        fetch('https://lautech-edu-ng.onrender.com/api/appointments/stats'),
        fetch('https://lautech-edu-ng.onrender.com/api/applications/stats')
      ]);

      const [patientsData, doctorsData, appointmentsData, applicationsData] = await Promise.all([
        patientsRes.json(),
        doctorsRes.json(),
        appointmentsRes.json(),
        applicationsRes.json()
      ]);

      // Update stats
      setStats({
        totalPatients: patientsData.data?.totalPatients || 0,
        totalDoctors: doctorsData.data?.totalDoctors || 0,
        totalDepartments: doctorsData.data?.departmentStats?.length || 0,
        todayAppointments: appointmentsData.data?.today || 0,
        totalApplications: applicationsData.data?.total || 0,
        pendingApplications: applicationsData.data?.pending || 0
      });

      // Set department stats
      setDepartmentStats(doctorsData.data?.departmentStats || []);

      // Generate recent activities based on real data
      const activities = [
        { id: 1, type: 'patient', message: `${patientsData.data?.activePatients || 0} active patients`, time: 'Just now', status: 'info' },
        { id: 2, type: 'appointment', message: `${appointmentsData.data?.today || 0} appointments today`, time: 'Just now', status: 'success' },
        { id: 3, type: 'application', message: `${applicationsData.data?.pending || 0} pending applications`, time: 'Just now', status: 'warning' },
        { id: 4, type: 'doctor', message: `${doctorsData.data?.totalDoctors || 0} doctors on staff`, time: 'Just now', status: 'success' }
      ];
      setRecentActivities(activities);

      // Fetch upcoming appointments
      const appointmentsRes2 = await fetch('https://lautech-edu-ng.onrender.com/api/appointments?limit=5&status=pending');
      const appointmentsData2 = await appointmentsRes2.json();
      
      if (appointmentsData2.success && appointmentsData2.data?.appointments) {
        const upcoming = appointmentsData2.data.appointments.map((apt, index) => ({
          id: apt._id || index,
          patient: `${apt.patientName || 'Unknown Patient'}`,
          doctor: `Dr. ${apt.doctorName || 'Unknown'}`,
          department: apt.department || 'General',
          time: new Date(apt.preferredDate).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          }),
          status: apt.status || 'pending'
        }));
        setUpcomingAppointments(upcoming);
      }

      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Refresh data every 5 minutes
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const departmentIcons = {
    'Cardiology': Heart,
    'Neurology': Brain,
    'Ophthalmology': Eye,
    'Pediatrics': Baby,
    'Orthopedics': Bone,
    'Dentistry': Smile,
    'Pulmonology': Wind,
    'Emergency Medicine': Shield,
    'Internal Medicine': Activity,
    'Pathology': Beaker,
    'Radiology': Activity,
    'Oncology': Beaker
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'info': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAppointmentStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, Admin!</h1>
            <p className="text-blue-100">Here's what's happening at LAUTECH Hospital today.</p>
            {lastUpdated && (
              <p className="text-blue-200 text-sm mt-1">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading dashboard data...</span>
        </div>
      )}

      {/* Stats Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          {/* Total Patients */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPatients.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 font-medium">Active</span>
            </div>
          </div>

          {/* Total Doctors */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Doctors</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDoctors}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 font-medium">On staff</span>
            </div>
          </div>

          {/* Total Departments */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Departments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDepartments}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 font-medium">Active</span>
            </div>
          </div>

          {/* Today's Appointments */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.todayAppointments}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <Clock className="w-4 h-4 text-blue-500 mr-1" />
              <span className="text-sm text-blue-600 font-medium">Scheduled</span>
            </div>
          </div>

          {/* Total Applications */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Applications</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <AlertCircle className="w-4 h-4 text-yellow-500 mr-1" />
              <span className="text-sm text-yellow-600 font-medium">{stats.pendingApplications} pending</span>
            </div>
          </div>

          {/* Pending Applications */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingApplications}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <AlertCircle className="w-4 h-4 text-yellow-500 mr-1" />
              <span className="text-sm text-yellow-600 font-medium">Needs review</span>
            </div>
          </div>
        </div>
      )}

      {/* Department Statistics */}
      {!isLoading && departmentStats.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Department Overview</h3>
              <Building2 className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {departmentStats.slice(0, 5).map((dept, index) => {
                const Icon = departmentIcons[dept._id] || Activity;
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Icon className="w-4 h-4 text-gray-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{dept._id}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{dept.count} doctors</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
              <Activity className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Database</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-green-600 font-medium">Online</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">API Services</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-green-600 font-medium">Healthy</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Email Service</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-green-600 font-medium">Active</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">File Upload</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-green-600 font-medium">Working</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.status === 'success' ? 'bg-green-500' :
                        activity.status === 'warning' ? 'bg-yellow-500' :
                        activity.status === 'error' ? 'bg-red-500' : 'bg-blue-500'
                      }`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(activity.status)}`}>
                        {activity.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No recent activities</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map((appointment) => {
                    const Icon = departmentIcons[appointment.department] || Activity;
                    return (
                      <div key={appointment.id} className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Icon className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{appointment.patient}</p>
                          <p className="text-xs text-gray-500">{appointment.doctor} • {appointment.time}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAppointmentStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No upcoming appointments</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      {!isLoading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button 
                onClick={() => window.location.href = '/admin/patients'}
                className="flex flex-col items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <UserPlus className="w-6 h-6 text-blue-600 mb-2" />
                <span className="text-sm font-medium text-blue-900">Manage Patients</span>
              </button>
              <button 
                onClick={() => window.location.href = '/admin/appointments'}
                className="flex flex-col items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
              >
                <CalendarIcon className="w-6 h-6 text-green-600 mb-2" />
                <span className="text-sm font-medium text-green-900">View Appointments</span>
              </button>
              <button 
                onClick={() => window.location.href = '/admin/doctors'}
                className="flex flex-col items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
              >
                <Stethoscope className="w-6 h-6 text-purple-600 mb-2" />
                <span className="text-sm font-medium text-purple-900">Manage Doctors</span>
              </button>
              <button 
                onClick={() => window.location.href = '/admin/reports'}
                className="flex flex-col items-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
              >
                <FileText className="w-6 h-6 text-orange-600 mb-2" />
                <span className="text-sm font-medium text-orange-900">Generate Reports</span>
              </button>
              <button 
                onClick={() => window.location.href = '/admin/applications'}
                className="flex flex-col items-center p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
              >
                <FileText className="w-6 h-6 text-indigo-600 mb-2" />
                <span className="text-sm font-medium text-indigo-900">Review Applications</span>
              </button>
              <button 
                onClick={() => window.location.href = '/admin/departments'}
                className="flex flex-col items-center p-4 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
              >
                <Building2 className="w-6 h-6 text-teal-600 mb-2" />
                <span className="text-sm font-medium text-teal-900">Manage Departments</span>
              </button>
              <button 
                onClick={() => window.location.href = '/admin/users'}
                className="flex flex-col items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Users className="w-6 h-6 text-gray-600 mb-2" />
                <span className="text-sm font-medium text-gray-900">Manage Users</span>
              </button>
              <button 
                onClick={() => window.location.href = '/admin/settings'}
                className="flex flex-col items-center p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors"
              >
                <Activity className="w-6 h-6 text-yellow-600 mb-2" />
                <span className="text-sm font-medium text-yellow-900">System Settings</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
