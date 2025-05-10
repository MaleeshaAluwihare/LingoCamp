import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiBook, FiCalendar, FiTarget } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebaseConfig';
import axios from 'axios';
import  NavBar  from '../../components/UI/TutorDashBoardNavBar'

const SkillPlansView = () => {
  const [skillPlans, setSkillPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSkillPlans = async () => {
      try {
        // Get current user's token
        const token = await auth.currentUser.getIdToken();
        const userId = auth.currentUser.uid;
        
        // Use the correct API endpoint structure that matches your backend
        const response = await axios.get(
          `http://localhost:8081/lingocamp/api/${userId}/skillplans`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        // Set the skill plans directly - the backend already filters by user
        setSkillPlans(response.data);
      } catch (err) {
        console.error('Error fetching skill plans:', err);
        setError(err.response?.data?.error || 'Failed to fetch skill plans');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSkillPlans();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this skill plan?')) {
      try {
        const token = await auth.currentUser.getIdToken();
        const userId = auth.currentUser.uid;
        
        // Use the correct delete endpoint structure that matches your backend
        await axios.delete(
          `http://localhost:8081/lingocamp/api/${userId}/skillplans/delete/${id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        setSkillPlans(skillPlans.filter(plan => plan.id !== id));
      } catch (err) {
        console.error('Error deleting skill plan:', err);
        setError(err.response?.data?.error || 'Failed to delete skill plan');
      }
    }
  };

  const handleEdit = (planId) => {
    navigate(`/skill-plans/edit/${planId}`);
  };

  

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="max-w-6xl mx-auto p-4 mt-8">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Section - Styled like profile page */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">My Skill Plans</h1>
            <button
              onClick={() => navigate('/skill-plans/add')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <FiPlus className="mr-2" /> Add New Plan
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg shadow-sm">
            {error}
          </div>
        )}

        {/* Skill Plans Grid */}
        <div className="space-y-6">
          {skillPlans.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="flex justify-center mb-4">
                <FiBook className="text-4xl text-blue-500" />
              </div>
              <p className="text-gray-600 mb-4">No skill plans found</p>
              <button
                onClick={() => navigate('/skill-plans/add')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
              >
                Create Your First Plan
              </button>
            </div>
          ) : (
            skillPlans.map(plan => (
              <div key={plan.id} className="bg-blue-200/10 rounded-xl shadow-sm p-6 transition-shadow hover:shadow-md">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">{plan.skillDetails}</h2>
                  <div className="flex space-x-2">
                  <button onClick={() => handleEdit(plan.id)} className="text-blue-600 hover:underline">
                      <FiEdit2 className="mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(plan.id)}
                      className="text-red-600 hover:text-red-800 flex items-center"
                    >
                      <FiTrash2 className="mr-1" /> Delete
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center">
                    <FiTarget className="text-blue-600 mr-2" />
                    <div>
                      <span className="text-sm text-gray-500">Level</span>
                      <p className="font-medium">{plan.skillLevel}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FiCalendar className="text-green-600 mr-2" />
                    <div>
                      <span className="text-sm text-gray-500">Target Date</span>
                      <p className="font-medium">{plan.date}</p>
                    </div>
                  </div>
                </div>
                
                {plan.resources && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h3 className="font-medium text-gray-700 mb-2">Resources:</h3>
                    <p className="whitespace-pre-line text-gray-600">{plan.resources}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillPlansView;