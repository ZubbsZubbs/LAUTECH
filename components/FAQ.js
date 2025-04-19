"use client";

import React, { useState } from "react";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "What services do you offer?",
      answer:
        "We offer a wide range of technology solutions, including software development, IT consulting, and digital transformation.",
    },
    {
      question: "How can I contact your support team?",
      answer:
        "You can contact our support team 24/7 via email, phone, or live chat on our website.",
    },
    {
      question: "Do you provide customized solutions?",
      answer:
        "Yes, we tailor our solutions to meet the unique needs of each client.",
    },
    {
      question: "What industries do you serve?",
      answer:
        "We serve a variety of industries, including healthcare, finance, retail, and more.",
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Title */}
        <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-12">
          Frequently Asked <span className="text-blue-500">Questions</span>
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
