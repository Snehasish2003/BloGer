import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../Firebase/firebase';
import ShimmerFollower from './shimmer/followerShimmer';
const Followers = ({ userId, onClose }) => {
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [activeTab, setActiveTab] = useState('followers');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowersAndFollowing = async () => {
      setLoading(true);
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.followers) {
          const followerDetails = await Promise.all(
            userData.followers.map(async (followerId) => {
              const followerRef = doc(db, 'users', followerId);
              const followerDoc = await getDoc(followerRef);
              return followerDoc.exists() ? followerDoc.data() : null;
            })
          );
          setFollowers(followerDetails.filter(f => f !== null));
        }
        if (userData.following) {
          const followingDetails = await Promise.all(
            userData.following.map(async (followingId) => {
              const followingRef = doc(db, 'users', followingId);
              const followingDoc = await getDoc(followingRef);
              return followingDoc.exists() ? followingDoc.data() : null;
            })
          );
          setFollowing(followingDetails.filter(f => f !== null));
        }
      }
      setLoading(false);
    };

    fetchFollowersAndFollowing();
  }, [userId]);

  return (
    <div className="fixed w-screen h-screen flex justify-center items-center top-0 left-0 bg-black bg-opacity-70 z-50">
      <div className="w-[90%] md:w-[60%] h-[80%] bg-[#1f1f1f] relative p-6 rounded-lg overflow-hidden shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-2xl font-bold hover:text-red-500 transition"
        >
          &times;
        </button>

        <div className="flex justify-between items-center border-b border-gray-600 pb-3">
          <button
            className={`w-1/2 text-center text-lg font-bold py-2 ${activeTab === 'followers' ? 'text-white border-b-2 border-red-500' : 'text-gray-400'}`}
            onClick={() => setActiveTab('followers')}
          >
            Followers ({followers.length})
          </button>
          <button
            className={`w-1/2 text-center text-lg font-bold py-2 ${activeTab === 'following' ? 'text-white border-b-2 border-red-500' : 'text-gray-400'}`}
            onClick={() => setActiveTab('following')}
          >
            Following ({following.length})
          </button>
        </div>

        <div className="overflow-y-auto mt-5 h-[70%]">
          {loading ? (
            <>
              <ShimmerFollower />
              <ShimmerFollower />
              <ShimmerFollower />
            </>
          ) : activeTab === 'followers' ? (
            followers.length > 0 ? (
              followers.map((follower, index) => (
                <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-800 transition rounded-md mb-2">
                  <div className="flex items-center">
                    <img
                      src={follower.photo || '/path/to/default/image.png'}
                      alt={follower.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="ml-4">
                      <p className="text-white font-semibold">{`${follower.firstName || ''} ${follower.lastName || ''}`}</p>
                      <p className="text-gray-400 text-sm">{follower.bio || 'No description available'}</p>
                    </div>
                  </div>
                  <button className="text-sm text-red-500 hover:text-white border border-red-500 hover:bg-red-500 rounded-full px-4 py-1 transition">
                    Remove
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No followers yet.</p>
            )
          ) : (
            following.length > 0 ? (
              following.map((follow, index) => (
                <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-800 transition rounded-md mb-2">
                  <div className="flex items-center">
                    <img
                      src={follow.photo || '/path/to/default/image.png'}
                      alt={follow.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="ml-4">
                      <p className="text-white font-semibold">{`${follow.firstName || ''} ${follow.lastName || ''}`}</p>
                      <p className="text-gray-400 text-sm">{follow.bio || 'No description available'}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">You are not following anyone yet.</p>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Followers;
