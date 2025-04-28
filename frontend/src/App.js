import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TutorRegistration from './components/TutorManagement/TutorRegistration';
import TutorLogin from './components/TutorManagement/TutorLogin';
import HomePage from './components/Home';
import TutorCompleteProfile from './components/TutorManagement/TutorProfileCompletion';
import TutorProfileUpdate from './components/TutorManagement/TutorProfileUpdate';

import CreateCourse from './components/CourseManagement/CourseCreation';
import CourseDisplay from './components/CourseManagement/CourseDisplay';
import CourseDashboard from './components/CourseManagement/CourseDashboard';
import CourseUpdate from './components/CourseManagement/CourseUpdate';

import JobDashboard from './components/JobManagement/JobDashboard';
import Job from './components/JobManagement/Job';
import Messaging from './components/JobManagement/Messaging';
import PostJob from './components/JobManagement/PostJob';
import JobList from './components/JobManagement/JobList';
import AllCompanyPosts from './components/JobManagement/AllCompanyPosts';
import CompanyProfile from './components/JobManagement/CompanyProfile';
import AllPosts from './components/AllPost';


function App() {
  return (
    <Router>
      <Routes>
        <Route path='/home' element={<HomePage/>}/>
        <Route path='/tutorlogin' element={<TutorLogin/>}/>
        <Route path='/tutorregistration' element={<TutorRegistration/>}/>
        <Route path='/tutorcompleteprofile' element={<TutorCompleteProfile/>}/>
        <Route path='/tutorprofileupdate' element={<TutorProfileUpdate/>}/>

        <Route path='/coursedashboard' element={<CourseDashboard/>}/>
        <Route path='/createcourse' element={<CreateCourse/>}/>
        <Route path="/updatecourse/:courseId" element={<CourseUpdate/>}/>
        <Route path='/mycourses' element={<CourseDisplay/>}/>

        <Route path='/jobdashboard' element={<JobDashboard/>}/>
        <Route path='/job' element={<Job/>}/>
        <Route path='/message' element={<Messaging/>}/>
        <Route path='/postjob' element={<PostJob/>}/>
        <Route path='/joblist' element={<JobList/>}/>

        <Route path='/allpost' element={<AllCompanyPosts/>}/>
        <Route path="/company-profile" element={<CompanyProfile />} />
        <Route path="/allpost-learner" element={<AllPosts />} />
        


      </Routes>
    </Router>

    

  );
}

export default App;
