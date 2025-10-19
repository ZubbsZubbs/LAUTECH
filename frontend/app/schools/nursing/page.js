'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { 
  Heart, 
  BookOpen, 
  Users, 
  Award, 
  Clock, 
  MapPin, 
  Phone, 
  Mail,
  ArrowRight,
  CheckCircle,
  Star,
  Calendar,
  Globe,
  Building2,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Download,
  Target,
  Zap,
  Shield,
  Microscope,
  DollarSign,
  FileText,
  MessageCircle,
  ExternalLink,
  TrendingUp,
  BookMarked,
  UserCheck,
  Newspaper,
  Send
} from 'lucide-react';
import ButtonLoader from '@/components/ui/ButtonLoader';

const SchoolOfNursingPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [contactForm, setContactForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Handle contact form submission
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${contactForm.firstName} ${contactForm.lastName}`,
          email: contactForm.email,
          phoneNumber: contactForm.phone,
          subject: contactForm.subject,
          message: contactForm.message
        })
      });

      if (response.ok) {
        setFormSubmitted(true);
        setContactForm({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          subject: 'General Inquiry',
          message: ''
        });
        alert('Message sent successfully! We will get back to you soon.');
      } else {
        alert('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle newsletter subscription
  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: "Newsletter Subscriber",
          email: newsletterEmail,
          message: "Newsletter subscription request for School of Nursing"
        })
      });

      if (response.ok) {
        setNewsletterEmail('');
        alert('Successfully subscribed to our newsletter!');
      } else {
        alert('Failed to subscribe. Please try again.');
      }
    } catch (error) {
      console.error('Error subscribing:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const school = {
    name: 'School of Nursing',
    shortName: 'SON',
    description: 'Comprehensive nursing education combining theoretical knowledge with practical clinical training.',
    established: '1992',
    students: '1,800+',
    faculty: '120+',
    dean: 'Prof. Dr. Mary Adebayo',
    location: 'Health Sciences Campus',
    website: 'nursing.lautech.edu.ng',
    phone: '+234-803-123-4568',
    email: 'nursing@lautech.edu.ng',
    image: '/s2.jpeg'
  };

  const programs = [
    'BSc Nursing',
    'MSc Nursing', 
    'PhD Nursing',
    'Postgraduate Diploma',
    'MSc Clinical Nursing',
    'MSc Community Health'
  ];

  const highlights = [
    'Modern nursing simulation lab',
    'Clinical placement partnerships',
    'Community health programs',
    'Continuing education courses',
    'Research opportunities',
    'International exchange programs'
  ];

  const requirements = [
    '5 O\'Level credits including English, Mathematics, Biology, Chemistry, Physics',
    'JAMB UTME score of 180+',
    'Post-UTME screening examination',
    'Health clearance certificate',
    'Character reference from two referees',
    'Personal statement of purpose'
  ];

  const careerPaths = [
    'Registered Nurse (RN)',
    'Nurse Educator',
    'Nurse Administrator',
    'Clinical Nurse Specialist',
    'Nurse Practitioner',
    'Public Health Nurse',
    'Nurse Researcher',
    'Nurse Consultant'
  ];

  const faculty = [
    {
      name: 'Prof. Dr. Mary Adebayo',
      position: 'Dean & Professor',
      specialization: 'Community Health Nursing',
      experience: '25+ years'
    },
    {
      name: 'Dr. Sarah Johnson',
      position: 'Associate Professor',
      specialization: 'Medical-Surgical Nursing',
      experience: '20+ years'
    },
    {
      name: 'Dr. James Okafor',
      position: 'Senior Lecturer',
      specialization: 'Mental Health Nursing',
      experience: '15+ years'
    },
    {
      name: 'Dr. Aisha Mohammed',
      position: 'Lecturer',
      specialization: 'Pediatric Nursing',
      experience: '12+ years'
    }
  ];

  const facilities = [
    {
      name: 'Nursing Simulation Lab',
      description: 'State-of-the-art simulation center with high-fidelity mannequins',
      features: ['Adult simulators', 'Pediatric simulators', 'Maternity simulators', 'Critical care scenarios']
    },
    {
      name: 'Clinical Skills Lab',
      description: 'Hands-on practice area for fundamental nursing skills',
      features: ['Bedside care practice', 'Medication administration', 'Vital signs monitoring', 'Wound care']
    },
    {
      name: 'Community Health Center',
      description: 'Real-world community health practice facility',
      features: ['Health screening', 'Health education', 'Family planning', 'Immunization programs']
    },
    {
      name: 'Research Laboratory',
      description: 'Advanced research facilities for nursing studies',
      features: ['Data analysis center', 'Research consultation', 'Statistical software', 'Publication support']
    }
  ];

  // Accreditation & Certifications
  const accreditations = [
    {
      name: 'Nigerian University Commission (NUC)',
      description: 'Full accreditation for all nursing programs',
      status: 'Active',
      validUntil: '2027',
      logo: '/s1.jpg'
    },
    {
      name: 'Nursing and Midwifery Council of Nigeria (NMCN)',
      description: 'Professional accreditation for nursing practice',
      status: 'Active',
      validUntil: '2026',
      logo: '/s2.jpeg'
    },
    {
      name: 'West African School Certificate (WASC)',
      description: 'Educational quality assurance certification',
      status: 'Active',
      validUntil: '2028',
      logo: '/s3.jpeg'
    },
    {
      name: 'International Council of Nurses (ICN)',
      description: 'International nursing standards compliance',
      status: 'Active',
      validUntil: '2025',
      logo: '/s4.jpeg'
    }
  ];

  // Tuition & Fees
  const tuitionFees = [
    {
      program: 'BSc Nursing',
      duration: '4 years',
      tuition: '₦150,000',
      perYear: 'per year',
      total: '₦600,000',
      additional: ['Registration: ₦25,000', 'Clinical: ₦50,000', 'Books: ₦30,000']
    },
    {
      program: 'MSc Nursing',
      duration: '2 years',
      tuition: '₦200,000',
      perYear: 'per year',
      total: '₦400,000',
      additional: ['Registration: ₦30,000', 'Thesis: ₦75,000', 'Books: ₦40,000']
    },
    {
      program: 'PhD Nursing',
      duration: '3-5 years',
      tuition: '₦250,000',
      perYear: 'per year',
      total: '₦750,000 - ₦1,250,000',
      additional: ['Registration: ₦40,000', 'Research: ₦100,000', 'Books: ₦50,000']
    },
    {
      program: 'Postgraduate Diploma',
      duration: '1 year',
      tuition: '₦180,000',
      perYear: 'total',
      total: '₦180,000',
      additional: ['Registration: ₦25,000', 'Clinical: ₦40,000', 'Books: ₦25,000']
    }
  ];

  // Scholarships & Financial Aid
  const scholarships = [
    {
      name: 'Merit Scholarship',
      description: 'For students with outstanding academic performance',
      amount: '50% tuition waiver',
      requirements: ['CGPA 3.5+', 'JAMB score 280+', 'Community service']
    },
    {
      name: 'Need-Based Financial Aid',
      description: 'For students from low-income families',
      amount: 'Up to 75% tuition waiver',
      requirements: ['Income verification', 'Academic potential', 'Essay submission']
    },
    {
      name: 'Nursing Excellence Award',
      description: 'For students showing exceptional nursing potential',
      amount: 'Full tuition + stipend',
      requirements: ['Clinical excellence', 'Leadership qualities', 'Interview']
    },
    {
      name: 'International Student Grant',
      description: 'For international students pursuing nursing',
      amount: '30% tuition reduction',
      requirements: ['International status', 'Academic merit', 'English proficiency']
    }
  ];

  // Clinical Partners
  const clinicalPartners = [
    {
      name: 'University College Hospital (UCH)',
      location: 'Ibadan',
      type: 'Teaching Hospital',
      specialties: ['General Medicine', 'Surgery', 'Pediatrics', 'Obstetrics'],
      students: '150+'
    },
    {
      name: 'Lagos University Teaching Hospital (LUTH)',
      location: 'Lagos',
      type: 'Teaching Hospital',
      specialties: ['Cardiology', 'Neurology', 'Oncology', 'Emergency Medicine'],
      students: '120+'
    },
    {
      name: 'National Hospital Abuja',
      location: 'Abuja',
      type: 'Federal Hospital',
      specialties: ['Trauma', 'Infectious Diseases', 'Mental Health', 'Community Health'],
      students: '80+'
    },
    {
      name: 'Eko Hospital',
      location: 'Lagos',
      type: 'Private Hospital',
      specialties: ['Maternity', 'Pediatrics', 'Surgery', 'Diagnostics'],
      students: '60+'
    }
  ];

  // Research Areas
  const researchAreas = [
    {
      area: 'Community Health Nursing',
      description: 'Research on community-based healthcare delivery and health promotion',
      faculty: 'Prof. Dr. Mary Adebayo',
      publications: 15,
      funding: '₦5.2M'
    },
    {
      area: 'Mental Health Nursing',
      description: 'Studies on mental health interventions and psychiatric care',
      faculty: 'Dr. James Okafor',
      publications: 12,
      funding: '₦3.8M'
    },
    {
      area: 'Pediatric Nursing',
      description: 'Research on child health and development',
      faculty: 'Dr. Aisha Mohammed',
      publications: 18,
      funding: '₦4.5M'
    },
    {
      area: 'Nursing Education',
      description: 'Studies on nursing pedagogy and curriculum development',
      faculty: 'Dr. Sarah Johnson',
      publications: 20,
      funding: '₦6.1M'
    }
  ];

  // Alumni Success Stories
  const alumniStories = [
    {
      name: 'Dr. Grace Okonkwo',
      graduation: '2018',
      program: 'BSc Nursing',
      currentPosition: 'Chief Nursing Officer, Lagos State University Teaching Hospital',
      achievements: ['Nigerian Nurse of the Year 2022', 'Published 25 research papers', 'Mentored 50+ nursing students'],
      quote: 'LAUTECH Nursing gave me the foundation to excel in my career. The practical training was exceptional.'
    },
    {
      name: 'Dr. Michael Adebayo',
      graduation: '2015',
      program: 'MSc Nursing',
      currentPosition: 'Director of Nursing Services, Federal Medical Centre',
      achievements: ['Led 200+ nursing staff', 'Implemented quality improvement programs', 'International conference speaker'],
      quote: 'The research opportunities at LAUTECH prepared me for leadership roles in healthcare administration.'
    },
    {
      name: 'Dr. Sarah Johnson',
      graduation: '2020',
      program: 'PhD Nursing',
      currentPosition: 'Professor of Nursing, University of Ibadan',
      achievements: ['Supervised 15 PhD students', 'Grant recipient (₦10M)', 'International collaboration projects'],
      quote: 'The PhD program at LAUTECH opened doors to academic excellence and research leadership.'
    }
  ];

  // News & Events
  const newsEvents = [
    {
      title: 'Nursing Simulation Lab Grand Opening',
      date: 'March 15, 2024',
      type: 'Event',
      description: 'State-of-the-art simulation lab with advanced mannequins and VR technology',
      image: '/s1.jpg'
    },
    {
      title: 'International Nursing Conference 2024',
      date: 'May 20-22, 2024',
      type: 'Conference',
      description: 'Annual conference featuring international speakers and research presentations',
      image: '/s2.jpeg'
    },
    {
      title: 'Student Research Day',
      date: 'April 10, 2024',
      type: 'Academic',
      description: 'Showcase of undergraduate and postgraduate research projects',
      image: '/s3.jpeg'
    },
    {
      title: 'Community Health Outreach Program',
      date: 'Ongoing',
      type: 'Service',
      description: 'Free health screening and education in rural communities',
      image: '/s4.jpeg'
    }
  ];

  // FAQ Data
  const faqs = [
    {
      question: 'What are the admission requirements for BSc Nursing?',
      answer: 'You need 5 O\'Level credits including English, Mathematics, Biology, Chemistry, and Physics, plus a JAMB UTME score of 180+ and successful completion of our post-UTME screening.'
    },
    {
      question: 'How long does the BSc Nursing program take?',
      answer: 'The BSc Nursing program is a 4-year full-time program, including both theoretical coursework and clinical practice rotations.'
    },
    {
      question: 'Are there clinical placement opportunities?',
      answer: 'Yes, we have partnerships with over 20 hospitals and healthcare facilities where students complete their clinical rotations.'
    },
    {
      question: 'What career opportunities are available after graduation?',
      answer: 'Graduates can work as registered nurses, nurse educators, nurse administrators, clinical nurse specialists, or pursue advanced degrees.'
    },
    {
      question: 'Is financial aid available?',
      answer: 'Yes, we offer various scholarships and financial aid programs including merit scholarships, need-based aid, and nursing excellence awards.'
    },
    {
      question: 'Can I transfer from another nursing program?',
      answer: 'Transfer applications are considered on a case-by-case basis. You must meet our admission requirements and have completed equivalent coursework.'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'programs', label: 'Programs', icon: GraduationCap },
    { id: 'facilities', label: 'Facilities', icon: Building2 },
    { id: 'faculty', label: 'Faculty', icon: Users },
    { id: 'admissions', label: 'Admissions', icon: Award },
    { id: 'accreditation', label: 'Accreditation', icon: Shield },
    { id: 'tuition', label: 'Tuition & Fees', icon: Award },
    { id: 'clinical', label: 'Clinical Partners', icon: Heart },
    { id: 'research', label: 'Research', icon: Microscope },
    { id: 'alumni', label: 'Alumni', icon: Users },
    { id: 'news', label: 'News & Events', icon: Calendar },
    { id: 'contact', label: 'Contact', icon: Phone }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-900 via-green-800 to-green-700 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-6">
                <Link href="/schools" className="flex items-center space-x-2 text-green-200 hover:text-white transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                  <span>Back to Schools</span>
                </Link>
              </div>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-6xl font-bold">{school.name}</h1>
                  <p className="text-xl text-green-200">{school.shortName}</p>
                </div>
              </div>
              
              <p className="text-xl mb-8 leading-relaxed max-w-3xl">
                {school.description}
              </p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                  <Calendar className="w-5 h-5" />
                  <span className="font-semibold">Est. {school.established}</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                  <Users className="w-5 h-5" />
                  <span className="font-semibold">{school.students} Students</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                  <Award className="w-5 h-5" />
                  <span className="font-semibold">{school.faculty} Faculty</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => router.push('/auth/login?redirect=/schools/nursing/apply')}
                  className="bg-white text-green-700 py-4 px-8 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button 
                    onClick={() => {
                      try {
                        // Open brochure in new tab
                        window.open('/brochures/nursing-brochure.html', '_blank');
                      } catch (error) {
                        console.error('Error opening brochure:', error);
                        alert('Sorry, the brochure is temporarily unavailable. Please contact us directly for more information.');
                      }
                    }}
                    className="border-2 border-white text-white py-3 px-6 rounded-2xl font-bold text-sm hover:bg-white/10 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>View Brochure</span>
                  </button>
                  <button 
                    onClick={() => {
                      try {
                        // Download PDF brochure
                        const link = document.createElement('a');
                        link.href = '/brochures/nursing-brochure.pdf';
                        link.download = 'LAUTECH-Nursing-Brochure.pdf';
                        link.click();
                      } catch (error) {
                        console.error('Error downloading brochure:', error);
                        alert('Sorry, the brochure download is temporarily unavailable. Please contact us directly for more information.');
                      }
                    }}
                    className="bg-white/20 text-white py-3 px-6 rounded-2xl font-bold text-sm hover:bg-white/30 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex-1 max-w-lg">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src={school.image}
                  alt={school.name}
                  width={600}
                  height={400}
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-white">Dean</h3>
                      <p className="text-green-200">{school.dean}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-200">Location</p>
                      <p className="text-white font-semibold">{school.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex space-x-2 sm:space-x-4 lg:space-x-6 xl:space-x-8 min-w-max">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-1 sm:space-x-2 py-4 sm:py-6 px-2 sm:px-3 border-b-2 font-semibold text-xs sm:text-sm whitespace-nowrap transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span className="hidden xs:inline">{tab.label}</span>
                    <span className="xs:hidden">{tab.label.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">About Our School</h2>
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                    The School of Nursing at LAUTECH has been at the forefront of nursing education for over three decades. 
                    We are committed to producing competent, compassionate, and professional nurses who are ready to serve 
                    in various healthcare settings both locally and internationally.
                  </p>
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    Our comprehensive curriculum combines theoretical knowledge with extensive practical clinical training, 
                    ensuring our graduates are well-prepared to meet the challenges of modern healthcare.
                  </p>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center p-6 bg-green-50 rounded-2xl">
                      <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
                      <div className="text-sm font-semibold text-gray-700">Graduation Rate</div>
                    </div>
                    <div className="text-center p-6 bg-green-50 rounded-2xl">
                      <div className="text-3xl font-bold text-green-600 mb-2">98%</div>
                      <div className="text-sm font-semibold text-gray-700">Employment Rate</div>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <Image
                    src="/s1.jpg"
                    alt="Nursing students in clinical practice"
                    width={600}
                    height={400}
                    className="rounded-3xl shadow-2xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                    <Target className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                  <p className="text-gray-600 leading-relaxed">
                    To provide excellent nursing education that prepares competent, compassionate, and professional nurses 
                    who are committed to improving health outcomes and advancing the nursing profession.
                  </p>
                </div>
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                    <Zap className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                  <p className="text-gray-600 leading-relaxed">
                    To be a leading school of nursing in Nigeria and Africa, recognized for excellence in nursing education, 
                    research, and practice that contributes to the health and well-being of communities.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Choose Our School?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {highlights.map((highlight, index) => (
                    <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <p className="text-gray-700 font-medium">{highlight}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Programs Tab */}
          {activeTab === 'programs' && (
            <div className="space-y-12">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Programs</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Choose from our comprehensive range of nursing programs designed to meet your career goals.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {programs.map((program, index) => (
                  <div key={index} className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-green-200 transform hover:-translate-y-2">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-green-600" />
                      </div>
                      <span className="text-xs px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
                        Program
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{program}</h3>
                    <button 
                      onClick={() => setActiveTab('admissions')}
                      className="w-full py-3 px-4 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
                    >
                      Learn More
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Facilities Tab */}
          {activeTab === 'facilities' && (
            <div className="space-y-12">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Facilities</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  State-of-the-art facilities designed to provide the best learning environment.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {facilities.map((facility, index) => (
                  <div key={index} className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                    <div className="relative h-64">
                      <Image
                        src="/s1.jpg"
                        alt={facility.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-2xl font-bold text-white mb-2">{facility.name}</h3>
                        <p className="text-gray-200">{facility.description}</p>
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Key Features:</h4>
                      <div className="space-y-2">
                        {facility.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-gray-700 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Faculty Tab */}
          {activeTab === 'faculty' && (
            <div className="space-y-12">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Faculty</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Meet our experienced and dedicated faculty members.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {faculty.map((member, index) => (
                  <div key={index} className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 text-center">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <Image
                        src="/s1.jpg"
                        alt={member.name}
                        fill
                        className="rounded-2xl object-cover"
                      />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-green-600 font-semibold mb-2">{member.position}</p>
                    <p className="text-gray-600 text-sm mb-3">{member.specialization}</p>
                    <p className="text-gray-500 text-xs mb-4">{member.experience} experience</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Admissions Tab */}
          {activeTab === 'admissions' && (
            <div className="space-y-12">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Admission Requirements</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Learn about the requirements and process for admission.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Entry Requirements</h3>
                  <div className="space-y-4">
                    {requirements.map((req, index) => (
                      <div key={index} className="flex items-start space-x-3 p-4 bg-white rounded-2xl shadow-lg border border-gray-100">
                        <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Career Opportunities</h3>
                  <div className="space-y-3">
                    {careerPaths.map((career, index) => (
                      <div key={index} className="flex items-center space-x-3 p-4 bg-white rounded-2xl shadow-lg border border-gray-100">
                        <ArrowRight className="w-5 h-5 text-green-500" />
                        <span className="text-gray-700 font-medium">{career}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-3xl p-8 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Apply?</h3>
                <p className="text-gray-600 mb-6">Start your journey to becoming a professional nurse today.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => router.push('/auth/login?redirect=/schools/nursing/apply')}
                    className="bg-green-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    Apply Now
                  </button>
                  <button 
                    onClick={() => setActiveTab('contact')}
                    className="border-2 border-green-600 text-green-600 py-3 px-8 rounded-lg font-semibold hover:bg-green-50 transition-colors"
                  >
                    Contact Admissions
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Accreditation Tab */}
          {activeTab === 'accreditation' && (
            <div className="space-y-12">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Accreditation & Certifications</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Our programs are fully accredited by national and international bodies, ensuring the highest standards of nursing education.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {accreditations.map((accreditation, index) => (
                  <div key={index} className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
                    <div className="flex items-start space-x-6">
                      <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Shield className="w-8 h-8 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{accreditation.name}</h3>
                        <p className="text-gray-600 mb-4">{accreditation.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-sm font-semibold text-green-600">{accreditation.status}</span>
                          </div>
                          <span className="text-sm text-gray-500">Valid until {accreditation.validUntil}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-green-50 rounded-3xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Quality Assurance</h3>
                <p className="text-gray-600 mb-6">
                  Our accreditation ensures that our nursing programs meet the highest standards of quality and prepare students for professional practice. 
                  We regularly undergo review processes to maintain and improve our educational standards.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
                    <div className="text-sm font-semibold text-gray-700">Accreditation Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">4</div>
                    <div className="text-sm font-semibold text-gray-700">Accrediting Bodies</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">2028</div>
                    <div className="text-sm font-semibold text-gray-700">Next Review</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tuition & Fees Tab */}
          {activeTab === 'tuition' && (
            <div className="space-y-12">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Tuition & Fees</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Transparent pricing for all our nursing programs with flexible payment options and financial aid available.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {tuitionFees.map((program, index) => (
                  <div key={index} className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{program.program}</h3>
                      <p className="text-gray-600">{program.duration}</p>
                    </div>
                    
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold text-green-600 mb-2">{program.tuition}</div>
                      <div className="text-gray-500">{program.perYear}</div>
                      <div className="text-lg font-semibold text-gray-700 mt-2">Total: {program.total}</div>
                    </div>

                    <div className="space-y-2 mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Additional Fees:</h4>
                      {program.additional.map((fee, feeIndex) => (
                        <div key={feeIndex} className="flex justify-between text-sm">
                          <span className="text-gray-600">{fee.split(':')[0]}</span>
                          <span className="font-semibold text-gray-900">{fee.split(':')[1]}</span>
                        </div>
                      ))}
                    </div>

                    <button className="w-full py-3 px-4 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors">
                      Apply Now
                    </button>
                  </div>
                ))}
              </div>

              {/* Scholarships Section */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-3xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Scholarships & Financial Aid</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {scholarships.map((scholarship, index) => (
                    <div key={index} className="bg-white rounded-2xl p-6 shadow-lg">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">{scholarship.name}</h4>
                      <p className="text-gray-600 mb-3">{scholarship.description}</p>
                      <div className="text-green-600 font-bold mb-3">{scholarship.amount}</div>
                      <div className="space-y-1">
                        <h5 className="font-semibold text-gray-900 text-sm">Requirements:</h5>
                        {scholarship.requirements.map((req, reqIndex) => (
                          <div key={reqIndex} className="flex items-center space-x-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-gray-600">{req}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Clinical Partners Tab */}
          {activeTab === 'clinical' && (
            <div className="space-y-12">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Clinical Placement Partners</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Our students gain hands-on experience at leading hospitals and healthcare facilities across Nigeria.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {clinicalPartners.map((partner, index) => (
                  <div key={index} className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
                    <div className="flex items-start space-x-4 mb-6">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <Heart className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{partner.name}</h3>
                        <p className="text-gray-600">{partner.location} • {partner.type}</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Specialties:</h4>
                      <div className="flex flex-wrap gap-2">
                        {partner.specialties.map((specialty, specIndex) => (
                          <span key={specIndex} className="text-xs px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-200">
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        <span className="font-semibold">{partner.students}</span> students placed
                      </div>
                      <button className="text-green-600 hover:text-green-700 font-semibold text-sm">
                        Learn More <ArrowRight className="w-4 h-4 inline ml-1" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 rounded-3xl p-8 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Clinical Excellence</h3>
                <p className="text-gray-600 mb-6">
                  Our clinical partnerships provide students with diverse learning experiences across different healthcare settings, 
                  preparing them for successful nursing careers.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">20+</div>
                    <div className="text-sm font-semibold text-gray-700">Partner Hospitals</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                    <div className="text-sm font-semibold text-gray-700">Clinical Hours</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">15</div>
                    <div className="text-sm font-semibold text-gray-700">Specialties</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
                    <div className="text-sm font-semibold text-gray-700">Satisfaction Rate</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Research Tab */}
          {activeTab === 'research' && (
            <div className="space-y-12">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Research Areas</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Our faculty conducts cutting-edge research in various nursing specialties, contributing to healthcare knowledge and practice.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {researchAreas.map((area, index) => (
                  <div key={index} className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
                    <div className="flex items-start space-x-4 mb-6">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <Microscope className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{area.area}</h3>
                        <p className="text-gray-600 text-sm">Led by {area.faculty}</p>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-6">{area.description}</p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center p-3 bg-gray-50 rounded-xl">
                        <div className="text-2xl font-bold text-purple-600">{area.publications}</div>
                        <div className="text-xs text-gray-600">Publications</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-xl">
                        <div className="text-2xl font-bold text-purple-600">{area.funding}</div>
                        <div className="text-xs text-gray-600">Funding</div>
                      </div>
                    </div>

                    <button className="w-full py-2 px-4 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors text-sm">
                      View Research
                    </button>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Research Impact</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">65+</div>
                    <div className="text-sm font-semibold text-gray-700">Research Papers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">₦20M+</div>
                    <div className="text-sm font-semibold text-gray-700">Total Funding</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">15</div>
                    <div className="text-sm font-semibold text-gray-700">Active Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">8</div>
                    <div className="text-sm font-semibold text-gray-700">International Collaborations</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Alumni Tab */}
          {activeTab === 'alumni' && (
            <div className="space-y-12">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Alumni Success Stories</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Our graduates are making significant contributions to healthcare across Nigeria and internationally.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {alumniStories.map((alumni, index) => (
                  <div key={index} className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
                    <div className="text-center mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">{alumni.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{alumni.name}</h3>
                      <p className="text-green-600 font-semibold">{alumni.graduation} • {alumni.program}</p>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-2">Current Position:</h4>
                      <p className="text-gray-600 text-sm mb-4">{alumni.currentPosition}</p>
                      
                      <h4 className="font-semibold text-gray-900 mb-2">Key Achievements:</h4>
                      <ul className="space-y-1">
                        {alumni.achievements.map((achievement, achIndex) => (
                          <li key={achIndex} className="flex items-start space-x-2 text-sm">
                            <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <blockquote className="text-gray-700 italic text-sm border-l-4 border-green-500 pl-4">
                      "{alumni.quote}"
                    </blockquote>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-3xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Alumni Network</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">2,500+</div>
                    <div className="text-sm font-semibold text-gray-700">Alumni Worldwide</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
                    <div className="text-sm font-semibold text-gray-700">Employment Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">15</div>
                    <div className="text-sm font-semibold text-gray-700">Countries</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">200+</div>
                    <div className="text-sm font-semibold text-gray-700">Leadership Positions</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* News & Events Tab */}
          {activeTab === 'news' && (
            <div className="space-y-12">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">News & Events</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Stay updated with the latest news, events, and happenings at the School of Nursing.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {newsEvents.map((event, index) => (
                  <div key={index} className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
                    <div className="relative h-48">
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          event.type === 'Event' ? 'bg-green-100 text-green-700' :
                          event.type === 'Conference' ? 'bg-blue-100 text-blue-700' :
                          event.type === 'Academic' ? 'bg-purple-100 text-purple-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {event.type}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                      <p className="text-gray-600 mb-4">{event.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>{event.date}</span>
                        </div>
                        <button className="text-green-600 hover:text-green-700 font-semibold text-sm">
                          Read More <ArrowRight className="w-4 h-4 inline ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Stay Connected</h3>
                <p className="text-gray-600 mb-6">
                  Subscribe to our newsletter to receive updates about events, research, and opportunities.
                </p>
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                  <button 
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <ButtonLoader size="sm" color="white" />
                        <span className="ml-2">Subscribing...</span>
                      </>
                    ) : (
                      'Subscribe'
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className="space-y-12">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Get in touch with us for inquiries, applications, or to learn more about our programs.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact Information */}
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h3>
                    <div className="space-y-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                          <Phone className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Phone</h4>
                          <p className="text-gray-600">{school.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                          <Mail className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Email</h4>
                          <p className="text-gray-600">{school.email}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                          <Globe className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Website</h4>
                          <p className="text-gray-600">{school.website}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                          <MapPin className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Location</h4>
                          <p className="text-gray-600">{school.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* FAQ Section */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
                    <div className="space-y-4">
                      {faqs.map((faq, index) => (
                        <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                          <h4 className="font-semibold text-gray-900 mb-2">{faq.question}</h4>
                          <p className="text-gray-600 text-sm">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                        <input
                          type="text"
                          value={contactForm.firstName}
                          onChange={(e) => setContactForm({...contactForm, firstName: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Enter your first name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                        <input
                          type="text"
                          value={contactForm.lastName}
                          onChange={(e) => setContactForm({...contactForm, lastName: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Enter your last name"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                      <select 
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option>General Inquiry</option>
                        <option>Admission Information</option>
                        <option>Program Details</option>
                        <option>Financial Aid</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                      <textarea
                        rows={4}
                        value={contactForm.message}
                        onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter your message"
                        required
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-green-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <ButtonLoader size="sm" color="white" />
                          <span className="ml-2">Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-16 bg-green-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
            <p className="text-xl text-green-200">Have questions? We're here to help.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Phone</h3>
              <p className="text-green-200">{school.phone}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Email</h3>
              <p className="text-green-200">{school.email}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Website</h3>
              <p className="text-green-200">{school.website}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolOfNursingPage;