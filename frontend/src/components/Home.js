import React, { useState } from "react";
import axios from "axios";
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { FiGlobe, FiUsers, FiSmartphone, FiChevronDown, FiUser, FiSettings, FiLogOut, FiEdit, FiTrash2 } from 'react-icons/fi';import { Link } from "react-router-dom";
import { auth } from '../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { fetchAllCompanyPosts } from "../services/apiService";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const HomePage = () => {
    const [user] = useAuthState(auth);
    const [tutorData, setTutorData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isGuest, setIsGuest] = useState(false);
    const navigate = useNavigate();

    const [allPosts, setAllPosts] = useState([]);
    const [activeTab, setActiveTab] = useState("all");
      // New state for the comment input
    const [newComment, setNewComment] = useState("");


    useEffect(() => {
      const fetchPosts = async () => {
        const posts = await fetchAllCompanyPosts();
        console.log("Fetched posts:", posts); // 👈 Check console log
        setAllPosts(posts);
      };
      fetchPosts();
    }, []);
    

    useEffect(() => {
      const fetchUserData = async () => {
        if(user) {
          try {
            const response = await axios.get(`http://localhost:8081/lingocamp/api/tutors/${user.uid}`);
            setTutorData(response.data);
          }catch(error){
            console.error("Error fetching tutor data:", error);
            setTutorData({});
          }
          setLoading(false);
        }
      };
      fetchUserData();
    },[user]);

    const getDisplayName = () => {
      if(tutorData?.firstName) return tutorData.firstName;
      if(user?.displayName) return user.displayName;
      if(user?.email) return user.email.split('@')[0];
      return "Guest";
    };


  

