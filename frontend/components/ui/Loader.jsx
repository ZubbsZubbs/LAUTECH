import React from 'react';

const Loader = ({ size = 'md', text = 'Loading...', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const containerClasses = fullScreen
    ? 'flex items-center justify-center min-h-[calc(100vh-160px)]'
    : 'flex items-center justify-center py-12';

  return (
    <div className={containerClasses}>
      <div className="text-center">
        <div className="relative inline-flex">
          {/* Outer ring */}
          <div className={`${sizeClasses[size]} rounded-full border-4 border-gray-200`}></div>
          {/* Spinning gradient ring */}
          <div className={`${sizeClasses[size]} rounded-full border-4 border-transparent border-t-blue-600 border-r-blue-500 animate-spin absolute top-0 left-0`}></div>
        </div>
        {text && (
          <p className="mt-3 text-sm text-gray-600 font-medium">{text}</p>
        )}
      </div>
    </div>
  );
};

export default Loader;

