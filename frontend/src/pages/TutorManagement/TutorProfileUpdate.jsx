 import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import axios from 'axios';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, storage } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { FiUploadCloud, FiX, FiPlus, FiLink, FiUser, FiBriefcase, FiAward } from 'react-icons/fi';
import NavBar from '../../components/UI/TutorDashBoardNavBar';

const TutorProfileUpdate = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [existingImage, setExistingImage] = useState('');
  const [specializations, setSpecializations] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [newSpec, setNewSpec] = useState("");
  const [newLink, setNewLink] = useState({ platform: "", url: "" });

  const addSpecialization = () => {
    if (newSpec.trim() !== "") {
      setSpecializations([...specializations, newSpec.trim()]);
      setNewSpec("");
    }
  };

  const removeSpecialization = (index) => {
    setSpecializations(specializations.filter((_, i) => i !== index));
  };

  const addSocialLink = () => {
    if (newLink.platform.trim() && newLink.url.trim()) {
      setSocialLinks([...socialLinks, newLink]);
      setNewLink({ platform: "", url: "" });
    }
  };

  const removeSocialLink = (index) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      if(user) {
        try {
          const token = await user.getIdToken();
          const response = await axios.get(`http://localhost:8081/lingocamp/api/tutors/${user.uid}`,
            {headers: {Authorization: `Bearer ${token}`}}
          );
          const data = response.data;
          
          // Set form values with existing data
          setValue('firstName', data.firstName);
          setValue('lastName', data.lastName);
          setValue('phoneNumber', data.phoneNumber);
          setValue('experience', data.experience);
          setSpecializations(data.specialization || []);
          setSocialLinks(data.socialLinks || []);
          setExistingImage(data.profileImageUrl || '');

        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
    };
    fetchProfileData();
  }, [user, setValue]);

  const handleImageUpload = async () => {
    if (!profileImage) return null;
    const storageRef = ref(storage, `tutors/${profileImage.name}`);
    const uploadTask = uploadBytesResumable(storageRef, profileImage);

    return new Promise((resolve, reject) => {
      uploadTask.on("state_changed", null, reject, async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      });
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if(file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const profileImageUrl = await handleImageUpload();
      
      const formData = {
        ...data,
        profileImageUrl,
        specialization: specializations,
        socialLinks: socialLinks,
        profileComplete: true
      };

      const token = await user.getIdToken();
      await axios.patch(`http://localhost:8081/lingocamp/api/tutors/updateprofile/${user.uid}`,
        formData,
        {headers: {Authorization: `Bearer ${token}`}}
      );
      navigate('/home');
    } catch (error) {
      console.error('Update failed:', error);
    }
    setLoading(false);
  };

  return (
      <div className="min-h-screen bg-blue-50">
        <NavBar/>
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="px-8 py-6 bg-gradient-to-r from-blue-600 to-blue-500">
              <h1 className="text-2xl font-bold text-white">Update Your Profile</h1>
              <p className="text-blue-100 mt-1">Keep your information up to date</p>
            </div>
    
            <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-6 space-y-8">
              {/* Profile Photo Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FiUser className="w-5 h-5" />
                  Profile Photo
                </h3>
                <div className="flex items-center gap-6">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-dashed border-gray-300 group">
                    {previewImage && (
                      <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                    )}
                    <div className={`absolute inset-0 flex flex-col items-center justify-center bg-gray-50 transition-opacity ${previewImage ? 'opacity-0 group-hover:opacity-100' : ''}`}>
                      <FiUploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">Upload Photo</span>
                    </div>
                    <input 
                      type="file" 
                      onChange={handleImageChange} 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      accept="image/*"
                    />
                    {previewImage && previewImage !== existingImage && (
                      <button
                        type="button"
                        onClick={() => {
                          setProfileImage(null);
                          setPreviewImage(existingImage);
                        }}
                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm z-20"
                      >
                        <FiX className="w-5 h-5 text-red-500" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
    
              {/* Personal Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FiUser className="w-5 h-5" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      {...register("firstName")}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      {...register("lastName", { required: "Required" })}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Doe"
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>
              </div>
    
              {/* Professional Details */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FiBriefcase className="w-5 h-5" />
                  Professional Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      {...register("phoneNumber")}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="+1 234 567 890"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience (years)
                    </label>
                    <input
                      {...register("experience")}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      type="number"
                      min="0"
                      placeholder="3"
                    />
                  </div>
                </div>
              </div>
    
              {/* Specializations */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FiAward className="w-5 h-5" />
                  Teaching Specializations
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={newSpec}
                      onChange={(e) => setNewSpec(e.target.value)}
                      className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Mathematics, Physics..."
                    />
                    <button
                      type="button"
                      onClick={addSpecialization}
                      className="px-6 py-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2"
                    >
                      <FiPlus className="w-5 h-5" />
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {specializations.map((spec, index) => (
                      <div key={index} className="flex items-center bg-blue-50 rounded-full px-4 py-2">
                        <span className="text-sm">{spec}</span>
                        <button
                          type="button"
                          onClick={() => removeSpecialization(index)}
                          className="ml-2 text-red-400 hover:text-red-600"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
    
              {/* Social Links */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FiLink className="w-5 h-5" />
                  Social Profiles
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      value={newLink.platform}
                      onChange={(e) => setNewLink({ ...newLink, platform: e.target.value })}
                      className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Platform"
                    />
                    <input
                      type="url"
                      value={newLink.url}
                      onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                      className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Profile URL"
                    />
                    <button
                      type="button"
                      onClick={addSocialLink}
                      className="px-6 py-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2"
                    >
                      <FiPlus className="w-5 h-5" />
                      Add
                    </button>
                  </div>
                  <div className="space-y-3">
                    {socialLinks.map((link, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FiLink className="text-gray-500" />
                          <div>
                            <p className="font-medium">{link.platform}</p>
                            <a 
                              href={link.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline text-sm"
                            >
                              {link.url.replace(/^https?:\/\//, '')}
                            </a>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSocialLink(index)}
                          className="text-red-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50"
                        >
                          <FiX className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
    
              {/* Form Actions */}
              <div className="flex flex-col gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      Updating...
                    </>
                  ) : 'Update Profile'}
                </button>
                
                <button 
                  type="button"
                  onClick={() => navigate('/home')}
                  className="w-full py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };
  
  export default TutorProfileUpdate;