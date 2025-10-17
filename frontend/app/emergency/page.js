"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { FaPhone, FaAmbulance, FaHeartbeat, FaClock } from "react-icons/fa";

const Emergency = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div className="relative w-full bg-gradient-to-r from-red-600 to-red-500 flex items-center justify-center text-white text-center pt-32 pb-20">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative z-10">
          <h1 className="text-5xl font-bold mb-4 animate-fade-in-up">
            Emergency Services
          </h1>
          <p className="text-xl mb-6 animate-fade-in-up delay-200">
            24/7 Emergency Care Available
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="tel:+2348031234568"
              className="bg-white text-red-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all animate-pulse"
            >
              🚨 Call Emergency: +234 (803) 123-4568
            </a>
          </div>
        </div>
      </div>

      {/* Emergency Information */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Emergency Contacts */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <FaPhone className="text-red-600 mr-3" />
              Emergency Contacts
            </h2>
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-red-50 rounded-lg">
                <FaAmbulance className="text-red-600 text-2xl mr-4" />
                <div>
                  <h3 className="font-bold text-lg">Emergency Line</h3>
                  <p className="text-gray-600">+234 (803) 123-4568</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-red-50 rounded-lg">
                <FaHeartbeat className="text-red-600 text-2xl mr-4" />
                <div>
                  <h3 className="font-bold text-lg">Ambulance Service</h3>
                  <p className="text-gray-600">+234 (803) 123-4569</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-red-50 rounded-lg">
                <FaClock className="text-red-600 text-2xl mr-4" />
                <div>
                  <h3 className="font-bold text-lg">Emergency Department</h3>
                  <p className="text-gray-600">Available 24/7</p>
                </div>
              </div>
            </div>
          </div>

          {/* What to Do in Emergency */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              What to Do in an Emergency
            </h2>
            <div className="space-y-4">
              <div className="flex items-start p-4 bg-blue-50 rounded-lg">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 mt-1">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-lg">Stay Calm</h3>
                  <p className="text-gray-600">Take a deep breath and assess the situation safely.</p>
                </div>
              </div>
              <div className="flex items-start p-4 bg-blue-50 rounded-lg">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 mt-1">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-lg">Call Emergency</h3>
                  <p className="text-gray-600">Dial our emergency number immediately.</p>
                </div>
              </div>
              <div className="flex items-start p-4 bg-blue-50 rounded-lg">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 mt-1">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-lg">Provide Information</h3>
                  <p className="text-gray-600">Give clear details about the emergency and location.</p>
                </div>
              </div>
              <div className="flex items-start p-4 bg-blue-50 rounded-lg">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 mt-1">
                  4
                </div>
                <div>
                  <h3 className="font-bold text-lg">Follow Instructions</h3>
                  <p className="text-gray-600">Listen carefully and follow the operator's guidance.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Services */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Our Emergency Services
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHeartbeat className="text-red-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Trauma Care</h3>
              <p className="text-gray-600">
                Advanced trauma care with experienced emergency physicians and surgeons.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaAmbulance className="text-red-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Ambulance Service</h3>
              <p className="text-gray-600">
                Fully equipped ambulances with trained paramedics for rapid response.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaClock className="text-red-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">24/7 Availability</h3>
              <p className="text-gray-600">
                Round-the-clock emergency care with no waiting for critical cases.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Emergency;
