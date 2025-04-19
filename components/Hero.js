"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaBullseye, FaEye, FaQuoteLeft, FaQuoteRight } from "react-icons/fa";

const testimonials = [
  {
    name: "John Doe",
    position: "CEO, TechCorp",
    message:
      "Restech transformed our business with cutting-edge solutions. Highly recommended!",
    image: "/s1.jpg",
  },
  {
    name: "Jane Smith",
    position: "Marketing Manager, DigitalEdge",
    message:
      "The best tech company we've ever worked with. Their innovation is unmatched!",
    image: "/s2.jpg",
  },
  {
    name: "Michael Lee",
    position: "Founder, StartupX",
    message:
      "Incredible service and support. Restech helped us scale our business quickly!",
    image: "/s3.jpg",
  },
  {
    name: "Emily Davis",
    position: "CTO, Innovatech",
    message:
      "Their team is highly professional and delivers exceptional results every time.",
    image: "/s4.jpg",
  },
  {
    name: "Chris Johnson",
    position: "Product Manager, NextGen",
    message:
      "Restech's solutions have been a game-changer for our product development.",
    image: "/s5.jpg",
  },
  {
    name: "Sophia Brown",
    position: "Entrepreneur",
    message:
      "I couldn't have asked for a better partner to help grow my business.",
    image: "/s6.jpg",
  },
  {
    name: "Daniel Wilson",
    position: "Operations Head, FutureWorks",
    message:
      "Their innovative approach and attention to detail are truly impressive.",
    image: "/s5.jpg",
  },
  {
    name: "Olivia Martinez",
    position: "Creative Director, BrightIdeas",
    message:
      "Restech's creativity and technical expertise are unmatched in the industry.",
    image: "/slide_4.jpg",
  },
  {
    name: "Liam Garcia",
    position: "CEO, VisionaryTech",
    message:
      "Their solutions have helped us achieve remarkable growth in a short time.",
    image: "/slide_1.jpg",
  },
  {
    name: "Ava Thompson",
    position: "Freelancer",
    message:
      "Working with Restech has been an absolute pleasure. Highly recommended!",
    image: "/slide_2.jpg",
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
      <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-center animate-fade-in">
        Our <span className="text-blue-400">Drive</span>
      </h1>

      {/* Intro Section */}
      <div
        ref={sectionRef}
        className={`flex flex-col items-center justify-center mb-8 bg-white text-gray-800 border border-gray-200 rounded-xl shadow-lg max-w-3xl text-center px-8 py-10 transform transition duration-500 hover:scale-105 hover:shadow-2xl ${
          isVisible ? "animate-slide-in-right" : "opacity-0 translate-x-20"
        }`}
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-blue-500">
          Empowering Growth with Innovation
        </h2>
        <p className="text-sm sm:text-base md:text-lg leading-relaxed">
          We are driven by innovation, purpose, excellence, and an unwavering
          commitment to transforming lives and industries through cutting-edge
          technology, strategic solutions, and meaningful impact.
        </p>
      </div>

      {/* Mission and Vision Section */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto px-6">
        {/* Mission Statement */}
        <div
          ref={missionRef}
          className={`p-8 bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-lg shadow-lg flex flex-col items-center text-center transform transition duration-500 hover:scale-105 hover:shadow-2xl ${
            isMissionVisible ? "animate-fade-in-up" : "opacity-0 translate-y-10"
          }`}
        >
          <FaBullseye className="text-6xl text-white mb-6" />
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-base sm:text-lg leading-relaxed">
            We are dedicated to shaping the future of businesses and societies
            by offering innovative, reliable, and sustainable solutions across
            technology, hosting, media, and analytics.
          </p>
        </div>

        {/* Vision Statement */}
        <div
          ref={visionRef}
          className={`p-8 bg-gradient-to-r from-blue-400 to-blue-300 text-white rounded-lg shadow-lg flex flex-col items-center text-center transform transition duration-500 hover:scale-105 hover:shadow-2xl ${
            isVisionVisible ? "animate-fade-in-up" : "opacity-0 translate-y-10"
          }`}
        >
          <FaEye className="text-6xl text-white mb-6" />
          <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
          <p className="text-base sm:text-lg leading-relaxed">
            Our vision is to be a beacon of transformation, recognized globally
            for our ability to integrate technology with real-world business
            solutions.
          </p>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="mt-20 w-full overflow-hidden relative">
        <h2 className="text-3xl font-bold mb-8 text-blue-500 text-center">
          What Our Clients Say
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
