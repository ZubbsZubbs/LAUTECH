const API_BASE_URL = 'https://localhost:9000/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Helper function to make API calls
const apiCall = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = getAuthToken();
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    // Add authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, {
      headers,
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API call failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API call error for endpoint: "${endpoint}"`, error);
    throw error;
  }
};

// Get all settings for a user
export const getSettings = async (userId) => {
  return await apiCall(`/settings/${userId}`);
};

// Update profile settings
export const updateProfileSettings = async (userId, profileData) => {
  return await apiCall(`/settings/${userId}/profile`, {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
};

// Update hospital settings
export const updateHospitalSettings = async (userId, hospitalData) => {
  return await apiCall(`/settings/${userId}/hospital`, {
    method: 'PUT',
    body: JSON.stringify(hospitalData),
  });
};

// Update notification settings
export const updateNotificationSettings = async (userId, notificationData) => {
  return await apiCall(`/settings/${userId}/notifications`, {
    method: 'PUT',
    body: JSON.stringify(notificationData),
  });
};

// Update security settings
export const updateSecuritySettings = async (userId, securityData) => {
  return await apiCall(`/settings/${userId}/security`, {
    method: 'PUT',
    body: JSON.stringify(securityData),
  });
};

// Update system settings
export const updateSystemSettings = async (userId, systemData) => {
  return await apiCall(`/settings/${userId}/system`, {
    method: 'PUT',
    body: JSON.stringify(systemData),
  });
};

// Change password
export const changePassword = async (userId, passwordData) => {
  return await apiCall(`/settings/${userId}/password`, {
    method: 'PUT',
    body: JSON.stringify(passwordData),
  });
};

// Update all settings at once
export const updateAllSettings = async (userId, settingsData) => {
  return await apiCall(`/settings/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(settingsData),
  });
};
