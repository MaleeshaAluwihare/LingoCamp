import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiGlobe, FiUsers, FiSmartphone } from 'react-icons/fi';
import { auth } from '../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from "react-router-dom";
import  Navbar  from '../components/UI/navBar';

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
      <div className="min-h-screen bg-gray-50">
        <Navbar/>
      {/* Hero Section */}
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              {!loading && (
                <span className="block text-2xl text-blue-600 mb-4">
                  Welcome back, {getDisplayName()}!
                </span>
              )}
              Learn Languages Naturally with
              <span className="text-blue-600"> LingoCamp</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Immerse yourself in real conversations with native speakers from around the world.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <button
                onClick={handleDashboardNavigation}
                className={`${
                  isGuest || !user ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
                } text-white p-3 rounded-lg transition-colors`}
                title={isGuest ? "Guest users cannot started" : !user ? "Login to navigate" : ""}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-12 bg-white" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
              <FiUsers className="h-12 w-12 text-blue-600" />
              <h3 className="mt-4 text-xl font-semibold">Native Speakers</h3>
              <p className="mt-2 text-gray-500">
                Connect with language partners who are native speakers of your target language.
              </p>
            </div>
            <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
              <FiSmartphone className="h-12 w-12 text-blue-600" />
              <h3 className="mt-4 text-xl font-semibold">Mobile Friendly</h3>
              <p className="mt-2 text-gray-500">
                Learn anywhere, anytime with our mobile-optimized platform.
              </p>
            </div>
            <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
              <FiGlobe className="h-12 w-12 text-blue-600" />
              <h3 className="mt-4 text-xl font-semibold">100+ Languages</h3>
              <p className="mt-2 text-gray-500">
                Choose from a wide variety of languages and dialects from around the world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-400">
              © 2023 LingoCamp. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;