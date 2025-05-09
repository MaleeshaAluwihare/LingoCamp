import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { getAuth } from 'firebase/auth';
import axios from 'axios';

const AllCompanyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const fetchAllPosts = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        console.log("User not logged in. Skipping fetchAllPosts.");
        return;
      }

      setUserEmail(currentUser.email);
      const token = await currentUser.getIdToken();

      try {
        const res = await axios.get("http://localhost:8081/lingocamp/api/company/posts/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(res.data);
      } catch (error) {
        console.error("Error fetching all posts", error);
      }
    };

    fetchAllPosts();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4">
      {/* Navbar */}
      <nav className="bg-white shadow px-4 py-3 mb-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h2 className="text-xl font-bold text-blue-700">LingoCamp</h2>
          <p className="text-sm text-gray-700">
            Logged in as: <span className="font-medium text-blue-600">{userEmail}</span>
          </p>
        </div>
      </nav>

      <h1 className="text-3xl font-bold text-center mb-8">Explore Company Posts</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {posts.map((post, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center mb-3">
              {post.companyProfileImage ? (
                <img
                  src={post.companyProfileImage}
                  alt="Profile"
                  className="w-12 h-12 rounded-full mr-3"
                />
              ) : (
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-bold text-xl">
                    {post.companyEmail?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <p className="font-bold">{post.companyEmail}</p>
                <p className="text-xs text-gray-500">
                  {post.createdAt?.seconds
                    ? new Date(post.createdAt.seconds * 1000).toLocaleString()
                    : "Just now"} · 🌐
                </p>
              </div>
            </div>

            <p className="mb-3 text-gray-700">{post.description}</p>

            {post.mediaUrls?.length > 0 && (
              <Swiper pagination={{ clickable: true }}>
                {post.mediaUrls.map((url, idx) => {
                          const cleanUrl = url.split("?")[0]; // Remove query params
                          const isVideo =
                            cleanUrl.toLowerCase().endsWith(".mp4") ||
                            cleanUrl.toLowerCase().endsWith(".webm") ||
                            cleanUrl.toLowerCase().endsWith(".ogg");

                          return (
                  <SwiperSlide key={idx}>
                   {isVideo ? (
                      <video
                        controls
                        className="w-full h-[250px] object-cover rounded-lg"
                      >
                        <source src={url} />
                      </video>
                    ) : (
                      <img
                        src={url}
                        alt={`media-${idx}`}
                        className="w-full h-[300px] object-cover rounded-lg"
                      />
                    )}
                  </SwiperSlide>
                 );
                })}
              </Swiper>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllCompanyPosts;
