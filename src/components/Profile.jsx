import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../Firebase/firebase'; 
import mailbox from "../assets/mailbox.webp";
import { Pencil, BriefcaseBusiness, GraduationCap, MapPin, CalendarDays, Camera } from 'lucide-react'; // Added Camera icon
import CreatePost from './smallComponents/CreatePost';
import { Cloudinary } from 'cloudinary-core';
import EditCredential from './smallComponents/EditCridentials';
import Education from './smallComponents/Education';
import Location from './smallComponents/Location';
import Employment from './smallComponents/Employment';
import Posts from './Posts';
import Followers from './Followers';
import BioEditor from './smallComponents/Bioeditor';
import { toast } from 'react-toastify'; 
import ProfileSkeleton from './shimmer/ProfileSkeleton';

const cloudinary = new Cloudinary({
  cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,  
});

const Profile = () => {
  const [user, setUser] = useState({});
  const [editBio, setEditBio] = useState(false);
  const [create, setCreate] = useState(false);
  const [edit, setEdit] = useState(false);
  const [monthYear, setMonthYear] = useState('');
  const [credential, setCredential] = useState(null);
  const [location, setLocation] = useState(null);
  const [education, setEducation] = useState({});
  const [employment, setEmployment] = useState({});
  const [showFollowers, setShowFollowers] = useState(false);
  const [userId, setUserId] = useState('');
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const currentUser = await getDoc(userRef);
        if (currentUser.exists()) {
          const userData = currentUser.data();
          setUser(userData);
          setUserId(user.uid);

          setLocation(userData.address || {});
          setEducation(userData.education || {});
          setEmployment(userData.employment || {});

          setFollowersCount(userData.followers?.length || 0);
          setFollowingCount(userData.following?.length || 0);

          setIsFollowing(userData.following?.includes(userId));

          if (userData.joinedAt?.seconds) {
            const joinDate = new Date(userData.joinedAt.seconds * 1000);
            const formattedMonthYear = joinDate.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
            });
            setMonthYear(formattedMonthYear);
          }
        } else {
          console.log("No such document");
        }
      } else {
        console.log("User does not exist");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const handleFollow = async () => {
    if (auth.currentUser) {
      const currentUserRef = doc(db, 'users', auth.currentUser.uid);
      const userRef = doc(db, 'users', userId);

      if (isFollowing) {
        await updateDoc(currentUserRef, {
          following: arrayRemove(userId),
        });
        await updateDoc(userRef, {
          followers: arrayRemove(auth.currentUser.uid),
        });

        setIsFollowing(false);
        setFollowersCount(followersCount - 1);
        setFollowingCount(followingCount - 1);
      } else {
        await updateDoc(currentUserRef, {
          following: arrayUnion(userId),
        });
        await updateDoc(userRef, {
          followers: arrayUnion(auth.currentUser.uid),
        });

        setIsFollowing(true);
        setFollowersCount(followersCount + 1);
        setFollowingCount(followingCount + 1);
      }
    }
  };


  const handleImageUpload = (file) => {
    setImageUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'Blogger');

    return fetch(
      `https://api.cloudinary.com/v1_1/${cloudinary.config().cloud_name}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setImageUploading(false);
        if (data.secure_url) {
          setImageUrl(data.secure_url);

          
          const userRef = doc(db, "users", userId);
          updateDoc(userRef, {
            photo: data.secure_url,
          });

          setUser((prevUser) => ({ ...prevUser, photo: data.secure_url }));
          toast.success('Image uploaded successfully!');
          return data.secure_url;
        } else {
          throw new Error(data.error.message);
        }
      })
      .catch((error) => {
        setImageUploading(false);
        console.error('Error uploading image:', error);
        toast.error('Failed to upload image. Please try again.');
        return null;
      });
  };
  if (loading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className='w-full flex flex-col md:flex-row justify-center mt-20'>
      <div className='w-full md:w-[60%] lg:w-[50%] p-4'>
        {showFollowers && <Followers userId={auth.currentUser.uid} onClose={() => setShowFollowers(false)} />}
        <div className='flex flex-col md:flex-row p-4 items-center'>
          <div className='relative md:w-[30%] w-full flex justify-center md:justify-start'>
            <img src={user.photo || mailbox} className='w-32 rounded-full' alt="Profile" />
            <label className='absolute bottom-0 right--20 md:right--10 cursor-pointer bg-black p-1 rounded-full'>
              <Camera  />
              <input 
                type='file' 
                accept='image/*' 
                className='hidden' 
                onChange={(e) => handleImageUpload(e.target.files[0])} 
              />
            </label>
          </div>
          <div className='md:w-[70%] w-full text-center md:text-left'>
            <h3 className='text-2xl md:text-3xl font-bold'>
              {`${user.firstName || ''} ${user.lastName || ''}`}
            </h3>
            <p
              className='text-gray-500 hover:underline cursor-pointer text-md mt-2 md:mt-0'
              onClick={() => setEditBio(true)}
            >
              {user.bio || 'Add a bio'}
            </p>
            <div className='mt-4'>
              <span
                className='cursor-pointer hover:underline'
                onClick={() => setShowFollowers(true)}
              >
                {followersCount} followers
              </span>{' '}
              <span
                className='cursor-pointer hover:underline ml-2'
                onClick={() => setShowFollowers(true)}
              >
                {followingCount} following
              </span>
              {auth.currentUser && auth.currentUser.uid !== userId && (
                <button
                  onClick={handleFollow}
                  className={`ml-4 px-4 py-2 mt-4 md:mt-0 rounded ${isFollowing ? 'bg-gray-600' : 'bg-blue-600'} text-white`}
                >
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </button>
              )}
            </div>
          </div>
        </div>

        <p className='border-y border-[#393839] p-3 text-lg mt-10'>Posts</p>
        <Posts userId={userId} currentUserId={userId} />
      </div>

      <div className='w-full md:w-[40%] lg:w-[27%] mt-10 md:mt-0 p-4'>
        <div className='border-b border-[#393839] py-3 flex justify-between text-sm'>
          <div>Credentials & Highlights</div>
          <div
            className='rounded-full border border-[#393839] p-1 cursor-pointer'
            onClick={() => setEdit(true)}
          >
            <Pencil color='#ecedee' height={15} width={15} />
          </div>
        </div>

        <div className='text-sm p-5'>
          <ul className='space-y-2'>
            <li className='flex gap-2 items-center'>
              <BriefcaseBusiness />
              {employment?.position ? (
                <p>
                  {employment.position} at {employment.company} ({employment.startYear} - {employment.endYear || 'Present'})
                </p>
              ) : (
                <p onClick={() => setCredential("Employment")} className='text-blue-500 cursor-pointer'>
                  Add employment credential
                </p>
              )}
            </li>
            <li className='flex gap-2 items-center'>
              <GraduationCap />
              {education?.degree ? (
                <p>{education.degree} from {education.school}</p>
              ) : (
                <p onClick={() => setCredential("Education")} className='text-blue-500 cursor-pointer'>
                  Add education credential
                </p>
              )}
            </li>
            <li className='flex gap-2 items-center'>
              <MapPin />
              {location?.city ? (
                <p>{location.city}, {location.state}, {location.country}</p>
              ) : (
                <p onClick={() => setCredential("Location")} className='text-blue-500 cursor-pointer'>
                  Add location credential
                </p>
              )}
            </li>
            <li className='flex gap-2 items-center'>
              <CalendarDays />
              <p>Joined {monthYear}</p>
            </li>
          </ul>
        </div>
      </div>

      {edit && <EditCredential closeModal={() => setEdit(false)} />}
      {credential === "Education" && <Education closeModal={() => setCredential(null)} />}
      {credential === "Location" && <Location closeModal={() => setCredential(null)} />}
      {credential === "Employment" && <Employment closeModal={() => setCredential(null)} />}
      {editBio && <BioEditor userId={userId}  onClose={() => setEditBio(false)} />}
    </div>
  );
};

export default Profile;
