import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import { auth } from '../../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { InstructorSkeleton } from '../../components/UI/SkeletonLoader';
import Man from '../UI/man.png'
import { FiClock, FiBook, FiUsers, FiCheckCircle, FiArrowRight, FiShield, FiArrowLeft, FiStar, FiChevronRight, FiInbox, FiAward, FiMessageSquare, FiDownload, FiCode, FiUserCheck, FiUserX } from 'react-icons/fi';

export default function CourseDetails({ course, onBack }) {
  const [instructor, setInstructor] = useState(null);
  const [loadingInstructor, setLoadingInstructor] = useState(true);
  const [instructorError, setInstructorError] = useState(null);

  const userId = auth.currentUser?.uid;
  
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

  const handleEnroll = async () => {
    if (!userId || !course?.courseId || !course?.tutorId) {
      alert("Missing required information for enrollment.");
      return;
    }

    try {
      const enrollment = {
        courseId: course.courseId,
        courseName: course.title,
        tutorId: course.tutorId,
        learnerId: userId,
        amountPaid: course.price
      };

      await axios.post("http://localhost:8081/lingocamp/api/courses/enroll", enrollment);
      alert("Enrollment successful!");
    } catch (error) {
      console.error("Enrollment failed:", error);
      alert("Enrollment failed. Please try again.");
    }
  };


  if (!course) return null;

  return (
    <div className='min-h-screen bg-gray-50'>       
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Sticky Purchase Bar */}
      <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-gray-100 shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <p className="text-3xl font-bold text-gray-900 flex items-center justify-center sm:justify-start">
                <span className="text-blue-600">
                  {course.price.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  })}
                </span>
                <span className="ml-3 text-sm font-normal text-gray-500 line-through">
                  $199.99
                </span>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                <FiShield className="inline mr-1 text-green-500" />
                30-day money-back guarantee
              </p>
            </div>
            <button 
              onClick={handleEnroll}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl 
                        hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-[1.02] 
                        flex items-center justify-center shadow-lg shadow-blue-100"
            >
              <FiCheckCircle className="mr-2 w-5 h-5" />
              Enroll Now
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Course Header */}
        <div className="relative">
          <button 
            onClick={onBack}
            className="absolute top-4 left-4 bg-white/90 px-4 py-2.5 rounded-lg shadow-sm
                      hover:bg-white transition-all flex items-center text-gray-600 hover:text-gray-900
                      backdrop-blur-sm z-10"
          >
            <FiArrowLeft className="mr-2" />
            Back to Courses
          </button>
          <div className="aspect-video bg-gray-100 overflow-hidden">
            <img 
              src={course.coverImage} 
              alt={course.title} 
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>

        {/* Course Meta */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-wrap gap-3 mb-5">
            <div className="flex items-center bg-blue-50/80 px-3.5 py-1.5 rounded-lg border border-blue-100">
              <FiClock className="text-blue-600 mr-2 w-4 h-4" />
              <span className="text-sm font-medium text-gray-700">{course.duration} Hours</span>
            </div>
            <div className="flex items-center bg-purple-50/80 px-3.5 py-1.5 rounded-lg border border-purple-100">
              <FiBook className="text-purple-600 mr-2 w-4 h-4" />
              <span className="text-sm font-medium text-gray-700">{course.lessons} Lessons</span>
            </div>
            <div className="flex items-center bg-green-50/80 px-3.5 py-1.5 rounded-lg border border-green-100">
              <FiUsers className="text-green-600 mr-2 w-4 h-4" />
              <span className="text-sm font-medium text-gray-700">{course.enrolled} Enrolled</span>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-3">{course.title}</h1>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex items-center bg-yellow-100 px-2.5 py-1 rounded-full">
              <span className="text-sm font-semibold text-yellow-800">Bestseller</span>
            </div>
            <div className="flex items-center">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className={`w-5 h-5 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`} />
                ))}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-600">4.5/5</span>
              <span className="ml-2 text-sm text-gray-500">(128 reviews)</span>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="grid lg:grid-cols-[1fr_350px] gap-8 p-6">
          {/* Main Content */}
          <div className="space-y-8">
            <section className="prose max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What You'll Learn</h2>
              <div 
                className="text-gray-600 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: course.introduction }} 
              />
            </section>

            <section className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">Course Content</h3>
              <div className="space-y-4">
                {course.curriculum?.map((module, index) => (
                  <div 
                    key={index} 
                    className="group border rounded-xl p-4 hover:border-blue-100 hover:bg-gray-50/50 transition-colors cursor-pointer"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-gray-900">{module.title}</h4>
                        <p className="text-sm text-gray-500 mt-1">{module.description}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">{module.lessons} lessons</span>
                        <FiChevronRight className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Course Includes</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <li className="flex items-center">
                  <FiInbox className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="text-gray-700">Full lifetime access</span>
                </li>
                <li className="flex items-center">
                  <FiAward className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="text-gray-700">Certificate of completion</span>
                </li>
                <li className="flex items-center">
                  <FiMessageSquare className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="text-gray-700">Q&A section</span>
                </li>
                <li className="flex items-center">
                  <FiDownload className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="text-gray-700">Downloadable resources</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="sticky top-24">
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Features</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <FiClock className="w-5 h-5 text-blue-600 mr-3 mt-1" />
                      <div>
                        <p className="font-medium text-gray-900">Beginner Friendly</p>
                        <p className="text-sm text-gray-500 mt-1">No prior experience needed</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <FiCode className="w-5 h-5 text-blue-600 mr-3 mt-1" />
                      <div>
                        <p className="font-medium text-gray-900">Hands-on Exercises</p>
                        <p className="text-sm text-gray-500 mt-1">15 practical exercises included</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <FiUserCheck className="w-5 h-5 text-blue-600 mr-3 mt-1" />
                      <div>
                        <p className="font-medium text-gray-900">Personal Feedback</p>
                        <p className="text-sm text-gray-500 mt-1">From industry experts</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Instructor</h3>
                  {loadingInstructor ? (
                    <InstructorSkeleton />
                  ) : instructorError ? (
                    <div className="text-red-600 text-sm">{instructorError}</div>
                  ) : instructor ? (
                    <div className="flex flex-col items-center text-center">
                      <img 
                        src={instructor.profileImageUrl || Man} 
                        className="w-20 h-20 rounded-full mb-4 object-cover border-4 border-white shadow-sm"
                        alt={instructor.firstName}
                        onError={(e) => e.target.src = Man}
                      />
                      <div className="mb-3">
                        <p className="font-semibold text-gray-900 text-lg">{instructor.firstName}</p>
                        <p className="text-sm text-gray-500">
                          {instructor.specialization || 'Language Education Expert'}
                        </p>
                      </div>
                      <Link 
                        to={`/tutors/${instructor.uid}`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 group font-medium"
                      >
                        View Full Profile
                        <FiArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <FiUserX className="w-8 h-8 mx-auto mb-2" />
                      Instructor information not available
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}