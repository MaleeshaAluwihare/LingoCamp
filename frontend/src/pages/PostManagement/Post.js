import React, { useState } from 'react';
import { FiHeart, FiMessageSquare, FiShare2, FiBookmark, FiMoreHorizontal } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';

const Post = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(post.comments);
  const [showAllComments, setShowAllComments] = useState(false);

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (comment.trim() === '') return;
    
    const newComment = {
      id: comments.length + 1,
      user: {
        name: 'You',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
      },
      text: comment,
      timestamp: 'Just now'
    };
    
    setComments([...comments, newComment]);
    setComment('');
  };

  const displayedComments = showAllComments ? comments : comments.slice(0, 2);

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-6">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-3">
          <img 
            src={post.user.avatar} 
            alt={post.user.name} 
            className="w-10 h-10 rounded-full object-cover border-2 border-blue-100"
          />
          <div>
            <h3 className="font-semibold text-gray-800">{post.user.name}</h3>
            <p className="text-xs text-gray-500">{post.timestamp}</p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <FiMoreHorizontal />
        </button>
      </div>

      {/* Post Content */}
      <div className="p-4">
        <p className="text-gray-800 mb-3">{post.text}</p>
        {post.image && (
          <img 
            src={post.image} 
            alt="Post content" 
            className="w-full h-auto rounded-lg object-cover mb-3"
          />
        )}
      </div>

      {/* Post Stats */}
      <div className="px-4 py-2 border-t border-b flex justify-between text-sm text-gray-500">
        <span>{likeCount} likes</span>
        <span>{comments.length} comments</span>
      </div>

      {/* Post Actions */}
      <div className="flex justify-around p-3 border-b">
        <button 
          onClick={handleLike}
          className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition-colors ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-gray-700'}`}
        >
          {isLiked ? <FaHeart className="text-red-500" /> : <FiHeart />}
          <span>Like</span>
        </button>
        <button className="flex items-center space-x-1 px-4 py-2 rounded-lg text-gray-500 hover:text-gray-700">
          <FiMessageSquare />
          <span>Comment</span>
        </button>
        <button className="flex items-center space-x-1 px-4 py-2 rounded-lg text-gray-500 hover:text-gray-700">
          <FiShare2 />
          <span>Share</span>
        </button>
        <button className="flex items-center space-x-1 px-4 py-2 rounded-lg text-gray-500 hover:text-gray-700">
          <FiBookmark />
          <span>Save</span>
        </button>
      </div>

      {/* Comments Section */}
      <div className="p-4">
        {displayedComments.map((comment) => (
          <div key={comment.id} className="flex space-x-3 mb-3">
            <img 
              src={comment.user.avatar} 
              alt={comment.user.name} 
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="font-semibold text-sm">{comment.user.name}</h4>
                <p className="text-gray-800 text-sm">{comment.text}</p>
              </div>
              <div className="flex space-x-3 mt-1 ml-3 text-xs text-gray-500">
                <span>{comment.timestamp}</span>
                <button className="hover:text-gray-700">Like</button>
                <button className="hover:text-gray-700">Reply</button>
              </div>
            </div>
          </div>
        ))}

        {comments.length > 2 && (
          <button 
            onClick={() => setShowAllComments(!showAllComments)}
            className="text-sm text-blue-600 hover:text-blue-800 mb-3"
          >
            {showAllComments ? 'Show fewer comments' : `View all ${comments.length} comments`}
          </button>
        )}

        {/* Comment Input */}
        <form onSubmit={handleCommentSubmit} className="flex items-center space-x-2 mt-3">
          <img 
            src="https://randomuser.me/api/portraits/women/44.jpg" 
            alt="Your profile" 
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="flex-1 relative">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full p-2 pl-3 pr-10 bg-gray-50 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
            <button 
              type="submit"
              disabled={!comment.trim()}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${comment.trim() ? 'text-blue-600' : 'text-gray-400'}`}
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Example usage with sample data
const PostSection = () => {
  const samplePost = {
    id: 1,
    user: {
      name: 'Alex Johnson',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    text: 'Just finished my first language lesson on LingoCamp! The interactive exercises made learning so much fun. Highly recommend trying it out!',
    image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    timestamp: '2 hours ago',
    likes: 24,
    comments: [
      {
        id: 1,
        user: {
          name: 'Maria Garcia',
          avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
        },
        text: 'That sounds amazing! Which language are you learning?',
        timestamp: '1 hour ago'
      },
      {
        id: 2,
        user: {
          name: 'Sam Wilson',
          avatar: 'https://randomuser.me/api/portraits/men/22.jpg'
        },
        text: 'I had the same experience last week. The platform is really intuitive.',
        timestamp: '45 minutes ago'
      }
    ]
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <Post post={samplePost} />
      
      {/* Additional posts would go here */}
      {/* <Post post={anotherPost} /> */}
    </div>
  );
};

export default PostSection;