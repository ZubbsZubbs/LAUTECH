"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { NAV_LINKS, AUTH_LINKS, ADMIN_LINKS } from "@/constants";
import { Menu, X, Search, User } from "lucide-react"; // Import Search icon
import { useTheme } from "../contexts/ThemeContext";

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
  const pathname = usePathname();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { theme, changeTheme } = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false); // State to toggle search bar
  const [searchQuery, setSearchQuery] = useState(""); // State to store search input
  const [searchResults, setSearchResults] = useState([]); // State to store search results
  const [expandedItems, setExpandedItems] = useState([]); // Track expanded mobile menu items

  // Check if user is an admin or not logged in (show admin button to unauthenticated users)
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const showAdminButton = !isAuthenticated || isAdmin;

  // Check if current page is a department page or school page
  const isDepartmentPage = pathname?.startsWith('/departments');
  const isSchoolPage = pathname?.startsWith('/schools/') || pathname === '/schools';
  const isNursingSchoolPage = pathname?.startsWith('/schools/nursing');
  const isBoardPage = pathname === '/board';
  const isServicesPage = pathname === '/services';
  const isAboutPage = pathname === '/about';
  const isEmergencyPage = pathname === '/emergency';
  const isContactPage = pathname === '/contact';
  const shouldHideSlider = isDepartmentPage || isSchoolPage || isBoardPage || isServicesPage || isAboutPage || isEmergencyPage || isContactPage;

  useEffect(() => {
    // Handle slide transitions - only on pages that should show slider
    if (!shouldHideSlider) {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
    }
  }, [shouldHideSlider]);

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

  const toggleMobileSubmenu = (key) => {
    setExpandedItems((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  return (
    <nav className="relative w-full">
      {/* Navbar */}
      <div
        className={`fixed top-0 left-0 right-0 w-full z-[100] transition-all duration-300 ${
          isScrolled 
            ? "bg-white/98 backdrop-blur-lg shadow-xl py-3" 
            : "bg-transparent py-5"
        }`}
      >
        <div className="flex items-center justify-between px-6 md:px-16 max-w-[1500px] mx-auto w-full">
          {/* Logo */}
          <Link href="/" className="group">
            <div className="flex items-center space-x-3">
              {/* <Image
                src="/c_logo.png"
                width={64}
                height={20}
                alt="LAUTECH Teaching Hospital Logo"
                className={`${isScrolled ? "brightness-0" : ""}`} // Make logo dark on white background
              /> */}
              <div className="flex flex-col">
                <span
                  className={`text-2xl font-extrabold tracking-tight transition-colors ${
                    isScrolled ? "text-blue-600" : "text-white"
                  }`}
                >
                  LAUTECH
                </span>
                <span
                  className={`text-[10px] font-medium tracking-wider uppercase transition-colors ${
                    isScrolled ? "text-gray-600" : "text-blue-100"
                  }`}
                >
                  Teaching Hospital
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex gap-1 items-center justify-center flex-1">
            {NAV_LINKS.map((link) => (
              <li key={link.key}>
                <Link
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-[14px] font-semibold transition-all duration-200 relative group ${
                    isScrolled 
                      ? "text-gray-800 hover:text-blue-600 hover:bg-blue-50/80" 
                      : "text-white hover:text-blue-100 hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}

            {/* Authentication Links - Only show on nursing school pages */}
            {isNursingSchoolPage && AUTH_LINKS.map((link) => (
              <li key={link.key}>
                <Link
                  href={link.key === 'login' ? '/auth/login?redirect=/student/dashboard' : link.href}
                  className={`px-3 py-2 rounded-lg text-[14px] font-semibold transition-all duration-200 ${
                    isScrolled 
                      ? "text-gray-800 hover:text-blue-600 hover:bg-blue-50/80" 
                      : "text-white hover:text-blue-100 hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}

            {/* My Applications - Show for authenticated users on nursing pages */}
            {isNursingSchoolPage && isAuthenticated && (
              <li>
                <Link
                  href="/student/dashboard"
                  className={`px-3 py-2 rounded-lg text-[14px] font-semibold transition-all duration-200 flex items-center gap-2 ${
                    isScrolled 
                      ? "text-gray-800 hover:text-blue-600 hover:bg-blue-50/80" 
                      : "text-white hover:text-blue-100 hover:bg-white/10"
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Applications</span>
                </Link>
              </li>
            )}

            {/* Admin Links - Visible to unauthenticated users and admin users */}
            {showAdminButton && ADMIN_LINKS.map((link) => (
              <li key={link.key}>
                <Link
                  href={link.href}
                  className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 ${
                    isScrolled 
                      ? "bg-gray-600 text-white hover:bg-gray-700" 
                      : "bg-gray-600 text-white hover:bg-gray-700"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}

          </ul>

          {/* Right side buttons container */}
          <div className="flex items-center gap-2">
            {/* Dark Mode Toggle - Desktop and Mobile */}
            <button
              onClick={() => changeTheme(theme === 'light' ? 'dark' : 'light')}
              className={`focus:outline-none p-2 rounded-lg transition-all duration-300 ${
                isScrolled 
                  ? "text-gray-900 hover:bg-gray-100" 
                  : "text-white hover:bg-white/10"
              }`}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`lg:hidden focus:outline-none p-2 rounded-lg transition-all duration-300 relative ${
                isScrolled 
                  ? "text-gray-900 hover:bg-gray-100 bg-white/50" 
                  : "text-white hover:bg-white/20 bg-black/20"
              }`}
              aria-label="Toggle menu"
            >
              <Menu size={24} className="relative z-10" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] transition-opacity duration-300"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed top-0 right-0 h-screen w-80 bg-white dark:bg-gray-900 shadow-2xl transition-transform duration-500 ease-out z-[9999] overflow-y-auto ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
          {/* Menu Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">LAUTECH</h2>
                <p className="text-sm text-blue-100 mt-1">Teaching Hospital</p>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-300 hover:rotate-90"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Menu Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6 bg-white dark:bg-gray-900">
            <ul className="space-y-1 pb-6">
            {NAV_LINKS.map((link) => (
              <li key={link.key}>
                {link.subLinks ? (
                  // Parent item with sub-menu
                  <div>
                    <button
                      onClick={() => toggleMobileSubmenu(link.key)}
                      className="w-full flex items-center justify-between px-4 py-3.5 text-base font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 group"
                    >
                      <span>{link.label}</span>
                      <svg
                        className={`w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-all duration-300 ${
                          expandedItems.includes(link.key) ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {/* Sub-menu */}
                    <ul
                      className={`ml-4 mt-1 space-y-1 overflow-hidden transition-all duration-300 ${
                        expandedItems.includes(link.key) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      {link.subLinks.map((subLink) => (
                        <li key={subLink.key}>
                          <Link
                            href={subLink.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                            <span>{subLink.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  // Regular link without sub-menu
                  <Link
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3.5 text-base font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}

            {/* Divider */}
            <li className="my-4">
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            </li>

            {/* Authentication Links - Only show on nursing school pages */}
            {isNursingSchoolPage && AUTH_LINKS.map((link) => (
              <li key={link.key}>
                <Link
                  href={link.key === 'login' ? '/auth/login?redirect=/student/dashboard' : link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3.5 text-base font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}

            {/* My Applications - Show for authenticated users on nursing pages */}
            {isNursingSchoolPage && isAuthenticated && (
              <li>
                <Link
                  href="/student/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3.5 text-base font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                >
                  <User className="w-5 h-5" />
                  <span>My Applications</span>
                </Link>
              </li>
            )}

            {/* Admin Links - Visible to unauthenticated users and admin users */}
            {showAdminButton && ADMIN_LINKS.map((link) => (
              <li key={link.key}>
                <Link
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3.5 text-base font-semibold text-white bg-gray-600 hover:bg-gray-700 rounded-lg transition-all duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}

            {/* Divider */}
            <li className="my-4">
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            </li>

            {/* Dark Mode Toggle for Mobile */}
            <li>
              <button
                onClick={() => changeTheme(theme === 'light' ? 'dark' : 'light')}
                className="w-full flex items-center justify-between px-4 py-3.5 text-base font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
              >
                <span className="flex items-center gap-3">
                  {theme === 'light' ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                      <span>Dark Mode</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <span>Light Mode</span>
                    </>
                  )}
                </span>
                <div className={`w-10 h-5 rounded-full transition-colors ${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-200 mt-0.5 ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0.5'}`}></div>
                </div>
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

      {/* Slideshow - Only show on pages that should display slider */}
      {!shouldHideSlider && (
        <>
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
        </>
      )}
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
