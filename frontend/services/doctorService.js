// Force the correct API URL to fix the 404 issue
const API_BASE_URL = 'https://localhost:9000/api';

class DoctorService {
  async getAllDoctors(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.search) queryParams.append('search', params.search);
      if (params.department) queryParams.append('department', params.department);
      if (params.status) queryParams.append('status', params.status);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const response = await fetch(`${API_BASE_URL}/doctors?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching doctors:', error);
      throw error;
    }
  }

  async getDoctorById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/doctors/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching doctor:', error);
      throw error;
    }
  }

  async createDoctor(doctorData) {
    try {
      const response = await fetch(`${API_BASE_URL}/doctors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(doctorData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating doctor:', error);
      throw error;
    }
  }

  async updateDoctor(id, doctorData) {
    try {
      const response = await fetch(`${API_BASE_URL}/doctors/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(doctorData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating doctor:', error);
      throw error;
    }
  }

  async deleteDoctor(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/doctors/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting doctor:', error);
      throw error;
    }
  }

  async updateDoctorStatus(id, status) {
    try {
      const response = await fetch(`${API_BASE_URL}/doctors/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating doctor status:', error);
      throw error;
    }
  }

  async getDoctorStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/doctors/stats`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching doctor stats:', error);
      throw error;
    }
  }

  async searchDoctors(query, department = '', status = '') {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('q', query);
      if (department) queryParams.append('department', department);
      if (status) queryParams.append('status', status);

      const response = await fetch(`${API_BASE_URL}/doctors/search?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error searching doctors:', error);
      throw error;
    }
  }
}

export default new DoctorService();
