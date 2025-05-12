import React, { useState } from 'react';
import { FiUserPlus } from 'react-icons/fi';

const ProfileWithFriendButton = ({ user }) => {
  const [isFriend, setIsFriend] = useState(false);
  const [isRequestSent, setIsRequestSent] = useState(false);

  const handleAddFriend = () => {
    // Here you would typically make an API call to send friend request
    setIsRequestSent(true);
    setTimeout(() => {
      setIsFriend(true);
      setIsRequestSent(false);
    }, 1500); // Simulate API response delay
  };

  return (
    <div className="flex items-center space-x-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
      {/* Profile Image */}
      <div className="relative">
        <img 
          src={user.avatar} 
          alt={user.name} 
          className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
        />
        
        {/* Online Status Indicator (optional) */}
        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
      </div>
      
      {/* User Info */}
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800">{user.name}</h3>
        <p className="text-sm text-gray-500">{user.title || 'Language Learner'}</p>
      </div>
      
      {/* Add Friend Button */}
      {isFriend ? (
        <span className="px-4 py-2 text-sm text-gray-500">Friends</span>
      ) : (
        <button
          onClick={handleAddFriend}
          disabled={isRequestSent}
          className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition-all ${
            isRequestSent 
              ? 'bg-blue-100 text-blue-600' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isRequestSent ? (
            'Request Sent'
          ) : (
            <>
              <FiUserPlus className="w-4 h-4" />
              <span>Add Friend</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};

// Example usage
const FriendProfileExample = () => {
  const sampleUser = {
    name: 'Alex Johnson',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    title: 'Spanish Tutor'
  };

  return (
    <div className="max-w-md mx-auto py-6 px-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Suggested Friends</h2>
      <ProfileWithFriendButton user={sampleUser} />
      
      {/* Additional profiles would go here */}
      {/* <ProfileWithFriendButton user={anotherUser} /> */}
    </div>
  );
};

export default FriendProfileExample;