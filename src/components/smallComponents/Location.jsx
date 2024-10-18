import { useState, useEffect } from 'react';
import { ArrowBigUp, ArrowBigDown, RefreshCcw } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../Firebase/firebase'; 

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [expandedTextIndex, setExpandedTextIndex] = useState(null);
  const [expandedImageIndex, setExpandedImageIndex] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsCollection = collection(db, 'posts');
        const postSnapshot = await getDocs(postsCollection);
        const postList = postSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(postList);
      } catch (error) {
        console.error("Error fetching posts: ", error);
      }
    };

    fetchPosts();
  }, []);

  const handleTextToggle = (index) => {
    setExpandedTextIndex(expandedTextIndex === index ? null : index);
  };

  const handleImageToggle = (index) => {
    setExpandedImageIndex(expandedImageIndex === index ? null : index);
  };

  return (
    <div>
      {posts.map((item, index) => (
        <div className="w-[50%] bg-[#262626] mt-2 pb-3" key={item.id}>
        
          <div className="w-full px-3">
            <p>
              {expandedTextIndex === index || item.text.length <= 300
                ? item.text
                : `${item.text.substring(0, 200)}...`}
              {item.text.length > 200 && (
                <span
                  className="text-blue-500 cursor-pointer hover:underline"
                  onClick={() => handleTextToggle(index)}
                >
                  {expandedTextIndex === index ? " Show less" : " Show more"}
                </span>
              )}
            </p>
          </div>
          
     
          {item.image && (
            <div className="w-full flex justify-center p-4 mt-1">
              <img
                src={item.image}
                alt="Post"
                className={
                  expandedImageIndex === index ? "w-full" : "w-[70%] h-[50%] cursor-pointer"
                }
                onClick={() => handleImageToggle(index)}
              />
            </div>
          )}
          
        
          <div className="w-full flex gap-3 items-center px-5 mt-1">
            <div className="w-[24%] bg-[#313131] rounded-3xl flex justify-center items-center">
              <div className="flex pr-2 hover:bg-slate-600 cursor-pointer text-sm ">
                <ArrowBigUp color="blue" />
                <p>upvote • 0</p> 
              </div>
              <ArrowBigDown className="cursor-pointer hover:text-blue-400" />
            </div>
            <div className="flex justify-center items-center hover:text-slate-600 cursor-pointer px-2">
              <RefreshCcw />
              <p>0</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Blog;
