"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { FaUsers, FaBullseye, FaLightbulb } from "react-icons/fa";
// about
const About = () => {
  return (
    <div className="flex flex-col justify-start bg-gradient-to-b from-blue-50 via-gray-50 to-blue-100 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-blue-300 rounded-full opacity-30 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-60 h-60 bg-blue-500 rounded-full opacity-30 blur-3xl animate-pulse"></div>

      <Navbar />

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-green-800 to-green-600 text-white pt-32 pb-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-hero-pattern opacity-10"></div>
        <div className="relative z-10">
          <h1 className="text-5xl font-bold mb-4 animate-typewriter">
            About LAUTECH Teaching Hospital
          </h1>
          <p className="text-lg max-w-2xl mx-auto animate-fade-in-up delay-200">
            Learn more about our hospital, our commitment to healthcare excellence, and our mission to serve our community.
          </p>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="w-full max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-semibold text-center mb-10 text-gray-800">
          Who We Are
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col justify-center bg-gradient-to-r from-green-50 to-white rounded-lg shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-3xl font-bold text-green-600 mb-4">
              Excellence in Healthcare
            </h3>
            <p className="text-lg text-gray-600">
              LAUTECH Teaching Hospital is a leading healthcare institution dedicated to providing 
              exceptional patient care, advancing medical education, and conducting groundbreaking research. 
              Our team of highly skilled professionals is committed to delivering compassionate, 
              evidence-based healthcare services to our community.
            </p>
          </div>
          <div className="relative group">
            <img
              src="/s1.jpg"
              alt="Our Team"
              className="rounded-lg shadow-lg w-full transform group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="w-full bg-gradient-to-r from-gray-100 to-gray-200 py-20 relative">
        <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-gray-200 to-transparent"></div>
        <div className="w-full max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-semibold text-center mb-10 text-gray-800">
            Our Mission
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img
                src="/s2.jpeg"
                alt="Our Mission"
                className="rounded-lg shadow-lg w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50 rounded-lg"></div>
            </div>
            <div className="flex flex-col justify-center animate-slide-in-right">
              <h3 className="text-3xl font-bold text-green-600 mb-4">
                Healing & Teaching
              </h3>
              <p className="text-lg text-gray-600">
                Our mission is to provide exceptional healthcare services while training the next generation 
                of medical professionals. We are committed to advancing medical knowledge through research, 
                delivering compassionate patient care, and maintaining the highest standards of medical education 
                and clinical excellence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Vision & Values Section */}
      <section className="w-full bg-gradient-to-br from-blue-50 via-gray-50 to-blue-100 py-20">
        <div className="w-full max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
            Our Vision & Values
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Guided by our vision and core values, we strive to transform healthcare delivery 
            and medical education in our region.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Vision */}
            <div className="group relative bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
              {/* Decorative background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-white rounded-full -ml-20 -mb-20"></div>
              </div>
              
              <div className="relative z-10">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <FaBullseye size={40} className="text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 text-center">
                  Our Vision
                </h3>
                <p className="text-base text-white/90 leading-relaxed text-center">
                  To be a leading teaching hospital recognized for excellence in patient care, 
                  medical education, and research that transforms healthcare delivery in our region.
                </p>
              </div>
            </div>

            {/* Core Values */}
            <div className="group relative bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-2 border-blue-100 hover:border-blue-300">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                  <FaLightbulb size={40} className="text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Core Values
              </h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-gray-700"><span className="font-semibold text-gray-900">Compassion:</span> Caring with empathy</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-gray-700"><span className="font-semibold text-gray-900">Excellence:</span> Highest standards of care</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-gray-700"><span className="font-semibold text-gray-900">Integrity:</span> Ethical medical practices</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-gray-700"><span className="font-semibold text-gray-900">Innovation:</span> Advancing knowledge</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-gray-700"><span className="font-semibold text-gray-900">Education:</span> Training professionals</p>
                </div>
              </div>
            </div>

            {/* Collaboration */}
            <div className="group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
              {/* Decorative background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -ml-16 -mt-16"></div>
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full -mr-20 -mb-20"></div>
              </div>
              
              <div className="relative z-10">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <FaUsers size={40} className="text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 text-center">
                  Collaboration
                </h3>
                <p className="text-base text-white/90 leading-relaxed text-center">
                  Our multidisciplinary teams work together to provide comprehensive care, 
                  ensuring the best outcomes for our patients and students.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full py-16 bg-gradient-to-r from-green-900 to-green-700 text-white relative">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="w-full max-w-7xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl font-semibold mb-4 animate-fade-in-up">
            Join Us in Advancing Healthcare
          </h2>
          <p className="text-lg mb-6 animate-fade-in-up delay-200">
            We are always looking for dedicated healthcare professionals and medical students 
            to join our team. If you're passionate about making a difference in healthcare, let's talk!
          </p>
          <a
            href="/contact"
            className="inline-block py-3 px-6 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-400 transition-all animate-glow"
          >
            Contact Us
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
