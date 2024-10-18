import React, { useState, useEffect } from 'react';
import { db, auth } from '../Firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import Shimmer from './shimmer/notificationShimmer';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid);
      } else {
        setCurrentUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentUserId) return;

    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'notifications', currentUserId);
        const docSnap = await getDoc(docRef);
        const notificationsList = docSnap.exists() ? docSnap.data().notifications || [] : []; // Handle undefined data

        const usersData = {};
        await Promise.all(
          notificationsList.map(async (notification) => {
            if (notification.from && !usersData[notification.from]) {
              const userDoc = await getDoc(doc(db, 'users', notification.from));
              if (userDoc.exists()) {
                usersData[notification.from] = userDoc.data();
              }
            }
          })
        );

        setNotifications(notificationsList);
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [currentUserId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center mt-20">
        <h2 className="text-2xl font-bold my-4">Notifications</h2>
        <Shimmer />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mt-20">
      <h2 className="text-2xl font-bold my-4">Notifications</h2>
      {notifications.length === 0 ? (
        <p className="text-gray-500">You have no notifications.</p>
      ) : (
        notifications.map((notification, index) => {
          const user = users[notification.from];
          const userName = user ? `${user.firstName} ${user.lastName}` : 'Unknown User';
          return (
            <div
              key={index}
              className="w-full max-w-md p-4 bg-[#262626] rounded-lg my-2 gap-5 flex justify-center items-center"
            >
              <img src={user?.photo || '/placeholder.jpg'} alt="User" className="rounded-full w-16" />
              <p className="text-white">
                {userName} {notification.message}
              </p>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Notifications;
