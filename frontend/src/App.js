import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import TutorRegistration from './components/TutorManagement/TutorRegistration';
import TutorLogin from './components/TutorManagement/TutorLogin';
import HomePage from './components/Home';
import TutorCompleteProfile from './components/TutorManagement/TutorProfileCompletion';
import TutorProfileUpdate from './components/TutorManagement/TutorProfileUpdate';

import CourseCreate from './components/CourseManagement/CourseCreation';

import JobDashboard from './components/JobManagement/JobDashboard';
import Job from './components/JobManagement/Job';
import Messaging from './components/JobManagement/Messaging';
import PostJob from './components/JobManagement/PostJob';
import JobList from './components/JobManagement/JobList';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught an error:", error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
          <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg text-center">
            <h1 className="text-3xl font-bold text-red-500 mb-4">Something went wrong 😞</h1>
            <p className="text-gray-700 mb-6">
              We’re sorry for the inconvenience. Please try again or go back to the homepage.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={this.handleReload}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Try Again
              </button>
              <a
                href="/home"
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
              >
                Go to Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
    <Router>
      <Routes>
        <Route path='/home' element={<HomePage/>}/>
        <Route path='/tutorlogin' element={<TutorLogin/>}/>
        <Route path='/tutorregistration' element={<TutorRegistration/>}/>
        <Route path='/tutorcompleteprofile' element={<TutorCompleteProfile/>}/>
        <Route path='/tutorprofileupdate' element={<TutorProfileUpdate/>}/>
        <Route path='/coursecreate' element={<CourseCreate/>}/>
        <Route path='/jobdashboard' element={<JobDashboard/>}/>
        <Route path='/job' element={<Job/>}/>
        <Route path='/message' element={<Messaging/>}/>
        <Route path='/postjob' element={<PostJob/>}/>
        <Route path='/joblist' element={<JobList/>}/>
      </Routes>
    </Router>
    </ErrorBoundary>
  );
}

export default App;
