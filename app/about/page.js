"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { FaUsers, FaBullseye, FaLightbulb } from "react-icons/fa";

const About = () => {
  return (
    <div className="flex flex-col justify-start bg-gradient-to-b from-blue-50 via-gray-50 to-blue-100 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-blue-300 rounded-full opacity-30 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-60 h-60 bg-blue-500 rounded-full opacity-30 blur-3xl animate-pulse"></div>

      <Navbar />

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-green-800 to-green-600 text-white py-20 text-center relative overflow-hidden">
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
      <section className="w-full bg-gradient-to-r from-green-50 to-green-100 py-20">
        <div className="w-full max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-semibold text-center mb-10 text-gray-800">
            Our Vision & Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Vision */}
            <div className="flex flex-col items-center text-center bg-white rounded-lg shadow-lg p-8 hover:shadow-2xl transition-shadow duration-300">
              <FaBullseye size={50} className="text-green-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Our Vision
              </h3>
              <p className="text-lg text-gray-600">
                To be a leading teaching hospital recognized for excellence in patient care, 
                medical education, and research that transforms healthcare delivery in our region.
              </p>
            </div>

            {/* Core Values */}
            <div className="flex flex-col items-center text-center bg-white rounded-lg shadow-lg p-8 hover:shadow-2xl transition-shadow duration-300">
              <FaLightbulb size={50} className="text-green-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Core Values
              </h3>
              <ul className="list-disc pl-6 text-lg text-gray-600 text-left">
                <li>Compassion: Caring for patients with empathy and understanding.</li>
                <li>Excellence: Maintaining the highest standards of care.</li>
                <li>Integrity: Upholding ethical medical practices.</li>
                <li>Innovation: Advancing medical knowledge through research.</li>
                <li>Education: Training competent healthcare professionals.</li>
              </ul>
            </div>

            {/* Teamwork */}
            <div className="flex flex-col items-center text-center bg-white rounded-lg shadow-lg p-8 hover:shadow-2xl transition-shadow duration-300">
              <FaUsers size={50} className="text-green-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Collaboration
              </h3>
              <p className="text-lg text-gray-600">
                Our multidisciplinary teams work together to provide comprehensive care, 
                ensuring the best outcomes for our patients and students.
              </p>
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
