"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { NAV_LINKS } from "@/constants";
import { Menu, X, Search } from "lucide-react"; // Import Search icon

const slides = [
  {
    image: "/s1.jpg",
    text: "Excellence in Healthcare & Medical Education",
    subtext: "LAUTECH Teaching Hospital",
    textAnimation: "animate-slide-up",
  },
  {
    image: "/s2.jpeg",
    text: "Compassionate Care, Advanced Medicine",
    subtext: "Your Health, Our Priority",
    textAnimation: "animate-slide-right",
  },
  {
    image: "/s3.jpeg",
    text: "Training Tomorrow's Medical Leaders",
    subtext: "Education & Excellence Combined",
    textAnimation: "animate-slide-left",
  },
  {
    image: "/s4.jpeg",
    text: "Innovative Healthcare Solutions",
    subtext: "Leading Medical Research & Treatment",
    textAnimation: "animate-slide-up",
  },
  {
    image: "/s5.jpeg",
    text: "Your Trusted Healthcare Partner",
    subtext: "Quality Care, Every Day",
    textAnimation: "animate-slide-right",
  },
];

const Navbar = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false); // State to toggle search bar
  const [searchQuery, setSearchQuery] = useState(""); // State to store search input
  const [searchResults, setSearchResults] = useState([]); // State to store search results

  useEffect(() => {
    // Handle slide transitions
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Handle scroll event to toggle navbar background
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50); // Add background when scrolled 50px or more
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    // Simulate search results (replace this with actual search logic)
    const results = NAV_LINKS.filter((link) =>
      link.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setSearchResults(results); // Update search results
    setSearchQuery(""); // Clear the search input after submission
    setIsSearchOpen(false); // Close the search bar
  };

  return (
    <nav className="relative w-full z-20">
      {/* Navbar */}
      <div
        className={`fixed top-0 left-0 w-full z-50 py-2 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md" : "bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between px-6 md:px-8 max-w-[1440px] mx-auto w-full">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2">
              {/* <Image
                src="/c_logo.png"
                width={64}
                height={20}
                alt="LAUTECH Teaching Hospital Logo"
                className={`${isScrolled ? "brightness-0" : ""}`} // Make logo dark on white background
              /> */}
              <span
                className={`text-lg font-bold ${
                  isScrolled ? "text-black" : "text-white"
                }`}
              >
                LAUTECH
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex gap-10 items-center justify-center flex-1">
            {NAV_LINKS.map((link) => (
              <li key={link.key}>
                <Link
                  href={link.href}
                  className={`${
                    isScrolled ? "text-black" : "text-white"
                  } hover:text-[#0077cc] border-b-2 border-transparent hover:border-[#1DA1F2] transition-all`}
                >
                  {link.label}
                </Link>
              </li>
            ))}

            {/* Search Bar */}
            {isSearchOpen && (
              <li className="flex items-center">
                <form
                  onSubmit={handleSearch}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                  >
                    Search
                  </button>
                </form>
              </li>
            )}

            {/* Search Icon */}
            {!isSearchOpen && (
              <li>
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className={`${
                    isScrolled ? "text-black" : "text-white"
                  } hover:text-[#0077cc] transition-all`}
                >
                  <Search size={24} />
                </button>
              </li>
            )}
          </ul>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`lg:hidden focus:outline-none z-50 ${
              isScrolled ? "text-black" : "text-white"
            }`}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden fixed top-0 right-0 h-full w-64 bg-white text-black p-6 transition-transform duration-300 z-40 ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Close Button */}
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-4 right-4 text-2xl text-black"
          >
            <X size={28} />
          </button>

          {/* Menu Links */}
          <ul className="space-y-6 mt-10">
            {NAV_LINKS.map((link) => (
              <li key={link.key}>
                <Link
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)} // Close the menu when a link is clicked
                  className="block text-lg text-black hover:text-[#1DA1F2] transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}

            {/* Search Icon */}
            <li>
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-white hover:text-[#1DA1F2] transition-all"
              >
                <Search size={24} />
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="absolute top-20 left-0 w-full bg-white shadow-md z-50 py-4 px-6">
          <h3 className="text-lg font-semibold mb-2">Search Results:</h3>
          <ul>
            {searchResults.map((result) => (
              <li key={result.key} className="py-1">
                <Link
                  href={result.href}
                  className="text-blue-500 hover:underline"
                >
                  {result.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Slideshow */}
      <div className="relative w-full h-[97vh] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            } ${slide.animation}`}
          >
            {/* Background Image */}
            <Image
              src={slide.image}
              fill
              className={`absolute inset-0 object-cover ${
                index === currentSlide ? "animate-zoom-out" : ""
              }`}
              alt={`Slide ${index + 1}`}
              priority={index === 0}
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/50"></div>

            {/* Centered Text */}
            <div className="relative z-10 text-center text-white drop-shadow-lg p-4">
              <h1
                className={`text-4xl font-bold md:text-6xl slide-text ${
                  index === currentSlide ? slide.textAnimation : ""
                }`}
              >
                {slide.text}
              </h1>
              <p
                className={`text-2xl md:text-4xl mt-2 slide-text ${
                  index === currentSlide ? slide.textAnimation : ""
                }`}
                style={{ animationDelay: "0.2s" }}
              >
                {slide.subtext}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Dot Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-3 w-3 rounded-full transition-all ${
              index === currentSlide ? "bg-white scale-125" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </nav>
  );
};

export default Navbar;

// "use client";

// import { useState } from "react";
// import { NAV_LINKS } from "@/constants";
// import Image from "next/image";
// import Link from "next/link";
// import React from "react";

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <nav className="max-container flex items-center justify-between py-4 px-5 z-50 relative">
//       <Link href="/">
//         <Image src="/c_logo.png" alt="Logo" width={74} height={29} />
//       </Link>

//       <ul className="hidden h-full gap-12 lg:flex">
//         {NAV_LINKS.map((link) => (
//           <li>
//             <Link
//             href={link.href}
//             key={link.key}
//             // className="text-[16px] font-[400] flex items-center justify-center cursor-pointer pb-1.5 transition-all hover:font-bold"
//             className="text-[16px] font-[400] flex items-center justify-center cursor-pointer pb-1.5
//               text-[#1DA1F2] transition-all hover:font-bold hover:text-[#0077cc] border-b-2 border-transparent hover:border-[#1DA1F2] transition: border-color 0.3s ease-in-out;"
//             >
//               {link.label}
//             </Link>
//           </li>
//         ))}
//       </ul>

//       {/* Mobile Menu Icon */}
//       <Image
//         src="/menu.svg"
//         alt="menu"
//         width={32}
//         height={32}
//         onClick={() => setIsOpen(true)}
//         className="cursor-pointer"
//       />

//       {/* Mobile Nav Menu */}
//       {isOpen && (
//         <div
//           className={`fixed top-0 right-0 h-screen w-3/4 bg-black text-white transition-transform duration-300 ease-in-out ${
//             isOpen ? "translate-x-0" : "translate-x-full"
//           } lg:hidden z-40 flex flex-col items-center justify-center gap-6 shadow-lg`}
//         >
//           {/* Close Button */}
//           <button
//             className="absolute top-6 right-6"
//             onClick={() => setIsOpen(false)}
//           >
//             <Image src="/close.svg" alt="close" width={24} height={24} />
//           </button>

//           {/* Mobile Links */}
//           {NAV_LINKS.map((link) => (
//             <Link
//               href={link.href}
//               key={link.key}
//               className="text-lg font-semibold hover:text-green-300 transition-colors"
//               onClick={() => setIsOpen(false)}
//             >
//               {link.label}
//             </Link>
//           ))}
//         </div>
//       )}

//       {/* Overlay to Close Menu */}
//       {isOpen && (
//         <div
//           className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-30"
//           onClick={() => setIsOpen(false)}
//         ></div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;

// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { NAV_LINKS } from "@/constants";

// const images = ["/slide_1.jpg", "/slide_2.jpg", "/slide_3.jpg"];

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [currentImage, setCurrentImage] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentImage((prev) => (prev + 1) % images.length);
//     }, 3000); // Change image every 3 seconds
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <nav className="relative  flex items-center justify-between py-4 px-5 z-50 pb-80">
//       {/* Logo */}
//       <Link href="/">
//         <Image src="/c_logo.png" width={74} height={29} alt="Logo" style={{ width: "auto", height: "auto" }} />
//       </Link>

//       {/* Slideshow Background */}
//       <div className="absolute inset-0 z-[-1] w-full h-full">
//         {images.map((src, index) => (
//           <Image
//             key={index}
//             src={src}
//             fill
//             style={{ objectFit: "cover" }}
//             className={`absolute inset-0 transition-opacity duration-1000 ${
//               index === currentImage ? "opacity-100" : "opacity-0"
//             }`}
//             alt={`Slide ${index + 1}`}
//             priority={index === 0} // Priority for first image
//           />
//         ))}
//       </div>

//       {/* Desktop Navigation */}
//       <ul className="hidden lg:flex gap-12">
//         {NAV_LINKS.map((link) => (
//           <li key={link.key}>
//             <Link href={link.href} className="text-[#1DA1F2] hover:text-[#0077cc] border-b-2 border-transparent hover:border-[#1DA1F2]">
//               {link.label}
//             </Link>
//           </li>
//         ))}
//       </ul>

//       {/* Mobile Menu */}
//       <Image src="/menu.svg" alt="menu" width={32} height={32} onClick={() => setIsOpen(true)} className="cursor-pointer lg:hidden" />

//       {isOpen && (
//         <div className="fixed top-0 right-0 w-3/4 h-screen bg-black text-white flex flex-col items-center gap-6 shadow-lg z-40">
//           <button className="absolute top-6 right-6" onClick={() => setIsOpen(false)}>
//             <Image src="/close.svg" alt="close" width={24} height={24} />
//           </button>
//           {NAV_LINKS.map((link) => (
//             <Link key={link.key} href={link.href} className="text-lg font-semibold hover:text-green-300" onClick={() => setIsOpen(false)}>
//               {link.label}
//             </Link>
//           ))}
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;
