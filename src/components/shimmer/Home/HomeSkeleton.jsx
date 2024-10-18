import React from 'react';
import './HomeSkeleton.css'; 

const HomeBlogSkeleton = () => {
  return (
    <div className='flex flex-col items-center mt-16 w-full'>
      <div className="w-full md:w-3/4 lg:w-1/2 bg-[#262626] mt-5 p-4">
        <div className="w-full flex items-center px-5">
          <div className="shimmer-circle rounded-full w-10 h-10"></div>
          <div className="w-full bg-[#202020] rounded-3xl p-2 ml-2 shimmer-block h-8"></div>
        </div>

        <div className="w-full flex justify-between items-center text-center mt-4">
          <div className="flex-1 flex justify-center items-center text-white text-sm p-2 gap-2 shimmer-block h-8 rounded-3xl"></div>
          <div className="flex-1 flex justify-center items-center text-white text-sm p-2 gap-2 shimmer-block h-8 rounded-3xl"></div>
          <div className="flex-1 flex justify-center items-center text-white text-sm p-2 gap-2 shimmer-block h-8 rounded-3xl"></div>
        </div>
      </div>

      <div className="w-full md:w-3/4 lg:w-1/2 flex flex-col items-center">
        {[1, 2, 3].map((_, index) => (
          <div className="w-full bg-[#262626] mt-2 pb-3" key={index}>
            <div className="flex items-center p-3">
              <div className="shimmer-circle rounded-full w-10 h-10"></div>
              <div className="ml-4 flex-1">
                <div className="shimmer-block w-24 h-4 rounded"></div>
              </div>
            </div>
            <div className="px-3">
              <div className="shimmer-block w-full h-4 rounded mt-1"></div>
              <div className="shimmer-block w-full h-4 rounded mt-1"></div>
              <div className="shimmer-block w-2/3 h-4 rounded mt-1"></div>
            </div>
            <div className="w-full flex justify-center p-4 mt-1">
              <div className="shimmer-block w-[70%] h-36 rounded"></div>
            </div>
            <div className="px-3 text-sm">
              <div className="flex justify-between">
                <div className="shimmer-block w-16 h-4 rounded"></div>
                <div className="shimmer-block w-16 h-4 rounded"></div>
              </div>
            </div>
            <div className="flex gap-3 items-center px-5 mt-1">
              <div className="shimmer-block w-20 h-8 rounded-3xl"></div>
              <div className="shimmer-block w-16 h-8 rounded-3xl"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeBlogSkeleton;
