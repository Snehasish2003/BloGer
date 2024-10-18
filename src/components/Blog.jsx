import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowBigUp, ArrowBigDown } from 'lucide-react';
import { db, auth } from '../Firebase/firebase';
import { collection, getDocs, doc, getDoc, updateDoc, arrayUnion, arrayRemove, increment } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import DOMPurify from 'dompurify';
import { notify } from './smallComponents/Notify';
import BlogSkeleton from './shimmer/Blog/BlogSkeleton';
import ShareButtons from './smallComponents/shareButtons';

const Blog = ({ category, ClassName }) => {
    const [expandedTextIndex, setExpandedTextIndex] = useState(null);
    const [expandedImageIndex, setExpandedImageIndex] = useState(null);
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState({});
    const [currentUserId, setCurrentUserId] = useState(null);
    const [currentUserData, setCurrentUserData] = useState({ following: [] });
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setCurrentUserId(user.uid);
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setCurrentUserData({
                        ...userData,
                        following: userData.following || []
                    });
                }
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchPostsAndUsers = async () => {
            const postsCollection = collection(db, 'posts');
            const postsSnapshot = await getDocs(postsCollection);
            let postsList = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            if (category) {
                postsList = postsList.filter(post => post.category === category);
            }

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
            setLoading(false);
        };

        fetchPostsAndUsers();
    }, [category]);

    if (loading) {
        return <BlogSkeleton />;
    }

    const handleTextToggle = (index) => {
        setExpandedTextIndex(expandedTextIndex === index ? null : index);
    };

    const handleImageToggle = (index) => {
        setExpandedImageIndex(expandedImageIndex === index ? null : index);
    };

    const handleUpvote = async (postId, currentVotes, upvotedBy) => {
        if (!currentUserId) return;
        if (upvotedBy.includes(currentUserId)) {
            alert('You have already upvoted this post.');
            return;
        }

        try {
            const postRef = doc(db, 'posts', postId);
            await updateDoc(postRef, {
                votes: increment(1),
                upvotedBy: arrayUnion(currentUserId)
            });
            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post.id === postId ? { ...post, votes: currentVotes + 1, upvotedBy: [...upvotedBy, currentUserId] } : post
                )
            );

            const postOwnerUid = posts.find(post => post.id === postId).uid;
            await notify(postOwnerUid, currentUserId, 'upvoted your post');
        } catch (error) {
            console.error('Error upvoting post:', error);
        }
    };

    const handleShare = async (postId, currentShares, sharedBy) => {
        if (!currentUserId) return;
        if (sharedBy.includes(currentUserId)) {
            return;
        }
        try {
            const postRef = doc(db, 'posts', postId);
            await updateDoc(postRef, {
                shares: increment(1),
                sharedBy: arrayUnion(currentUserId)
            });
            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post.id === postId ? { ...post, shares: currentShares + 1, sharedBy: [...sharedBy, currentUserId] } : post
                )
            );

            const postOwnerUid = posts.find(post => post.id === postId).uid;
            await notify(postOwnerUid, currentUserId, 'shared your post');
        } catch (error) {
            console.error('Error sharing post:', error);
        }
    };

    const handleProfileClick = (userId) => {
        navigate(`/profile/${userId}`);
    };

    const handleFollowToggle = async (postUserId) => {
        if (!currentUserId || !currentUserData) return;

        const isFollowing = currentUserData.following?.includes(postUserId);

        try {
            const currentUserRef = doc(db, 'users', currentUserId);
            const targetedUserRef = doc(db, 'users', postUserId);

            if (isFollowing) {
                await updateDoc(currentUserRef, {
                    following: arrayRemove(postUserId)
                });
                await updateDoc(targetedUserRef, {
                    followers: arrayRemove(currentUserId)
                });
            } else {
                await updateDoc(currentUserRef, {
                    following: arrayUnion(postUserId)
                });
                await updateDoc(targetedUserRef, {
                    followers: arrayUnion(currentUserId)
                });


                await notify(postUserId, currentUserId, 'started following you');
            }

            setUsers(prevUsers => ({
                ...prevUsers,
                [postUserId]: {
                    ...prevUsers[postUserId],
                    followedByCurrentUser: !isFollowing
                }
            }));

            setCurrentUserData(prevData => ({
                ...prevData,
                following: isFollowing
                    ? prevData.following?.filter(id => id !== postUserId) || []
                    : [...(prevData.following || []), postUserId]
            }));
        } catch (error) {
            console.error('Error updating follow status:', error);
        }
    };

    return (
        <div className={`flex flex-col items-center ${ClassName} `}>
            {posts.map((item, index) => {
                const userData = users[item.uid] || {};
                const isFollowing = currentUserData?.following?.includes(item.uid) || false;
                return (
                    <div id={item.id} className="w-full max-w-2xl bg-[#262626] mt-2 pb-3" key={item.id}>
                        <div className="flex items-center p-3">
                            <img src={userData.photo || '/default-profile.png'} alt="" className="rounded-full w-10 h-10" />
                            <div className="ml-4 flex items-center">
                                <h3
                                    className="text-white text-sm font-semibold cursor-pointer hover:underline"
                                    onClick={() => handleProfileClick(item.uid)}
                                >
                                    {(userData.firstName + " " + userData.lastName) || 'Anonymous'}
                                </h3>
                                {item.uid !== currentUserId && (
                                    <button
                                        onClick={() => { handleFollowToggle(item.uid); }}
                                        className={`ml-4 px-2 py-1 text-sm rounded-full ${isFollowing ? 'bg-gray-600 text-white' : 'bg-blue-500 text-white'}`}
                                    >
                                        {isFollowing ? 'Following' : 'Follow'}
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="px-3">
                            <p dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(
                                    expandedTextIndex === index || item.text.length <= 300
                                        ? item.text
                                        : `${item.text.substring(0, 200)}...`
                                )
                            }} />
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
                                    alt=""
                                    className={expandedImageIndex === index ? 'w-full' : 'w-[70%] h-[50%] cursor-pointer'}
                                    onClick={() => handleImageToggle(index)}
                                />
                            )}
                        </div>
                        <div className="px-3 text-sm">
                            <p>{item.votes} upvotes • </p>
                            <p>{item.shares} shares </p>
                        </div>
                        <div className="flex gap-3 items-center px-5 mt-1">
                            <div className="flex-grow bg-[#313131] rounded-3xl flex justify-center items-center">
                                <div
                                    className="flex pr-2 hover:bg-slate-600 cursor-pointer text-sm"
                                    onClick={() => handleUpvote(item.id, item.votes, item.upvotedBy || [])}
                                >
                                    <ArrowBigUp color="blue" />
                                    <p className="ml-1">upvote • {item.votes}</p>
                                </div>
                                <ArrowBigDown className="cursor-pointer hover:text-blue-400 ml-2" />
                            </div>
                            <div
                                className="flex justify-center items-center hover:text-slate-600 cursor-pointer px-2"
                                onClick={() => handleShare(item.id, item.shares, item.sharedBy || [])}
                            >
                                {/* <RefreshCcw /> */}
                                <ShareButtons
                                    url={`http://localhost:5173/home?postId=${item.id}`}
                                    title={item.text.substring(15, 100)}
                                />
                                <p className="ml-1">{item.shares}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Blog;
