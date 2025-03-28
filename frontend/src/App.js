import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TutorRegistration from './components/TutorManagement/TutorRegistration';
import TutorLogin from './components/TutorManagement/TutorLogin';
import HomePage from './components/Home';
import TutorCompleteProfile from './components/TutorManagement/TutorProfileCompletion';
import TutorProfileUpdate from './components/TutorManagement/TutorProfileUpdate';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/home' element={<HomePage/>}/>
        <Route path='/tutorlogin' element={<TutorLogin/>}/>
        <Route path='/tutorregistration' element={<TutorRegistration/>}/>
        <Route path='/tutorcompleteprofile' element={<TutorCompleteProfile/>}/>
        <Route path='/tutorprofileupdate' element={<TutorProfileUpdate/>}/>
      </Routes>
    </Router>
  );
}

export default App;
