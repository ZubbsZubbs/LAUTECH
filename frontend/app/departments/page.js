"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { 
  FaHeart, 
  FaBaby, 
  FaBrain, 
  FaBone, 
  FaEye, 
  FaTooth, 
  FaLungs, 
  FaStethoscope,
  FaUserMd,
  FaMicroscope,
  FaXRay,
  FaFlask,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
  FaHospital,
  FaBuilding,
  FaCogs,
  FaCheckCircle,
  FaAward,
  FaShieldAlt,
  FaArrowRight,
  FaArrowLeft
} from "react-icons/fa";

// Static department data as fallback
const staticDepartmentsData = [
  {
    id: 1,
    name: "Cardiology",
    slug: "cardiology",
    icon: FaHeart,
    description: "Comprehensive heart and cardiovascular care with advanced diagnostic and treatment options.",
    color: "from-red-500 to-red-600",
    services: ["Heart Surgery", "Cardiac Catheterization", "Echocardiography", "Stress Testing"],
    head: "Dr. Sarah Johnson",
    patients: 1247,
    doctors: 3
  },
  {
    id: 2,
    name: "Pediatrics",
    slug: "pediatrics",
    icon: FaBaby,
    description: "Specialized healthcare for infants, children, and adolescents with compassionate care.",
    color: "from-pink-500 to-pink-600",
    services: ["Well-child Checkups", "Vaccinations", "Emergency Care", "Chronic Disease Management"],
    head: "Dr. Michael Chen",
    patients: 892,
    doctors: 4
  },
  {
    id: 3,
    name: "Neurology",
    slug: "neurology",
    icon: FaBrain,
    description: "Advanced neurological care for brain, spine, and nervous system disorders.",
    color: "from-purple-500 to-purple-600",
    services: ["Brain Surgery", "Epilepsy Treatment", "Stroke Care", "Neurological Rehabilitation"],
    head: "Dr. Emily Rodriguez",
    patients: 456,
    doctors: 1
  },
  {
    id: 4,
    name: "Orthopedics",
    slug: "orthopedics",
    icon: FaBone,
    description: "Expert care for bones, joints, muscles, and sports-related injuries.",
    color: "from-blue-500 to-blue-600",
    services: ["Joint Replacement", "Sports Medicine", "Fracture Care", "Physical Therapy"],
    head: "Dr. David Kim",
    patients: 678,
    doctors: 2
  },
  {
    id: 5,
    name: "Ophthalmology",
    slug: "ophthalmology",
    icon: FaEye,
    description: "Comprehensive eye care and vision services with state-of-the-art technology.",
    color: "from-green-500 to-green-600",
    services: ["Cataract Surgery", "LASIK", "Retinal Treatment", "Pediatric Ophthalmology"],
    head: "Dr. Lisa Wilson",
    patients: 456,
    doctors: 2
  },
  {
    id: 6,
    name: "Dentistry",
    slug: "dentistry",
    icon: FaTooth,
    description: "Complete dental care for all ages with modern techniques and equipment.",
    color: "from-teal-500 to-teal-600",
    services: ["General Dentistry", "Orthodontics", "Oral Surgery", "Cosmetic Dentistry"],
    head: "Dr. James Brown",
    patients: 789,
    doctors: 3
  },
  {
    id: 7,
    name: "Pulmonology",
    slug: "pulmonology",
    icon: FaLungs,
    description: "Specialized care for respiratory and lung conditions with advanced treatments.",
    color: "from-cyan-500 to-cyan-600",
    services: ["Lung Cancer Treatment", "Asthma Management", "COPD Care", "Sleep Medicine"],
    head: "Dr. Maria Garcia",
    patients: 345,
    doctors: 2
  },
  {
    id: 8,
    name: "Emergency Medicine",
    slug: "emergency-medicine",
    icon: FaStethoscope,
    description: "24/7 emergency care with rapid response and critical care expertise.",
    color: "from-orange-500 to-orange-600",
    services: ["Trauma Care", "Critical Care", "Emergency Surgery", "Triage Services"],
    head: "Dr. Robert Taylor",
    patients: 1200,
    doctors: 4
  }
];

