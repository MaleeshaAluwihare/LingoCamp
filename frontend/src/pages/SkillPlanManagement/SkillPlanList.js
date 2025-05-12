import React, { useState, useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SkillPlansView = ({ token }) => {
  const [skillPlans, setSkillPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSkillPlans = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8081/lingocamp/api/skillPlans/mySkillPlans',
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        setSkillPlans(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch skill plans');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSkillPlans();
  }, [token]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this skill plan?')) {
      try {
        await axios.delete(
          `http://localhost:8081/lingocamp/api/skillPlans/delete/${id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        setSkillPlans(skillPlans.filter(plan => plan.id !== id));
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete skill plan');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My Skill Plans</h1>
        <button
          onClick={() => navigate('/skill-plans/add')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
        >
          <FiPlus className="mr-2" /> Add New Plan
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          {error}
        </div>
      )}

      <div className="grid gap-6">
        {skillPlans.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No skill plans found</p>
            <button
              onClick={() => navigate('/skill-plans/add')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
            >
              Create Your First Plan
            </button>
          </div>
        ) : (
          skillPlans.map(plan => (
            <div key={plan.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">{plan.skillDetails}</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate(`/skill-plans/edit/${plan.id}`)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(plan.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="font-medium">Level:</span> {plan.skillLevel}
                </div>
                <div>
                  <span className="font-medium">Target Date:</span> {plan.date}
                </div>
              </div>
              
              {plan.resources && (
                <div>
                  <h3 className="font-medium mb-2">Resources:</h3>
                  <p className="whitespace-pre-line">{plan.resources}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SkillPlansView;