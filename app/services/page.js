"use client";

import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";

const services = [
  {
    id: 1,
    title: "Emergency Medicine",
    description:
      "24/7 emergency care with state-of-the-art facilities and experienced trauma specialists.",
    icon: "/slide_1.jpeg",
  },
  {
    id: 2,
    title: "Cardiology",
    description: "Comprehensive heart care including diagnostics, treatment, and rehabilitation.",
    icon: "/slide_2.jpeg",
  },
  {
    id: 3,
    title: "Pediatrics",
    description:
      "Specialized care for infants, children, and adolescents with child-friendly facilities.",
    icon: "/slide_3.jpeg",
  },
  {
    id: 4,
    title: "Surgery",
    description:
      "Advanced surgical procedures using minimally invasive techniques and modern equipment.",
    icon: "/slide_4.jpeg",
  },
  {
    id: 5,
    title: "Oncology",
    description:
      "Comprehensive cancer care including diagnosis, treatment, and supportive care.",
    icon: "/slide_1.jpeg",
  },
  {
    id: 6,
    title: "Radiology",
    description: "Advanced imaging services including MRI, CT scans, and ultrasound.",
    icon: "/slide_2.jpeg",
  },
  {
    id: 7,
    title: "Obstetrics & Gynecology",
    description: "Women's health services from prenatal care to advanced gynecological procedures.",
    icon: "/slide_3.jpeg",
  },
  {
    id: 8,
    title: "Neurology",
    description: "Specialized care for brain, spine, and nervous system disorders.",
    icon: "/slide_4.jpeg",
  },
  {
    id: 9,
    title: "Orthopedics",
    description: "Bone, joint, and muscle care including sports medicine and rehabilitation.",
    icon: "/slide_1.jpeg",
  },
];

const OurServices = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const section = document.getElementById("services-section");
      if (section && scrollPosition > section.offsetTop + 100) {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-gray-50 to-blue-100 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-blue-300 rounded-full opacity-30 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-60 h-60 bg-blue-500 rounded-full opacity-30 blur-3xl"></div>

      {/* Navigation Bar */}
      <Navbar />

      {/* Hero Section */}
      <div
        className="relative w-full h-[300px] md:h-[400px] flex items-center justify-center text-white text-center bg-fixed bg-cover bg-center"
        style={{ backgroundImage: "url('/services-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <h1 className="relative text-4xl md:text-5xl font-bold animate-fade-in-up">
          Medical Services
        </h1>
      </div>

      {/* Services Section */}
      <div
        id="services-section"
        className={`container mx-auto px-6 py-12 md:py-16 transition-opacity duration-1000 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-8">
          Our Medical Departments
        </h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-10">
          We provide comprehensive healthcare services across multiple specialties 
          with state-of-the-art facilities and expert medical professionals.
        </p>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`relative group bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl min-h-[400px] flex flex-col opacity-0 animate-fade-in-card`}
              style={{
                animationDelay: `${index * 0.2}s`,
                animationFillMode: "forwards",
              }}
            >
              {/* Service Icon */}
              <div className="flex-1 relative">
                <Image
                  src={service.icon}
                  alt={service.title}
                  layout="fill"
                  objectFit="cover"
                  className="w-full h-full"
                />
              </div>

              {/* Service Text */}
              <div className="flex-1 flex flex-col items-center justify-center p-4">
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-500 transition">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm mt-2 text-center">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default OurServices;
