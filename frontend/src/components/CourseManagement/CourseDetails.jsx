import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import { InstructorSkeleton } from '../../components/UI/SkeletonLoader';
import Man from '../UI/man.png'
import { FiClock, FiBook, FiUsers, FiCheckCircle, FiArrowRight } from 'react-icons/fi';

export default function CourseDetails({ course, onBack }) {
  const [instructor, setInstructor] = useState(null);
  const [loadingInstructor, setLoadingInstructor] = useState(true);
  const [instructorError, setInstructorError] = useState(null);

  useEffect(() => {
    const fetchInstructor = async () => {
      if (course?.tutorId) {
        try {
          setLoadingInstructor(true);
          const response = await axios.get(`http://localhost:8081/lingocamp/api/tutors/public/${course.tutorId}`);
          console.log(response.data);
          setInstructor(response.data);
          setInstructorError(null);
        } catch (error) {
          console.error('Error fetching instructor:', error);
          setInstructorError('Failed to load instructor information');
        } finally {
          setLoadingInstructor(false);
        }
      }
    };

    fetchInstructor();
  }, [course?.tutorId]);

  if (!course) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Sticky Purchase Bar */}
      <div className="sticky bottom-0 bg-white border-t shadow-lg py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-blue-600 flex items-center">
              {course.price.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD'
              })}
            </p>
            <p className="text-sm text-gray-500">30-day money-back guarantee</p>
          </div>
          <button 
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg 
                      hover:from-blue-600 hover:to-blue-700 transition-all flex items-center"
          >
            <FiCheckCircle className="mr-2" />
            Enroll Now
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-sm">
        {/* Course Header */}
        <div className="relative">
          <button 
            onClick={onBack}
            className="absolute top-4 left-4 bg-white/90 px-4 py-2 rounded-lg shadow-sm
                      hover:bg-white transition-all flex items-center"
          >
            ← Back to Courses
          </button>
          <img 
            src={course.coverImage} 
            alt={course.title} 
            className="w-full h-64 object-cover rounded-t-2xl"
          />
        </div>

        {/* Course Meta */}
        <div className="p-6 border-b">
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center bg-blue-50 px-3 py-1 rounded-lg">
              <FiClock className="text-blue-600 mr-2" />
              <span className="text-sm">{course.duration} Hours</span>
            </div>
            <div className="flex items-center bg-blue-50 px-3 py-1 rounded-lg">
              <FiBook className="text-blue-600 mr-2" />
              <span className="text-sm">{course.lessons} Lessons</span>
            </div>
            <div className="flex items-center bg-blue-50 px-3 py-1 rounded-lg">
              <FiUsers className="text-blue-600 mr-2" />
              <span className="text-sm">{course.enrolled} Enrolled</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
          <div className="flex items-center mb-4">
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm mr-2">
              Bestseller
            </span>
            <div className="flex items-center">
              ★★★★☆ (4.5/5)
              <span className="ml-2 text-gray-500">128 reviews</span>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="grid md:grid-cols-3 gap-8 p-6">
          {/* Main Description */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">What You'll Learn</h2>
            <div 
              className="prose max-w-none mb-8"
              dangerouslySetInnerHTML={{ __html: course.introduction }} 
            />

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">Course Content</h3>
              <div className="space-y-2">
                {course.curriculum?.map((module, index) => (
                  <div key={index} className="border rounded-lg p-3 hover:bg-gray-50">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{module.title}</span>
                      <span className="text-sm text-gray-500">{module.lessons} lessons</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Includes</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Full lifetime access</li>
                <li>Certificate of completion</li>
                <li>Q&A section</li>
                <li>Downloadable resources</li>
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="sticky top-20 space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Course Features</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <FiClock className="mr-2 text-blue-600" />
                    <span>Beginner Friendly</span>
                  </li>
                  <li className="flex items-center">
                    <FiBook className="mr-2 text-blue-600" />
                    <span>Hands-on Exercises</span>
                  </li>
                  <li className="flex items-center">
                    <FiUsers className="mr-2 text-blue-600" />
                    <span>Personal Feedback</span>
                  </li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Meet Your Instructor</h3>
                
                {loadingInstructor ? (
                  <InstructorSkeleton />
                ) : instructorError ? (
                  <div className="text-red-600 text-sm">
                    {instructorError}
                  </div>
                ) : instructor ? (
                  <>
                    <div className="flex items-center mb-3">
                      <img 
                        src={instructor.profileImageUrl || Man}
                        className="w-12 h-12 rounded-full mr-3"
                        alt={instructor.firstName}
                        onError={(e) => {
                          e.target.src = Man;
                        }}
                      />
                      <div>
                        <p className="font-medium">{instructor.firstName}</p>
                        <p className="text-sm text-gray-500">
                          {instructor.specialization || 'Language Expert'}
                        </p>
                        <Link 
                          to={`/tutors/${instructor.uid}`}
                          className="group inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm"
                          aria-label={`View ${instructor.firstName}'s full profile`}
                          title="Explore tutor's qualifications and experience"
                        >
                          <span className="relative border-b border-transparent group-hover:border-blue-600 pb-0.5 transition-all">
                            See Full Profile
                          </span>
                          <FiArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center text-gray-500">
                    <FiUsers className="mr-2" />
                    Instructor information not available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}