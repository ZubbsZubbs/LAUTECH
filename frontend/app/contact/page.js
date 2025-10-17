"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        const errorData = await response.json();
        setStatus(errorData.error || "Failed to send message.");
      }
    } catch (error) {
      setStatus("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div className="relative w-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center text-white text-center pt-32 pb-20">
        <h1 className="text-4xl md:text-5xl font-bold animate-fade-in-up">
          Contact Us
        </h1>
      </div>

      {/* Contact Information */}
      <div className="container mx-auto px-6 py-12 md:py-16">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Get in Touch Section */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Get in Touch
            </h2>
            <p className="text-gray-600 mb-8">
              Have questions? We're here to help. Reach out to us via phone,
              email, or visit our office.
            </p>
            <ul className="space-y-6">
              <li className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-full">
                  📍
                </div>
                <span className="text-gray-700">
                  LAUTECH Teaching Hospital, Ogbomoso, Oyo State, Nigeria
                </span>
              </li>
              <li className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-full">
                  📞
                </div>
                <a
                  href="tel:+2348031234567"
                  className="text-gray-700 hover:text-green-600 transition-all"
                >
                  +234 (803) 123-4567
                </a>
              </li>
              <li className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-full">
                  🚨
                </div>
                <a
                  href="tel:+2348031234568"
                  className="text-gray-700 hover:text-green-600 transition-all"
                >
                  Emergency: +234 (803) 123-4568
                </a>
              </li>
              <li className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-full">
                  ✉️
                </div>
                <a
                  href="mailto:info@lautechhospital.edu.ng"
                  className="text-gray-700 hover:text-green-600 transition-all"
                >
                  info@lautechhospital.edu.ng
                </a>
              </li>
              <li className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-full">
                  🕒
                </div>
                <span className="text-gray-700">
                  Emergency: 24/7 | OPD: Mon - Fri: 8:00 AM - 5:00 PM
                </span>
              </li>
            </ul>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Send a Message
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="relative mb-6">
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="peer w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-0 outline-none transition-all"
                  placeholder=""
                  required
                />
                <label
                  htmlFor="name"
                  className={`absolute left-4 top-3 text-gray-500 transition-all duration-300 pointer-events-none ${
                    formData.name ? 'opacity-0' : 'opacity-100'
                  }`}
                >
                  Full Name
                </label>
              </div>
              <div className="relative mb-6">
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="peer w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-0 outline-none transition-all"
                  placeholder=""
                  required
                />
                <label
                  htmlFor="email"
                  className={`absolute left-4 top-3 text-gray-500 transition-all duration-300 pointer-events-none ${
                    formData.email ? 'opacity-0' : 'opacity-100'
                  }`}
                >
                  Email Address
                </label>
              </div>
              <div className="relative mb-6">
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="peer w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-0 outline-none transition-all resize-none"
                  rows="5"
                  placeholder=""
                  required
                ></textarea>
                <label
                  htmlFor="message"
                  className={`absolute left-4 top-3 text-gray-500 transition-all duration-300 pointer-events-none ${
                    formData.message ? 'opacity-0' : 'opacity-100'
                  }`}
                >
                  Message
                </label>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all shadow-lg font-semibold"
              >
                Send Message
              </button>
            </form>
            {status && (
              <p className="mt-4 text-center text-gray-600">{status}</p>
            )}
          </div>
        </div>
      </div>

      {/* Google Map */}
      <div className="w-full h-[350px] md:h-[450px] rounded-lg overflow-hidden shadow-lg">
        <iframe
          className="w-full h-full border-none"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3975.639324803848!2d7.013400314763934!3d4.906764396392835!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1069cf2b7c8c5b2f%3A0x5c4b5c2b5b5b5b5b!2sUniversity%20of%20Port%20Harcourt!5e0!3m2!1sen!2sng!4v1680000000000!5m2!1sen!2sng"
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
