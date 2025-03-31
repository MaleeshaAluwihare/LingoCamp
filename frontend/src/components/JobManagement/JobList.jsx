import React from 'react';

const JobList = ({ jobs }) => {
  // Ensure that jobs is always an array
  const jobList = Array.isArray(jobs) ? jobs : [];

  return (
    <div className="bg-gray-100 min-h-screen pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Language Related Opportunities</h1>
          <p className="text-gray-600">Browse through the available job postings</p>
        </div>

        {/* Job Listings */}
        <div className="space-y-4">
          {jobList.length > 0 ? (
            jobList.map(job => (
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
                </div>
                <p className="text-sm text-gray-600">{job.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-gray-500">
                    Posted {job.posted} - {job.applicants} Applicants
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No jobs available at the moment.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobList;
