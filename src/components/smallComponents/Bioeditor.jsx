
import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../Firebase/firebase';

const BioEditor = ({ userId, initialBio, onClose }) => {
  const [bio, setBio] = useState(initialBio);

  const handleSave = async () => {
    try {
      console.log(bio,userId);
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { bio });
      onClose();
    } catch (error) {
      console.error("Error updating bio: ", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-white mb-4">Edit Bio</h2>
        <textarea
          className="w-full p-3 border border-gray-700 rounded bg-gray-800 text-white focus:outline-none focus:border-orange-500"
          rows="4"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        ></textarea>
        <div className="mt-4 flex justify-end">
          <button
            className="mr-2 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors duration-200"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors duration-200"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default BioEditor;
