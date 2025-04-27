// AllPosts.js
import React, { useState, useEffect } from "react";
import { fetchAllCompanyPosts } from "../services/apiService";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { FiUser } from 'react-icons/fi';
import axios from 'axios';

const AllPosts = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState(""); // New state for comment input

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const posts = await fetchAllCompanyPosts();
        console.log("Fetched posts:", posts); // 👈 Check console log
        setAllPosts(posts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Handle comment submission
  const handleCommentSubmit = async (postId) => {
    if (newComment.trim()) {
      try {
        // Make API call to submit the comment for the post
        await axios.post(`http://localhost:8081/lingocamp/api/posts/${postId}/comments`, {
          comment: newComment,
        });
        setNewComment(""); // Clear input field after submission
        // Optionally, you can refresh the posts or comments to show the new comment
        const updatedPosts = await fetchAllCompanyPosts();
        setAllPosts(updatedPosts);
      } catch (error) {
        console.error('Error submitting comment:', error);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-8">
      <div className="flex justify-center mb-4">
        <button className="px-4 py-2 rounded bg-blue-600 text-white">
          All Posts
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-6 mt-6">
          {allPosts.length === 0 ? (
            <p className="text-center text-gray-500">No posts available.</p>
          ) : (
            allPosts.map((post, index) => (
              <div key={index} className="bg-white shadow rounded p-4 relative">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    {post.companyProfileImage ? (
                      <img
                        src={post.companyProfileImage}
                        className="w-10 h-10 rounded-full mr-3"
                        alt="profile"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-bold">{post.companyEmail?.charAt(0)}</span>
                      </div>
                    )}
                    <div>
                      <p className="font-semibold">{post.companyEmail}</p>
                      <p className="text-xs text-gray-500">
                        {post.createdAt?.seconds
                          ? new Date(post.createdAt.seconds * 1000).toLocaleString()
                          : "Just now"}
                      </p>
                    </div>
                  </div>
                  <button className="absolute top-0 right-0 px-4 py-2 bg-blue-600 text-white rounded-md">
                    Apply Job
                  </button>
                </div>
                <p className="mb-2">{post.description}</p>
                {post.mediaUrls?.length > 0 && (
                  <Swiper spaceBetween={10} slidesPerView={1}>
                    {post.mediaUrls.map((url, i) => {
                      const cleanUrl = url.split("?")[0]; // Remove query params
                      const isVideo =
                        cleanUrl.toLowerCase().endsWith(".mp4") ||
                        cleanUrl.toLowerCase().endsWith(".webm") ||
                        cleanUrl.toLowerCase().endsWith(".ogg");

                      return (
                        <SwiperSlide key={i}>
                          {isVideo ? (
                            <video controls className="w-full max-h-96 rounded">
                              <source src={url} type="video/mp4" />
                            </video>
                          ) : (
                            <img src={url} alt={`media-${i}`} className="w-full max-h-96 object-cover rounded" />
                          )}
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>
                )}

                {/* Comment Section */}
                <div className="mt-4">
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)} // Update the comment state
                  />
                  <button
                    className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-md"
                    onClick={() => handleCommentSubmit(post.id)} // Call the submit function with the post ID
                  >
                    Submit
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AllPosts;
