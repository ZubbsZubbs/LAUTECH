"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import AppointmentModal from "@/components/AppointmentModal";
import ContactModal from "@/components/ContactModal";
import FormsModal from "@/components/FormsModal";
import { Phone, X, Mail, Calendar, Award, Briefcase } from "lucide-react";
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
  FaArrowLeft,
  FaCalendarAlt,
  FaEnvelope,
  FaStar,
  FaDownload,
  FaFilePdf,
  FaChevronRight,
  FaGraduationCap,
  FaUser,
  FaPhoneAlt,
  FaMailBulk,
  FaLocationDot
} from "react-icons/fa";

// Modern department data
const departmentsData = {
  "pediatrics": {
    id: 2,
    name: "Pediatrics",
    icon: FaBaby,
    description: "Comprehensive healthcare for infants, children, and adolescents with specialized care.",
    services: ["Well-child Checkups", "Vaccinations", "Emergency Care", "Chronic Disease Management"],
    head: "Dr. Sarah Johnson",
    color: "from-pink-500 to-pink-600",
    expandedDetails: {
      overview: "Our Pediatrics Department is dedicated to providing exceptional healthcare for children from birth through adolescence. We combine advanced medical expertise with compassionate care to ensure every child receives the best possible treatment in a child-friendly environment.",
      
      statistics: {
        patients: 892,
        doctors: 4,
        nurses: 12,
        appointments: 18,
        successRate: 98,
        yearsExperience: 15,
        facilities: 6
      },
      
      expertTeam: [
        {
          name: "Dr. Sarah Johnson",
          role: "Department Head & Chief Pediatrician",
          specialization: "Pediatric Cardiology",
          experience: "15 years",
          education: "MD, PhD, FAAP",
          image: "/ceo.jpg",
          rating: 4.9,
          patients: 1247,
          bio: "Dr. Johnson is a renowned pediatric cardiologist with over 15 years of experience in treating congenital heart defects and acquired heart diseases in children."
        },
        {
          name: "Dr. Michael Chen",
          role: "Senior Pediatrician",
          specialization: "Pediatric Neurology",
          experience: "12 years",
          education: "MD, PhD, FAAP",
          image: "/cto.jpeg",
          rating: 4.8,
          patients: 892,
          bio: "Dr. Chen specializes in pediatric neurology and has treated thousands of children with neurological conditions and developmental disorders."
        },
        {
          name: "Dr. Emily Rodriguez",
          role: "Pediatric Specialist",
          specialization: "Pediatric Emergency Medicine",
          experience: "10 years",
          education: "MD, FAAP",
          image: "/s1.jpg",
          rating: 4.7,
          patients: 456,
          bio: "Dr. Rodriguez is an expert in pediatric emergency medicine and has extensive experience in critical care for children."
        }
      ],
      
      facilities: [
        {
          name: "Pediatric Emergency Unit",
          description: "24/7 emergency care for children",
          conditions: ["Fever", "Respiratory distress", "Trauma", "Poisoning", "Seizures", "Dehydration"],
          image: "https://images.unsplash.com/photo-1576091160399-112ba8d25bb1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
          equipment: ["Pediatric ventilators", "Cardiac monitors", "IV pumps", "Emergency medications"]
        },
        {
          name: "Child-Friendly Examination Rooms",
          description: "Specially designed rooms to reduce anxiety",
          conditions: ["Routine checkups", "Vaccinations", "Minor procedures", "Developmental assessments"],
          image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
          equipment: ["Child-sized equipment", "Interactive displays", "Comfortable seating", "Privacy screens"]
        },
        {
          name: "Pediatric ICU",
          description: "Intensive care for critically ill children",
          conditions: ["Post-surgical care", "Respiratory failure", "Cardiac conditions", "Neurological emergencies"],
          image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
          equipment: ["Advanced ventilators", "Hemodynamic monitoring", "ECMO", "Specialized medications"]
        }
      ],
      
      procedures: [
        {
          name: "Well-Child Checkups",
          description: "Comprehensive health assessments for children",
          duration: "30-45 minutes",
          preparation: "Bring immunization records",
          cost: "₦15,000"
        },
        {
          name: "Vaccination Schedule",
          description: "Complete immunization following CDC guidelines",
          duration: "15-30 minutes",
          preparation: "No special preparation needed",
          cost: "₦5,000 - ₦25,000"
        },
        {
          name: "Developmental Assessment",
          description: "Evaluation of physical and cognitive development",
          duration: "60-90 minutes",
          preparation: "Complete medical history",
          cost: "₦25,000"
        }
      ],
      
      conditionsTreated: [
        "Congenital heart defects",
        "Asthma and respiratory conditions",
        "Diabetes in children",
        "Epilepsy and seizure disorders",
        "Developmental delays",
        "Behavioral disorders",
        "Infectious diseases",
        "Growth disorders"
      ],
      
      achievements: [
        "JCI Accredited Pediatric Care",
        "Top 10 Pediatric Department in Nigeria",
        "Zero Hospital-Acquired Infections",
        "Patient Satisfaction Score: 98%"
      ],
      
      forms: [
        {
          name: "New Patient Registration",
          description: "Complete medical history and contact information",
          type: "PDF",
          size: "2.3 MB",
          icon: FaFilePdf
        },
        {
          name: "Immunization Record",
          description: "Track your child's vaccination history",
          type: "PDF",
          size: "1.8 MB",
          icon: FaFilePdf
        },
        {
          name: "Medical History Form",
          description: "Detailed health background information",
          type: "PDF",
          size: "3.1 MB",
          icon: FaFilePdf
        }
      ]
    }
  },
  
  "cardiology": {
    id: 1,
    name: "Cardiology",
    icon: FaHeart,
    description: "Advanced heart and cardiovascular care with cutting-edge technology and expert specialists.",
    services: ["Heart Surgery", "Cardiac Catheterization", "Echocardiography", "Stress Testing"],
    head: "Dr. Sarah Johnson",
    color: "from-red-500 to-red-600",
    expandedDetails: {
      overview: "Our Cardiology Department provides comprehensive cardiovascular care using state-of-the-art technology and evidence-based treatments. We offer both invasive and non-invasive procedures to diagnose and treat heart conditions.",
      
      statistics: {
        patients: 1247,
        doctors: 3,
        nurses: 8,
        appointments: 23,
        successRate: 98,
        yearsExperience: 15,
        facilities: 5
      },
      
      expertTeam: [
        {
          name: "Dr. Sarah Johnson",
          role: "Department Head & Interventional Cardiologist",
          specialization: "Interventional Cardiology",
          experience: "15 years",
          education: "MD, PhD, FACC",
          image: "/ceo.jpg",
          rating: 4.9,
          patients: 1247,
          bio: "Dr. Johnson is a renowned interventional cardiologist with over 15 years of experience in complex cardiac procedures and minimally invasive treatments."
        },
        {
          name: "Dr. David Kim",
          role: "Cardiac Surgeon",
          specialization: "Heart Surgery",
          experience: "12 years",
          education: "MD, FACS",
          image: "/s2.jpg",
          rating: 4.8,
          patients: 456,
          bio: "Dr. Kim specializes in open heart surgery and has performed hundreds of successful bypass and valve replacement procedures."
        },
        {
          name: "Dr. Lisa Wilson",
          role: "Electrophysiologist",
          specialization: "Heart Rhythm Disorders",
          experience: "10 years",
          education: "MD, PhD",
          image: "/s3.jpg",
          rating: 4.7,
          patients: 234,
          bio: "Dr. Wilson is an expert in treating heart rhythm disorders and has extensive experience in cardiac electrophysiology procedures."
        }
      ],
      
      facilities: [
        {
          name: "Cardiac Catheterization Lab",
          description: "State-of-the-art interventional procedures",
          conditions: ["Coronary artery disease", "Heart valve problems", "Congenital defects", "Arrhythmias"],
          image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
          equipment: ["Digital angiography", "Intravascular ultrasound", "Pressure monitoring", "Stent deployment systems"]
        },
        {
          name: "Cardiac Surgery Suite",
          description: "Advanced surgical facilities for heart procedures",
          conditions: ["Bypass surgery", "Valve replacement", "Heart transplants", "Aortic surgery"],
          image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
          equipment: ["Heart-lung machine", "Robotic surgery systems", "3D imaging", "Advanced monitoring"]
        },
        {
          name: "Cardiac Rehabilitation Center",
          description: "Comprehensive recovery and lifestyle modification",
          conditions: ["Post-surgical recovery", "Heart failure management", "Risk factor modification", "Exercise therapy"],
          image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
          equipment: ["Treadmills", "Exercise bikes", "Cardiac monitoring", "Educational materials"]
        }
      ],
      
      procedures: [
        {
          name: "Coronary Angiography",
          description: "Imaging of coronary arteries",
          duration: "30-60 minutes",
          preparation: "Fasting required",
          cost: "₦150,000"
        },
        {
          name: "Cardiac Bypass Surgery",
          description: "Surgical treatment for blocked arteries",
          duration: "3-6 hours",
          preparation: "Pre-operative evaluation",
          cost: "₦1,500,000 - ₦3,000,000"
        },
        {
          name: "Echocardiography",
          description: "Ultrasound imaging of the heart",
          duration: "30-45 minutes",
          preparation: "No special preparation",
          cost: "₦25,000"
        },
        {
          name: "Cardiac Catheterization",
          description: "Minimally invasive procedure to diagnose and treat heart conditions",
          duration: "1-2 hours",
          preparation: "Fasting for 6-8 hours",
          cost: "₦200,000"
        },
        {
          name: "Pacemaker Implantation",
          description: "Device implantation to regulate heart rhythm",
          duration: "1-3 hours",
          preparation: "Pre-procedure testing",
          cost: "₦800,000 - ₦1,200,000"
        },
        {
          name: "Heart Valve Replacement",
          description: "Surgical replacement of damaged heart valves",
          duration: "2-4 hours",
          preparation: "Complete cardiac evaluation",
          cost: "₦2,000,000 - ₦3,500,000"
        },
        {
          name: "Angioplasty and Stenting",
          description: "Opening blocked arteries with balloon and stent",
          duration: "1-2 hours",
          preparation: "Fasting required",
          cost: "₦500,000 - ₦800,000"
        },
        {
          name: "Electrocardiogram (ECG)",
          description: "Recording of heart's electrical activity",
          duration: "10-15 minutes",
          preparation: "No special preparation",
          cost: "₦5,000"
        },
        {
          name: "Stress Test",
          description: "Exercise-based heart function assessment",
          duration: "30-45 minutes",
          preparation: "Wear comfortable clothing",
          cost: "₦35,000"
        },
        {
          name: "Holter Monitoring",
          description: "24-hour continuous heart rhythm monitoring",
          duration: "24-48 hours",
          preparation: "Normal daily activities",
          cost: "₦40,000"
        },
        {
          name: "Cardiac MRI",
          description: "Detailed imaging of heart structure and function",
          duration: "45-90 minutes",
          preparation: "No metal objects",
          cost: "₦150,000"
        },
        {
          name: "Cardiac Rehabilitation",
          description: "Supervised exercise and lifestyle program",
          duration: "3-6 months",
          preparation: "Doctor's referral",
          cost: "₦100,000/month"
        }
      ],
      
      conditionsTreated: [
        "Coronary artery disease",
        "Heart failure",
        "Arrhythmias",
        "Valvular heart disease",
        "Congenital heart defects",
        "Hypertension",
        "Cardiomyopathy",
        "Pericardial disease",
        "Atrial fibrillation",
        "Myocardial infarction (Heart attack)",
        "Angina pectoris",
        "Heart murmurs",
        "Bradycardia (Slow heart rate)",
        "Tachycardia (Fast heart rate)",
        "Aortic aneurysm",
        "Deep vein thrombosis",
        "Pulmonary embolism",
        "Peripheral artery disease",
        "Mitral valve prolapse",
        "Endocarditis",
        "Rheumatic heart disease",
        "Atherosclerosis",
        "Cardiac arrhythmia"
      ],
      
      achievements: [
        "JCI Accredited Cardiac Care",
        "First in Nigeria to perform robotic heart surgery",
        "98% success rate in bypass surgeries",
        "Patient Satisfaction Score: 97%"
      ],
      
      forms: [
        {
          name: "Cardiac Assessment Form",
          description: "Comprehensive cardiac evaluation",
          type: "PDF",
          size: "2.8 MB",
          icon: FaFilePdf
        },
        {
          name: "Pre-Surgical Consent",
          description: "Informed consent for cardiac procedures",
          type: "PDF",
          size: "1.9 MB",
          icon: FaFilePdf
        },
        {
          name: "Medication List",
          description: "Current cardiac medications",
          type: "PDF",
          size: "1.2 MB",
          icon: FaFilePdf
        }
      ]
    }
  }
};

