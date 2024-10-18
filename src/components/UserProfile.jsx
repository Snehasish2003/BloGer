import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { auth, db } from '../Firebase/firebase';
import mailbox from "../assets/mailbox.webp";
import { BriefcaseBusiness, GraduationCap, MapPin, CalendarDays } from 'lucide-react';
import Posts from './Posts';
import ProfileSkeleton from './shimmer/ProfileSkeleton';

const UserProfile = () => {
  const { userId } = useParams();  
  const [user, setUser] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0); 
  const [monthYear, setMonthYear] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          setCurrentUser(user);
          const currentUserDoc = await getDoc(doc(db, 'users', user.uid));
          if (currentUserDoc.exists()) {
            const currentUserData = currentUserDoc.data();
            setIsFollowing(currentUserData.following?.includes(userId));
            setFollowingCount(currentUserData.following?.length || 0); 
          }
        }
      });

      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUser(userData);
        setFollowersCount(userData.followers?.length || 0);

        if (userData.joinedAt?.seconds) {
          const joinDate = new Date(userData.joinedAt.seconds * 1000);
          const formattedMonthYear = joinDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
          });
          setMonthYear(formattedMonthYear);
        }
      } else {
        console.log('User does not exist');
      }
      setLoading(false);

      return () => unsubscribe();
    };

    fetchData();
  }, [userId]);

  const handleFollow = async () => {
    if (currentUser) {
      const currentUserRef = doc(db, 'users', currentUser.uid);
      const targetUserRef = doc(db, 'users', userId);

      if (isFollowing) {
        await updateDoc(currentUserRef, {
          following: arrayRemove(userId),
        });

        await updateDoc(targetUserRef, {
          followers: arrayRemove(currentUser.uid),
        });

        setIsFollowing(false);
        setFollowersCount(followersCount - 1);
      } else {
        await updateDoc(currentUserRef, {
          following: arrayUnion(userId),
        });

        await updateDoc(targetUserRef, {
          followers: arrayUnion(currentUser.uid),
        });

        setIsFollowing(true);
        setFollowersCount(followersCount + 1);
      }
    }
  };
  if (loading) {
    return <ProfileSkeleton />;
  }


  return (
    <div className='w-full flex flex-col lg:flex-row justify-center mt-20'>
      <div className='w-full lg:w-[50%] px-4 lg:px-0'>
        <div className='flex flex-col lg:flex-row p-4 lg:p-8 items-center lg:items-start'>
          <div className='w-full lg:w-[30%] flex justify-center lg:justify-start mb-4 lg:mb-0'>
            <img src={user.photo || mailbox} className='w-24 lg:w-32 rounded-full' alt="Profile" />
          </div>
          <div className='w-full lg:w-[70%]'>
            <h3 className='text-2xl lg:text-3xl font-bold text-center lg:text-left'>
              {`${user.firstName || ''} ${user.lastName || ''}`}
            </h3>
            <p className='text-gray-500 text-md text-center lg:text-left'>
              {user.bio || 'No bio available'}
            </p>
            <div className='flex justify-center lg:justify-start mt-4'>
              <span className='cursor-pointer'>{followersCount} followers</span>{' '}
              <span className='cursor-pointer ml-4'>{followingCount} following</span> 
              {currentUser && currentUser.uid !== userId && (
                <button
                  onClick={handleFollow}
                  className={`ml-4 px-4 py-2 rounded ${isFollowing ? 'bg-gray-600' : 'bg-blue-600'} text-white`}
                >
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </button>
              )}
            </div>
          </div>
        </div>
        <p className='p-4 lg:p-8 text-md text-center lg:text-left'>
          {user.description || 'No description available'}
        </p>
        <p className='border-y border-[#393839] p-3 text-lg mt-6 lg:mt-10 text-center lg:text-left'>Posts</p>
        <Posts userId={userId} currentUserId={currentUser.uid} />
      </div>

      <div className='w-full lg:w-[27%] lg:ml-16 mt-10 lg:mt-0 px-4 lg:px-0'>
        <div className='border-b border-[#393839] py-3 flex justify-center lg:justify-between text-sm'>
          <div>Credentials & Highlights</div>
        </div>

        <div className='text-sm p-5'>
          <ul className='space-y-2'>
            <li className='flex gap-2 items-center'>
              <BriefcaseBusiness />
              {user.employment?.position ? (
                <p>
                  {user.employment.position} at {user.employment.company} ({user.employment.startYear} - {user.employment.endYear || 'Present'})
                </p>
              ) : (
                <p className='text-gray-500'>No employment credential available</p>
              )}
            </li>
            <li className='flex gap-2 items-center'>
              <GraduationCap />
              {user.education?.school ? (
                <p>
                  {user.education.school}, {user.education.location} - {user.education.degreeType} ({user.education.graduationYear})
                </p>
              ) : (
                <p className='text-gray-500'>No education credential available</p>
              )}
            </li>
            <li className='flex gap-2 items-center'>
              <MapPin />
              {user.address?.location ? (
                <p>
                  {user.address.location} ({user.address.startYear} - {user.address.endYear})
                </p>
              ) : (
                <p className='text-gray-500'>No location credential available</p>
              )}
            </li>
            <li className='flex gap-2 items-center'>
              <CalendarDays />
              <p>Joined {monthYear}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
