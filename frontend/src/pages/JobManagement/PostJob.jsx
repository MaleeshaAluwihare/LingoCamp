import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PostLanguageJob = () => {
  const navigate = useNavigate();
  const [jobForm, setJobForm] = useState({
    title: "",
    category: "Teaching",
    location: "",
    type: "Part-time",
    language: "English",
    proficiency: "Intermediate",
    certification: "None",
    remote: false,
    jobType: "Onsite", // Added jobType field
    description: "",
    status: "Active"
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setJobForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmitJob = (e) => {
    e.preventDefault();
    console.log("Language Job Submitted:", jobForm);
    navigate('/job'); // Redirect back to the job listings
  };

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-xl font-semibold mb-4">Post a Language Related Job</h2>
        <form onSubmit={handleSubmitJob}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Job Title*</label>
            <input
              type="text"
              name="title"
              value={jobForm.title}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select name="category" value={jobForm.category} onChange={handleInputChange} className="w-full p-2 border rounded">
              <option>Teaching</option>
              <option>Translation</option>
              <option>Curriculum Development</option>
              <option>Linguistic Research</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Language</label>
            <select name="language" value={jobForm.language} onChange={handleInputChange} className="w-full p-2 border rounded">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>Japanese</option>
              <option>Mandarin</option>
              <option>German</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Proficiency Required</label>
            <select name="proficiency" value={jobForm.proficiency} onChange={handleInputChange} className="w-full p-2 border rounded">
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
              <option>Native</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Certification Required</label>
            <select name="certification" value={jobForm.certification} onChange={handleInputChange} className="w-full p-2 border rounded">
              <option>None</option>
              <option>TESOL</option>
              <option>TEFL</option>
              <option>CELTA</option>
              <option>Other</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Job Type</label>
            <select name="jobType" value={jobForm.jobType} onChange={handleInputChange} className="w-full p-2 border rounded">
              <option>Onsite</option>
              <option>Remote</option>
              <option>Work from Home</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Job Description*</label>
            <textarea
              name="description"
              value={jobForm.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => navigate('/job')}
              className="px-4 py-2 border rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Post Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostLanguageJob;
