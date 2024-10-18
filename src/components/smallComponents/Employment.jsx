import React, { useState } from 'react';
import { X } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../Firebase/firebase';

const Employment = ({ selected, onClose }) => {
  const [isCurrent, setIsCurrent] = useState(false);
  const [position, setPosition] = useState('');
  const [company, setCompany] = useState('');
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');
  const [openCreate, setOpenCreate] = useState(selected);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const user = auth.currentUser;
    if (user) {
      const employmentData = {
        position,
        company,
        startYear,
        endYear: isCurrent ? 'Present' : endYear,
        isCurrent,
      };
      
      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          employment: employmentData
        });
        onClose();
      } catch (error) {
        console.error('Error updating document: ', error);
      }
    }
  };

  return (
    <div
      className={`fixed inset-0 w-screen h-screen ${openCreate ? 'flex' : 'hidden'} justify-center items-center bg-black bg-opacity-60`}
    >
      <div className="w-[60%] max-w-2xl h-[80%] bg-[#1e1e1e] relative p-8 rounded-lg shadow-lg">
        <X className="absolute top-4 right-4 cursor-pointer text-gray-400 hover:text-gray-200" onClick={onClose} />
        <h1 className="font-bold text-2xl text-white mb-4">Edit Credentials</h1>
        <p className="text-gray-400 mb-6">Credentials add credibility to your content</p>
        <hr className="border-gray-600 mb-6" />

        <form className="space-y-6 overflow-y-auto h-[65%]" onSubmit={handleSubmit}>
          <h5 className="font-semibold text-lg text-white mb-3 flex items-center">
            <i className="fa-solid fa-briefcase text-yellow-500"></i>&nbsp; Add employment details
          </h5>
          <hr className="border-gray-600 mb-4" />

          <div className="mb-4">
            <label htmlFor="position" className="block text-sm font-medium text-gray-300">Position</label>
            <input
              type="text"
              className="w-full mt-1 p-2 bg-[#2c2c2c] text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-600"
              id="position"
              placeholder="Enter your position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="company" className="block text-sm font-medium text-gray-300">Company/Organization</label>
            <input
              type="text"
              className="w-full mt-1 p-2 bg-[#2c2c2c] text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-600"
              id="company"
              placeholder="Enter your company/organization"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="syear" className="block text-sm font-medium text-gray-300">Start year</label>
            <input
              type="number"
              className="w-full mt-1 p-2 bg-[#2c2c2c] text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-600"
              id="syear"
              placeholder="Enter start year"
              value={startYear}
              onChange={(e) => setStartYear(e.target.value)}
            />
          </div>

          <div className={`mb-4 ${isCurrent ? 'hidden' : ''}`}>
            <label htmlFor="eyear" className="block text-sm font-medium text-gray-300">End year</label>
            <input
              type="number"
              className="w-full mt-1 p-2 bg-[#2c2c2c] text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-600"
              id="eyear"
              placeholder="Enter end year"
              value={endYear}
              onChange={(e) => setEndYear(e.target.value)}
            />
          </div>

          <div className="flex items-center mb-4">
            <input
              className="h-4 w-4 text-blue-600 border-gray-600 bg-[#2c2c2c] rounded focus:ring-2 focus:ring-blue-600"
              type="checkbox"
              id="flexCheckDefault"
              checked={isCurrent}
              onChange={() => setIsCurrent(!isCurrent)}
            />
            <label className="ml-2 text-gray-300" htmlFor="flexCheckDefault">
              I currently work here
            </label>
          </div>

          <hr className="border-gray-600 mb-4" />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="bg-transparent border border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-white py-2 px-4 rounded-md"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Employment;
