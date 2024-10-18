import React from 'react';

const Shimmer = () => {
  return (
    <>

    <div className="flex items-center w-full max-w-md p-4 bg-[#262626] rounded-lg my-2 gap-5">
      <div className="rounded-full bg-gray-400 h-16 w-16 animate-pulse"></div>
      <div className="flex-1 space-y-3 py-1">
        <div className="h-4 bg-gray-400 rounded w-3/4 animate-pulse"></div>
        <div className="h-4 bg-gray-400 rounded w-5/6 animate-pulse"></div>
      </div>
    </div>
    <div className="flex items-center w-full max-w-md p-4 bg-[#262626] rounded-lg my-2 gap-5">
      <div className="rounded-full bg-gray-400 h-16 w-16 animate-pulse"></div>
      <div className="flex-1 space-y-3 py-1">
        <div className="h-4 bg-gray-400 rounded w-3/4 animate-pulse"></div>
        <div className="h-4 bg-gray-400 rounded w-5/6 animate-pulse"></div>
      </div>
    </div>
    <div className="flex items-center w-full max-w-md p-4 bg-[#262626] rounded-lg my-2 gap-5">
      <div className="rounded-full bg-gray-400 h-16 w-16 animate-pulse"></div>
      <div className="flex-1 space-y-3 py-1">
        <div className="h-4 bg-gray-400 rounded w-3/4 animate-pulse"></div>
        <div className="h-4 bg-gray-400 rounded w-5/6 animate-pulse"></div>
      </div>
    </div>
    </>
  );
};

export default Shimmer;