export default function DepartmentsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Icon mapping for API data
  const getIconComponent = (iconName) => {
    const iconMap = {
      'Heart': FaHeart,
      'Baby': FaBaby,
      'Brain': FaBrain,
      'Bone': FaBone,
      'Eye': FaEye,
      'Tooth': FaTooth,
      'Lung': FaLungs,
      'Shield': FaShieldAlt,
      'Activity': FaStethoscope,
      'Flask': FaFlask,
      'X': FaXRay,
      'Check': FaCheckCircle
    };
    return iconMap[iconName] || FaStethoscope;
  };

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
          // Transform API data to match expected format
          const transformedDepartments = data.data.departments.map(dept => ({
            id: dept._id,
            name: dept.name,
            slug: dept.slug,
            icon: getIconComponent(dept.icon),
            description: dept.description,
            color: dept.color,
            services: dept.procedures?.map(p => p.name) || [],
            head: dept.head,
            patients: dept.patients || 0,
            doctors: dept.doctors?.length || 0
          }));
          setDepartments(transformedDepartments);
          setFilteredDepartments(transformedDepartments);
        } else {
          setError(data.message || 'Failed to fetch departments');
          // Fallback to static data
          setDepartments(staticDepartmentsData);
          setFilteredDepartments(staticDepartmentsData);
        }
      } catch (err) {
        console.error('Error fetching departments:', err);
        setError('API server not available. Using static data.');
        // Fallback to static data
        setDepartments(staticDepartmentsData);
        setFilteredDepartments(staticDepartmentsData);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  // Filter departments based on search term
  useEffect(() => {
    const filtered = departments.filter(dept =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredDepartments(filtered);
  }, [searchTerm, departments]);

  const handleDepartmentClick = (slug) => {
    router.push(`/departments/${slug}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading departments...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
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
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => router.push('/')}
              className="flex items-center justify-center w-10 h-10 text-white hover:text-blue-100 hover:bg-white/10 rounded-full transition-all duration-300 group"
            >
              <FaArrowLeft className="text-lg group-hover:-translate-x-1 transition-transform duration-300" />
            </button>
          </div>
          
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Our Medical Departments
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Comprehensive healthcare services across specialized departments
            </p>
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search departments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 pr-12 text-gray-900 rounded-lg text-lg focus:outline-none focus:ring-4 focus:ring-white bg-white placeholder-gray-500"
                />
                <FaStethoscope className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-600 text-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Departments Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDepartments.map((department) => {
            const IconComponent = department.icon;
            return (
              <div
                key={department.id}
                className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-200/50 hover:border-gray-300"
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${department.color} opacity-0 group-hover:opacity-3 transition-opacity duration-500`}></div>
                
                <div className="relative p-5">
                  {/* Icon and Title Section */}
                  <div className="flex items-start mb-4">
                    <div className="relative">
                      {/* Icon background glow */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${department.color} rounded-xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300`}></div>
                      <div className={`relative p-3 rounded-xl bg-gradient-to-br ${department.color} text-white shadow-lg group-hover:scale-105 transition-all duration-300`}>
                        <IconComponent className="text-2xl" />
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1.5 group-hover:text-blue-600 transition-colors duration-300">
                        {department.name}
                      </h3>
                      <div className="flex items-center text-xs text-gray-600 bg-gray-50 rounded-lg px-2.5 py-1 w-fit">
                        <FaUserMd className="mr-1.5 text-blue-500 text-sm" />
                        <span className="font-medium">{department.head}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed text-sm">
                    {department.description}
                  </p>
                  
                  {/* Services Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {department.services.slice(0, 2).map((service, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg border border-gray-200"
                      >
                        {service}
                      </span>
                    ))}
                    {department.services.length > 2 && (
                      <span className="px-3 py-1 bg-gray-200 text-gray-700 text-xs font-medium rounded-lg border border-gray-300">
                        +{department.services.length - 2} more
                      </span>
                    )}
                  </div>
                  
                  {/* Stats Section */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg px-3 py-2 border border-blue-200/50">
                      <FaUserMd className="text-blue-600 text-base mr-2" />
                      <div>
                        <div className="text-xl font-bold text-blue-900">{department.doctors}</div>
                        <div className="text-[10px] text-blue-600 font-medium">Doctors</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100/50 rounded-lg px-3 py-2 border border-green-200/50">
                      <FaHospital className="text-green-600 text-base mr-2" />
                      <div>
                        <div className="text-xl font-bold text-green-900">{department.patients}</div>
                        <div className="text-[10px] text-green-600 font-medium">Patients</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Read More Button */}
                  <button
                    onClick={() => handleDepartmentClick(department.slug)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold text-sm shadow-sm hover:shadow-md transform hover:scale-[1.01] active:scale-[0.99] transition-all duration-300"
                  >
                    <span>Explore</span>
                    <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredDepartments.length === 0 && (
          <div className="text-center py-12">
            <FaStethoscope className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No departments found</h3>
            <p className="text-gray-500">Try adjusting your search terms</p>
          </div>
        )}
      </div>

      {/* Stats Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">{departments.length}</div>
              <div className="text-blue-200">Departments</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">
                {departments.reduce((sum, dept) => sum + dept.doctors, 0)}
              </div>
              <div className="text-blue-200">Specialists</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">
                {departments.reduce((sum, dept) => sum + dept.patients, 0).toLocaleString()}
              </div>
              <div className="text-blue-200">Patients Served</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-200">Emergency Care</div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
