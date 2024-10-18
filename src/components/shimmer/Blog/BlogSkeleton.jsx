import React from 'react';
import './BlogSkeleton.css';

const BlogSkeleton = () => {
  return (
    <div className="flex flex-col items-center w-full max-w-2xl mt-20 mx-auto">
      {[1, 2, 3].map((item, index) => (
        <div className="w-full bg-[#262626] mt-2 pb-3" key={index}>
          <div className="flex items-center p-3">
            <div className="shimmer-circle rounded-full w-10 h-10"></div>
            <div className="ml-4 shimmer-line w-1/3 h-4"></div>
          </div>
          <div className="px-3">
            <div className="shimmer-line w-full h-5 mb-2"></div>
            <div className="shimmer-line w-3/4 h-5 mb-2"></div>
          </div>
          <div className="w-full flex justify-center p-4 mt-1">
            <div className="shimmer-block w-3/4 h-40"></div>
          </div>
          <div className="px-3 text-sm shimmer-line w-1/2 h-5"></div>
          <div className="flex gap-3 items-center px-5 mt-1">
            <div className="shimmer-line w-1/4 h-4"></div>
            <div className="shimmer-line w-1/4 h-4 ml-4"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlogSkeleton;
