import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import axios from "axios";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, storage } from '../../firebaseConfig';


const CompanyDashboard = () => {
  const [user] = useAuthState(auth);
  const [userEmail, setUserEmail] = useState("");
  const [companyInfo, setCompanyInfo] = useState(null);
  const [posts, setPosts] = useState([]);
  const [showPostForm, setShowPostForm] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [editedDescription, setEditedDescription] = useState("");
  const [editedMediaFiles, setEditedMediaFiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const postFetch = async () => {
      if(user){
        try{
            const token = await user.getIdToken();
            const uid = user.uid;

            console.log("token",token)
            console.log("uid",uid)

            setUserEmail(user.email);

            const postResponse = await axios.get(`http://localhost:8081/lingocamp/api/company/posts/myposts`,
            { headers: { Authorization: `Bearer ${token}` } });

            setPosts(postResponse.data);

            const infoResponse = await axios.get(`http://localhost:8081/lingocamp/api/company/${uid}`,
            { headers: { Authorization: `Bearer ${token}` } });

            setCompanyInfo(infoResponse.data);

        }catch (error) {
          console.error("Error loading dashboard data:", error);
        }
      }
    };
    postFetch();

    },[user, navigate]);

  const company = {
    name: "Acme Corporation",
    tagline: "Building the future of technology",
    followers: 24875,
    employees: 1240,
    location: "San Francisco, CA",
    website: "www.acmecorp.com",
    industry: "Technology",
  };

  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmitPassword = () => {
    if (password === "adminPassword") {
      setShowPasswordModal(false);
      setShowJobForm(true);
    } else {
      setPasswordError("Incorrect password. Please try again.");
    }
  };

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      navigate("/companylogin");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const followingPeople = [
    {
      id: 1,
      name: "Sarah Johnson",
      position: "CEO at TechSolutions",
      followers: "12.5K",
    },
    {
      id: 2,
      name: "Michael Chen",
      position: "Product Manager at InnovateCo",
      followers: "8.2K",
    },
    {
      id: 3,
      name: "David Wilson",
      position: "CTO at FutureTech",
      followers: "15.7K",
    },
  ];

  const handleCreatePost = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const uid = currentUser.uid;
    const form = e.target;
    const description = form.description.value;

    if (selectedFiles.length === 0) {
      alert("Please upload at least one media file.");
      return;
    }
    const token = await auth.currentUser.getIdToken();
    const mediaUrls = [];

    for (const file of selectedFiles) {
      if (file.type.startsWith("video/")) {
        const videoURL = URL.createObjectURL(file);
        const video = document.createElement("video");
        video.src = videoURL;

        await new Promise((resolve) => {
          video.onloadedmetadata = () => {
            if (video.duration > 30) {
              alert(`"${file.name}" exceeds 30 seconds.`);
              resolve(false);
            } else {
              resolve(true);
            }
          };
        });
      }

      const storageRef = ref(
        storage,
        `company-posts/${uid}/${Date.now()}_${file.name}`
      );
      const uploadTask = await uploadBytesResumable(storageRef, file);
      const downloadURL = await getDownloadURL(uploadTask.ref);

      mediaUrls.push(downloadURL);
    }

    try {
      await axios.post(`http://localhost:8081/lingocamp/api/company/posts/create`,
        {
          description,
          mediaUrls,
        },
        { headers: { Authorization: `Bearer ${token}` } });


      setShowPostForm(false);
      form.reset();
      setSelectedFiles([]);
      alert("Post uploaded successfully!");
    } catch (error) {
      console.error("Error uploading post:", error);
      alert("Failed to upload post.");
    }
  };
  const handleEditPost = (post) => {
    setEditingPost(post);
    setEditedDescription(post.description || "");
    setEditedMediaFiles([]); // New files to upload
    setEditModalOpen(true);
  };
  const handleUpdatePost = async () => {
    const auth = getAuth();
    const token = await auth.currentUser.getIdToken();

    let newMediaUrls = [...editingPost.mediaUrls]; // existing media

    // Upload new media files (if any)
    if (editedMediaFiles.length > 0) {
      newMediaUrls = []; // clear previous if uploading new
      for (const file of editedMediaFiles) {
        const uid = auth.currentUser.uid;
        const storageRef = ref(
          storage,
          `company-posts/${uid}/${Date.now()}_${file.name}`
        );
        const uploadTask = await uploadBytesResumable(storageRef, file);
        const downloadURL = await getDownloadURL(uploadTask.ref);
        newMediaUrls.push(downloadURL);
      }
    }

    try {
      await axios.put(
        `http://localhost:8081/lingocamp/api/company/posts/update/${editingPost.postId}`,
        {
          description: editedDescription,
          mediaUrls: newMediaUrls, // send updated list
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update UI
      setPosts((prev) =>
        prev.map((p) =>
          p.postId === editingPost.postId
            ? { ...p, description: editedDescription, mediaUrls: newMediaUrls }
            : p
        )
      );

      setEditModalOpen(false);
      alert("Post updated successfully");
    } catch (error) {
      console.error("Failed to update post", error);
      alert("Error updating post");
    }
  };

  const handleDeletePost = async (postId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirm) return;

    try {
      const auth = getAuth();
      const token = await auth.currentUser.getIdToken();
      await axios.delete(
        `http://localhost:8081/lingocamp/api/company/posts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPosts((prev) => prev.filter((post) => post.postId !== postId));
      alert("Post deleted!");
    } catch (error) {
      console.error("Failed to delete post", error);
      alert("Error deleting post");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navigation Bar - LinkedIn logo removed */}

      <nav className="bg-white border-b border-gray-300 fixed top-0 w-full z-10">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center h-14">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search"
              className="p-1 px-3 bg-gray-100 rounded-md"
            />
          </div>
          <div className="flex items-center space-x-6">
            <span className="cursor-pointer font-semibold text-blue-600 border-b-2 border-blue-600 pb-1">
              Home
            </span>
            <span
              className="cursor-pointer font-semibold text-blue-600 pb-1"
              onClick={() => navigate("/allpost")}
            >
              allpost
            </span>
            

            <div className="relative group">
              <button className="text-sm font-medium text-blue-700 focus:outline-none">
                {userEmail}
              </button>
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  onClick={() => navigate("/company-profile")}
                >
                  View Profile
                </button>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
                  onClick={() => handleLogout()}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-16 pb-8 max-w-6xl mx-auto px-4">
        {/* Company Header - Fixed logo/name layout */}
        <div className="bg-white rounded-lg shadow mb-4 overflow-hidden">
          <div className="h-48 bg-blue-700 relative"></div>
          <div className="px-6 pb-6 relative">
            {/* Logo repositioned to not overlap with company info */}
            <div className="flex items-start mt-4">
              {/* <div className="w-24 h-24 bg-white flex items-center justify-center rounded-lg border border-gray-300 mr-4 shadow">
                <span className="text-3xl font-bold text-blue-600">{company.name.charAt(0)}</span>
              </div> */}
              {companyInfo?.profileImageUrl ? (
                <img
                  src={companyInfo.profileImageUrl}
                  alt="Company Profile"
                  className="w-24 h-24 rounded-lg border border-gray-300 mr-4 shadow object-cover"
                />
              ) : (
                <div className="w-24 h-24 bg-white flex items-center justify-center rounded-lg border border-gray-300 mr-4 shadow">
                  <span className="text-3xl font-bold text-blue-600">
                    {companyInfo?.companyName?.charAt(0).toUpperCase() || "C"}
                  </span>
                </div>
              )}

              <div className="flex-1">
                <h1 className="text-2xl font-bold">
                  {" "}
                  {companyInfo?.companyName || "Company Name"}
                </h1>
                <p className="text-gray-600">
                  {companyInfo?.email || "email@example.com"}
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  {companyInfo?.address || "No address provided"}
                </p>
                {/* <p className="text-gray-500 text-sm">{company.website}</p> */}
                {/* <p className="mt-2 text-blue-600 font-medium">{company.followers.toLocaleString()} followers · {company.employees.toLocaleString()} employees</p> */}
                {companyInfo?.socialLinks?.length > 0 && (
                  <div className="text-gray-500 text-sm mt-1 space-y-1">
                    {companyInfo.socialLinks.map((link, idx) => (
                      <p key={idx}>
                        🔗 {link.platform}:{" "}
                        <a
                          className="text-blue-600 underline"
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {link.url}
                        </a>
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* Password Modal */}
              {showPasswordModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                    <h2 className="text-xl font-semibold mb-4">
                      Enter Password to Post Job
                    </h2>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password*
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        className="w-full p-2 border rounded"
                        required
                        placeholder="Enter your password"
                      />
                      {passwordError && (
                        <p className="text-red-500 text-sm mt-2">
                          {passwordError}
                        </p>
                      )}
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                      <button
                        onClick={() => setShowPasswordModal(false)}
                        className="px-4 py-2 border rounded-md"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmitPassword}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Job Form Modal - Added to handle what happens after password is validated */}
              {showJobForm && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                    <h2 className="text-xl font-semibold mb-4">
                      Post a New Job
                    </h2>
                    <form>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Job Title*
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border rounded"
                          required
                          placeholder="e.g. Software Engineer"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Job Description*
                        </label>
                        <textarea
                          className="w-full p-2 border rounded min-h-32"
                          required
                          placeholder="Describe the job responsibilities, requirements, etc."
                        ></textarea>
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Location*
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border rounded"
                          required
                          placeholder="e.g. Remote, San Francisco, CA"
                        />
                      </div>
                      <div className="flex justify-end space-x-2 mt-4">
                        <button
                          type="button"
                          onClick={() => setShowJobForm(false)}
                          className="px-4 py-2 border rounded-md"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          Post Job
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex gap-4">
          {/* Left Sidebar */}
          <div className="w-1/4">
            <div className="bg-white rounded-lg shadow p-4 mb-4">
              <h2 className="font-bold mb-2">About</h2>
              <p className="text-sm text-gray-600 whitespace-pre-wrap break-words">
                {companyInfo?.about
                  ? companyInfo.about
                  : "No description available for this company."}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              {/* <h2 className="font-bold mb-2">Following People</h2> */}
              <div className="space-y-4 mt-3">
                {followingPeople.map((person) => (
                  <div key={person.id} className="flex items-center">
                    {/* <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                      <span className="font-bold text-sm">
                        {person.name.charAt(0)}
                      </span>
                    </div> */}
                    {/* <div>
                      <p className="font-medium">{person.name}</p>
                      <p className="text-xs text-gray-500">{person.position}</p>
                      <p className="text-xs text-gray-500">
                        {person.followers} followers
                      </p>
                    </div> */}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-3/4">
            {/* Create Post - Event option removed */}
            <div className="bg-white rounded-lg shadow p-4 mb-4">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="font-bold text-blue-600">
                    {company.name.charAt(0)}
                  </span>
                </div>
                <button
                  onClick={() => setShowPostForm(true)}
                  className="flex-grow bg-gray-100 hover:bg-gray-200 rounded-full py-3 px-4 text-left text-gray-500"
                >
                  Start a post
                </button>
              </div>

              {showPostForm && (
                <form
                  onSubmit={handleCreatePost}
                  className="border-t pt-4"
                  encType="multipart/form-data"
                >
                  <textarea
                    name="description"
                    className="w-full p-2 border rounded mb-2 min-h-24"
                    placeholder="Write a caption for your post..."
                    required
                  ></textarea>

                  <input
                    type="file"
                    name="media"
                    id="media-upload"
                    accept="image/*,video/*"
                    multiple
                    className="hidden"
                    onChange={(e) =>
                      setSelectedFiles(Array.from(e.target.files).slice(0, 3))
                    }
                  />
                  <p className="text-sm text-gray-500 mb-2">
                    * Max 3 files. Videos must be under 30 seconds.
                  </p>
                  {selectedFiles.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      {selectedFiles.map((file, index) => {
                        const url = URL.createObjectURL(file);
                        const isVideo = file.type.startsWith("video/");

                        return (
                          <div
                            key={index}
                            className="relative border rounded overflow-hidden"
                          >
                            {isVideo ? (
                              <video
                                src={url}
                                controls
                                className="w-full h-48 object-cover"
                              />
                            ) : (
                              <img
                                src={url}
                                alt={`preview-${index}`}
                                className="w-full h-48 object-cover"
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowPostForm(false)}
                      className="px-4 py-1 border rounded-full"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1 bg-blue-600 text-white rounded-full"
                    >
                      Post
                    </button>
                  </div>
                </form>
              )}

              <div className="flex justify-between mt-2">
                <button
                  type="button"
                  className="flex items-center text-gray-500 hover:bg-gray-100 p-2 rounded"
                  onClick={() =>
                    document.getElementById("media-upload").click()
                  }
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="mr-1"
                  >
                    <path
                      d="M19 4H5C3.9 4 3 4.9 3 6V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V6C21 4.9 20.1 4 19 4ZM19 19H5V14H19V19ZM19 12H5V6H19V12Z"
                      fill="currentColor"
                    />
                  </svg>
                  Photo
                </button>

                <button
                  type="button"
                  className="flex items-center text-gray-500 hover:bg-gray-100 p-2 rounded"
                  onClick={() =>
                    document.getElementById("media-upload").click()
                  }
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="mr-1"
                  >
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.66 13.33L12.7 16.5C12.31 16.81 11.68 16.5 11.68 16V12.5L8.72 15.06C8.34 15.39 7.7 15.08 7.7 14.58V9.41C7.7 8.92 8.34 8.6 8.72 8.94L11.68 11.5V8C11.68 7.5 12.31 7.19 12.7 7.5L16.66 10.67C16.98 10.92 16.98 13.08 16.66 13.33Z"
                      fill="currentColor"
                    />
                  </svg>
                  Video
                </button>
              </div>
            </div>

            {/* Posts - No interaction options */}

            <div className="space-y-4">
              {posts.map((post, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow p-4 relative"
                >
                  {/* Action buttons */}
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                      onClick={() => handleEditPost(post)}
                      className="text-blue-500 hover:text-blue-700 text-sm"
                      title="Edit"
                    >
                      🖊️
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.postId)}
                      className="text-red-500 hover:text-red-700 text-sm"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>

                  <div className="flex items-start mb-3">
                    {companyInfo?.profileImageUrl ? (
                      <img
                        src={companyInfo.profileImageUrl}
                        alt="Profile"
                        className="w-12 h-12 rounded-full mr-2"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                        <span className="font-bold text-blue-600">
                          {companyInfo?.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-bold">{companyInfo?.email}</p>
                      <p className="text-xs text-gray-500">
                        {post.createdAt?.seconds
                          ? new Date(
                            post.createdAt.seconds * 1000
                          ).toLocaleString()
                          : "Just now"}{" "}
                        · <span className="text-gray-700">🌐</span>
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p>{post.description}</p>
                    {post.mediaUrls?.length > 0 && (
                      <Swiper pagination={{ clickable: true }} className="mt-4">
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
                                  style={{
                                    width: "100%",
                                    height: "auto",
                                    maxHeight: 400,
                                    objectFit: "cover",
                                    backgroundColor: "#000",
                                  }}
                                >
                                  <source src={url} />
                                  Your browser does not support the video tag.
                                </video>
                              ) : (
                                <img
                                  src={url}
                                  alt={`media-${idx}`}
                                  style={{
                                    width: "100%",
                                    height: "auto",
                                    maxHeight: 400,
                                    objectFit: "cover",
                                  }}
                                  onError={(e) =>
                                    (e.target.style.display = "none")
                                  }
                                />
                              )}
                            </SwiperSlide>
                          );
                        })}
                      </Swiper>
                    )}
                  </div>
                  {/* Comment Area */}
                  <div className="mt-4 border-t pt-3">
                    <h4 className="font-semibold text-sm mb-2">Comments</h4>

                    {post.comments?.length > 0 ? (
                      <div className="space-y-2">
                        {post.comments.map((comment, idx) => (
                          <div key={idx} className="bg-gray-100 p-2 rounded text-sm">
                            <p className="font-medium text-gray-800">{comment.userEmail || "Anonymous"}</p>
                            <p className="text-gray-700">{comment.text}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No comments yet.</p>
                    )}
                  </div>

                </div>
              ))}
            </div>
            {editModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                  <h2 className="text-xl font-semibold mb-4">Edit Post</h2>

                  {/* Description input */}
                  <textarea
                    className="w-full border p-2 rounded mb-3"
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                  ></textarea>

                  {/* Current Media Preview */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                    {editingPost?.mediaUrls?.map((url, idx) => {
                      const cleanUrl = url.split("?")[0]; // Strip query params
                      const isVideo =
                        cleanUrl.toLowerCase().endsWith(".mp4") ||
                        cleanUrl.toLowerCase().endsWith(".webm") ||
                        cleanUrl.toLowerCase().endsWith(".ogg");

                      return isVideo ? (
                        <video
                          key={idx}
                          controls
                          className="w-full h-40 object-cover rounded shadow bg-black"
                        >
                          <source src={url} />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <img
                          key={idx}
                          src={url}
                          alt={`media-${idx}`}
                          className="w-full h-40 object-cover rounded shadow"
                        />
                      );
                    })}
                  </div>



                  {/* New Media Upload */}
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={(e) =>
                      setEditedMediaFiles(Array.from(e.target.files))
                    }
                    className="mb-4"
                  />

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setEditModalOpen(false)}
                      className="px-4 py-2 border rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdatePost}
                      className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
