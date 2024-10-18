import { useState, useEffect } from 'react';
import { ArrowBigUp, ArrowBigDown, RefreshCcw, MoreHorizontal } from 'lucide-react';
import { db } from '../Firebase/firebase';
import { collection, getDocs, doc, getDoc, updateDoc, increment, arrayUnion, query, where, deleteDoc } from 'firebase/firestore';
import ShareButtons from './smallComponents/shareButtons';

const Posts = ({ userId, currentUserId }) => {
  const [expandedTextIndex, setExpandedTextIndex] = useState(null);
  const [expandedImageIndex, setExpandedImageIndex] = useState(null);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState({});
  const [showDeleteOptions, setShowDeleteOptions] = useState(false);


  useEffect(() => {
    const fetchPostsAndUsers = async () => {
      const postsCollection = collection(db, 'posts');
      const postsQuery = query(postsCollection, where('uid', '==', userId));
      const postsSnapshot = await getDocs(postsQuery);
      const postsList = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const userIds = Array.from(new Set(postsList.map(post => post.uid)));
      const usersData = {};
      for (const uid of userIds) {
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (userDoc.exists()) {
          usersData[uid] = userDoc.data();
        }
      }

      setPosts(postsList);
      setUsers(usersData);
    };

    fetchPostsAndUsers();
  }, [userId]);

  const handleTextToggle = (index) => {
    setExpandedTextIndex(expandedTextIndex === index ? null : index);
  };

  const handleImageToggle = (index) => {
    setExpandedImageIndex(expandedImageIndex === index ? null : index);
  };

  const handleUpvote = async (postId, currentVotes, upvotedBy) => {
    const currentUserId = 'user123';

    if (upvotedBy.includes(currentUserId)) {
      alert('You have already upvoted this post.');
      return;
    }

    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        votes: increment(1),
        upvotedBy: arrayUnion(currentUserId),
      });
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId ? { ...post, votes: currentVotes + 1, upvotedBy: [...upvotedBy, currentUserId] } : post
        )
      );
    } catch (error) {
      console.error('Error upvoting post:', error);
    }
  };

  const handleShare = async (postId, currentShares, sharedBy) => {
    const currentUserId = currentUserId;
    if (sharedBy.includes(currentUserId)) {
      return;
    }

    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        shares: increment(1),
        sharedBy: arrayUnion(currentUserId),
      });
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId ? { ...post, shares: currentShares + 1, sharedBy: [...sharedBy, currentUserId] } : post
        )
      );
    } catch (error) {
      console.error('Error sharing post:', error);
    }
  };

  const handleDelete = async (postId) => {
    try {
      await deleteDoc(doc(db, 'posts', postId));
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
      alert('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const toggleDeleteOption = (postId) => {
    setShowDeleteOptions(prev => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  return (
    <div>
      {posts.map((item, index) => {
        const userData = users[item.uid] || {};
        return (
          <div className="w-[100%] bg-[#262626] mt-2 pb-3" key={item.id}>
            <div className="flex items-center p-3 w-full">
              <img src={userData.photo || '/default-profile.png'} alt="" className="rounded-full w-10" />
              <div className="p-4">
                <h3 className="text-white text-sm font-semibold flex gap-2">
                  {(userData.firstName + " " + userData.lastName) || 'Anonymous'}
                </h3>
              </div>
              <div className="ml-auto relative">
                {(item.uid === currentUserId) && <MoreHorizontal
                  className="cursor-pointer text-white"
                  onClick={() => toggleDeleteOption(item.id)}
                />}
                {(item.uid === currentUserId) && showDeleteOptions[item.id] && (
                  <div className="absolute right-0 bg-black text-white p-2 rounded shadow-lg z-10">
                    <button
                      className="hover:text-red-500"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete Post
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="w-full px-3">

              <p
                dangerouslySetInnerHTML={{
                  __html:
                    expandedTextIndex === index || item.text.length <= 300
                      ? item.text
                      : `${item.text.substring(0, 200)}...`
                }}
              />
              {item.text.length > 200 && (
                <span
                  className="text-blue-500 cursor-pointer hover:underline"
                  onClick={() => handleTextToggle(index)}
                >
                  {expandedTextIndex === index ? ' Show less' : ' Show more'}
                </span>
              )}
            </div>
            <div className="w-full flex justify-center p-4 mt-1">
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt="post"
                  className={expandedImageIndex === index ? 'w-full' : 'w-[70%] h-[50%] cursor-pointer'}
                  onClick={() => handleImageToggle(index)}
                />
              )}
            </div>
            <div className="w-full flex items-center mt-1 px-3 text-sm">
              <p>{item.votes} upvotes • </p>
              <p>{item.shares} shares </p>
            </div>
            <div className="w-full flex gap-3 items-center px-5 mt-1">
              <div className="w-[24%] bg-[#313131] rounded-3xl flex justify-center items-center">
                <div
                  className="flex pr-2 hover:bg-slate-600 cursor-pointer text-sm"
                  onClick={() => handleUpvote(item.id, item.votes, item.upvotedBy || [])}
                >
                  <ArrowBigUp color="blue" />
                  <p>upvote • {item.votes}</p>
                </div>
                <ArrowBigDown className="cursor-pointer hover:text-blue-400" />
              </div>
              <div
                className="flex justify-center items-center hover:text-slate-600 cursor-pointer px-2"
                onClick={() => handleShare(item.id, item.shares, item.sharedBy || [])}
              >
                <ShareButtons
                  url={`http://localhost:5173/home?postId=${item.id}`}
                  title={item.text.substring(10, 100)}
                />
                <p>{item.shares}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Posts;
