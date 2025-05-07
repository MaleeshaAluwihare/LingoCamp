import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import {
  FiGlobe, FiUser, FiChevronDown, FiEdit, FiTrash2, FiSettings, FiLogOut
} from 'react-icons/fi';
import { useAuthState } from 'react-firebase-hooks/auth';
import axios from 'axios';
import { auth } from '../../firebaseConfig'

const NavBar = ({ loading: loadingProp }) => {
  const [user] = useAuthState(auth);
  const [tutorData, setTutorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const token = await user.getIdToken();
          const response = await axios.get(`http://localhost:8081/lingocamp/api/tutors/${user.uid}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setTutorData(response.data);
        } catch (error) {
          console.error("Error fetching tutor data:", error);
          setTutorData({});
        }
        setLoading(false);
      }
    };
    fetchUserData();
  }, [user]);

  useEffect(() => {
    const guestStatus = localStorage.getItem('isGuest');
    if (user && guestStatus) {
      localStorage.removeItem('isGuest');
      setIsGuest(false);
    } else {
      setIsGuest(!!guestStatus);
    }
  }, [user]);

  const getDisplayName = () => {
    if (tutorData?.firstName) return tutorData.firstName;
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split('@')[0];
    return "Guest";
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      try {
        await auth.signOut();
        navigate('/tutorlogin');
      } catch (error) {
        console.log('Logout failed:', error);
      }
    }
  };

  const handleDeleteProfile = async () => {
    const confirmation = window.prompt(
      'Type "DELETE" to confirm permanent profile deletion:'
    );

    if (confirmation === "DELETE") {
      try {
        const token = await user.getIdToken();
        await axios.delete(`http://localhost:8081/lingocamp/api/tutors/deleteprofile/${user.uid}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        await auth.signOut();
        navigate('/tutorlogin');
      } catch (error) {
        console.error('Deletion failed:', error);
        alert('Profile deletion failed. Please try again.');
      }
    } else {
      alert('Deletion cancelled. Profile remains active.');
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <div className="flex items-center">
            <FiGlobe className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-800">LingoCamp</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-blue-600">Features</a>
            <a href="#pricing" className="text-gray-600 hover:text-blue-600">Pricing</a>
            {!user && (
                <>
                    <Link to="/tutorlogin" className="text-gray-600 hover:text-blue-600">Login</Link>
                    <Link to="/tutorregistration" className="text-gray-600 hover:text-blue-600">Register</Link>
                </>
            )}

            {/* User Dropdown */}
            {!loading && (
              <Menu as="div" className="relative ml-3">
                <div>
                  <MenuButton className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 focus:outline-none">
                    <FiUser className="h-5 w-5" />
                    <span className="font-medium">{getDisplayName()}</span>
                    <FiChevronDown className="h-4 w-4" />
                  </MenuButton>
                </div>
                <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <MenuItem>
                    {({ active }) => (
                      <button
                        onClick={() => alert('Profile clicked - Add your profile handler')}
                        className={`${active ? 'bg-blue-100' : ''} block w-full px-4 py-2 text-sm text-gray-700 text-left`}
                      >
                        <FiUser className="inline mr-2 h-4 w-4" />
                        Profile
                      </button>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ active }) => (
                      <button
                        onClick={() => navigate('/tutorprofileupdate')}
                        className={`${active ? 'bg-blue-100' : ''} block w-full px-4 py-2 text-sm text-gray-700 text-left`}
                      >
                        <FiEdit className="inline mr-2 h-4 w-4" />
                        Update Profile
                      </button>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ active }) => (
                      <button
                        onClick={handleDeleteProfile}
                        className={`${active ? 'bg-blue-100' : ''} block w-full px-4 py-2 text-sm text-gray-700 text-left`}
                      >
                        <FiTrash2 className="inline mr-2 h-4 w-4" />
                        Delete Profile
                      </button>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ active }) => (
                      <button
                        onClick={() => alert('Settings clicked - Add your settings handler')}
                        className={`${active ? 'bg-blue-100' : ''} block w-full px-4 py-2 text-sm text-gray-700 text-left`}
                      >
                        <FiSettings className="inline mr-2 h-4 w-4" />
                        Settings
                      </button>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={`${active ? 'bg-blue-100' : ''} block w-full px-4 py-2 text-sm text-gray-700 text-left`}
                      >
                        <FiLogOut className="inline mr-2 h-4 w-4" />
                        Logout
                      </button>
                    )}
                  </MenuItem>
                </MenuItems>
              </Menu>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
