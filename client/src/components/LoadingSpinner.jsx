import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-200 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-indigo-600 rounded-full animate-spin absolute top-0 left-0 border-t-transparent"></div>
        </div>
        <p className="text-gray-600 font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner; 