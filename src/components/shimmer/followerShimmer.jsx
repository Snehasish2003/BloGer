import React from 'react';

const ShimmerFollower = () => {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-800 transition rounded-md mb-2">
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-full bg-gray-400 animate-pulse"></div>
        <div className="ml-4 space-y-2">
          <div className="w-32 h-4 bg-gray-400 rounded animate-pulse"></div>
          <div className="w-48 h-3 bg-gray-400 rounded animate-pulse"></div>
        </div>
      </div>
      <div className="w-20 h-8 bg-gray-400 rounded-full animate-pulse"></div>
    </div>
  );
};

export default ShimmerFollower;
