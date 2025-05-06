import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FiBriefcase, FiGlobe, FiMail, FiPhone, FiUser, FiLink, FiAward } from 'react-icons/fi';
import {SkeletonLoader} from '../../components/UI/SkeletonLoader';

const TutorProfile = () => {
  const { tutoruid } = useParams();
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/lingocamp/api/tutors/public/${tutoruid}`);
        setTutor(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load tutor profile');
      } finally {
        setLoading(false);
      }
    };

    fetchTutor();
  }, [tutoruid]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <SkeletonLoader count={3} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-red-600">
        {error}
      </div>
    );
  }

  if (!tutor) {
    return <div className="max-w-4xl mx-auto p-4">Tutor not found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative">
            {tutor.profileImageUrl ? (
              <img
                src={tutor.profileImageUrl}
                alt={`${tutor.firstName} ${tutor.lastName}`}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center text-4xl font-bold text-blue-600">
                {tutor.firstName?.[0]}
                {tutor.lastName?.[0]}
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {tutor.firstName} {tutor.lastName}
            </h1>
            {tutor.specialization?.length > 0 && (
              <div className="flex items-center text-lg text-gray-600 mb-4">
                <FiBriefcase className="mr-2" />
                Teaches {tutor.specialization.join(', ')}
              </div>
            )}
            
            <div className="flex flex-wrap gap-3">
              {tutor.experience && (
                <div className="flex items-center px-3 py-1 bg-blue-50 rounded-full">
                  <FiAward className="mr-2 text-blue-600" />
                  {tutor.experience}+ years experience
                </div>
              )}
              
              {tutor.createdAt && (
                <div className="flex items-center px-3 py-1 bg-green-50 rounded-full">
                  <FiUser className="mr-2 text-green-600" />
                  Member since {new Date(tutor.createdAt.seconds * 1000).getFullYear()}
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
              {tutor.email && (
                <div className="flex items-center text-gray-600">
                  <FiMail className="mr-2" />
                  <a href={`mailto:${tutor.email}`} className="hover:text-blue-600">
                    {tutor.email}
                  </a>
                </div>
              )}
              
              {tutor.phoneNumber && (
                <div className="flex items-center text-gray-600">
                  <FiPhone className="mr-2" />
                  <a href={`tel:${tutor.phoneNumber}`} className="hover:text-blue-600">
                    {tutor.phoneNumber}
                  </a>
                </div>
              )}
              
              {tutor.socialLinks?.length > 0 && (
                <div className="pt-4">
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">Social Links</h3>
                  <div className="flex gap-3">
                    {tutor.socialLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-600"
                      >
                        <FiLink className="w-5 h-5" />
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
          {tutor.bio && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">About Me</h2>
              <p className="text-gray-600 leading-relaxed">{tutor.bio}</p>
            </div>
          )}

          {/* Teaching Details */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Teaching Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <FiBriefcase className="w-6 h-6 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Experience</p>
                  <p className="font-medium">
                    {tutor.experience || 'Not specified'} years
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <FiGlobe className="w-6 h-6 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Languages</p>
                  <p className="font-medium">
                    {tutor.specialization?.join(', ') || 'Not specified'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorProfile;