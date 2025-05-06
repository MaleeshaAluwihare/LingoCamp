import React from 'react';
import { Link } from 'react-router-dom';

const CourseDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Course Dashboard</h1>
      
      <div className="flex flex-col space-y-4 w-full max-w-xs">
        {/* New Course Button */}
        <Link
          to="/createcourse"
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg 
                   transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" 
              clipRule="evenodd" 
            />
          </svg>
          <span>New Course</span>
        </Link>

        {/* My Courses Button */}
        <Link
          to="/mycourses"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg 
                   transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2H4a1 1 0 110-2V4zm3 1h2v2H7V5zm0 4h2v2H7V9zm0 4h2v2H7v-2zm6-8h2v2h-2V5zm0 4h2v2h-2V9zm0 4h2v2h-2v-2z" 
              clipRule="evenodd" 
            />
          </svg>
          <span>My Courses</span>
        </Link>
      </div>
    </div>
  );
};

export default CourseDashboard;