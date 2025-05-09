import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { 
  FiBriefcase, FiGlobe, FiMail, FiPhone, FiUser, 
  FiLink, FiAward, FiBook, FiMapPin 
} from 'react-icons/fi';
import { 
  FaFacebook, FaInstagram, FaYoutube, FaLinkedin, 
  FaGithub, FaMedium, FaReddit 
} from 'react-icons/fa';
import { SkeletonLoader } from '../../components/UI/SkeletonLoader';
import NavBar from '../../components/UI/navBar';
import { auth } from '../../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';

const ensureArray = (value) => {
  if (!value) return [];
  if (typeof value === 'string') return [value];
  return Array.isArray(value) ? value : [];
};

const LearnerProfileView = () => {
  const { learnerid } = useParams(); // Match the parameter name from App.js route
  const [user] = useAuthState(auth); // Use react-firebase-hooks for auth state
  const [learner, setLearner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const SOCIAL_ICONS = {
    linkedin: <FaLinkedin className="text-blue-600" />,
    github: <FaGithub className="text-gray-800" />,
    facebook: <FaFacebook className="text-blue-600" />,
    instagram: <FaInstagram className="text-pink-600" />,
    youtube: <FaYoutube className="text-red-600" />,
    medium: <FaMedium className="text-black" />,
    reddit: <FaReddit className="text-orange-500" />,
    other: <FiGlobe className="text-gray-600" />
  };

  useEffect(() => {
    const fetchLearner = async () => {
      try {
        // First, try to get an auth token if the user is logged in
        let headers = {};
        
        if (user) {
          const token = await user.getIdToken();
          headers = { Authorization: `Bearer ${token}` };
        }
        
        // Log the URL we're trying to fetch from for debugging
        const url = `http://localhost:8081/lingocamp/api/learners/${learnerid}`;
        console.log('Fetching learner profile from:', url);
        
        // Use the correct API endpoint format from your backend
        const response = await axios.get(
          url,
          { headers }
        );
        
        console.log('Learner data received:', response.data);
        setLearner(response.data);
      } catch (err) {
        console.error('Error fetching learner data:', err);
        console.error('Error details:', err.response?.data || err.message);
        setError('Failed to load learner profile. Please ensure the user ID is correct.');
      } finally {
        setLoading(false);
      }
    };

    if (learnerid) {
      fetchLearner();
    } else {
      setError('Learner ID is missing');
      setLoading(false);
    }
  }, [learnerid, user]);

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-4xl mx-auto p-4 mt-8">
        <SkeletonLoader count={3} />
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-4xl mx-auto p-4 mt-8 text-red-600 bg-white rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Error</h2>
        <p>{error}</p>
      </div>
    </div>
  );
  
  if (!learner) return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-4xl mx-auto p-4 mt-8 bg-white rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Not Found</h2>
        <p>Learner profile not found</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              {learner.profileImageUrl ? (
                <img
                  src={learner.profileImageUrl}
                  alt={`${learner.firstName} ${learner.lastName}`}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center text-4xl font-bold text-blue-600">
                  {learner.firstName?.[0]}
                  {learner.lastName?.[0]}
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {learner.firstName} {learner.lastName}
              </h1>
              
              {ensureArray(learner.preferredLanguages).length > 0 && (
                <div className="flex items-center text-lg text-gray-600 mb-4">
                  <FiGlobe className="mr-2" />
                  Learning {ensureArray(learner.preferredLanguages).join(', ')}
                </div>
              )}
              
              <div className="flex flex-wrap gap-3">
                {learner.proficiencyLevel && (
                  <div className="flex items-center px-3 py-1 bg-blue-50 rounded-full">
                    <FiAward className="mr-2 text-blue-600" />
                    {learner.proficiencyLevel} level
                  </div>
                )}
                
                {learner.createdAt && (
                  <div className="flex items-center px-3 py-1 bg-green-50 rounded-full">
                    <FiUser className="mr-2 text-green-600" />
                    Member since {new Date(learner.createdAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1 space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
              <div className="space-y-3">
                {learner.email && (
                  <div className="flex items-center text-gray-600">
                    <FiMail className="mr-2" />
                    <a href={`mailto:${learner.email}`} className="hover:text-blue-600">
                      {learner.email}
                    </a>
                  </div>
                )}
                
                {learner.phoneNumber && (
                  <div className="flex items-center text-gray-600">
                    <FiPhone className="mr-2" />
                    <a href={`tel:${learner.phoneNumber}`} className="hover:text-blue-600">
                      {learner.phoneNumber}
                    </a>
                  </div>
                )}
                
                {learner.location && (
                  <div className="flex items-center text-gray-600">
                    <FiMapPin className="mr-2" />
                    {learner.location}
                  </div>
                )}
                
                {learner.socialLinks?.length > 0 && (
                  <div className="pt-4">
                    <h3 className="text-sm font-semibold text-gray-500 mb-2">Social Links</h3>
                    <div className="flex gap-3">
                      {learner.socialLinks.map((link, index) => (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-blue-600"
                          title={link.platform}
                        >
                          {SOCIAL_ICONS[link.platform] || SOCIAL_ICONS.other}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Section */}
          <div className="md:col-span-2 space-y-6">
            {/* About Section */}
            {learner.bio && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">About Me</h2>
                <p className="text-gray-600 leading-relaxed">{learner.bio}</p>
              </div>
            )}

            {/* Learning Goals */}
            {learner.learningGoals && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Learning Goals</h2>
                <p className="text-gray-600 leading-relaxed">{learner.learningGoals}</p>
              </div>
            )}

            {/* Languages */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Language Learning</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <FiGlobe className="w-6 h-6 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Learning</p>
                    <p className="font-medium">
                      {ensureArray(learner.preferredLanguages).join(', ') || 'Not specified'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <FiAward className="w-6 h-6 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Proficiency Level</p>
                    <p className="font-medium">
                      {learner.proficiencyLevel || 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnerProfileView;