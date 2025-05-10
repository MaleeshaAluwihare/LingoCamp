import React, { useState } from "react";
import axios from "axios";
import { FiVideo, FiActivity, FiClock, FiTarget, FiAward, FiSmile } from 'react-icons/fi';
import { auth } from '../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import  Navbar  from '../components/UI/HomeNavBar';
import LHome1 from '../components/Images/LHome1.jpg';
import LHome2 from '../components/Images/LHome2.jpg';

const LearnerHomePage = () => {
    const [user] = useAuthState(auth);
    const [learnerData, setLearnerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isGuest, setIsGuest] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
      const fetchUserData = async () => {
        if(user) {
          try {
            const token = await user.getIdToken();
            const response = await axios.get(`http://localhost:8081/lingocamp/api/learners/${user.uid}`,
              { headers: { Authorization: `Bearer ${token}`}}
            );
            setLearnerData(response.data);
          }catch(error){
            console.error("Error fetching learner data:", error);
            setLearnerData({});
          }
          setLoading(false);
        }
      };
      fetchUserData();
    },[user]);

    const handleDashboardNavigation = () => {
      if (!isGuest && user) {
        navigate('/skill-plans');
      }
    }; 

    const getDisplayName = () => {
      if(learnerData?.firstName) return learnerData.firstName;
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      
      {/* Hero Section */}
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-20 flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
              <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
                {!loading && (
                  <span className="block text-2xl text-blue-600 mb-4">
                    Welcome back, {getDisplayName()}!
                  </span>
                )}
                Master Languages Through
                <span className="text-blue-600"> Real Conversations</span>
              </h1>
              <p className="text-xl text-gray-600 md:max-w-2xl mx-auto lg:mx-0">
                Connect with certified tutors and language partners for immersive learning experiences 
                that adapt to your pace and goals.
              </p>
              <div className="flex gap-4 justify-center lg:justify-start">
                <button
                  onClick={handleDashboardNavigation}
                  className={`${
                    isGuest || !user 
                      ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all transform hover:scale-105`}
                >
                  {user ? 'Continue Learning' : 'Start Your Journey'}
                </button>
                {!user && (
                  <button
                    onClick={() => navigate('/learnerlogin')}
                    className="bg-white border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-50 transition-colors"
                  >
                    Learner Login
                  </button>
                )}
              </div>
            </div>
            <div className="lg:w-1/2 mt-12 lg:mt-0">
              <img 
                src={LHome2} 
                alt="Happy language learners"
                className="rounded-lg shadow-xl hover:shadow-2xl transition-shadow"
              />
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose LingoCamp?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <FiVideo className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Live Tutoring</h3>
              <p className="text-gray-600">
                Interactive 1-on-1 sessions with certified language experts.
              </p>
            </div>
            
            <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <FiActivity className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Progress Tracking</h3>
              <p className="text-gray-600">
                Visualize your improvement with personalized analytics dashboards.
              </p>
            </div>

            <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <FiClock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Flexible Scheduling</h3>
              <p className="text-gray-600">
                Learn anytime that works for you - 24/7 availability worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Benefits Section */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-8">Your Path to Fluency</h2>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                    <FiTarget className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Personalized Learning</h3>
                    <p className="text-gray-600 mt-2">
                      Custom lesson plans tailored to your goals and learning style.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                    <FiAward className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Certified Experts</h3>
                    <p className="text-gray-600 mt-2">
                      Learn from qualified tutors with proven teaching experience.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                    <FiSmile className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Community Support</h3>
                    <p className="text-gray-600 mt-2">
                      Join study groups and language exchange communities.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <img 
              src={LHome1} 
              alt="Learning benefits"
              className="rounded-lg shadow-xl order-first md:order-last"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Start Speaking Confidently Today!</h2>
          <p className="text-xl mb-8">
            Join 500,000+ learners who've achieved their language goals with LingoCamp
          </p>
          <button
            onClick={handleDashboardNavigation}
            className="bg-white text-blue-600 px-10 py-4 rounded-xl text-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            {user ? 'Continue Learning' : 'Begin Free Trial'}
          </button>
        </div>
      </section>

      <footer className="bg-gray-800 text-white">
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

export default LearnerHomePage;