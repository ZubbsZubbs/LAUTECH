'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  MoreVertical,
  Building2,
  Users,
  Stethoscope,
  Calendar,
  TrendingUp,
  Heart,
  Brain,
  Eye as EyeIcon,
  Baby,
  Bone,
  Smile,
  Wind,
  Shield,
  Activity,
  Beaker,
  X,
  Check
} from 'lucide-react';
import Loader from '../../../components/ui/Loader';

const DepartmentsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [showTeamModal, setShowTeamModal] = useState(null);
  const [departmentDoctors, setDepartmentDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);

  // Fetch departments from API
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://lautech-edu-ng.onrender.com/api/departments');
        
        // Check if response is HTML (404 or server error)
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('API server not responding properly');
        }
        
        const data = await response.json();
        
        if (data.success) {
          setDepartments(data.data.departments);
        } else {
          setError(data.message || 'Failed to fetch departments');
        }
      } catch (err) {
        console.error('Error fetching departments:', err);
        setError('API server not available. Using static data.');
        // Fallback to static data
        setDepartments(staticDepartments);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown && !event.target.closest('.relative')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

  const staticDepartments = [
    {
      id: 1,
      name: 'Cardiology',
      icon: Heart,
      description: 'Comprehensive heart care including diagnostics, treatment, and rehabilitation.',
      head: 'Dr. Sarah Johnson',
      doctors: 8,
      patients: 1247,
      appointments: 23,
      status: 'active',
      color: 'from-red-500 to-red-600',
      lastUpdated: '2024-01-15'
    },
    {
      id: 2,
      name: 'Pediatrics',
      icon: Baby,
      description: 'Specialized care for infants, children, and adolescents.',
      head: 'Dr. Michael Chen',
      doctors: 6,
      patients: 892,
      appointments: 18,
      status: 'active',
      color: 'from-pink-500 to-pink-600',
      lastUpdated: '2024-01-14'
    },
    {
      id: 3,
      name: 'Neurology',
      icon: Brain,
      description: 'Advanced treatment for brain, spine, and nervous system disorders.',
      head: 'Dr. Emily Rodriguez',
      doctors: 7,
      patients: 654,
      appointments: 15,
      status: 'active',
      color: 'from-purple-500 to-purple-600',
      lastUpdated: '2024-01-13'
    },
    {
      id: 4,
      name: 'Orthopedics',
      icon: Bone,
      description: 'Expert care for bones, joints, muscles, and connective tissues.',
      head: 'Dr. David Thompson',
      doctors: 9,
      patients: 1123,
      appointments: 21,
      status: 'active',
      color: 'from-blue-500 to-blue-600',
      lastUpdated: '2024-01-12'
    },
    {
      id: 5,
      name: 'Ophthalmology',
      icon: EyeIcon,
      description: 'Comprehensive eye care and vision services.',
      head: 'Dr. Lisa Wilson',
      doctors: 5,
      patients: 456,
      appointments: 12,
      status: 'active',
      color: 'from-indigo-500 to-indigo-600',
      lastUpdated: '2024-01-11'
    },
    {
      id: 6,
      name: 'Dentistry',
      icon: Smile,
      description: 'Complete oral health and dental care services.',
      head: 'Dr. Robert Kim',
      doctors: 4,
      patients: 789,
      appointments: 16,
      status: 'active',
      color: 'from-teal-500 to-teal-600',
      lastUpdated: '2024-01-10'
    },
    {
      id: 7,
      name: 'Pulmonology',
      icon: Wind,
      description: 'Specialized respiratory care and lung disease treatment.',
      head: 'Dr. Jennifer Garcia',
      doctors: 6,
      patients: 567,
      appointments: 14,
      status: 'active',
      color: 'from-cyan-500 to-cyan-600',
      lastUpdated: '2024-01-09'
    },
    {
      id: 8,
      name: 'Emergency Medicine',
      icon: Shield,
      description: '24/7 emergency and trauma care services.',
      head: 'Dr. Mark Davis',
      doctors: 12,
      patients: 2341,
      appointments: 45,
      status: 'active',
      color: 'from-orange-500 to-orange-600',
      lastUpdated: '2024-01-08'
    },
    {
      id: 9,
      name: 'Internal Medicine',
      icon: Activity,
      description: 'Comprehensive adult medical care and disease management.',
      head: 'Dr. Sarah Martinez',
      doctors: 10,
      patients: 1456,
      appointments: 28,
      status: 'active',
      color: 'from-green-500 to-green-600',
      lastUpdated: '2024-01-07'
    },
    {
      id: 10,
      name: 'Pathology',
      icon: Beaker,
      description: 'Laboratory services and disease diagnosis.',
      head: 'Dr. James Wilson',
      doctors: 3,
      patients: 234,
      appointments: 8,
      status: 'active',
      color: 'from-gray-500 to-gray-600',
      lastUpdated: '2024-01-06'
    },
    {
      id: 11,
      name: 'Radiology',
      icon: Activity,
      description: 'Advanced imaging and diagnostic procedures.',
      head: 'Dr. Maria Lopez',
      doctors: 4,
      patients: 1234,
      appointments: 32,
      status: 'active',
      color: 'from-violet-500 to-violet-600',
      lastUpdated: '2024-01-05'
    },
    {
      id: 12,
      name: 'Oncology',
      icon: Beaker,
      description: 'Comprehensive cancer care and treatment.',
      head: 'Dr. Amina Hassan',
      doctors: 8,
      patients: 567,
      appointments: 19,
      status: 'active',
      color: 'from-rose-500 to-rose-600',
      lastUpdated: '2024-01-04'
    }
  ];

  const filteredDepartments = departments.filter(dept => {
    const matchesSearch = dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dept.head.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dept.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || dept.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'maintenance': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Icon mapping for API data
  const getIconComponent = (iconName) => {
    const iconMap = {
      'Heart': Heart,
      'Baby': Baby,
      'Brain': Brain,
      'Bone': Bone,
      'Eye': EyeIcon,
      'Smile': Smile,
      'Wind': Wind,
      'Shield': Shield,
      'Activity': Activity,
      'Beaker': Beaker,
      'X': X,
      'Check': Check
    };
    return iconMap[iconName] || Activity;
  };

  const handleEdit = (department) => {
    setEditingDepartment(department);
    setShowAddModal(true);
  };

  const handleDelete = (department) => {
    setShowDeleteModal(department);
  };

  const confirmDelete = () => {
    // Handle delete logic here
    console.log('Deleting department:', showDeleteModal);
    setShowDeleteModal(null);
  };

  const handleViewTeam = async (department) => {
    try {
        const response = await fetch(`https://lautech-edu-ng.onrender.com/api/doctors?department=${encodeURIComponent(department.name)}&status=active`);
      const data = await response.json();
      
      if (data.success) {
        setDepartmentDoctors(data.data.doctors);
        setShowTeamModal(department);
      }
    } catch (err) {
      console.error('Error fetching department doctors:', err);
    }
  };

  if (loading) {
    return <Loader text="Loading departments..." />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Departments Management</h1>
          <p className="text-gray-600">Manage hospital departments and their configurations</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 sm:mt-0 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Department
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search departments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDepartments.map((department) => {
          const Icon = getIconComponent(department.icon) || Building2; // Use API icon or fallback
          return (
            <div key={department._id || department.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 bg-gradient-to-r ${department.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{department.name}</h3>
                      <p className="text-sm text-gray-500">{department.head}</p>
                    </div>
                  </div>
                  <div className="relative">
                    <button 
                      onClick={() => setOpenDropdown(openDropdown === department._id || openDropdown === department.id ? null : (department._id || department.id))}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {openDropdown === (department._id || department.id) && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                        <button
                          onClick={() => {
                            handleViewTeam(department);
                            setOpenDropdown(null);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        >
                          <Users className="w-4 h-4 mr-2" />
                          View Team
                        </button>
                        <button
                          onClick={() => {
                            handleEdit(department);
                            setOpenDropdown(null);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            handleDelete(department);
                            setOpenDropdown(null);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{department.description}</p>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg mx-auto mb-1">
                      <Stethoscope className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="text-xs text-gray-500">Doctors</p>
                    <p className="text-sm font-semibold text-gray-900">{department.doctors?.length || 0}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg mx-auto mb-1">
                      <Users className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-xs text-gray-500">Patients</p>
                    <p className="text-sm font-semibold text-gray-900">{(department.patients || 0).toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-lg mx-auto mb-1">
                      <Calendar className="w-4 h-4 text-orange-600" />
                    </div>
                    <p className="text-xs text-gray-500">Today</p>
                    <p className="text-sm font-semibold text-gray-900">{department.appointments || 0}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(department.status)}`}>
                    {department.status}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewTeam(department)}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="View Team"
                    >
                      <Users className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(department)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(department)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Department Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowAddModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {editingDepartment ? 'Edit Department' : 'Add New Department'}
                  </h3>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department Name</label>
                    <input
                      type="text"
                      defaultValue={editingDepartment?.name || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter department name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department Head</label>
                    <input
                      type="text"
                      defaultValue={editingDepartment?.head || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter department head name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      defaultValue={editingDepartment?.description || ''}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter department description"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      defaultValue={editingDepartment?.status || 'active'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>
                </form>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {editingDepartment ? 'Update Department' : 'Add Department'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Delete Department
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete <strong>{showDeleteModal.name}</strong>? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(null)}
                  className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Team Modal */}
      {showTeamModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{showTeamModal.name} Team</h3>
                <p className="text-gray-600">Manage department team members</p>
              </div>
              <button
                onClick={() => setShowTeamModal(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {departmentDoctors.map((doctor, index) => (
                <div key={doctor._id || index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{doctor.firstName} {doctor.lastName}</h4>
                      <p className="text-sm text-gray-600">{doctor.specialization}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Department:</span>
                      <span className="text-gray-900">{doctor.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Experience:</span>
                      <span className="text-gray-900">{doctor.experience}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status:</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        doctor.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {doctor.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {departmentDoctors.length === 0 && (
              <div className="text-center py-8">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No team members found for this department.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentsManagement;
