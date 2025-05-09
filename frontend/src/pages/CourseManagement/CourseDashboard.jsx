import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import { auth } from '../../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import  Navbar  from '../../components/UI/navBar'

ChartJS.register(...registerables);

const CourseDashboard = () => {
  const [user] = useAuthState(auth);
  const [salesData, setSalesData] = useState(null);
  const [courseSalesData, setCourseSalesData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const token = await user.getIdToken();
          const headers = { headers: { Authorization: `Bearer ${token}` } };
          
          const [salesRes, courseSalesRes] = await Promise.all([
            axios.get(`http://localhost:8081/lingocamp/api/courses/sales/stats/${user.uid}`, headers),
            axios.get(`http://localhost:8081/lingocamp/api/courses/sales/by-course/${user.uid}`, headers)
          ]);

          setSalesData(salesRes.data);
          setCourseSalesData(courseSalesRes.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [user]);

  // Chart data configurations
  const revenueByCourseData = {
    labels: courseSalesData?.map(course => course.courseName) || [],
    datasets: [{
      label: 'Total Revenue',
      data: courseSalesData?.map(course => course.totalRevenue) || [],
      backgroundColor: ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'],
      borderWidth: 0,
    }]
  };

  const salesDistributionData = {
    labels: courseSalesData?.map(course => course.courseName) || [],
    datasets: [{
      label: 'Sales Distribution',
      data: courseSalesData?.map(course => course.salesCount) || [],
      backgroundColor: ['#60A5FA', '#34D399', '#A78BFA', '#FBBF24'],
      borderWidth: 0,
    }]
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className="mb-8">
          <Navbar />
      </div>  
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Course Dashboard</h1>
          <div className="flex flex-row space-x-2">
            <Link
              to="/createcourse"
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg 
                      transition-colors duration-200 flex items-center space-x-2 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>New Course</span>
            </Link>
            <Link
              to="/mycourses"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg 
                      transition-colors duration-200 flex items-center space-x-2 text-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385V4.804zM11 4.804c1.282.874 2.831 1.385 4.5 1.385 1.255 0 2.443-.29 3.5-.804v10A7.969 7.969 0 0015.5 14c-1.669 0-3.218-.51-4.5-1.385V4.804z" />
              </svg>
              <span>My Courses</span>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading dashboard data...</div>
        ) : (
          <>
            {/* Stats Cards */}
            <h2 className="text-xl font-semibold text-gray-700 mb-6">Sales Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-800">
                      ${salesData?.totalRevenue?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Your Earnings</p>
                    <p className="text-2xl font-bold text-green-800">
                      ${salesData?.tutorEarnings?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                  <div className="bg-green-100 p-2 rounded-lg">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Courses Sold</p>
                    <p className="text-2xl font-bold text-purple-800">
                      {salesData?.totalCoursesSold || 0}
                    </p>
                  </div>
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4">Revenue by Course</h3>
                {courseSalesData?.length > 0 ? (
                  <Bar 
                    data={revenueByCourseData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { display: false },
                        tooltip: {
                          callbacks: {
                            label: (context) => ` $${context.parsed.y.toFixed(2)}`
                          }
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: { callback: (value) => `$${value}` }
                        }
                      }
                    }}
                  />
                ) : (
                  <div className="text-gray-400 text-center py-8">No revenue data available</div>
                )}
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4">Sales Distribution</h3>
                {courseSalesData?.length > 0 ? (
                  <Pie 
                    data={salesDistributionData}
                    options={{
                      responsive: true,
                      plugins: {
                        tooltip: {
                          callbacks: {
                            label: (context) => ` ${context.label}: ${context.parsed} sales`
                          }
                        }
                      }
                    }}
                  />
                ) : (
                  <div className="text-gray-400 text-center py-8">No sales distribution data</div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CourseDashboard;