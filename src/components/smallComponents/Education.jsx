import { X } from 'lucide-react';
import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../Firebase/firebase';

const Education = ({ selected, onClose }) => {
  const [school, setSchool] = useState('');
  const [primaryMajor, setPrimaryMajor] = useState('');
  const [secondaryMajor, setSecondaryMajor] = useState('');
  const [degreeType, setDegreeType] = useState('');
  const [graduationYear, setGraduationYear] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    const user = auth.currentUser;
    console.log(user)
    if (user) {
      const userRef = doc(db, 'users', user.uid);

      try {
        await updateDoc(userRef, {
          education: {
            school,
            primaryMajor,
            secondaryMajor,
            degreeType,
            graduationYear
          }
        });

        alert('Education details updated successfully!');
        onClose(); 
      } catch (error) {
        console.error('Error updating education details: ', error);
        alert('Failed to update education details. Please try again.');
      }
    } else {
      alert('User not authenticated');
    }
  };

  return (
    <div className={`fixed inset-0 w-screen h-screen ${selected ? 'flex' : 'hidden'} justify-center items-center bg-black bg-opacity-60`}>
      <div className="w-[60%] max-w-2xl h-[80%] bg-[#1e1e1e] relative p-8 rounded-lg shadow-lg">
        <X className="absolute top-4 right-4 cursor-pointer text-gray-400 hover:text-gray-200" onClick={onClose} />
        <h1 className="font-bold text-2xl text-white mb-4">Edit Credentials</h1>
        <p className="text-gray-400 mb-6">Credentials add credibility to your content</p>
        <hr className="border-gray-600 mb-6" />

        <form className="space-y-6 overflow-y-auto h-[65%]" onSubmit={handleSubmit}>
          <h5 className="font-semibold text-lg text-white mb-3 flex items-center">
            <i className="fa-solid fa-user-graduate text-yellow-500"></i>&nbsp; Add educational details
          </h5>
          <hr className="border-gray-600 mb-4" />

          <div className="mb-4">
            <label htmlFor="school" className="block text-sm font-medium text-gray-300">School</label>
            <input
              type="text"
              className="w-full mt-1 p-2 bg-[#2c2c2c] text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-600"
              id="school"
              placeholder="Enter your school"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="primary-major" className="block text-sm font-medium text-gray-300">Primary Major</label>
            <input
              type="text"
              className="w-full mt-1 p-2 bg-[#2c2c2c] text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-600"
              id="primary-major"
              placeholder="Enter your primary major"
              value={primaryMajor}
              onChange={(e) => setPrimaryMajor(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="secondary-major" className="block text-sm font-medium text-gray-300">Secondary Major</label>
            <input
              type="text"
              className="w-full mt-1 p-2 bg-[#2c2c2c] text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-600"
              id="secondary-major"
              placeholder="Enter your secondary major"
              value={secondaryMajor}
              onChange={(e) => setSecondaryMajor(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="degree-type" className="block text-sm font-medium text-gray-300">Degree Type</label>
            <input
              type="text"
              className="w-full mt-1 p-2 bg-[#2c2c2c] text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-600"
              id="degree-type"
              placeholder="M.F.A"
              value={degreeType}
              onChange={(e) => setDegreeType(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="graduation-year" className="block text-sm font-medium text-gray-300">Graduation Year</label>
            <input
              type="number"
              className="w-full mt-1 p-2 bg-[#2c2c2c] text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-600"
              id="graduation-year"
              placeholder="Enter your graduation year"
              value={graduationYear}
              onChange={(e) => setGraduationYear(e.target.value)}
              required
            />
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

export default Education;
