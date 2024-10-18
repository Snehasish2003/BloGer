import React from 'react';
import './Blog/BlogSkeleton';

const ProfileSkeleton = () => {
    return (
        <div className='w-full flex flex-col md:flex-row justify-center mt-20'>
            <div className='w-full md:w-[60%] lg:w-[50%] p-4'>
                <div className='flex flex-col md:flex-row p-4 items-center'>
                    
                    <div className='relative md:w-[30%] w-full flex justify-center md:justify-start'>
                        <div className='shimmer-circle rounded-full w-32 h-32'></div>
                        <label className='absolute bottom-0 right--20 md:right--10 cursor-pointer bg-black p-1 rounded-full'>
                            <input
                                type='file'
                                accept='image/*'
                                className='hidden'
                            />
                        </label>
                    </div>
                    <div className='md:w-[70%] w-full text-center md:text-left'>
                        <div className='shimmer-block w-48 h-8 rounded mt-4'></div>
                        <div className='shimmer-block w-64 h-4 rounded mt-2'></div>
                        <div className='mt-4'>
                            <div className='shimmer-block w-24 h-4 rounded inline-block'></div>
                            <div className='shimmer-block w-24 h-4 rounded inline-block ml-2'></div>
                        </div>
                    </div>
                </div>

                <p className='border-y border-[#393839] p-3 text-lg mt-10'>Posts</p>
                <div className="w-full flex flex-col items-center">
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


            <div className='w-full md:w-[40%] lg:w-[27%] mt-10 md:mt-0 p-4'>
                <div className='border-b border-[#393839] py-3 flex justify-between text-sm'>
                    <div>Credentials & Highlights</div>
                    <div className='shimmer-block w-6 h-6 rounded-full'></div>
                </div>

                <div className='text-sm p-5'>
                    <ul className='space-y-2'>
                        <li className='flex gap-2 items-center'>
                            <div className='shimmer-block w-5 h-5'></div>
                            <div className='shimmer-block w-64 h-4 rounded'></div>
                        </li>
                        <li className='flex gap-2 items-center'>
                            <div className='shimmer-block w-5 h-5'></div>
                            <div className='shimmer-block w-64 h-4 rounded'></div>
                        </li>
                        <li className='flex gap-2 items-center'>
                            <div className='shimmer-block w-5 h-5'></div>
                            <div className='shimmer-block w-64 h-4 rounded'></div>
                        </li>
                        <li className='flex gap-2 items-center'>
                            <div className='shimmer-block w-5 h-5'></div>
                            <div className='shimmer-block w-64 h-4 rounded'></div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ProfileSkeleton;
