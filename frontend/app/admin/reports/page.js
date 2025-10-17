'use client';

import { useState, useEffect } from 'react';
import { 
  Download, 
  Calendar, 
  Filter, 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users,
  Stethoscope,
  Building2,
  Activity,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  PieChart,
  LineChart,
  RefreshCw
} from 'lucide-react';
import { 
  getOverviewReport, 
  getPatientReport, 
  getDoctorReport, 
  getAppointmentReport, 
  getDepartmentReport,
  exportReportAsCSV,
  exportReportAsJSON
} from '../../../services/reportsService';
import SimpleChart from '../../../components/ui/SimpleChart';

const ReportsPage = () => {
  const [selectedReport, setSelectedReport] = useState('overview');
  const [dateRange, setDateRange] = useState('30');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const reportTypes = [
    { id: 'overview', name: 'Overview Report', icon: BarChart3, description: 'General hospital statistics and performance metrics' },
    { id: 'patients', name: 'Patient Report', icon: Users, description: 'Patient demographics, admissions, and outcomes' },
    { id: 'doctors', name: 'Doctor Report', icon: Stethoscope, description: 'Doctor performance, workload, and productivity' },
    { id: 'departments', name: 'Department Report', icon: Building2, description: 'Department-wise statistics and performance' },
    { id: 'appointments', name: 'Appointment Report', icon: Calendar, description: 'Appointment statistics and scheduling analysis' },
    { id: 'revenue', name: 'Revenue Report', icon: DollarSign, description: 'Financial performance and revenue analysis' },
    { id: 'emergency', name: 'Emergency Report', icon: AlertCircle, description: 'Emergency department statistics and response times' }
  ];

  // Load data when component mounts or report type changes
  useEffect(() => {
    // Add a small delay to ensure backend is ready
    const timer = setTimeout(() => {
      loadReportData();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [selectedReport, dateRange, customStartDate, customEndDate]);

  const loadReportData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Loading report data for:', selectedReport, 'with date range:', dateRange);
      
      // Test API connection first
      try {
        const testResponse = await fetch('http://localhost:9000/api/patients/stats');
        console.log('Test API call status:', testResponse.status);
        if (!testResponse.ok) {
          throw new Error(`Test API call failed: ${testResponse.status}`);
        }
      } catch (testError) {
        console.error('Test API call failed:', testError);
        throw new Error('Cannot connect to backend API. Please ensure the backend server is running on port 9000.');
      }
      
      // Handle custom date range
      let effectiveDateRange = dateRange;
      if (dateRange === 'custom') {
        if (!customStartDate || !customEndDate) {
          setError('Please select both start and end dates for custom range.');
          setIsLoading(false);
          return;
        }
        
        // Calculate days between custom dates
        const start = new Date(customStartDate);
        const end = new Date(customEndDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        effectiveDateRange = diffDays.toString();
      }
      
      console.log('Effective date range:', effectiveDateRange);
      
      let data;
      switch (selectedReport) {
        case 'overview':
          console.log('Calling getOverviewReport...');
          data = await getOverviewReport(effectiveDateRange);
          break;
        case 'patients':
          console.log('Calling getPatientReport...');
          data = await getPatientReport(effectiveDateRange);
          break;
        case 'doctors':
          console.log('Calling getDoctorReport...');
          data = await getDoctorReport(effectiveDateRange);
          break;
        case 'appointments':
          console.log('Calling getAppointmentReport...');
          data = await getAppointmentReport(effectiveDateRange);
          break;
        case 'departments':
          console.log('Calling getDepartmentReport...');
          data = await getDepartmentReport(effectiveDateRange);
          break;
        default:
          console.log('Calling getOverviewReport (default)...');
          data = await getOverviewReport(effectiveDateRange);
      }
      
      console.log('Report data received:', data);
      setReportData(data.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error loading report data:', err);
      setError(err.message || 'Failed to load report data');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate overview stats from API data
  const getOverviewStats = () => {
    if (!reportData) return null;
    
    const { applications, patients, doctors, appointments } = reportData;
    
    return {
      totalPatients: patients?.totalPatients || 0,
      totalDoctors: doctors?.totalDoctors || 0,
      totalDepartments: doctors?.departmentStats?.length || 0,
      totalAppointments: appointments?.total || 0,
      totalApplications: applications?.total || 0,
      pendingApplications: applications?.pending || 0,
      approvedApplications: applications?.approved || 0,
      rejectedApplications: applications?.rejected || 0,
      activeDoctors: doctors?.activeDoctors || 0,
      todayAppointments: appointments?.today || 0,
      averageRating: doctors?.averageRating || 0
    };
  };

  // Get department stats from API data
  const getDepartmentStats = () => {
    if (!reportData || selectedReport !== 'overview') return [];
    
    const { doctors, patients, appointments } = reportData;
    const departmentMap = {};
    
    // Process doctor department stats
    if (doctors?.departmentStats) {
      doctors.departmentStats.forEach(dept => {
        departmentMap[dept._id] = {
          name: dept._id,
          doctors: dept.count,
          activeDoctors: dept.activeCount,
          patients: 0,
          appointments: 0
        };
      });
    }
    
    // Process patient department stats
    if (patients?.patientsByDepartment) {
      patients.patientsByDepartment.forEach(dept => {
        if (departmentMap[dept._id]) {
          departmentMap[dept._id].patients = dept.count;
        } else {
          departmentMap[dept._id] = {
            name: dept._id,
            doctors: 0,
            activeDoctors: 0,
            patients: dept.count,
            appointments: 0
          };
        }
      });
    }
    
    // Process appointment department stats
    if (appointments?.byDepartment) {
      appointments.byDepartment.forEach(dept => {
        if (departmentMap[dept._id]) {
          departmentMap[dept._id].appointments = dept.count;
        } else {
          departmentMap[dept._id] = {
            name: dept._id,
            doctors: 0,
            activeDoctors: 0,
            patients: 0,
            appointments: dept.count
          };
        }
      });
    }
    
    return Object.values(departmentMap).sort((a, b) => b.patients - a.patients);
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      await loadReportData();
    } catch (err) {
      console.error('Error generating report:', err);
      setError(err.message || 'Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportReport = (format) => {
    if (!reportData) {
      alert('No data to export. Please generate a report first.');
      return;
    }

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `${selectedReport}_report_${timestamp}`;

    try {
      let exportData = [];
      
      switch (selectedReport) {
        case 'overview':
          exportData = getDepartmentStats();
          break;
        case 'patients':
          exportData = reportData.patients || [];
          break;
        case 'doctors':
          exportData = reportData.doctors || [];
          break;
        case 'appointments':
          exportData = reportData.appointments || [];
          break;
        case 'departments':
          exportData = reportData.departments || [];
          break;
        default:
          exportData = getDepartmentStats();
      }

      if (format === 'csv') {
        exportReportAsCSV(exportData, filename);
      } else if (format === 'json') {
        exportReportAsJSON(exportData, filename);
      }
    } catch (err) {
      console.error('Error exporting report:', err);
      alert('Failed to export report. Please try again.');
    }
  };

  const getReportIcon = (reportId) => {
    const report = reportTypes.find(r => r.id === reportId);
    return report ? report.icon : BarChart3;
  };

  const getReportName = (reportId) => {
    const report = reportTypes.find(r => r.id === reportId);
    return report ? report.name : 'Report';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Generate comprehensive reports and analyze hospital performance</p>
          {lastUpdated && (
            <p className="text-sm text-gray-500 mt-1">
              Last updated: {lastUpdated.toLocaleString()}
            </p>
          )}
        </div>
        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-2">
          <button
            onClick={loadReportData}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Loading...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </>
            )}
          </button>
          <button
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Generate Report
              </>
            )}
          </button>
          {reportData && (
            <div className="flex gap-1">
              <button
                onClick={() => handleExportReport('csv')}
                className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <Download className="w-4 h-4 mr-1" />
                CSV
              </button>
              <button
                onClick={() => handleExportReport('json')}
                className="inline-flex items-center px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
              >
                <Download className="w-4 h-4 mr-1" />
                JSON
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Report Selection */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Report Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTypes.map((report) => {
            const Icon = report.icon;
            return (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report.id)}
                className={`p-4 rounded-lg border-2 text-left transition-colors ${
                  selectedReport === report.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <Icon className={`w-6 h-6 ${
                    selectedReport === report.id ? 'text-blue-600' : 'text-gray-600'
                  }`} />
                  <h4 className={`font-medium ${
                    selectedReport === report.id ? 'text-blue-900' : 'text-gray-900'
                  }`}>
                    {report.name}
                  </h4>
                </div>
                <p className="text-sm text-gray-600">{report.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Date Range Selection */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Period</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Quick Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => {
                setDateRange(e.target.value);
                setCustomStartDate('');
                setCustomEndDate('');
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="180">Last 6 months</option>
              <option value="365">Last year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          {dateRange === 'custom' && (
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Custom Date Range</label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="flex items-center text-gray-500">to</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>
        {dateRange === 'custom' && (!customStartDate || !customEndDate) && (
          <div className="mt-2 text-sm text-amber-600">
            Please select both start and end dates for custom range.
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <XCircle className="w-5 h-5 text-red-400 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error loading report data</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading report data...</p>
        </div>
      )}

      {/* Overview Report Content */}
      {selectedReport === 'overview' && !isLoading && !error && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(() => {
              const stats = getOverviewStats();
              if (!stats) return null;
              
              return (
                <>
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600 font-medium">Active</span>
                      <span className="text-sm text-gray-500 ml-1">patients</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
                      <span className="text-sm text-gray-500">{stats.activeDoctors} active</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalAppointments}</p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center">
                      <span className="text-sm text-gray-500">{stats.todayAppointments} today</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Applications</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
                      </div>
                      <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-yellow-600" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center">
                      <span className="text-sm text-gray-500">{stats.pendingApplications} pending</span>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>

          {/* Department Performance Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SimpleChart
              data={getDepartmentStats().slice(0, 8).map(dept => ({
                label: dept.name,
                value: dept.patients
              }))}
              type="bar"
              title="Patients by Department"
              height={300}
            />
            <SimpleChart
              data={getDepartmentStats().slice(0, 6).map(dept => ({
                label: dept.name,
                value: dept.doctors
              }))}
              type="pie"
              title="Doctors by Department"
              height={300}
            />
          </div>

          {/* Department Performance Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Department Performance Details</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctors</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patients</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appointments</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active Doctors</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getDepartmentStats().map((dept, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{dept.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dept.doctors}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dept.patients.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dept.appointments}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${dept.doctors > 0 ? (dept.activeDoctors / dept.doctors) * 100 : 0}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-900">{dept.activeDoctors}/{dept.doctors}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Other Report Types */}
      {selectedReport !== 'overview' && !isLoading && !error && (
        <div className="space-y-6">
          {/* Patient Report */}
          {selectedReport === 'patients' && reportData && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-blue-600">Total Patients</p>
                  <p className="text-2xl font-bold text-blue-900">{reportData.stats?.totalPatients || 0}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-green-600">Active Patients</p>
                  <p className="text-2xl font-bold text-green-900">{reportData.stats?.activePatients || 0}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-red-600">Critical Patients</p>
                  <p className="text-2xl font-bold text-red-900">{reportData.stats?.criticalPatients || 0}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">Discharged</p>
                  <p className="text-2xl font-bold text-gray-900">{reportData.stats?.dischargedPatients || 0}</p>
                </div>
              </div>
              
              {reportData.stats?.patientsByDepartment && (
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Patients by Department</h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <SimpleChart
                      data={reportData.stats.patientsByDepartment.map(dept => ({
                        label: dept._id,
                        value: dept.count
                      }))}
                      type="bar"
                      title="Patient Distribution"
                      height={250}
                    />
                    <div className="space-y-2">
                      {reportData.stats.patientsByDepartment.map((dept, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="font-medium">{dept._id}</span>
                          <span className="text-blue-600 font-semibold">{dept.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Doctor Report */}
          {selectedReport === 'doctors' && reportData && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Doctor Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-blue-600">Total Doctors</p>
                  <p className="text-2xl font-bold text-blue-900">{reportData.stats?.totalDoctors || 0}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-green-600">Active Doctors</p>
                  <p className="text-2xl font-bold text-green-900">{reportData.stats?.activeDoctors || 0}</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-yellow-600">On Leave</p>
                  <p className="text-2xl font-bold text-yellow-900">{reportData.stats?.onLeaveDoctors || 0}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-purple-600">Avg Rating</p>
                  <p className="text-2xl font-bold text-purple-900">{reportData.stats?.averageRating || 0}/5</p>
                </div>
              </div>
              
              {reportData.stats?.departmentStats && (
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Doctors by Department</h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <SimpleChart
                      data={reportData.stats.departmentStats.map(dept => ({
                        label: dept._id,
                        value: dept.count
                      }))}
                      type="pie"
                      title="Doctor Distribution"
                      height={250}
                    />
                    <div className="space-y-2">
                      {reportData.stats.departmentStats.map((dept, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="font-medium">{dept._id}</span>
                          <div className="flex items-center space-x-4">
                            <span className="text-blue-600 font-semibold">{dept.count} total</span>
                            <span className="text-green-600 text-sm">({dept.activeCount} active)</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Appointment Report */}
          {selectedReport === 'appointments' && reportData && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-blue-600">Total Appointments</p>
                  <p className="text-2xl font-bold text-blue-900">{reportData.stats?.total || 0}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-green-600">Today's Appointments</p>
                  <p className="text-2xl font-bold text-green-900">{reportData.stats?.today || 0}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-purple-600">Departments</p>
                  <p className="text-2xl font-bold text-purple-900">{reportData.stats?.byDepartment?.length || 0}</p>
                </div>
              </div>
              
              {reportData.stats?.byDepartment && (
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Appointments by Department</h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <SimpleChart
                      data={reportData.stats.byDepartment.map(dept => ({
                        label: dept._id,
                        value: dept.count
                      }))}
                      type="bar"
                      title="Appointment Distribution"
                      height={250}
                    />
                    <div className="space-y-2">
                      {reportData.stats.byDepartment.map((dept, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="font-medium">{dept._id}</span>
                          <span className="text-blue-600 font-semibold">{dept.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Department Report */}
          {selectedReport === 'departments' && reportData && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Overview</h3>
              <div className="mb-6">
                <p className="text-lg text-gray-600">Total Departments: <span className="font-bold text-blue-600">{reportData.totalDepartments}</span></p>
              </div>
              
              {reportData.departments && (
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Department Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {reportData.departments.map((dept, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <h5 className="font-semibold text-gray-900 mb-2">{dept.name}</h5>
                        <div className="space-y-1 text-sm">
                          <p>Doctors: <span className="font-medium text-blue-600">{dept.doctors}</span></p>
                          <p>Active: <span className="font-medium text-green-600">{dept.activeDoctors}</span></p>
                          <p>Patients: <span className="font-medium text-purple-600">{dept.patients}</span></p>
                          <p>Appointments: <span className="font-medium text-orange-600">{dept.appointments}</span></p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Revenue and Emergency Reports - Placeholder */}
          {(selectedReport === 'revenue' || selectedReport === 'emergency') && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {(() => {
                  const Icon = getReportIcon(selectedReport);
                  return <Icon className="w-8 h-8 text-gray-600" />;
                })()}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {getReportName(selectedReport)}
              </h3>
              <p className="text-gray-600 mb-6">
                This report type is not yet implemented. Please select another report type.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
