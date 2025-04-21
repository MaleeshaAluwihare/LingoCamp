import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebaseConfig';

const CourseDisplay = () => {
  const [courses, setCourses] = useState([]);
  const [user, loading, error] = useAuthState(auth); 

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (!user) return; 

        const token = await user.getIdToken();
        const res = await axios.get('http://localhost:8081/lingocamp/api/courses/mycourses', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setCourses(res.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, [user]); 

  return (
    <div className="p-4">
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {!loading && courses.length === 0 && <p>No courses found.</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {courses.map((course, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <img src={course.coverImage} alt={course.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-semibold">{course.title}</h3>
              <p className="text-gray-600 text-sm line-clamp-2">{course.description.replace(/<[^>]*>?/gm, '')}</p>
              <p className="text-green-600 font-medium mt-2">${course.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseDisplay;
