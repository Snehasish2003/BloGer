import { useEffect, useState } from "react";
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../Firebase/firebase';
import profilePlaceholder from "../assets/profile.jpg";
import { CircleHelp, SquarePen, Pencil } from 'lucide-react';
import Blog from "./Blog";
import CreatePost from "./smallComponents/CreatePost";
import HomeSkeleton from "./shimmer/Home/HomeSkeleton"; 
import { useLocation } from "react-router-dom";

const Home = () => {
  const [create, setCreate] = useState(false);
  const [profileImage, setProfileImage] = useState(profilePlaceholder);
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true); 
  const location=useLocation();
  const handleCreate = () => {
    setCreate(true);
  };

  const handleCloseCreate = () => {
    setCreate(false);
  };
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const postId = params.get('postId');

    if (postId) {
      const postElement = document.getElementById(postId);
      if (postElement) {
        postElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const currentUser = await getDoc(userRef);
        if (currentUser.exists()) {
          const userData = currentUser.data();
          setUser(userData);
          setUserId(user.uid);

          if (userData.photo) {
            setProfileImage(userData.photo);
          } else {
            setProfileImage(profilePlaceholder);
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

  if (loading) {
    return <HomeSkeleton />;
  }

  return (
    <div className='w-full flex flex-col items-center mt-16 '>
      <div className="w-full md:w-3/4 lg:w-1/2 bg-[#262626] mt-5 p-4">
        <div className="w-full flex items-center px-5">
          <img src={profileImage} alt="Profile" className="rounded-full w-10" />
          <div className="w-full bg-[#202020] rounded-3xl p-2 ml-2 cursor-pointer" onClick={handleCreate}>
            <p className="text-[#afb1b3] text-sm ml-2">
              What do you want to ask or share?
            </p>
          </div>
        </div>
        <div className="w-full flex justify-between items-center text-center mt-4">
          <div onClick={handleCreate} className="flex-1 flex justify-center items-center text-white text-sm p-2 gap-2 hover:bg-[#464748] hover:rounded-3xl cursor-pointer">
            <CircleHelp color="white" height={20} width={20} />Ask
          </div>
          <div onClick={handleCreate} className="flex-1 flex justify-center items-center text-white text-sm p-2 gap-2 hover:bg-[#464748] hover:rounded-3xl cursor-pointer">
            <SquarePen color="white" height={20} width={20} />News
          </div>
          <div onClick={handleCreate} className="flex-1 flex justify-center items-center text-white text-sm p-2 gap-2 hover:bg-[#464748] hover:rounded-3xl cursor-pointer">
            <Pencil color="white" height={20} width={20} />Post
          </div>
        </div>
      </div>
      <div className="w-full md:w-3/4 lg:w-1/2">
        <Blog />
      </div>
      <CreatePost selected={create} onClose={handleCloseCreate} />
    </div>
  );
};

export default Home;
