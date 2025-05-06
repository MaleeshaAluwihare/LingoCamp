import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const JobPage = () => {
  const navigate = useNavigate();

  // Sample initial job data for language platform
  const initialJobs = [
    {
      id: 1,
      title: "English Language Tutor",
      department: "Education",
      location: "Remote",
      type: "Part-time",
      language: "English",
      level: "Advanced",
      description: "Teach English to adult learners via video calls. Native speakers preferred. TESOL/TEFL certification required.",
      posted: "3 days ago",
      applicants: 12,
      status: "Active"
    },
    {
      id: 2,
      title: "Spanish Content Translator",
      department: "Content",
      location: "Barcelona, Spain",
      type: "Freelance",
      language: "Spanish",
      level: "Native",
      description: "Translate educational materials from English to Spanish. Must have 2+ years translation experience in education sector.",
      posted: "1 week ago",
      applicants: 8,
      status: "Active"
    },
    {
      id: 3,
      title: "Japanese Language Curriculum Developer",
      department: "Education",
      location: "Tokyo, Japan",
      type: "Full-time",
      language: "Japanese",
      level: "Native",
      description: "Develop structured Japanese language courses for beginner to intermediate learners. Teaching experience required.",
      posted: "2 weeks ago",
      applicants: 15,
      status: "Active"
    }
  ];

  const [jobs, setJobs] = useState(initialJobs);
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [jobForm, setJobForm] = useState({
    title: "",
    department: "Education",
    location: "",
    type: "Part-time",
    language: "",
    level: "Intermediate",
    description: "",
    status: "Active"
  });
  

  const languageOptions = ["English", "Spanish", "French", "German", "Japanese", "Chinese", "Korean", "Italian", "Russian", "Arabic"];
  const levelOptions = ["Beginner", "Intermediate", "Advanced", "Native"];
  const departmentOptions = ["Education", "Content", "Marketing", "Customer Support", "Technology"];
  const jobTypeOptions = ["Full-time", "Part-time", "Freelance", "Contract"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobForm(prev => ({ ...prev, [name]: value }));
  };

  

  const handleSubmitJob = (e) => {
    e.preventDefault();
    
    if (editingJob) {
      setJobs(jobs.map(job => 
        job.id === editingJob.id ? { ...jobForm, id: editingJob.id } : job
      ));
    } else {
      const newJob = {
        id: jobs.length + 1,
        ...jobForm,
        posted: "Just now",
        applicants: 0
      };
      setJobs([newJob, ...jobs]);
    }
    
    setJobForm({
      title: "",
      department: "Education",
      location: "",
      type: "Part-time",
      language: "",
      level: "Intermediate",
      description: "",
      status: "Active"
    });
    setEditingJob(null);
    setShowJobForm(false);
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setJobForm({
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      language: job.language,
      level: job.level,
      description: job.description,
      status: job.status
    });
    setShowJobForm(true);
  };

  const handleDeleteJob = (id) => {
    setJobs(jobs.filter(job => job.id !== id));
  };

  const handleToggleStatus = (id) => {
    setJobs(jobs.map(job => 
      job.id === id 
        ? { ...job, status: job.status === "Active" ? "Inactive" : "Active" } 
        : job
    ));
  };

  return (
    <div className="bg-gray-100 min-h-screen pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Previously Applied Jobs</h1>
            {/* <p className="text-gray-600">Find or post jobs in language education and translation</p> */}
          </div>
          {/* <button 
                  onClick={() => navigate('/postjob')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Post New Job
          </button> */}
        </div>

  

        {/* Job Form */}
        {showJobForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            {/* <h2 className="text-xl font-semibold mb-4">
              {editingJob ? "Edit Job Posting" : "Create New Job Posting"}
            </h2> */}
            <form onSubmit={handleSubmitJob}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Title*</label>
                  <input
                    type="text"
                    name="title"
                    value={jobForm.title}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                    placeholder="e.g. French Language Tutor"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department*</label>
                  <select
                    name="department"
                    value={jobForm.department}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    {departmentOptions.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Language*</label>
                  <select
                    name="language"
                    value={jobForm.language}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select language</option>
                    {languageOptions.map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Proficiency Level*</label>
                  <select
                    name="level"
                    value={jobForm.level}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    {levelOptions.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={jobForm.location}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    placeholder="e.g. Remote, Berlin, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Type*</label>
                  <select
                    name="type"
                    value={jobForm.type}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    {jobTypeOptions.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Description*</label>
                <textarea
                  name="description"
                  value={jobForm.description}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full p-2 border rounded"
                  required
                  placeholder="Describe the responsibilities, requirements, and benefits..."
                ></textarea>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowJobForm(false)}
                  className="px-4 py-2 border rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingJob ? "Update Job" : "Post Job"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Job Listings */}
        <div className="space-y-4">
          {jobs.map(job => (
            <div key={job.id} className={`bg-white rounded-lg shadow p-6 border-l-4 ${job.status === "Active" ? "border-green-500" : "border-gray-300"}`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-semibold">{job.title}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">{job.language} ({job.level})</span>
                    <span className="text-sm bg-gray-100 px-2 py-1 rounded">{job.department}</span>
                    <span className="text-sm bg-gray-100 px-2 py-1 rounded">{job.type}</span>
                  </div>
                </div>
                <div className="text-right">
                  {/* <button
                    onClick={() => handleToggleStatus(job.id)}
                    className={`px-4 py-2 rounded-md text-white ${job.status === "Active" ? "bg-green-500" : "bg-gray-500"}`}
                  >
                    {job.status === "Active" ? "Deactivate" : "Activate"}
                  </button> */}
                </div>
              </div>
              <p className="text-sm text-gray-600">{job.description}</p>
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-500">
                  Posted {job.posted} - {job.applicants} Applicants
                </div>
                <div className="flex space-x-2">
                  {/* <button
                    onClick={() => handleEditJob(job)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                  >
                    Edit
                  </button> */}
                  {/* <button
                    onClick={() => handleDeleteJob(job.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobPage;