export default function DepartmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showFormsModal, setShowFormsModal] = useState(false);
  const [expandedFacility, setExpandedFacility] = useState(null);
  const [expandedProcedure, setExpandedProcedure] = useState(null);
  const [expertTeam, setExpertTeam] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [loadingDoctor, setLoadingDoctor] = useState(false);

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:9000/api/departments/slug/${params.slug}`);
        
        // Check if response is HTML (404 or server error)
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('API server not responding properly');
        }
        
        const data = await response.json();
        
        if (data.success) {
          // Transform API data to match expected format
          const apiDept = data.data.department;
          const transformedDepartment = {
            id: apiDept._id,
            name: apiDept.name,
            icon: getIconComponent(apiDept.icon),
            description: apiDept.description,
            services: apiDept.procedures?.map(p => p.name) || [],
            head: apiDept.head,
            color: apiDept.color,
            expandedDetails: {
              overview: apiDept.description,
              statistics: {
                patients: apiDept.patients || 0,
                doctors: apiDept.doctors?.length || 0,
                nurses: 0, // Not in API yet
                appointments: apiDept.appointments || 0,
                successRate: 98, // Default value
                yearsExperience: 15, // Default value
                facilities: apiDept.facilities?.length || 0
              },
              expertTeam: [], // Will be populated by separate API call
              facilities: apiDept.facilities?.map((facility, index) => {
                // Medical facility images from Unsplash (working URLs)
                const facilityImages = [
                  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop',
                  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop',
                  'https://images.unsplash.com/photo-1576091160550-2173dba0ef8f?w=600&h=400&fit=crop',
                  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop',
                  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop',
                  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop'
                ];
                
                return {
                  name: facility.name,
                  description: facility.description,
                  conditions: [], // Not in API yet
                  image: facility.image || facilityImages[index % facilityImages.length],
                  equipment: facility.equipment || []
                };
              }) || [],
              procedures: apiDept.procedures?.map(procedure => ({
                name: procedure.name,
                description: procedure.description,
                duration: '30-60 minutes', // Default
                preparation: 'No special preparation needed', // Default
                cost: procedure.cost || 'Contact for pricing'
              })) || [],
              conditionsTreated: apiDept.conditions?.map(condition => condition.name) || [],
              achievements: [
                'JCI Accredited Care',
                'Patient Satisfaction Score: 98%',
                'Advanced Medical Technology',
                'Expert Medical Team'
              ],
              forms: [
                {
                  name: 'New Patient Registration',
                  description: 'Complete medical history and contact information',
                  type: 'PDF',
                  size: '2.3 MB',
                  icon: FaFilePdf
                },
                {
                  name: 'Medical History Form',
                  description: 'Detailed health background information',
                  type: 'PDF',
                  size: '3.1 MB',
                  icon: FaFilePdf
                }
              ]
            }
          };
          setDepartment(transformedDepartment);
        } else {
          // Fallback to static data
          const foundDepartment = departmentsData[params.slug];
          setDepartment(foundDepartment);
        }
      } catch (err) {
        console.error('Error fetching department:', err);
        // Fallback to static data
        const foundDepartment = departmentsData[params.slug];
        setDepartment(foundDepartment);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartment();
  }, [params.slug]);

  // Fetch doctors for the department
  useEffect(() => {
    const fetchDoctors = async () => {
      if (!department) return;
      
      
      try {
        const response = await fetch(`http://localhost:9000/api/doctors?department=${encodeURIComponent(department.name)}&status=active`);
        
        // Check if response is HTML (404 or server error)
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          console.warn('Doctor API not responding properly, using empty team');
          return;
        }
        
        const data = await response.json();
        
        if (data.success) {
          
          // Doctor images from Unsplash (working URLs)
          const doctorImages = [
            'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1594824388852-8a4b2b4b8b8b?w=400&h=400&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face'
          ];

          const transformedDoctors = data.data.doctors.map((doctor, index) => ({
            id: doctor._id,
            name: `${doctor.firstName} ${doctor.lastName}`,
            role: doctor.specialization || 'Specialist',
            specialization: doctor.specialization || 'General Medicine',
            experience: doctor.experience || '5+ years',
            education: doctor.qualifications || 'MD',
            image: doctor.image ? (doctor.image.startsWith('http') ? doctor.image : doctor.image) : doctorImages[index % doctorImages.length],
            rating: doctor.rating || 4.8,
            patients: Math.floor(Math.random() * 500) + 100, // Random patient count for demo
            bio: doctor.bio || `${doctor.firstName} ${doctor.lastName} is a dedicated medical professional with expertise in ${doctor.specialization || 'general medicine'}.`
          }));
          
          setExpertTeam(transformedDoctors);
        }
      } catch (err) {
        console.error('Error fetching doctors:', err);
      }
    };

    fetchDoctors();
  }, [department]);

  // Fetch individual doctor profile
  const fetchDoctorProfile = async (doctorId) => {
    try {
      setLoadingDoctor(true);
      const response = await fetch(`http://localhost:9000/api/doctors/${doctorId}`);
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Doctor API not responding properly');
      }
      
      const data = await response.json();
      
      if (data.success) {
        const doctor = data.data.doctor;
        setSelectedDoctor({
          id: doctor._id,
          firstName: doctor.firstName,
          lastName: doctor.lastName,
          name: `${doctor.firstName} ${doctor.lastName}`,
          email: doctor.email,
          phone: doctor.phone,
          department: doctor.department,
          specialization: doctor.specialization,
          qualifications: doctor.qualifications,
          experience: doctor.experience,
          education: doctor.education,
          bio: doctor.bio,
          image: doctor.image || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
          rating: doctor.rating || 4.8,
          status: doctor.status
        });
        setShowDoctorModal(true);
      }
    } catch (err) {
      console.error('Error fetching doctor profile:', err);
    } finally {
      setLoadingDoctor(false);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading department details...</p>
        </div>
      </div>
    );
  }

  if (!department) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-md mx-auto">
            <FaStethoscope className="text-6xl text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Department Not Found</h1>
            <p className="text-gray-600 mb-8">The department you're looking for doesn't exist.</p>
            <button
              onClick={() => router.push('/departments')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Departments
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const IconComponent = department.icon;
  const details = department.expandedDetails;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Modern Hero Section */}
      <div className="relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${department.color} opacity-95`}></div>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 py-24">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center mb-8">
              <button
                onClick={() => router.back()}
                className="flex items-center text-white/80 hover:text-white transition-colors group"
              >
                <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>
            
            {/* Department Title - Centered */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm mr-6">
                  <IconComponent className="text-5xl text-white" />
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-white">{department.name}</h1>
              </div>
              <p className="text-xl text-white/90">Department Head: {department.head}</p>
            </div>
            
            {/* Content Section */}
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                {details.overview}
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={() => setShowAppointmentModal(true)}
                  className="bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <FaCalendarAlt className="inline mr-2" />
                  Schedule Appointment
                </button>
                <button
                  onClick={() => setShowContactModal(true)}
                  className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-105"
                >
                  <Phone className="inline mr-2" size={20} />
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Section */}
      <div className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Main Container Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  About This Department
                </h2>
                <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
                <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
                  {details.overview}
                </p>
              </div>

              {/* Key Highlights Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                {/* Expert Team Card */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 border border-blue-200">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4 shadow-lg">
                    <FaUserMd className="text-white text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Expert Team</h3>
                  <p className="text-gray-700">
                    {details.statistics.doctors}+ specialized doctors with years of experience
                  </p>
                </div>
                
                {/* Success Rate Card */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 border border-green-200">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4 shadow-lg">
                    <FaAward className="text-white text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{details.statistics.successRate}% Success</h3>
                  <p className="text-gray-700">
                    Outstanding treatment outcomes and patient satisfaction
                  </p>
                </div>
                
                {/* Modern Facilities Card */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 border border-purple-200">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mb-4 shadow-lg">
                    <FaHospital className="text-white text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Modern Facilities</h3>
                  <p className="text-gray-700">
                    State-of-the-art equipment and {details.statistics.facilities}+ specialized facilities
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Department Statistics Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Department Statistics</h2>
              <p className="text-lg text-gray-600">Key metrics and performance indicators</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaHospital className="text-blue-600 text-2xl" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{details.statistics.patients.toLocaleString()}</div>
                <div className="text-gray-600">Patients Served</div>
              </div>
              
              <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUserMd className="text-green-600 text-2xl" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{details.statistics.doctors}</div>
                <div className="text-gray-600">Specialists</div>
              </div>
              
              <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaAward className="text-yellow-600 text-2xl" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{details.statistics.successRate}%</div>
                <div className="text-gray-600">Success Rate</div>
              </div>
              
              <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaClock className="text-purple-600 text-2xl" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{details.statistics.yearsExperience}+</div>
                <div className="text-gray-600">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expert Team Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Expert Team</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">Meet our world-class specialists dedicated to providing exceptional care</p>
            </div>
            
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {expertTeam.length > 0 ? expertTeam.map((member, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group p-4 cursor-pointer"
                  onClick={() => fetchDoctorProfile(member.id)}
                >
                  <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    
                    {/* View Profile Overlay on Hover */}
                    <div className="absolute inset-0 bg-blue-600/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="text-center text-white">
                        <FaUser className="text-4xl mx-auto mb-2" />
                        <p className="font-bold text-lg">View Profile</p>
                        <p className="text-sm text-blue-100">Click to see more details</p>
                      </div>
                    </div>
                    
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center mb-2">
                        <FaStar className="text-yellow-400 mr-1" />
                        <span className="text-white font-semibold">{member.rating}</span>
                        <span className="text-white/80 ml-2">({member.patients} patients)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-3">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-blue-600 font-semibold mb-2">{member.role}</p>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <FaGraduationCap className="mr-2" />
                      <span>{member.education}</span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed mb-3">{member.bio}</p>
                    
                    {/* View Profile Button */}
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-center text-gray-900 font-semibold text-sm group-hover:text-black">
                        <span>View Full Profile</span>
                        <FaChevronRight className="ml-2" size={12} />
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-span-full text-center py-12">
                  <div className="text-gray-500 text-lg">
                    <p>Loading expert team...</p>
                    <p className="text-sm mt-2">If this message persists, there may be no doctors assigned to this department yet.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Facilities Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Facilities</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">State-of-the-art facilities equipped with the latest medical technology</p>
            </div>
            
            <div className="relative overflow-hidden">
              <div className="flex space-x-6 animate-scroll">
                {details.facilities.map((facility, index) => (
                  <div 
                    key={index} 
                    className="relative group cursor-pointer flex-shrink-0 w-96 h-96 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
                    onMouseEnter={() => setExpandedFacility(index)}
                    onMouseLeave={() => setExpandedFacility(null)}
                  >
                    {/* Image Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200">
                      <img 
                        src={facility.image} 
                        alt={facility.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=600&fit=crop';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white mb-1">{facility.name}</h3>
                        <p className="text-white/90 text-sm">{facility.description}</p>
                      </div>
                    </div>
                    
                    {/* Hover Overlay with Details */}
                    <div className={`absolute inset-0 bg-black/80 backdrop-blur-sm p-6 flex items-center justify-center transform transition-all duration-500 ${
                      expandedFacility === index 
                        ? 'translate-y-0 opacity-100' 
                        : 'translate-y-full opacity-0'
                    }`}>
                      <div className="text-center text-green-300">
                        <h3 className="text-2xl font-bold mb-3 text-green-200">{facility.name}</h3>
                        <p className="text-green-300 text-base leading-relaxed">{facility.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Duplicate for seamless loop */}
                {details.facilities.map((facility, index) => (
                  <div 
                    key={`duplicate-${index}`} 
                    className="relative group cursor-pointer flex-shrink-0 w-96 h-96 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
                    onMouseEnter={() => setExpandedFacility(index)}
                    onMouseLeave={() => setExpandedFacility(null)}
                  >
                    {/* Image Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200">
                      <img 
                        src={facility.image} 
                        alt={facility.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=600&fit=crop';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white mb-1">{facility.name}</h3>
                        <p className="text-white/90 text-sm">{facility.description}</p>
                      </div>
                    </div>
                    
                    {/* Hover Overlay with Details */}
                    <div className={`absolute inset-0 bg-black/80 backdrop-blur-sm p-6 flex items-center justify-center transform transition-all duration-500 ${
                      expandedFacility === index 
                        ? 'translate-y-0 opacity-100' 
                        : 'translate-y-full opacity-0'
                    }`}>
                      <div className="text-center text-green-300">
                        <h3 className="text-2xl font-bold mb-3 text-green-200">{facility.name}</h3>
                        <p className="text-green-300 text-base leading-relaxed">{facility.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Procedures & Conditions Section - Side by Side */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">Comprehensive treatment for a wide range of medical conditions</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Procedures & Treatments - Left Side */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center border-b-2 border-blue-600 pb-4">
                  <span className="w-2 h-10 bg-blue-600 mr-4 rounded-full"></span>
                  Procedures & Treatments
                </h2>
                <ul className="space-y-6">
                  {details.procedures.map((procedure, index) => (
                    <li key={index} className="flex items-start group cursor-pointer pb-6 border-b border-gray-200 last:border-0" onClick={() => setExpandedProcedure(expandedProcedure === index ? null : index)}>
                      <FaChevronRight className={`text-blue-600 mt-1 mr-3 flex-shrink-0 transition-transform ${expandedProcedure === index ? 'rotate-90' : ''}`} />
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{procedure.name}</h3>
                        <p className="text-sm text-gray-600 mt-2">{procedure.description}</p>
                        {expandedProcedure === index && (
                          <div className="mt-4 pl-4 border-l-4 border-blue-200 space-y-2 animate-fadeIn">
                            <p className="text-sm text-gray-700"><span className="font-semibold">Duration:</span> {procedure.duration}</p>
                            <p className="text-sm text-gray-700"><span className="font-semibold">Preparation:</span> {procedure.preparation}</p>
                            <p className="text-sm text-gray-700"><span className="font-semibold">Cost:</span> <span className="text-green-600 font-bold">{procedure.cost}</span></p>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Conditions We Treat - Right Side */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center border-b-2 border-green-600 pb-4">
                  <span className="w-2 h-10 bg-green-600 mr-4 rounded-full"></span>
                  Conditions We Treat
                </h2>
                <ul className="space-y-4">
                  {details.conditionsTreated.map((condition, index) => (
                    <li key={index} className="flex items-center group pb-4 border-b border-gray-200 last:border-0">
                      <FaCheckCircle className="text-green-600 mr-3 flex-shrink-0 text-lg group-hover:scale-110 transition-transform" />
                      <span className="text-gray-900 font-medium text-base">{condition}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">Quick Actions</h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">Get started with our services today</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <button
                onClick={() => setShowAppointmentModal(true)}
                className="bg-white text-blue-600 p-8 rounded-2xl hover:bg-gray-50 transition-all duration-300 text-center group transform hover:scale-105 shadow-lg"
              >
                <FaCalendarAlt className="text-4xl mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-2">Schedule Appointment</h3>
                <p className="text-gray-600">Book your consultation</p>
              </button>
              
              <button
                onClick={() => setShowFormsModal(true)}
                className="bg-white text-green-600 p-8 rounded-2xl hover:bg-gray-50 transition-all duration-300 text-center group transform hover:scale-105 shadow-lg"
              >
                <FaDownload className="text-4xl mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-2">Download Forms</h3>
                <p className="text-gray-600">Get required documents</p>
              </button>
              
              <a
                href="tel:+2348031234567"
                className="bg-white text-purple-600 p-8 rounded-2xl hover:bg-gray-50 transition-all duration-300 text-center group transform hover:scale-105 shadow-lg block"
              >
                <Phone className="text-4xl mx-auto mb-4 group-hover:scale-110 transition-transform" size={40} />
                <h3 className="text-xl font-bold mb-2">Call Us</h3>
                <p className="text-gray-600">+234 803 123 4567</p>
              </a>
              
              <a
                href="mailto:info@lautech.edu.ng"
                className="bg-white text-orange-600 p-8 rounded-2xl hover:bg-gray-50 transition-all duration-300 text-center group transform hover:scale-105 shadow-lg block"
              >
                <FaMailBulk className="text-4xl mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-2">Email Us</h3>
                <p className="text-gray-600">info@lautech.edu.ng</p>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Forms Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Download Forms</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">Access and download the forms you need for your visit</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {details.forms.map((form, index) => {
                const FormIcon = form.icon;
                return (
                  <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center mb-4">
                      <div className="p-3 bg-red-50 rounded-xl mr-4">
                        <FormIcon className="text-red-500 text-2xl" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{form.name}</h3>
                        <p className="text-sm text-gray-500">{form.type} • {form.size}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{form.description}</p>
                    <button className="w-full bg-red-600 text-white py-3 px-4 rounded-xl hover:bg-red-700 transition-colors font-semibold flex items-center justify-center">
                      <FaDownload className="mr-2" />
                      Download
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Achievements</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">Recognition for our commitment to excellence in healthcare</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {details.achievements.map((achievement, index) => (
                <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <FaAward className="text-yellow-500 text-3xl mx-auto mb-4" />
                  <p className="text-gray-900 font-semibold">{achievement}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Modals */}
      {showAppointmentModal && (
        <AppointmentModal
          isOpen={showAppointmentModal}
          onClose={() => setShowAppointmentModal(false)}
          department={department.name}
        />
      )}

      {showContactModal && (
        <ContactModal
          isOpen={showContactModal}
          onClose={() => setShowContactModal(false)}
        />
      )}

      {showFormsModal && (
        <FormsModal
          isOpen={showFormsModal}
          onClose={() => setShowFormsModal(false)}
        />
      )}

      {/* Doctor Profile Modal */}
      {showDoctorModal && selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md" onClick={() => setShowDoctorModal(false)}>
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {loadingDoctor ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading doctor profile...</p>
              </div>
            ) : (
              <>
                {/* Close Button */}
                <button
                  onClick={() => setShowDoctorModal(false)}
                  className="absolute top-6 right-6 z-10 p-2.5 bg-white/90 hover:bg-white rounded-full transition-all shadow-lg hover:shadow-xl"
                >
                  <X size={22} className="text-gray-700" />
                </button>

                {/* Doctor Image & Header */}
                <div className="relative h-72 bg-gradient-to-br from-gray-900 to-gray-800">
                  <img
                    src={selectedDoctor.image}
                    alt={selectedDoctor.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  
                  {/* Doctor Name on Image */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <h2 className="text-4xl font-bold mb-2 drop-shadow-lg">{selectedDoctor.name}</h2>
                    <p className="text-xl font-medium text-blue-100 mb-3">{selectedDoctor.specialization}</p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                        <FaStar className="text-yellow-300 mr-2" size={16} />
                        <span className="font-bold">{selectedDoctor.rating}</span>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                        <span className="font-medium">{selectedDoctor.department}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-288px)]">
                  <div className="p-8">
                    {/* Contact Info Cards */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
                        <div className="flex items-center text-blue-700 mb-2">
                          <Mail size={18} className="mr-2" />
                          <span className="text-xs font-semibold uppercase tracking-wide">Email</span>
                        </div>
                        <p className="text-sm text-gray-900 font-medium break-words">{selectedDoctor.email}</p>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border border-purple-200">
                        <div className="flex items-center text-purple-700 mb-2">
                          <Phone size={18} className="mr-2" />
                          <span className="text-xs font-semibold uppercase tracking-wide">Phone</span>
                        </div>
                        <p className="text-sm text-gray-900 font-medium">{selectedDoctor.phone}</p>
                      </div>
                    </div>

                    {/* Professional Details */}
                    <div className="space-y-6 mb-8">
                      <div className="border-l-4 border-blue-500 pl-4">
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Experience</p>
                        <p className="text-base font-bold text-gray-900">{selectedDoctor.experience}</p>
                      </div>
                      <div className="border-l-4 border-purple-500 pl-4">
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Education</p>
                        <p className="text-base font-bold text-gray-900">{selectedDoctor.education}</p>
                      </div>
                      <div className="border-l-4 border-green-500 pl-4">
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Qualifications</p>
                        <p className="text-base font-bold text-gray-900">{selectedDoctor.qualifications}</p>
                      </div>
                    </div>

                    {/* Bio */}
                    {selectedDoctor.bio && (
                      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 flex items-center">
                          <span className="w-1 h-5 bg-blue-500 mr-3 rounded-full"></span>
                          About the Doctor
                        </h3>
                        <p className="text-sm text-gray-700 leading-relaxed">{selectedDoctor.bio}</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}