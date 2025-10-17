'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  GraduationCap, 
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
  Microscope,
  Heart,
  Brain,
  Eye,
  Tooth,
  Lung,
  Activity,
  Stethoscope,
  Shield,
  Zap
} from 'lucide-react';

const SchoolsPage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const schools = [
    {
      id: 'medicine',
      name: 'School of Medicine',
      shortName: 'SOM',
      description: 'Training the next generation of medical professionals with world-class education and clinical experience.',
      established: '1988',
      students: '2,500+',
      faculty: '180+',
      programs: ['MBBS', 'MD', 'PhD in Medical Sciences', 'MSc Medical Research'],
      duration: '5-7 years',
      accreditation: 'NUC, MDCN, WASC',
      dean: 'Prof. Dr. Sarah Johnson',
      location: 'Main Campus, Ogbomoso',
      website: 'medicine.lautech.edu.ng',
      phone: '+234-803-123-4567',
      email: 'medicine@lautech.edu.ng',
      image: '/s1.jpg',
      color: 'blue',
      icon: Stethoscope,
      highlights: [
        'State-of-the-art anatomy lab',
        'Clinical simulation center',
        'Research partnerships with top hospitals',
        'International exchange programs'
      ],
      requirements: [
        '5 O\'Level credits including English, Mathematics, Biology, Chemistry, Physics',
        'JAMB UTME score of 200+',
        'Post-UTME screening',
        'Medical fitness certificate'
      ],
      careerPaths: [
        'Medical Doctor',
        'Medical Researcher',
        'Public Health Specialist',
        'Medical Consultant'
      ]
    },
    {
      id: 'nursing',
      name: 'School of Nursing',
      shortName: 'SON',
      description: 'Comprehensive nursing education combining theoretical knowledge with practical clinical training.',
      established: '1992',
      students: '1,800+',
      faculty: '120+',
      programs: ['BSc Nursing', 'MSc Nursing', 'PhD Nursing', 'Postgraduate Diploma'],
      duration: '4-6 years',
      accreditation: 'NUC, NMCN, WASC',
      dean: 'Prof. Dr. Mary Adebayo',
      location: 'Health Sciences Campus',
      website: 'nursing.lautech.edu.ng',
      phone: '+234-803-123-4568',
      email: 'nursing@lautech.edu.ng',
      image: '/s2.jpeg',
      color: 'green',
      icon: Heart,
      highlights: [
        'Modern nursing simulation lab',
        'Clinical placement partnerships',
        'Community health programs',
        'Continuing education courses'
      ],
      requirements: [
        '5 O\'Level credits including English, Mathematics, Biology, Chemistry, Physics',
        'JAMB UTME score of 180+',
        'Post-UTME screening',
        'Health clearance certificate'
      ],
      careerPaths: [
        'Registered Nurse',
        'Nurse Educator',
        'Nurse Administrator',
        'Clinical Nurse Specialist'
      ]
    },
    {
      id: 'pharmacy',
      name: 'School of Pharmacy',
      shortName: 'SOP',
      description: 'Advanced pharmaceutical education focusing on drug discovery, patient care, and healthcare innovation.',
      established: '1995',
      students: '1,200+',
      faculty: '85+',
      programs: ['PharmD', 'MSc Pharmacy', 'PhD Pharmaceutical Sciences', 'MSc Clinical Pharmacy'],
      duration: '5-7 years',
      accreditation: 'NUC, PCN, WASC',
      dean: 'Prof. Dr. James Okafor',
      location: 'Health Sciences Campus',
      website: 'pharmacy.lautech.edu.ng',
      phone: '+234-803-123-4569',
      email: 'pharmacy@lautech.edu.ng',
      image: '/s3.jpeg',
      color: 'purple',
      icon: Microscope,
      highlights: [
        'Advanced pharmaceutical lab',
        'Drug discovery research center',
        'Community pharmacy partnerships',
        'Pharmaceutical industry collaborations'
      ],
      requirements: [
        '5 O\'Level credits including English, Mathematics, Biology, Chemistry, Physics',
        'JAMB UTME score of 200+',
        'Post-UTME screening',
        'Chemistry proficiency test'
      ],
      careerPaths: [
        'Pharmacist',
        'Pharmaceutical Researcher',
        'Drug Safety Specialist',
        'Pharmacy Manager'
      ]
    },
    {
      id: 'health-tech',
      name: 'School of Health Technology',
      shortName: 'SOHT',
      description: 'Cutting-edge health technology education preparing students for the future of healthcare.',
      established: '2005',
      students: '900+',
      faculty: '65+',
      programs: ['BSc Health Informatics', 'MSc Medical Technology', 'BSc Biomedical Engineering', 'MSc Health Data Science'],
      duration: '4-6 years',
      accreditation: 'NUC, COREN, WASC',
      dean: 'Prof. Dr. David Chen',
      location: 'Technology Campus',
      website: 'healthtech.lautech.edu.ng',
      phone: '+234-803-123-4570',
      email: 'healthtech@lautech.edu.ng',
      image: '/s4.jpeg',
      color: 'orange',
      icon: Zap,
      highlights: [
        'AI and machine learning lab',
        'Medical device development center',
        'Health data analytics lab',
        'Industry partnerships'
      ],
      requirements: [
        '5 O\'Level credits including English, Mathematics, Physics, Chemistry, Biology',
        'JAMB UTME score of 190+',
        'Post-UTME screening',
        'Mathematics proficiency test'
      ],
      careerPaths: [
        'Health Informatics Specialist',
        'Biomedical Engineer',
        'Health Data Analyst',
        'Medical Technology Consultant'
      ]
    },
    {
      id: 'public-health',
      name: 'School of Public Health',
      shortName: 'SOPH',
      description: 'Comprehensive public health education focusing on community health, epidemiology, and health policy.',
      established: '2010',
      students: '750+',
      faculty: '55+',
      programs: ['BSc Public Health', 'MPH', 'PhD Public Health', 'MSc Epidemiology'],
      duration: '4-6 years',
      accreditation: 'NUC, NPHCDA, WASC',
      dean: 'Prof. Dr. Aisha Mohammed',
      location: 'Public Health Campus',
      website: 'publichealth.lautech.edu.ng',
      phone: '+234-803-123-4571',
      email: 'publichealth@lautech.edu.ng',
      image: '/s5.jpeg',
      color: 'teal',
      icon: Shield,
      highlights: [
        'Community health research center',
        'Epidemiology lab',
        'Health policy institute',
        'International health programs'
      ],
      requirements: [
        '5 O\'Level credits including English, Mathematics, Biology, Chemistry, Geography',
        'JAMB UTME score of 180+',
        'Post-UTME screening',
        'Community service experience preferred'
      ],
      careerPaths: [
        'Public Health Specialist',
        'Epidemiologist',
        'Health Policy Analyst',
        'Community Health Coordinator'
      ]
    }
  ];

  const stats = [
    { label: 'Total Students', value: '7,150+', icon: Users },
    { label: 'Faculty Members', value: '505+', icon: Award },
    { label: 'Programs Offered', value: '25+', icon: BookOpen },
    { label: 'Years of Excellence', value: '35+', icon: Calendar }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      green: 'bg-green-50 text-green-700 border-green-200',
      purple: 'bg-purple-50 text-purple-700 border-purple-200',
      orange: 'bg-orange-50 text-orange-700 border-orange-200',
      teal: 'bg-teal-50 text-teal-700 border-teal-200'
    };
    return colors[color] || colors.blue;
  };

  const getColorClassesDark = (color) => {
    const colors = {
      blue: 'bg-blue-600 text-white',
      green: 'bg-green-600 text-white',
      purple: 'bg-purple-600 text-white',
      orange: 'bg-orange-600 text-white',
      teal: 'bg-teal-600 text-white'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white pt-32 pb-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Schools of Health Sciences
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Excellence in Health Education, Research, and Innovation
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                <GraduationCap className="w-5 h-5" />
                <span className="font-semibold">5 Schools</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                <Users className="w-5 h-5" />
                <span className="font-semibold">7,150+ Students</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                <Award className="w-5 h-5" />
                <span className="font-semibold">25+ Programs</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Stats Section */}
      <div className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-blue-200 transform hover:-translate-y-2">
                  <div className="text-center">
                    <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Icon className="w-10 h-10 text-white" />
                      <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="text-4xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">{stat.value}</div>
                    <div className="text-lg font-semibold text-gray-600 group-hover:text-gray-800 transition-colors duration-300">{stat.label}</div>
                  </div>
                  {/* Hover gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Schools Grid */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Schools
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our comprehensive range of health science programs designed to prepare you for a successful career in healthcare.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {schools.map((school) => {
              const Icon = school.icon;
              return (
                <div key={school.id} className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200 transform hover:-translate-y-1 p-4">
                  {/* Compact Header */}
                  <div className="relative h-40 overflow-hidden rounded-xl">
                    <Image
                      src={school.image}
                      alt={school.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

                    {/* School Title */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-xl font-bold text-white leading-tight mb-1">{school.name}</h3>
                      <div className="flex items-center gap-3 text-xs text-gray-200">
                        <span>Est. {school.established}</span>
                        <span>•</span>
                        <span>{school.students} Students</span>
                      </div>
                    </div>
                  </div>

                  {/* Compact Content */}
                  <div className="pt-5 px-1">
                    {/* Description */}
                    <p className="text-gray-600 mb-4 leading-relaxed line-clamp-2 text-sm">{school.description}</p>

                    {/* Top Programs Only */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {school.programs.slice(0, 2).map((program, index) => (
                          <span key={index} className="text-xs px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg font-medium">
                            {program}
                          </span>
                        ))}
                        {school.programs.length > 2 && (
                          <span className="text-xs px-3 py-1.5 bg-gray-200 text-gray-600 rounded-lg font-medium">
                            +{school.programs.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Compact Action Button */}
                    {school.id === 'nursing' ? (
                      <Link href={`/schools/${school.id}`}>
                        <button className="w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-300 bg-gray-100 text-gray-900 border border-gray-300 hover:bg-gray-900 hover:text-white hover:border-gray-900 hover:shadow-md flex items-center justify-center gap-2">
                          <span>Learn More</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </button>
                      </Link>
                    ) : (
                      <button 
                        disabled
                        className="w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-300 bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <span>Coming Soon</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* School Details Modal */}
      {activeTab !== 'overview' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {(() => {
              const school = schools.find(s => s.id === activeTab);
              if (!school) return null;
              const Icon = school.icon;
              
              return (
                <div>
                  {/* Modal Header */}
                  <div className="relative h-64 overflow-hidden rounded-t-2xl">
                    <Image
                      src={school.image}
                      alt={school.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <div className={`w-16 h-16 rounded-xl ${getColorClassesDark(school.color)} flex items-center justify-center`}>
                        <Icon className="w-8 h-8" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h2 className="text-3xl font-bold text-white mb-2">{school.name}</h2>
                      <p className="text-lg text-gray-200">{school.shortName}</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('overview')}
                      className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                    >
                      ×
                    </button>
                  </div>

                  {/* Modal Content */}
                  <div className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Left Column */}
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-3">About</h3>
                          <p className="text-gray-600 leading-relaxed">{school.description}</p>
                        </div>

                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-3">Programs Offered</h3>
                          <div className="space-y-2">
                            {school.programs.map((program, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                <span className="text-gray-700">{program}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-3">Admission Requirements</h3>
                          <div className="space-y-2">
                            {school.requirements.map((req, index) => (
                              <div key={index} className="flex items-start space-x-2">
                                <ArrowRight className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                                <span className="text-gray-700 text-sm">{req}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-3">Key Information</h3>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <Calendar className="w-5 h-5 text-gray-400" />
                              <div>
                                <div className="font-semibold text-gray-900">Established</div>
                                <div className="text-gray-600">{school.established}</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Clock className="w-5 h-5 text-gray-400" />
                              <div>
                                <div className="font-semibold text-gray-900">Duration</div>
                                <div className="text-gray-600">{school.duration}</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <MapPin className="w-5 h-5 text-gray-400" />
                              <div>
                                <div className="font-semibold text-gray-900">Location</div>
                                <div className="text-gray-600">{school.location}</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Award className="w-5 h-5 text-gray-400" />
                              <div>
                                <div className="font-semibold text-gray-900">Accreditation</div>
                                <div className="text-gray-600">{school.accreditation}</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-3">Highlights</h3>
                          <div className="space-y-2">
                            {school.highlights.map((highlight, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <Star className="w-4 h-4 text-yellow-500" />
                                <span className="text-gray-700 text-sm">{highlight}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-3">Career Paths</h3>
                          <div className="flex flex-wrap gap-2">
                            {school.careerPaths.map((career, index) => (
                              <span key={index} className={`text-xs px-3 py-1 rounded-full ${getColorClasses(school.color)}`}>
                                {career}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-3">Contact Information</h3>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-700 text-sm">{school.phone}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-700 text-sm">{school.email}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Globe className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-700 text-sm">{school.website}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-8">
                      <Link href={`/schools/${school.id}`}>
                        <button className={`w-full py-3 px-6 rounded-lg font-semibold ${getColorClassesDark(school.color)} hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl transform hover:scale-[1.02]`}>
                          View School Details
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="py-16 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Explore Our Schools of Health Sciences
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover detailed information about each school, including programs, facilities, faculty, and application requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <button className="bg-white text-blue-900 py-3 px-8 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg">
                Contact Admissions
              </button>
            </Link>
            <Link href="/about">
              <button className="border-2 border-white text-white py-3 px-8 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                About Our Institution
              </button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SchoolsPage;
