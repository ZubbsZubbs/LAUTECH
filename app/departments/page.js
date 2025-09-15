"use client";

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
  FaFlask
} from "react-icons/fa";

const departments = [
  {
    id: 1,
    name: "Cardiology",
    icon: FaHeart,
    description: "Comprehensive heart care including diagnostics, treatment, and rehabilitation.",
    services: ["Echocardiography", "Cardiac Catheterization", "Heart Surgery", "Cardiac Rehabilitation"],
    head: "Dr. Michael Adebayo",
    color: "from-red-500 to-red-600"
  },
  {
    id: 2,
    name: "Pediatrics",
    icon: FaBaby,
    description: "Specialized care for infants, children, and adolescents.",
    services: ["Well-child Checkups", "Vaccinations", "Child Development", "Pediatric Surgery"],
    head: "Dr. Fatima Ibrahim",
    color: "from-blue-500 to-blue-600"
  },
  {
    id: 3,
    name: "Neurology",
    icon: FaBrain,
    description: "Care for brain, spine, and nervous system disorders.",
    services: ["Brain Surgery", "Spine Surgery", "Neurological Exams", "Stroke Care"],
    head: "Dr. James Okonkwo",
    color: "from-purple-500 to-purple-600"
  },
  {
    id: 4,
    name: "Orthopedics",
    icon: FaBone,
    description: "Bone, joint, and muscle care including sports medicine.",
    services: ["Joint Replacement", "Sports Medicine", "Fracture Care", "Physical Therapy"],
    head: "Dr. Peter Williams",
    color: "from-green-500 to-green-600"
  },
  {
    id: 5,
    name: "Ophthalmology",
    icon: FaEye,
    description: "Eye care and vision services for all ages.",
    services: ["Eye Exams", "Cataract Surgery", "Glaucoma Treatment", "Retinal Care"],
    head: "Dr. Sarah Johnson",
    color: "from-yellow-500 to-yellow-600"
  },
  {
    id: 6,
    name: "Dentistry",
    icon: FaTooth,
    description: "Comprehensive dental care and oral health services.",
    services: ["General Dentistry", "Oral Surgery", "Orthodontics", "Cosmetic Dentistry"],
    head: "Dr. Grace Okafor",
    color: "from-teal-500 to-teal-600"
  },
  {
    id: 7,
    name: "Pulmonology",
    icon: FaLungs,
    description: "Respiratory system care and lung disease treatment.",
    services: ["Lung Function Tests", "Bronchoscopy", "Sleep Studies", "Respiratory Therapy"],
    head: "Dr. Amina Hassan",
    color: "from-indigo-500 to-indigo-600"
  },
  {
    id: 8,
    name: "Emergency Medicine",
    icon: FaStethoscope,
    description: "24/7 emergency care with experienced trauma specialists.",
    services: ["Trauma Care", "Emergency Surgery", "Critical Care", "Ambulance Service"],
    head: "Dr. Chinedu Okwu",
    color: "from-orange-500 to-orange-600"
  },
  {
    id: 9,
    name: "Internal Medicine",
    icon: FaUserMd,
    description: "Comprehensive adult medical care and disease management.",
    services: ["General Medicine", "Chronic Disease Management", "Preventive Care", "Health Screenings"],
    head: "Dr. Sarah Johnson",
    color: "from-pink-500 to-pink-600"
  },
  {
    id: 10,
    name: "Pathology",
    icon: FaMicroscope,
    description: "Laboratory services and disease diagnosis.",
    services: ["Blood Tests", "Tissue Analysis", "Microbiology", "Cytology"],
    head: "Dr. James Okonkwo",
    color: "from-cyan-500 to-cyan-600"
  },
  {
    id: 11,
    name: "Radiology",
    icon: FaXRay,
    description: "Advanced imaging services and diagnostic procedures.",
    services: ["MRI Scans", "CT Scans", "Ultrasound", "X-rays"],
    head: "Dr. Peter Williams",
    color: "from-gray-500 to-gray-600"
  },
  {
    id: 12,
    name: "Oncology",
    icon: FaFlask,
    description: "Comprehensive cancer care and treatment.",
    services: ["Chemotherapy", "Radiation Therapy", "Cancer Surgery", "Palliative Care"],
    head: "Dr. Amina Hassan",
    color: "from-rose-500 to-rose-600"
  }
];

const Departments = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div className="relative w-full h-[400px] bg-gradient-to-r from-green-600 to-green-500 flex items-center justify-center text-white text-center">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative z-10">
          <h1 className="text-5xl font-bold mb-4 animate-fade-in-up">
            Medical Departments
          </h1>
          <p className="text-xl mb-6 animate-fade-in-up delay-200">
            Comprehensive healthcare services across all medical specialties
          </p>
        </div>
      </div>

      {/* Departments Grid */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Our Medical Departments
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            LAUTECH Teaching Hospital offers specialized care across multiple medical departments, 
            each staffed with expert physicians and equipped with state-of-the-art facilities.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {departments.map((dept, index) => {
            const IconComponent = dept.icon;
            return (
              <div
                key={dept.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animation: "fadeInUp 0.6s ease-out forwards"
                }}
              >
                <div className={`h-2 bg-gradient-to-r ${dept.color}`}></div>
                
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-full bg-gradient-to-r ${dept.color} text-white mr-4`}>
                      <IconComponent size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{dept.name}</h3>
                      <p className="text-sm text-gray-600">Head: {dept.head}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {dept.description}
                  </p>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Services:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {dept.services.map((service, idx) => (
                        <li key={idx} className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          {service}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Department Statistics */}
      <div className="bg-green-50 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Department Statistics
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">12+</div>
              <p className="text-gray-600">Medical Departments</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">50+</div>
              <p className="text-gray-600">Specialist Doctors</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">200+</div>
              <p className="text-gray-600">Medical Staff</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">24/7</div>
              <p className="text-gray-600">Emergency Services</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Departments;
