import React from 'react';

const ButtonLoader = ({ size = 'sm', color = 'white' }) => {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const colorClasses = {
    white: 'border-white border-t-white/30',
    blue: 'border-blue-600 border-t-blue-600/30',
    gray: 'border-gray-600 border-t-gray-600/30',
    red: 'border-red-600 border-t-red-600/30',
    green: 'border-green-600 border-t-green-600/30'
  };

  return (
    <div 
      className={`${sizeClasses[size]} rounded-full border-2 ${colorClasses[color]} animate-spin`}
      style={{ borderTopColor: 'transparent' }}
    />
  );
};

export default ButtonLoader;

