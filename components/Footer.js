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
      const response = await axios.post("/api/subscribe", { email });
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
        {/* Column 1 - Company Info */}
        <div>
          <h2 className="text-3xl font-bold text-white">Restech</h2>
          <p className="mt-4 text-sm leading-relaxed">
            Empowering businesses with cutting-edge technology solutions to
            drive innovation and success.
          </p>
        </div>

        {/* Column 2 - Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-3">
            <li>
              <a href="#" className="hover:text-blue-400 transition">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-400 transition">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-400 transition">
                Services
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-400 transition">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3 - Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
          <p className="text-sm mb-4">
            Stay connected with us on social media:
          </p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-blue-400 transition">
              <FaFacebookF size={24} />
            </a>
            <a href="#" className="hover:text-blue-400 transition">
              <FaTwitter size={24} />
            </a>
            <a href="#" className="hover:text-blue-400 transition">
              <FaLinkedinIn size={24} />
            </a>
            <a href="#" className="hover:text-blue-400 transition">
              <FaInstagram size={24} />
            </a>
          </div>
        </div>

        {/* Column 4 - Newsletter Subscription */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Subscribe</h3>
          <p className="text-sm mb-4">
            Get the latest updates and news delivered to your inbox.
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
              className="bg-blue-500 px-5 py-2 rounded-r text-white hover:bg-blue-600 transition"
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
          <span className="font-bold text-white">Restech</span>. All Rights
          Reserved.
        </p>
        <p className="mt-2">
          Designed with <span className="text-red-500">&hearts;</span> by{" "}
          <a href="#" className="hover:text-blue-400 transition">
           Restoration Expert Technologies
          </a>
          .
        </p>
      </div>

      {/* Back to Top Button */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={scrollToTop}
          className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition"
          aria-label="Back to top"
        >
          <FaArrowUp size={20} />
        </button>
      </div>
    </footer>
  );
};

export default Footer;
