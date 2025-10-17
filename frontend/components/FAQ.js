"use client";

import React, { useState } from "react";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "What medical services do you offer?",
      answer:
        "We offer comprehensive healthcare services including emergency care, surgery, cardiology, pediatrics, oncology, radiology, and many other medical specialties. Our teaching hospital provides both patient care and medical education.",
    },
    {
      question: "How can I schedule an appointment?",
      answer:
        "You can schedule an appointment by calling our main number +234 (803) 123-4567, visiting our outpatient department, or using our online appointment system. Emergency cases are seen immediately 24/7.",
    },
    {
      question: "Do you accept health insurance?",
      answer:
        "Yes, we accept most major health insurance plans and also provide self-pay options. Our billing department can help you understand your coverage and payment options.",
    },
    {
      question: "What are your visiting hours?",
      answer:
        "General visiting hours are 10:00 AM - 8:00 PM daily. ICU and emergency department have restricted visiting hours. Please check with our staff for specific department visiting policies.",
    },
    {
      question: "Do you provide medical education and training?",
      answer:
        "Yes, as a teaching hospital, we train medical students, residents, and fellows. We also offer continuing medical education programs for healthcare professionals.",
    },
    {
      question: "What should I bring for my appointment?",
      answer:
        "Please bring your ID, insurance card, list of current medications, medical records if available, and any relevant test results. For new patients, arrive 30 minutes early to complete registration.",
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Title */}
        <h2 className="text-4xl font-extrabold text-center text-black mb-12">
          Frequently Asked <span className="text-blue-600">Questions</span>
        </h2>

        {/* FAQ Items */}
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`border rounded-lg p-6 transition-all duration-500 transform hover:scale-105 ${
                activeIndex === index
                  ? "bg-blue-50 border-blue-500 shadow-xl"
                  : "bg-white border-gray-300 shadow-md"
              }`}
              onClick={() => toggleFAQ(index)}
            >
              <div className="flex justify-between items-center cursor-pointer">
                <h3 className="text-lg font-semibold text-gray-900">
                  {faq.question}
                </h3>
                <span
                  className={`text-2xl font-bold transition-transform duration-300 ${
                    activeIndex === index
                      ? "text-blue-500 rotate-180"
                      : "text-gray-500"
                  }`}
                >
                  {activeIndex === index ? "-" : "+"}
                </span>
              </div>
              <div
                className={`overflow-hidden transition-max-height duration-500 ${
                  activeIndex === index ? "max-h-screen" : "max-h-0"
                }`}
              >
                <p className="mt-4 text-gray-700 text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
