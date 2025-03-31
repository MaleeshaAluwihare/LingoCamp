import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CompanyDashboard = () => {
  const [showPostForm, setShowPostForm] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false); // Added missing state variable
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const navigate = useNavigate();
  
  // Sample company data
  const company = {
    name: "Acme Corporation",
    tagline: "Building the future of technology",
    followers: 24875,
    employees: 1240,
    location: "San Francisco, CA",
    website: "www.acmecorp.com",
    industry: "Technology"
  };
  
  // Sample posts data
  const [posts, setPosts] = useState([
    {
      id: 1,
      content: "We're excited to announce our latest product launch! Join us next week for a special livestream event.",
      likes: 342,
      comments: 57,
      shares: 28,
      time: "2d ago"
    },
    {
      id: 2,
      content: "Acme Corporation is proud to be recognized as one of the Top 10 Places to Work in 2025! Thank you to all our amazing employees who make our company culture exceptional.",
      likes: 892,
      comments: 143,
      shares: 76,
      time: "1w ago"
    },
    {
      id: 3,
      content: "Looking for talented software engineers to join our growing team. Visit our careers page to learn more about open positions!",
      likes: 215,
      comments: 32,
      shares: 45,
      time: "2w ago"
    }
  ]);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmitPassword = () => {
    // You can replace this with real password validation logic
    if (password === "adminPassword") {
      setShowPasswordModal(false); // Close password modal
      setShowJobForm(true); // Show job form after password validation
    } else {
      setPasswordError("Incorrect password. Please try again.");
    }
  };

  // Following people data
  const followingPeople = [
    {
      id: 1,
      name: "Sarah Johnson",
      position: "CEO at TechSolutions",
      followers: "12.5K"
    },
    {
      id: 2,
      name: "Michael Chen",
      position: "Product Manager at InnovateCo",
      followers: "8.2K"
    },
    {
      id: 3,
      name: "David Wilson",
      position: "CTO at FutureTech",
      followers: "15.7K"
    }
  ];
  
  const handleCreatePost = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const content = formData.get('postContent');
    
    if (content.trim()) {
      const newPost = {
        id: posts.length + 1,
        content,
        likes: 0,
        comments: 0,
        shares: 0,
        time: "Just now"
      };
      
      setPosts([newPost, ...posts]);
      setShowPostForm(false);
      e.target.reset();
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navigation Bar - LinkedIn logo removed */}
      <nav className="bg-white border-b border-gray-300 fixed top-0 w-full z-10">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center h-14">
          <div className="flex items-center">
            <input type="text" placeholder="Search" className="p-1 px-3 bg-gray-100 rounded-md" />
          </div>
          <div className="flex items-center space-x-6">
            <span className="cursor-pointer font-semibold text-blue-600 border-b-2 border-blue-600 pb-1">Home</span>
            <span 
              className="cursor-pointer font-semibold text-blue-600 border-b-2 border-blue-600 pb-1"
              onClick={() => navigate('/joblist')}
            >Jobs</span>
            <span 
              className="cursor-pointer font-semibold text-blue-600 border-b-2 border-blue-600 pb-1"
              onClick={() => navigate('/message')}
            >Messaging</span>
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
              <div className="w-24 h-24 bg-white flex items-center justify-center rounded-lg border border-gray-300 mr-4 shadow">
                <span className="text-3xl font-bold text-blue-600">{company.name.charAt(0)}</span>
              </div>
              
              <div className="flex-1">
                <h1 className="text-2xl font-bold">{company.name}</h1>
                <p className="text-gray-600">{company.tagline}</p>
                <p className="text-gray-500 text-sm mt-1">{company.industry} · {company.location}</p>
                <p className="text-gray-500 text-sm">{company.website}</p>
                <p className="mt-2 text-blue-600 font-medium">{company.followers.toLocaleString()} followers · {company.employees.toLocaleString()} employees</p>
              </div>
              
              <div className="flex space-x-2">
                <button className="py-1 px-4 border border-blue-600 rounded-full text-blue-600 font-medium hover:bg-blue-50">
                  <span>Follow</span>
                </button>
                <button 
                  className="py-1 px-4 border border-blue-600 rounded-full text-blue-600 font-medium hover:bg-blue-50"
                  onClick={() => navigate('/message')}
                >
                  <span>Message</span>
                </button>
                <button 
                  className="py-1 px-4 bg-blue-600 rounded-full text-white font-medium hover:bg-blue-700"
                  onClick={() => setShowPasswordModal(true)}
                >
                  <span>Post a job</span>
                </button>
              </div>

              {/* Password Modal */}
              {showPasswordModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                    <h2 className="text-xl font-semibold mb-4">Enter Password to Post Job</h2>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password*</label>
                      <input
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        className="w-full p-2 border rounded"
                        required
                        placeholder="Enter your password"
                      />
                      {passwordError && <p className="text-red-500 text-sm mt-2">{passwordError}</p>}
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
                    <h2 className="text-xl font-semibold mb-4">Post a New Job</h2>
                    <form>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Job Title*</label>
                        <input
                          type="text"
                          className="w-full p-2 border rounded"
                          required
                          placeholder="e.g. Software Engineer"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Job Description*</label>
                        <textarea
                          className="w-full p-2 border rounded min-h-32"
                          required
                          placeholder="Describe the job responsibilities, requirements, etc."
                        ></textarea>
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location*</label>
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
              <p className="text-sm text-gray-600">
                Acme Corporation is a leading technology company specializing in innovative solutions for businesses and consumers worldwide. Founded in 2010, we've grown to become a trusted partner for digital transformation.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="font-bold mb-2">Following People</h2>
              <div className="space-y-4 mt-3">
                {followingPeople.map(person => (
                  <div key={person.id} className="flex items-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                      <span className="font-bold text-sm">{person.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium">{person.name}</p>
                      <p className="text-xs text-gray-500">{person.position}</p>
                      <p className="text-xs text-gray-500">{person.followers} followers</p>
                    </div>
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
                  <span className="font-bold text-blue-600">{company.name.charAt(0)}</span>
                </div>
                <button 
                  onClick={() => setShowPostForm(true)}
                  className="flex-grow bg-gray-100 hover:bg-gray-200 rounded-full py-3 px-4 text-left text-gray-500"
                >
                  Start a post
                </button>
              </div>
              
              {showPostForm && (
                <form onSubmit={handleCreatePost} className="border-t pt-4">
                  <textarea 
                    name="postContent"
                    className="w-full p-2 border rounded mb-2 min-h-24"
                    placeholder="What do you want to talk about?"
                  ></textarea>
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
                <button className="flex items-center text-gray-500 hover:bg-gray-100 p-2 rounded">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="mr-1">
                    <path d="M19 4H5C3.9 4 3 4.9 3 6V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V6C21 4.9 20.1 4 19 4ZM19 19H5V14H19V19ZM19 12H5V6H19V12Z" fill="currentColor"/>
                  </svg>
                  Photo
                </button>
                <button className="flex items-center text-gray-500 hover:bg-gray-100 p-2 rounded">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="mr-1">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.66 13.33L12.7 16.5C12.31 16.81 11.68 16.5 11.68 16V12.5L8.72 15.06C8.34 15.39 7.7 15.08 7.7 14.58V9.41C7.7 8.92 8.34 8.6 8.72 8.94L11.68 11.5V8C11.68 7.5 12.31 7.19 12.7 7.5L16.66 10.67C16.98 10.92 16.98 13.08 16.66 13.33Z" fill="currentColor"/>
                  </svg>
                  Video
                </button>
                <button className="flex items-center text-gray-500 hover:bg-gray-100 p-2 rounded">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="mr-1">
                    <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM7 10H9V17H7V10ZM11 7H13V17H11V7ZM15 13H17V17H15V13Z" fill="currentColor"/>
                  </svg>
                  Article
                </button>
              </div>
            </div>
            
            {/* Posts - No interaction options */}
            <div className="space-y-4">
              {posts.map(post => (
                <div key={post.id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-start mb-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                      <span className="font-bold text-blue-600">{company.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-bold">{company.name}</p>
                      <p className="text-xs text-gray-500">{company.followers.toLocaleString()} followers</p>
                      <p className="text-xs text-gray-500">{post.time} · <span className="text-gray-700">🌐</span></p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p>{post.content}</p>
                  </div>
                  
                  <div className="border-t py-2 flex justify-between text-gray-500 text-sm">
                    <span>{post.likes} likes · {post.comments} comments · {post.shares} shares</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;