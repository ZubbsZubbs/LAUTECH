// Department service to fetch doctors by department
const API_BASE_URL = 'http://localhost:9000/api';

class DepartmentService {
  async getDoctorsByDepartment(department) {
    try {
      const response = await fetch(`${API_BASE_URL}/doctors?department=${encodeURIComponent(department)}&status=active&limit=50`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.data.doctors || [];
    } catch (error) {
      console.error('Error fetching doctors by department:', error);
      return [];
    }
  }

  async getAllDoctors() {
    try {
      const response = await fetch(`${API_BASE_URL}/doctors?status=active&limit=100`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.data.doctors || [];
    } catch (error) {
      console.error('Error fetching all doctors:', error);
      return [];
    }
  }

  // Get department statistics
  async getDepartmentStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/doctors/stats`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.data || {};
    } catch (error) {
      console.error('Error fetching department stats:', error);
      return {};
    }
  }
}

export default new DepartmentService();
