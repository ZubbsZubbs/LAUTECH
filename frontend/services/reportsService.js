const API_BASE_URL = 'http://localhost:9000/api';

// Helper function to make API calls
const apiCall = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('Making API call to:', url);
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    console.log('API response status:', response.status, 'for', url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API call failed:', response.status, response.statusText, errorText);
      throw new Error(`API call failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('API call successful for:', url);
    return data;
  } catch (error) {
    console.error('API call error for endpoint:', endpoint, error);
    throw error;
  }
};

// Application statistics
export const getApplicationStats = async () => {
  return apiCall('/applications/stats');
};

// Patient statistics
export const getPatientStats = async () => {
  return apiCall('/patients/stats');
};

// Doctor statistics
export const getDoctorStats = async () => {
  return apiCall('/doctors/stats');
};

// Appointment statistics
export const getAppointmentStats = async () => {
  return apiCall('/appointments/stats');
};

// Get all applications with filtering
export const getApplications = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return apiCall(`/applications?${queryString}`);
};

// Get all patients with filtering
export const getPatients = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return apiCall(`/patients?${queryString}`);
};

// Get all doctors with filtering
export const getDoctors = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return apiCall(`/doctors?${queryString}`);
};

// Get all appointments with filtering
export const getAppointments = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return apiCall(`/appointments?${queryString}`);
};

// Helper function to calculate date range
const getDateRange = (days) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - parseInt(days));
  return { startDate, endDate };
};

// Generate comprehensive overview report
export const getOverviewReport = async (dateRange = '30') => {
  try {
    const { startDate, endDate } = getDateRange(dateRange);
    const dateParams = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    };

    const [applicationStats, patientStats, doctorStats, appointmentStats] = await Promise.all([
      getApplicationStats(dateParams),
      getPatientStats(dateParams),
      getDoctorStats(dateParams),
      getAppointmentStats(dateParams),
    ]);

    return {
      success: true,
      data: {
        applications: applicationStats.data,
        patients: patientStats.data,
        doctors: doctorStats.data,
        appointments: appointmentStats.data,
        dateRange: { startDate, endDate }
      },
    };
  } catch (error) {
    console.error('Error generating overview report:', error);
    throw error;
  }
};

// Generate patient report with detailed data
export const getPatientReport = async (dateRange = '30') => {
  try {
    const { startDate, endDate } = getDateRange(dateRange);
    const dateParams = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    };

    const [patientStats, patients] = await Promise.all([
      getPatientStats(dateParams),
      getPatients({ limit: 1000, ...dateParams }), // Get all patients for detailed report
    ]);

    return {
      success: true,
      data: {
        stats: patientStats.data,
        patients: patients.data?.patients || [],
        dateRange: { startDate, endDate }
      },
    };
  } catch (error) {
    console.error('Error generating patient report:', error);
    throw error;
  }
};

// Generate doctor report with detailed data
export const getDoctorReport = async (dateRange = '30') => {
  try {
    const { startDate, endDate } = getDateRange(dateRange);
    const dateParams = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    };

    const [doctorStats, doctors] = await Promise.all([
      getDoctorStats(dateParams),
      getDoctors({ limit: 1000, ...dateParams }), // Get all doctors for detailed report
    ]);

    return {
      success: true,
      data: {
        stats: doctorStats.data,
        doctors: doctors.data?.doctors || [],
        dateRange: { startDate, endDate }
      },
    };
  } catch (error) {
    console.error('Error generating doctor report:', error);
    throw error;
  }
};

// Generate appointment report with detailed data
export const getAppointmentReport = async (dateRange = '30') => {
  try {
    const { startDate, endDate } = getDateRange(dateRange);
    const dateParams = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    };

    const [appointmentStats, appointments] = await Promise.all([
      getAppointmentStats(dateParams),
      getAppointments({ limit: 1000, ...dateParams }), // Get all appointments for detailed report
    ]);

    return {
      success: true,
      data: {
        stats: appointmentStats.data,
        appointments: appointments.data?.appointments || [],
        dateRange: { startDate, endDate }
      },
    };
  } catch (error) {
    console.error('Error generating appointment report:', error);
    throw error;
  }
};

// Generate department report
export const getDepartmentReport = async (dateRange = '30') => {
  try {
    const { startDate, endDate } = getDateRange(dateRange);
    const dateParams = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    };

    const [doctorStats, patientStats, appointmentStats] = await Promise.all([
      getDoctorStats(dateParams),
      getPatientStats(dateParams),
      getAppointmentStats(dateParams),
    ]);

    // Combine department data from different sources
    const departmentData = {};
    
    // Process doctor department stats
    if (doctorStats.data?.departmentStats) {
      doctorStats.data.departmentStats.forEach(dept => {
        if (!departmentData[dept._id]) {
          departmentData[dept._id] = { name: dept._id, doctors: 0, activeDoctors: 0 };
        }
        departmentData[dept._id].doctors = dept.count;
        departmentData[dept._id].activeDoctors = dept.activeCount;
      });
    }

    // Process patient department stats
    if (patientStats.data?.patientsByDepartment) {
      patientStats.data.patientsByDepartment.forEach(dept => {
        if (!departmentData[dept._id]) {
          departmentData[dept._id] = { name: dept._id, patients: 0 };
        }
        departmentData[dept._id].patients = dept.count;
      });
    }

    // Process appointment department stats
    if (appointmentStats.data?.byDepartment) {
      appointmentStats.data.byDepartment.forEach(dept => {
        if (!departmentData[dept._id]) {
          departmentData[dept._id] = { name: dept._id, appointments: 0 };
        }
        departmentData[dept._id].appointments = dept.count;
      });
    }

    return {
      success: true,
      data: {
        departments: Object.values(departmentData),
        totalDepartments: Object.keys(departmentData).length,
        dateRange: { startDate, endDate }
      },
    };
  } catch (error) {
    console.error('Error generating department report:', error);
    throw error;
  }
};

// Export report data as CSV
export const exportReportAsCSV = (data, filename) => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Convert data to CSV format
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape commas and quotes in CSV
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export report data as JSON
export const exportReportAsJSON = (data, filename) => {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
