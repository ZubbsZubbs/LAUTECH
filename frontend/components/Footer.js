"use client";

import React, { useState } from "react";
import axios from "axios";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaArrowUp,
} from "react-icons/fa";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, { 
        name: "Newsletter Subscriber",
        email: email,
        message: "Newsletter subscription request"
      });
      setMessage("Subscription successful!");
      setEmail(""); // Clear the input field
    } catch (error) {
      setMessage("Subscription failed. Please try again.");
      console.error(error);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="mt-5 min-h-[2px] bg-[url('/footer.jpg')] bg-cover bg-center bg-no-repeat text-gray-300 py-12 px-6 md:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Column 1 - Hospital Info */}
        <div>
          <h2 className="text-3xl font-bold text-white">LAUTECH Teaching Hospital</h2>
          <p className="mt-4 text-sm leading-relaxed">
            Providing exceptional healthcare services, advancing medical education, 
            and conducting groundbreaking research for the betterment of our community.
          </p>
        </div>

        {/* Column 2 - Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-3">
            <li>
              <a href="/" className="hover:text-green-400 transition">
                Home
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-green-400 transition">
                About Hospital
              </a>
            </li>
            <li>
              <a href="/services" className="hover:text-green-400 transition">
                Medical Services
              </a>
            </li>
            <li>
              <a href="/departments" className="hover:text-green-400 transition">
                Departments
              </a>
            </li>
            <li>
              <a href="/schools" className="hover:text-green-400 transition">
                Schools
              </a>
            </li>
            <li>
              <a href="/board" className="hover:text-green-400 transition">
                Board of Directors
              </a>
            </li>
            <li>
              <a href="/news" className="hover:text-green-400 transition">
                News & Events
              </a>
            </li>
            <li>
              <a href="/emergency" className="hover:text-green-400 transition">
                Emergency
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-green-400 transition">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3 - Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Contact Info</h3>
          <div className="space-y-3 text-sm">
            <p>📍 LAUTECH Teaching Hospital<br />Ogbomoso, Oyo State, Nigeria</p>
            <p>📞 +234 (803) 123-4567</p>
            <p>🚨 Emergency: +234 (803) 123-4568</p>
            <p>✉️ info@lautechhospital.edu.ng</p>
          </div>
          <div className="flex space-x-4 mt-4">
            <a href="#" className="hover:text-green-400 transition">
              <FaFacebookF size={24} />
            </a>
            <a href="#" className="hover:text-green-400 transition">
              <FaTwitter size={24} />
            </a>
            <a href="#" className="hover:text-green-400 transition">
              <FaLinkedinIn size={24} />
            </a>
            <a href="#" className="hover:text-green-400 transition">
              <FaInstagram size={24} />
            </a>
          </div>
        </div>

        {/* Column 4 - Newsletter Subscription */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Health Updates</h3>
          <p className="text-sm mb-4">
            Subscribe to receive health tips, hospital news, and medical updates.
          </p>
          <form className="flex" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-l bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 px-5 py-2 rounded-r text-white hover:bg-blue-700 transition"
            >
              Subscribe
            </button>
          </form>
          {message && <p className="mt-4 text-sm">{message}</p>}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="text-center mt-12 border-t border-gray-700 pt-6 text-sm">
        <p>
          &copy; {new Date().getFullYear()}{" "}
          <span className="font-bold text-white">LAUTECH Teaching Hospital</span>. All Rights
          Reserved.
        </p>
        <p className="mt-2">
          Providing healthcare with <span className="text-red-500">&hearts;</span> and{" "}
          <span className="text-blue-400">excellence</span> to our community.
        </p>
      </div>

      {/* Back to Top Button */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={scrollToTop}
          className="bg-white text-black p-3 rounded-full hover:bg-gray-100 transition shadow-lg"
          aria-label="Back to top"
        >
          <FaArrowUp size={20} />
        </button>
      </div>
    </footer>
  );
};

export default Footer;
