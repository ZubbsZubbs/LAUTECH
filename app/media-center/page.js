import React from "react";

const MediaCenter = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-4xl font-bold text-blue-500 mb-4">
        Welcome to the Media Center
      </h1>
      <p className="text-lg text-gray-700 max-w-3xl mb-8">
        Explore our latest videos, articles, and resources to learn more about
        our innovative solutions and services.
      </p>

      {/* Video Section */}
      <div className="w-full max-w-4xl">
        <video
          controls
          className="w-full rounded-lg shadow-lg"
          poster="/video.jpg" // Optional: Thumbnail image for the video
        >
          <source src="/media-center.mp4" type="video/mp4" />
          <source src="/sample-video.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default MediaCenter;