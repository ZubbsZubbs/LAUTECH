import React from "react";

const StaticBackgroundPage = () => {
  return (
    <div className="mt-20 bg-[url('/video.jpg')] bg-cover bg-center bg-fixed min-h-[50vh] relative">
      {/* Content Section */}
      <div className="text-white min-h-[50vh] flex flex-col justify-center items-center px-6 text-center">
        <h1 className="text-5xl font-bold mb-6">Check Out Our Media Center</h1>
        <p className="text-lg max-w-3xl mb-8 font-bold">
          Explore our latest videos and resources...
        </p>
      </div>

      {/* Centralized Play Button */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex justify-center items-center">
        <a
          href="/media-center"
          className="bg-white text-blue-500 rounded-full p-6 shadow-lg hover:bg-blue-500 hover:text-white transition duration-300"
          aria-label="Go to Media Center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-10"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default StaticBackgroundPage;
