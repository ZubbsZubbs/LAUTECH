"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { FaStethoscope, FaGraduationCap, FaAward, FaUserMd } from "react-icons/fa";

const doctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Chief Medical Officer",
    qualifications: "MD, PhD, FRCP",
    experience: "15+ years",
    image: "/ceo.jpg",
    description: "Leading our medical team with expertise in internal medicine and hospital administration."
  },
  {
    id: 2,
    name: "Dr. Michael Adebayo",
    specialty: "Cardiologist",
    qualifications: "MD, FACC",
    experience: "12+ years",
    image: "/cto.jpeg",
    description: "Specialized in interventional cardiology and heart disease prevention."
  },
  {
    id: 3,
    name: "Dr. Fatima Ibrahim",
    specialty: "Pediatrician",
    qualifications: "MD, FAAP",
    experience: "10+ years",
    image: "/s1.jpg",
    description: "Dedicated to providing compassionate care for children and adolescents."
  },
  {
    id: 4,
    name: "Dr. James Okonkwo",
    specialty: "Neurosurgeon",
    qualifications: "MD, PhD, FACS",
    experience: "18+ years",
    image: "/s2.jpg",
    description: "Expert in complex brain and spine surgeries with advanced techniques."
  },
  {
    id: 5,
    name: "Dr. Grace Okafor",
    specialty: "Obstetrician & Gynecologist",
    qualifications: "MD, FACOG",
    experience: "14+ years",
    image: "/s3.jpg",
    description: "Specialized in high-risk pregnancies and minimally invasive gynecological procedures."
  },
  {
    id: 6,
    name: "Dr. Peter Williams",
    specialty: "Orthopedic Surgeon",
    qualifications: "MD, FACS",
    experience: "16+ years",
    image: "/s4.jpg",
    description: "Expert in joint replacement, sports medicine, and trauma surgery."
  },
  {
    id: 7,
    name: "Dr. Amina Hassan",
    specialty: "Oncologist",
    qualifications: "MD, PhD, FACP",
    experience: "13+ years",
    image: "/s5.jpg",
    description: "Leading cancer care with personalized treatment plans and research."
  },
  {
    id: 8,
    name: "Dr. Chinedu Okwu",
    specialty: "Emergency Medicine",
    qualifications: "MD, FACEP",
    experience: "11+ years",
    image: "/s6.jpg",
    description: "Specialized in trauma care and emergency medical procedures."
  }
];

const OurDoctors = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div className="relative w-full h-[400px] bg-gradient-to-r from-green-600 to-green-500 flex items-center justify-center text-white text-center">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative z-10">
          <h1 className="text-5xl font-bold mb-4 animate-fade-in-up">
            Our Medical Team
          </h1>
          <p className="text-xl mb-6 animate-fade-in-up delay-200">
            Meet our experienced and dedicated healthcare professionals
          </p>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Expert Medical Professionals
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our team of highly qualified doctors brings together years of experience, 
            advanced training, and a commitment to providing the best possible care for our patients.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {doctors.map((doctor, index) => (
            <div
  key={doctor.id}
  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 pt-8 px-4"
  style={{
    animationDelay: `${index * 0.1}s`,
    animation: "fadeInUp 0.6s ease-out forwards"
  }}
>
  <div className="relative h-64 flex items-center justify-center">
    <img
      src={doctor.image}
      alt={doctor.name}
      className="w-48 h-48 object-cover rounded-full shadow-lg"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg"></div>
    <div className="absolute bottom-4 left-4 right-4 text-white">
      <h3 className="text-xl font-bold">{doctor.name}</h3>
      <p className="text-green-300 font-semibold">{doctor.specialty}</p>
    </div>
  </div>
  <div className="p-6">
                <div className="flex items-center mb-3">
                  <FaGraduationCap className="text-green-600 mr-2" />
                  <span className="text-sm text-gray-600">{doctor.qualifications}</span>
                </div>
                <div className="flex items-center mb-3">
                  <FaAward className="text-green-600 mr-2" />
                  <span className="text-sm text-gray-600">{doctor.experience}</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {doctor.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose Our Doctors */}
      <div className="bg-green-50 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Why Choose Our Medical Team
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUserMd className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Expertise</h3>
              <p className="text-gray-600">
                Our doctors are board-certified specialists with extensive training and experience.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaStethoscope className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Compassionate Care</h3>
              <p className="text-gray-600">
                We provide patient-centered care with empathy and understanding.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaGraduationCap className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Continuous Learning</h3>
              <p className="text-gray-600">
                Our team stays updated with the latest medical advances and techniques.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OurDoctors;
