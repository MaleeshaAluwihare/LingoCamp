import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { auth } from '../../firebaseConfig';
import axios from 'axios';
import { FiBook, FiCalendar, FiTarget, FiSave, FiX } from 'react-icons/fi';
import  NavBar  from '../../components/UI/navBar'

const SkillPlanForm = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    skillDetails: '',
    skillLevel: '',
    resources: '',
    date: ''
  });

  useEffect(() => {
    const fetchSkillPlan = async () => {
      try {
        if (!planId) {
          setError('Skill plan ID is missing');
          setLoading(false);
          return;
        }

        const token = await auth.currentUser.getIdToken();
        const userId = auth.currentUser.uid;

        const response = await axios.get(
          `http://localhost:8081/lingocamp/api/${userId}/skillplans`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const plan = response.data.find(p => p.id === planId);

        if (plan) {
          setFormData({
            skillDetails: plan.skillDetails || '',
            skillLevel: plan.skillLevel || '',
            resources: plan.resources || '',
            date: plan.date || ''
          });
        } else {
          setError('Skill plan not found');
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load skill plan');
      } finally {
        setLoading(false);
      }
    };

    fetchSkillPlan();
  }, [planId]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = await auth.currentUser.getIdToken();
      const userId = auth.currentUser.uid;

      await axios.put(
        `http://localhost:8081/lingocamp/api/${userId}/skillplans/update/${planId}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      navigate('/skill-plans');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update skill plan');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="max-w-6xl mx-auto p-4 mt-8">
          <div className="flex justify-center items-center h-64">
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
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center">
            <FiBook className="text-blue-600 text-2xl mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">Update Skill Plan</h1>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg shadow-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="skillDetails">
              <div className="flex items-center">
                <FiTarget className="text-blue-600 mr-2" />
                <span>Skill Details *</span>
              </div>
            </label>
            <input
              type="text"
              id="skillDetails"
              name="skillDetails"
              value={formData.skillDetails}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Skill you want to develop"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="skillLevel">
              <div className="flex items-center">
                <FiTarget className="text-green-600 mr-2" />
                <span>Current Level *</span>
              </div>
            </label>
            <select
              id="skillLevel"
              name="skillLevel"
              value={formData.skillLevel}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Select Level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="resources">
              <div className="flex items-center">
                <FiBook className="text-blue-600 mr-2" />
                <span>Learning Resources</span>
              </div>
            </label>
            <textarea
              id="resources"
              name="resources"
              value={formData.resources}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Books, courses, websites, etc."
            ></textarea>
          </div>

          <div className="mb-8">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="date">
              <div className="flex items-center">
                <FiCalendar className="text-green-600 mr-2" />
                <span>Target Date *</span>
              </div>
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate('/skill-plans')}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center"
            >
              <FiX className="mr-2" /> Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              <FiSave className="mr-2" />
              {loading ? 'Saving...' : 'Update Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SkillPlanForm;
 