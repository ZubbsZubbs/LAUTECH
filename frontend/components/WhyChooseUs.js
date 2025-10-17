"use client";

import React from "react";
import { FaCheckCircle } from "react-icons/fa";

const WhyChooseUs = () => {
  const reasons = [
    {
      title: "Expert Medical Team",
      description:
        "Our team consists of highly qualified doctors and healthcare professionals with years of experience.",
    },
    {
      title: "Advanced Medical Technology",
      description:
        "We provide cutting-edge medical equipment and technology for accurate diagnosis and treatment.",
    },
    {
      title: "Patient-Centered Care",
      description:
        "We prioritize patient satisfaction and deliver compassionate, personalized healthcare services.",
    },
    {
      title: "24/7 Emergency Care",
      description:
        "Our emergency department is available around the clock to provide immediate medical attention.",
    },
  ];

  return (
    <section className="mt-20 py-6 bg-gradient-to-r from-blue-50 via-gray-100 to-blue-50 animate-gradient text-gray-800">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Title */}
        <h2 className="text-4xl font-extrabold text-center text-black mb-12">
          Why <span className="text-blue-600">Choose LAUTECH</span>
        </h2>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center bg-white shadow-lg rounded-lg p-12 border-2 border-transparent hover:border-gradient hover:shadow-glow transition-all duration-500 transform hover:scale-105"
            >
              {/* Icon */}
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-full mb-4 animate-pulse hover:animate-spin">
                <FaCheckCircle size={32} />
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-gray-900">
                {reason.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600 mt-3">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
