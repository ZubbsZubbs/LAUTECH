"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaBullseye, FaEye, FaQuoteLeft, FaQuoteRight } from "react-icons/fa";

const testimonials = [
  {
    name: "Dr. Sarah Johnson",
    position: "Chief Medical Officer",
    message:
      "LAUTECH Teaching Hospital provides exceptional patient care while training the next generation of medical professionals.",
    image: "/s1.jpeg",
  },
  {
    name: "Michael Adebayo",
    position: "Patient",
    message:
      "The care I received here was outstanding. The doctors and nurses were compassionate and highly skilled.",
    image: "/s2.jpeg",
  },
  {
    name: "Dr. Fatima Ibrahim",
    position: "Resident Physician",
    message:
      "Training at LAUTECH has been incredible. The mentorship and hands-on experience are world-class.",
    image: "/s3.jpeg",
  },
  {
    name: "Grace Okafor",
    position: "Patient's Family",
    message:
      "During my mother's treatment, the entire team showed such dedication and care. We're forever grateful.",
    image: "/s4.jpeg",
  },
  {
    name: "Dr. James Okonkwo",
    position: "Attending Physician",
    message:
      "The hospital's commitment to medical education and research excellence is truly remarkable.",
    image: "/s5.jpeg",
  },
  {
    name: "Aisha Mohammed",
    position: "Patient",
    message:
      "From emergency care to follow-up, LAUTECH provided comprehensive and compassionate treatment.",
    image: "/s6.jpeg",
  },
  {
    name: "Dr. Peter Williams",
    position: "Department Head",
    message:
      "Our multidisciplinary approach ensures patients receive the best possible care from our expert teams.",
    image: "/s5.jpeg",
  },
  {
    name: "Blessing Nwosu",
    position: "Patient",
    message:
      "The modern facilities and advanced technology made my treatment comfortable and effective.",
    image: "/slide_4.jpeg",
  },
  {
    name: "Dr. Amina Hassan",
    position: "Research Director",
    message:
      "LAUTECH's research programs are advancing medical knowledge and improving patient outcomes.",
    image: "/slide_1.jpeg",
  },
  {
    name: "Chinedu Okwu",
    position: "Patient",
    message:
      "The staff's professionalism and the hospital's commitment to excellence made all the difference.",
    image: "/slide_2.jpeg",
  },
];

export const Hero = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const [isMissionVisible, setIsMissionVisible] = useState(false);
  const [isVisionVisible, setIsVisionVisible] = useState(false);
  const missionRef = useRef(null);
  const visionRef = useRef(null);

  // Auto-slide testimonials every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 80000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === missionRef.current) {
              setIsMissionVisible(true);
            }
            if (entry.target === visionRef.current) {
              setIsVisionVisible(true);
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    if (missionRef.current) observer.observe(missionRef.current);
    if (visionRef.current) observer.observe(visionRef.current);

    return () => {
      if (missionRef.current) observer.unobserve(missionRef.current);
      if (visionRef.current) observer.unobserve(visionRef.current);
    };
  }, []);

  return (
    <section className="mt-20 relative w-full min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800 px-6 md:px-12">
      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-center animate-fade-in text-black">
        Our <span className="text-blue-600">Mission</span>
      </h1>

      {/* Intro Section */}
      <div
        ref={sectionRef}
        className={`flex flex-col items-center justify-center mb-8 bg-white text-gray-800 border border-gray-200 rounded-xl shadow-lg max-w-3xl text-center px-8 py-10 transform transition duration-500 hover:scale-105 hover:shadow-2xl ${
          isVisible ? "animate-slide-in-right" : "opacity-0 translate-x-20"
        }`}
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-black">
          Excellence in Healthcare & Medical Education
        </h2>
        <p className="text-sm sm:text-base md:text-lg leading-relaxed">
          We are committed to providing exceptional patient care, advancing medical knowledge through research, 
          and training the next generation of healthcare professionals with compassion, innovation, and excellence.
        </p>
      </div>

      {/* Mission and Vision Section */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto px-6">
        {/* Mission Statement */}
        <div
          ref={missionRef}
          className={`p-8 bg-gradient-to-br from-blue-100 to-blue-200 text-gray-900 rounded-lg shadow-lg flex flex-col items-center text-center transform transition duration-500 hover:scale-105 hover:shadow-2xl border border-blue-300 ${
            isMissionVisible ? "animate-fade-in-up" : "opacity-0 translate-y-10"
          }`}
        >
          <FaBullseye className="text-6xl text-blue-600 mb-6" />
          <h2 className="text-3xl font-bold mb-4 text-black">Our Mission</h2>
          <p className="text-base sm:text-lg leading-relaxed text-gray-700">
            To provide exceptional healthcare services, advance medical knowledge through research, 
            and train competent healthcare professionals while maintaining the highest standards of patient care and safety.
          </p>
        </div>

        {/* Vision Statement */}
        <div
          ref={visionRef}
          className={`p-8 bg-gradient-to-br from-blue-100 to-blue-200 text-gray-900 rounded-lg shadow-lg flex flex-col items-center text-center transform transition duration-500 hover:scale-105 hover:shadow-2xl border border-blue-300 ${
            isVisionVisible ? "animate-fade-in-up" : "opacity-0 translate-y-10"
          }`}
        >
          <FaEye className="text-6xl text-blue-600 mb-6" />
          <h2 className="text-3xl font-bold mb-4 text-black">Our Vision</h2>
          <p className="text-base sm:text-lg leading-relaxed text-gray-700">
            To be a leading teaching hospital recognized for excellence in patient care, 
            medical education, and research that transforms healthcare delivery in our region.
          </p>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="mt-20 w-full overflow-hidden relative">
        <h2 className="text-3xl font-bold mb-8 text-black text-center">
          What Our Patients & Staff Say
        </h2>

        {/* Scrolling Container */}
        <div className="mt-20 flex space-x-6 animate-scroll">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-80 p-8 bg-white text-gray-800 rounded-lg shadow-lg flex flex-col items-center transition-transform duration-500 hover:scale-105 hover:shadow-glow relative"
            >
              {/* Decorative Quote Icon */}
              <div className="absolute -top-4 left-4 bg-blue-500 text-white p-2 rounded-full shadow-md">
                <FaQuoteLeft size={20} />
              </div>

              {/* Customer Image */}
              <div className="mb-6">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-24 h-24 rounded-full border-4 border-blue-500 shadow-md"
                />
              </div>

              {/* Customer Name & Position */}
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {testimonial.name}
                </h3>
                <p className="text-sm text-blue-500">{testimonial.position}</p>
              </div>

              {/* Testimonial Message */}
              <p className="text-base italic leading-relaxed text-center text-gray-600">
                "{testimonial.message}"
              </p>

              {/* Decorative Border */}
              <div className="absolute inset-0 rounded-lg border-2 border-dashed border-gray-200 pointer-events-none"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
