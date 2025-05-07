import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebaseConfig';
import { Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { FiFilter,FiSliders,FiBook,FiInfo } from 'react-icons/fi';
import  Navbar  from '../../components/UI/navBar'


const CourseDisplay = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [uniqueCategories, setUniqueCategories] = useState([]);
  const [user, loading, error] = useAuthState(auth); 
  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (!user) return;

        const token = await user.getIdToken();
        const res = await axios.get('http://localhost:8081/lingocamp/api/courses/mycourses', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const allCourses = res.data;
        setCourses(allCourses);
        
        const categories = [...new Set(allCourses.map(course => course.categories).filter(Boolean))];
        setUniqueCategories(categories);

      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    fetchCourses();
  }, [user]);

  useEffect(() => {
    const filtered = courses.filter(course => {
      const statusMatch = selectedStatus === 'all' || course.status === selectedStatus;
      const categoryMatch = selectedCategory === 'all' || course.categories === selectedCategory;
      return statusMatch && categoryMatch;
    });
    setFilteredCourses(filtered);
  }, [selectedStatus, selectedCategory, courses]);

  const handleDelete = async (courseId) => {
    confirmAlert({
      title: 'Confirm Deletion',
      message: 'Are you sure you want to remove this course?',
      buttons: [
        {
          text: 'Cancel',
          className: "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transitionmr-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50",
          style: { 
            fontWeight: 'bold', 
            color: '#1f2937',
            backgroundColor: 'transparent'
          }
        },
        { 
          text: 'Delete',
          className: "bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition",
          style: { 
            backgroundColor: '#ef4444', 
            color: 'white', 
            fontWeight: 'bold',
            border: 'none'
          },
          onClick: async () => {
            try {
              const token = await user.getIdToken();
              await axios.delete(`http://localhost:8081/lingocamp/api/courses/deletecourse/${courseId}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              setCourses(courses.filter(course => course.courseId !== courseId));
            } catch (error) {
              console.error('Error deleting course:', error);
            }
          }
        }
      ]
    });
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className="mb-8">
          <Navbar />
      </div>      
      <div className="p-4 max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">My Courses</h1>
          <Link 
            to="/createcourse" 
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Create New Course
          </Link>
        </div>

        {/* Filters Section */}
        <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-700 mb-6 flex items-center gap-2">
            <FiFilter className="w-5 h-5 text-green-600" />
            Filter Courses
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status Filter */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FiSliders className="w-4 h-4 text-green-600" />
                <span>Course Status</span>
              </div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all cursor-pointer appearance-none"
              >
                <option value="all" className="text-gray-400">All Statuses</option>
                <option value="DRAFT" className="flex items-center gap-2">
                🔴 Draft
                </option>
                <option value="PUBLISHED" className="flex items-center gap-2">
                🟢  Published
                </option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FiBook className="w-4 h-4 text-green-600" />
                <span>Course Category</span>
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all cursor-pointer appearance-none"
              >
                <option value="all" className="text-gray-400">All Categories</option>
                {uniqueCategories.map((category, index) => (
                  <option 
                    key={index} 
                    value={category}
                    className="flex items-center gap-2"
                  >
                    🌐 {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Helper Text */}
          <p className="mt-4 text-sm text-gray-500 flex items-center gap-2">
            <FiInfo className="w-4 h-4 text-green-600" />
            Select filters to narrow down your course list
          </p>
        </div>

        {/* Courses Grid */}
        {loading && (
          <div className="text-center py-8">Loading courses...</div>
        )}

        {error && (
          <div className="text-red-600 text-center py-8">Error: {error.message}</div>
        )}

        {!loading && !error && filteredCourses.length === 0 && (
          <div className="text-center py-8 text-gray-500">No courses found matching your criteria</div>
        )}

        {!loading && !error && filteredCourses.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div key={course.courseId} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={course.coverImage || 'https://placehold.co/400x200?text=No+Image'}
                    alt={course.title || 'Course cover image'}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/400x200?text=Image+Error';
                      e.target.onerror = null;
                    }}
                  />
                  <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
                    <span className="px-2 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {course.categories || 'Uncategorized'}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                      course.status === 'PUBLISHED' 
                        ? 'bg-green-100 text-green-800' 
                        : course.status === 'DRAFT'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {course.status}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{course.title || 'Untitled Course'}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {course.description?.replace(/<[^>]*>?/gm, '') || 'No description available'}
                  </p>

                  <div className="flex items-center justify-between">
                    <p className="text-green-600 font-medium">
                      {course.price !== undefined && course.price !== null
                        ? `$${course.price}`
                        : 'Free'}
                    </p>
                    <div className="flex gap-2">
                      <Link
                        to={`/updatecourse/${course.courseId}`}
                        className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Update
                      </Link>
                      <button
                        onClick={() => handleDelete(course.courseId)}
                        className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default CourseDisplay;