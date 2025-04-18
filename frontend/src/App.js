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
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Error Boundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please try again.</h1>;
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
