"use client";

import { useState } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { FaBriefcase, FaUniversity, FaUserTie, FaBuilding, FaTimes, FaEnvelope, FaPhone } from "react-icons/fa";

const boardMembers = [
  {
    id: 1,
    name: "Prof. Adewale Oladipo",
    position: "Chairman, Board of Directors",
    qualifications: "PhD, FAS, FNIM",
    tenure: "2020 - Present",
    image: "/ceo.jpg",
    description: "Distinguished academic and healthcare administrator with over 30 years of experience in medical education and hospital governance."
  },
  {
    id: 2,
    name: "Dr. Amina Mohammed",
    position: "Vice Chairman",
    qualifications: "MD, MBA, FWACP",
    tenure: "2021 - Present",
    image: "/s1.jpg",
    description: "Renowned healthcare strategist with extensive experience in hospital management and public health policy."
  },
  {
    id: 3,
    name: "Chief Oluwaseun Bankole",
    position: "Board Member",
    qualifications: "LLB, BL, SAN",
    tenure: "2019 - Present",
    image: "/cto.jpeg",
    description: "Senior Advocate of Nigeria with expertise in healthcare law, corporate governance, and regulatory compliance."
  },
  {
    id: 4,
    name: "Prof. Grace Adeyemi",
    position: "Board Member",
    qualifications: "PhD, FMCN, FRCP",
    tenure: "2020 - Present",
    image: "/s3.jpg",
    description: "Leading medical researcher and educator specializing in internal medicine and healthcare quality improvement."
  },
  {
    id: 5,
    name: "Engr. Ibrahim Yusuf",
    position: "Board Member",
    qualifications: "B.Eng, MSc, FNSE",
    tenure: "2021 - Present",
    image: "/s2.jpg",
    description: "Infrastructure and facilities management expert with focus on hospital operations and medical technology."
  },
  {
    id: 6,
    name: "Mrs. Folake Adebayo",
    position: "Board Member",
    qualifications: "BSc, MBA, FCA",
    tenure: "2020 - Present",
    image: "/s4.jpg",
    description: "Chartered Accountant with extensive experience in healthcare finance, budgeting, and financial sustainability."
  },
  {
    id: 7,
    name: "Dr. Chukwuma Okonkwo",
    position: "Board Member",
    qualifications: "MD, MPH, FWACP",
    tenure: "2022 - Present",
    image: "/s5.jpg",
    description: "Public health physician and community health advocate with focus on healthcare accessibility and equity."
  },
  {
    id: 8,
    name: "Alhaji Musa Abdullahi",
    position: "Board Member",
    qualifications: "BSc, MSc, FCIB",
    tenure: "2019 - Present",
    image: "/s6.jpg",
    description: "Banking and finance professional with expertise in healthcare investment and institutional development."
  }
];

const BoardOfDirectors = () => {
  const [selectedMember, setSelectedMember] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div className="relative w-full pt-32 pb-20 bg-black flex items-center justify-center text-white text-center">
        <div className="relative z-10">
          <h1 className="text-5xl font-bold mb-4 animate-fade-in-up">
            Board of Directors
          </h1>
          <p className="text-xl mb-6 animate-fade-in-up delay-200">
            Leadership committed to excellence in healthcare and medical education
          </p>
        </div>
      </div>

      {/* Board Members Grid */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Strategic Leadership & Governance
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our Board of Directors brings diverse expertise and strategic vision to guide LAUTECH Teaching Hospital towards excellence in healthcare delivery, medical education, and research.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {boardMembers.map((member, index) => (
            <div
              key={member.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              style={{
                animationDelay: `${index * 0.1}s`,
                animation: "fadeInUp 0.6s ease-out forwards"
              }}
            >
              {/* Image with padding */}
              <div className="p-6 bg-gradient-to-br from-blue-100 via-blue-50 to-white">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover rounded-lg shadow-lg"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-black mb-2">{member.name}</h3>
                <p className="text-black font-semibold text-sm mb-6">{member.position}</p>

                {/* View Profile Button */}
                <button
                  onClick={() => setSelectedMember(member)}
                  className="w-full py-2.5 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold text-sm transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Board Values */}
      <div className="bg-blue-50 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Our Governance Principles
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUserTie className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Strategic Vision</h3>
              <p className="text-gray-600">
                Guiding the hospital with long-term strategic planning and sustainable growth initiatives.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaBuilding className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Institutional Excellence</h3>
              <p className="text-gray-600">
                Committed to maintaining the highest standards in healthcare delivery and medical education.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUniversity className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Accountability</h3>
              <p className="text-gray-600">
                Ensuring transparency, ethical governance, and responsible stewardship of resources.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Profile Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in relative scrollbar-hide">
            {/* Modal Header */}
            <div className="sticky top-0 bg-black text-white p-6 rounded-t-2xl flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold mb-1">{selectedMember.name}</h2>
                <p className="text-gray-300">{selectedMember.position}</p>
              </div>
              <button
                onClick={() => setSelectedMember(null)}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Image */}
              <div className="mb-6">
                <img
                  src={selectedMember.image}
                  alt={selectedMember.name}
                  className="w-full h-80 object-cover rounded-xl shadow-lg"
                />
              </div>

              {/* Details Grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start mb-2">
                    <FaUniversity className="text-blue-600 text-xl mr-3 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Qualifications</h3>
                      <p className="text-gray-700 text-sm">{selectedMember.qualifications}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start mb-2">
                    <FaBriefcase className="text-blue-600 text-xl mr-3 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Tenure</h3>
                      <p className="text-gray-700 text-sm">{selectedMember.tenure}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 text-lg mb-3">About</h3>
                <p className="text-gray-700 leading-relaxed">{selectedMember.description}</p>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedMember(null)}
                className="w-full py-3 px-6 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardOfDirectors;