// Handle comment submission
const handleCommentSubmit = async (postId) => {
  if (newComment.trim()) {
    try {
      // Make API call to submit the comment for the post
      await axios.post(`http://localhost:8081/lingocamp/api/posts/${postId}/comments`, {
        comment: newComment,
        userId: user?.uid,
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

    const handleLogout = async () => {
      if(window.confirm('Are you sure you want to logout?')) {
        try{
          await auth.signOut();
          navigate('/tutorlogin')
        }catch(error){
          console.log('Logout failed:', error);
        }
      }
    };

    const handleDeleteProfile = async () => {
      const confirmation = window.prompt(
        'Type "DELETE" to confirm permanent profile deletion:'
      );
      
      if (confirmation === "DELETE") {
        try {
          await axios.delete(`http://localhost:8081/lingocamp/api/tutors/deleteprofile/${user.uid}`);
          await auth.signOut();
          navigate('/home');
        } catch (error) {
          console.error('Deletion failed:', error);
          alert('Profile deletion failed. Please try again.');
        }
      } else {
        alert('Deletion cancelled. Profile remains active.');
      }
    };

    useEffect(() => {
      const guestStatus = localStorage.getItem('isGuest');
      if (!user && !guestStatus) {
          navigate('/tutorlogin');
      }
      setIsGuest(!!guestStatus);
  }, [user, navigate]);


return (
  <div className="min-h-screen bg-gray-50">
    {/* Navigation */}
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <div className="flex items-center">
            <FiGlobe className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-800">LingoCamp</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-blue-600">Features</a>
            <a href="#pricing" className="text-gray-600 hover:text-blue-600">Pricing</a>
            <Link to="/tutorlogin" className="text-gray-600 hover:text-blue-600">Login</Link>
            <Link to="/tutorregistration" className="text-gray-600 hover:text-blue-600">Register</Link>

            {/* User Dropdown */}
            {!loading && (
              <Menu as="div" className="relative ml-3">
                <div>
                  <MenuButton className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 focus:outline-none">
                    <FiUser className="h-5 w-5" />
                    <span className="font-medium">{getDisplayName()}</span>
                    <FiChevronDown className="h-4 w-4" />
                  </MenuButton>
                </div>
                <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <MenuItem>
                    {({ active }) => (
                      <button
                        onClick={() => alert('Profile clicked - Add your profile handler')}
                        className={`${active ? 'bg-blue-100' : ''} block w-full px-4 py-2 text-sm text-gray-700 text-left`}
                      >
                        <FiUser className="inline mr-2 h-4 w-4" />
                        Profile
                      </button>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ active }) => (
                      <button
                        onClick={() => navigate('/tutorprofileupdate')}
                        className={`${active ? 'bg-blue-100' : ''} block w-full px-4 py-2 text-sm text-gray-700 text-left`}
                      >
                        <FiEdit className="inline mr-2 h-4 w-4" />
                        Update Profile
                      </button>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ active }) => (
                      <button
                        onClick={handleDeleteProfile}
                        className={`${active ? 'bg-blue-100' : ''} block w-full px-4 py-2 text-sm text-gray-700 text-left`}
                      >
                        <FiTrash2 className="inline mr-2 h-4 w-4" />
                        Delete Profile
                      </button>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ active }) => (
                      <button
                        onClick={() => alert('Settings clicked - Add your settings handler')}
                        className={`${active ? 'bg-blue-100' : ''} block w-full px-4 py-2 text-sm text-gray-700 text-left`}
                      >
                        <FiSettings className="inline mr-2 h-4 w-4" />
                        Settings
                      </button>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={`${active ? 'bg-blue-100' : ''} block w-full px-4 py-2 text-sm text-gray-700 text-left`}
                      >
                        <FiLogOut className="inline mr-2 h-4 w-4" />
                        Logout
                      </button>
                    )}
                  </MenuItem>
                </MenuItems>
              </Menu>
            )}
          </div>
        </div>
      </div>
    </nav>

    {/* Hero Section */}
    <main>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-20">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            {!loading && (
              <span className="block text-2xl text-blue-600 mb-4">
                Welcome back, {getDisplayName()}!
              </span>
            )}
            Learn Languages Naturally with
            <span className="text-blue-600"> LingoCamp</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Immerse yourself in real conversations with native speakers from around the world.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </main>

    {/* Features Section */}
    <section className="py-12 bg-white" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
            <FiUsers className="h-12 w-12 text-blue-600" />
            <h3 className="mt-4 text-xl font-semibold">Native Speakers</h3>
            <p className="mt-2 text-gray-500">
              Connect with language partners who are native speakers of your target language.
            </p>
          </div>
          <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
            <FiSmartphone className="h-12 w-12 text-blue-600" />
            <h3 className="mt-4 text-xl font-semibold">Mobile Friendly</h3>
            <p className="mt-2 text-gray-500">
              Learn anywhere, anytime with our mobile-optimized platform.
            </p>
          </div>
          <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
            <FiGlobe className="h-12 w-12 text-blue-600" />
            <h3 className="mt-4 text-xl font-semibold">100+ Languages</h3>
            <p className="mt-2 text-gray-500">
              Choose from a wide variety of languages and dialects from around the world.
            </p>
          </div>
        </div>
      </div>
    </section>

    <div className="max-w-4xl mx-auto my-8">
      <div className="flex justify-center mb-4">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 rounded ${activeTab === "all" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          All Posts
        </button>
      </div>

      {/* 🔥 Your Component Starts Here */}
      {activeTab === "all" && (
        <div className="space-y-6 mt-6">
          {allPosts.length === 0 ? (
            <p className="text-center text-gray-500">No posts available.</p>
          ) : (
            allPosts.map((post, index) => (
              <div key={index} className="bg-white shadow rounded p-4 relative">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    {post.companyProfileImage ? (
                      <img src={post.companyProfileImage} className="w-10 h-10 rounded-full mr-3" alt="profile" />
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
                  />
                  <button className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-md">Submit</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>

    {/* Footer */}
    <footer className="bg-gray-800 text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-400">
            © 2023 LingoCamp. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  </div>
);

  
}

export default HomePage;