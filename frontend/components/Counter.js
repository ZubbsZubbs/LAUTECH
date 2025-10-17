"use client";

import React from "react";
import CountUp from "react-countup";
import { FaUsers, FaStethoscope, FaAward, FaClock } from "react-icons/fa";

const SectionCounter = () => {
  const counters = [
    {
      icon: <FaUsers size={40} className="text-blue-500" />,
      value: 15000,
      label: "Patients Treated",
    },
    {
      icon: <FaStethoscope size={40} className="text-blue-500" />,
      value: 500,
      label: "Medical Students Trained",
    },
    {
      icon: <FaAward size={40} className="text-blue-500" />,
      value: 25,
      label: "Medical Awards",
    },
    {
      icon: <FaClock size={40} className="text-blue-500" />,
      value: 15,
      label: "Years of Excellence",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300 text-white relative overflow-hidden">
      {/* Decorative Background Circles */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-blue-700 rounded-full opacity-30 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-60 h-60 bg-blue-800 rounded-full opacity-30 blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Title */}
        <h2 className="text-4xl font-extrabold text-center mb-12 text-black">
          Our <span className="text-yellow-300">Achievements</span>
        </h2>

        {/* Counters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {counters.map((counter, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center bg-white text-gray-800 shadow-lg rounded-lg p-8 border border-gray-200 hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
            >
              {/* Icon */}
              <div className="mb-4 animate-bounce">{counter.icon}</div>

              {/* Counter */}
              <h3 className="text-4xl font-bold text-blue-500">
                <CountUp end={counter.value} duration={2.5} />
              </h3>

              {/* Label */}
              <p className="text-lg text-gray-700 mt-2">{counter.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SectionCounter;
