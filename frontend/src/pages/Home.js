import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiGlobe, FiUsers, FiBookOpen, FiBarChart, FiDollarSign, FiAward } from 'react-icons/fi';
import { auth } from '../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from "react-router-dom";
import  Navbar  from '../components/UI/TutorDashBoardNavBar';
import HomeImg1 from '../components/Images/homeImg1.png';
import HomeImg2 from '../components/Images/homeImg2.png';

const HomePage = () => {
    const [user] = useAuthState(auth);
    const [tutorData, setTutorData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isGuest, setIsGuest] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
      const fetchUserData = async () => {
        if(user) {
          try {
            const token = await user.getIdToken();
            const response = await axios.get(`http://localhost:8081/lingocamp/api/tutors/${user.uid}`,
              { headers: { Authorization: `Bearer ${token}`}}
            );
            setTutorData(response.data);
          }catch(error){
            console.error("Error fetching tutor data:", error);
            setTutorData({});
          }
          setLoading(false);
        }
      };
      fetchUserData();
    },[user]);

    const handleDashboardNavigation = () => {
      if (isGuest) {
        const confirm = window.confirm(
          'You need a tutor account to navigate to dashboard. Would you like to register now?'
        );
        if (confirm) {
          navigate('/tutorregistration');
        }
      } else if (user) {
        navigate('/coursedashboard');
      } else {
        const confirm = window.confirm(
          'You need to be logged in to navigate to dashboard. Go to login page now?'
        );
        if (confirm) {
          navigate('/tutorlogin');
        }
      }
    };

    const getDisplayName = () => {
      if(tutorData?.firstName) return tutorData.firstName;
      if(user?.displayName) return user.displayName;
      if(user?.email) return user.email.split('@')[0];
      return "Guest";
    };

    useEffect(() => {
      const guestStatus = localStorage.getItem('isGuest');
      if (user && guestStatus) {
        localStorage.removeItem('isGuest');
        setIsGuest(false);
      } else {
        setIsGuest(!!guestStatus);
      }
    }, [user]);    

    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
          <Navbar/>
      {/* Hero Section */}
       <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20 flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 space-y-8">
              <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
                {!loading && (
                  <span className="block text-2xl text-purple-600 mb-4">
                    Welcome back, {getDisplayName()}!
                  </span>
                )}
                Empower Language Learners
                <span className="text-purple-600"> Worldwide</span>
              </h1>
              <p className="text-xl text-gray-600 md:max-w-2xl mx-auto">
                Shape the future of language learning by creating engaging courses,
                tracking student progress, and connecting with passionate learners globally.
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleDashboardNavigation}
                  className={`${
                    isGuest || !user 
                      ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' 
                      : 'bg-purple-600 hover:bg-purple-700'
                  } text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all transform hover:scale-105`}
                >
                  {user ? 'Go to Dashboard' : 'Start Teaching'}
                </button>
                {!user && (
                  <button
                    onClick={() => navigate('/tutorlogin')}
                    className="bg-white border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-purple-50 transition-colors"
                  >
                    Tutor Login
                  </button>
                )}
              </div>
            </div>
            <div className="lg:w-1/2 mt-12 lg:mt-0">
              <img 
                src={HomeImg1}
                alt="Tutor creating course"
                className="rounded-lg shadow-xl hover:shadow-2xl transition-shadow"
              />
            </div>
          </div>
        </div>
      </main>

      {/* Key Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Your Teaching Toolkit</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <FiBookOpen className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Course Builder</h3>
              <p className="text-gray-600">
                Create structured courses with multimedia content, quizzes, and interactive exercises.
              </p>
            </div>
            
            <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <FiBarChart className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Progress Analytics</h3>
              <p className="text-gray-600">
                Track student performance with detailed analytics and personalized feedback tools.
              </p>
            </div>

            <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <FiUsers className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Student Management</h3>
              <p className="text-gray-600">
                Manage your students, schedule sessions, and communicate through our integrated platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Teaching Benefits Section */}
      <section className="py-16 bg-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <img 
              src={HomeImg2}
              alt="Teaching benefits"
              className="rounded-lg shadow-xl"
            />
            <div>
              <h2 className="text-3xl font-bold mb-8">Why Teach With LingoCamp?</h2>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                    <FiDollarSign className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Earn Competitive Rates</h3>
                    <p className="text-gray-600 mt-2">
                      Set your own rates and get paid securely through our platform.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                    <FiGlobe className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Global Reach</h3>
                    <p className="text-gray-600 mt-2">
                      Connect with students from around the world and teach on your schedule.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                    <FiAward className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Professional Growth</h3>
                    <p className="text-gray-600 mt-2">
                      Access teaching resources and training to enhance your skills.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Teaching?</h2>
          <p className="text-xl mb-8">
            Join our community of 10,000+ language educators and make an impact today!
          </p>
          <button
            onClick={handleDashboardNavigation}
            className="bg-white text-purple-600 px-10 py-4 rounded-xl text-lg font-semibold hover:bg-purple-50 transition-colors"
          >
            {user ? 'Go to Dashboard' : 'Become a Tutor Now'}
          </button>
        </div>
      </section>

      <footer className="bg-gray-800 text-white">
        {/* Keep existing footer structure */}
      </footer>
    </div>
  );
}

export default HomePage;