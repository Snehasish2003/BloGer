import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Followers from '../components/Followers';
import { auth } from '../Firebase/firebase'; 

const FollowerPage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [showFollowers, setShowFollowers] = useState(true); 

  useEffect(() => {

    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe(); 
  }, []);

  const handleCloseFollowers = () => {
    setShowFollowers(false); 
  };

  if (!currentUser) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Navbar />
      {showFollowers && (
        <Followers 
          userId={currentUser.uid} 
          onClose={handleCloseFollowers} 
        />
      )}
    </>
  );
}

export default FollowerPage;
