"use client";

import { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const teamMembers = [
  {
    id: 1,
    name: "ThankGod Azubuike",
    position: "Chief Executive Officer",
    image: "/ceo.jpg",
    linkedin: "#",
    twitter: "#",
    bio: "ThankGod Azubuike is the visionary CEO of Restech, bringing over 3 years of experience in leading technology companies to success. With a passion for innovation and a commitment to excellence, ThankGod has spearheaded numerous projects that have transformed the tech landscape. His leadership style emphasizes collaboration, creativity, and a relentless pursuit of growth.",
  },
  {
    id: 2,
    name: "Jane Smith",
    position: "Chief Technology Officer",
    image: "/cto.jpeg",
    linkedin: "#",
    twitter: "#",
    bio: "Jane Smith, the CTO of Restech, is a technology enthusiast with a knack for developing innovative solutions. With a decade of experience in software engineering and system architecture, Jane has been instrumental in implementing cutting-edge technologies that drive efficiency and scalability. Her expertise lies in cloud computing, AI, and cybersecurity.",
  },
  {
    id: 3,
    name: "Michael Brown",
    position: "Head of Marketing",
    image: "/ceo.jpg",
    linkedin: "#",
    twitter: "#",
    bio: "Michael Brown is the dynamic Head of Marketing at Restech. With a strong background in digital marketing and brand strategy, Michael has successfully led campaigns that have significantly increased brand awareness and customer engagement. His creative approach and data-driven mindset make him a key player in Restech's growth.",
  },
  {
    id: 4,
    name: "Sarah Johnson",
    position: "Lead Developer",
    image: "/cto.jpeg",
    linkedin: "#",
    twitter: "#",
    bio: "Sarah Johnson is the Lead Developer at Restech, renowned for her expertise in building scalable and efficient systems. With a career spanning over 7 years, Sarah has contributed to the development of high-performing applications and platforms. Her dedication to clean code and innovative design has earned her recognition as a top developer in the industry.",
  },
];

const MeetOurStaff = () => {
  const [selectedMember, setSelectedMember] = useState(null);

  const handleClose = () => {
    setSelectedMember(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Navbar />

      {/* Hero Section */}
      <div
        className="relative w-full h-[300px] md:h-[400px] flex items-center justify-center text-white text-center bg-cover bg-center"
        style={{ backgroundImage: "url('/footer.jpg')" }}
      >
        <div className="absolute inset-0 bg-black "></div>
        <h1 className="relative text-4xl md:text-5xl font-bold">
          Meet Our Team
        </h1>
      </div>

      {/* Team Section */}
      <div className="container mx-auto px-6 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-8">
          Our Leadership Team
        </h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-10">
          Meet the talented professionals who drive our company's success.
        </p>

        {/* Team Members Grid */}
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="relative group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
              style={{ height: "400px", width: "350px" }} // Adjusted height for better layout
            >
              {/* Staff Image */}
              <div className="w-full h-2/3 relative">
                <Image
                  src={member.image}
                  fill
                  className="object-cover object-top" // Added object-top to focus on the top of the image
                  alt={member.name}
                />
              </div>

              {/* Card Content */}
              <div className="p-4 flex flex-col items-center justify-center h-1/3">
                <h3 className="text-lg font-bold text-gray-800">
                  {member.name}
                </h3>
                <p className="text-gray-600 text-sm">{member.position}</p>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-blue-100 bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => setSelectedMember(member)}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
                >
                  Read More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pop-Up Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Transparent Overlay */}
          <div
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.8)", // Black transparent overlay
              position: "absolute",
              inset: 0,
            }}
            onClick={handleClose}
          ></div>

          {/* Modal Content */}
          <div
            className="bg-white rounded-lg shadow-lg relative z-10 flex flex-col items-center justify-start overflow-y-auto"
            style={{
              height: "500px", // Slightly taller than the width
              width: "400px", // Fixed width
              padding: "20px",
            }}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            {/* Modal Content */}
            <div className="text-center">
              {/* Profile Image */}
              <div className="w-32 h-32 mx-auto mb-4 relative rounded-full overflow-hidden">
                <Image
                  src={selectedMember.image}
                  fill
                  className="object-cover"
                  alt={selectedMember.name}
                />
              </div>

              {/* Member Name */}
              <h3 className="text-xl font-bold text-gray-800">
                {selectedMember.name}
              </h3>

              {/* Member Position */}
              <p className="text-gray-600 text-sm">{selectedMember.position}</p>

              {/* Member Bio */}
              <p className="text-gray-700 mt-4">{selectedMember.bio}</p>

              {/* Social Media Links */}
              <div className="flex justify-center space-x-4 mt-4">
                <a
                  href={selectedMember.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 transition"
                >
                  <img
                    src="/instagram.svg"
                    alt="LinkedIn"
                    className="w-6 h-6"
                  />
                </a>
                <a
                  href={selectedMember.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-500 transition"
                >
                  <img src="/facebook.svg" alt="Facebook" className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default MeetOurStaff;
