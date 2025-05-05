import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { storage } from "../../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FaFacebook, FaInstagram, FaYoutube, FaLinkedin, FaGithub, FaMedium, FaReddit, FaGlobe,  } from 'react-icons/fa';
import { FiChevronDown, FiTrash2, FiPlus } from 'react-icons/fi';

const TutorRegistration = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [specializations, setSpecializations] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [newSpec, setNewSpec] = useState("");
  const [newLink, setNewLink] = useState({ platform: "", url: "" });
  const navigate = useNavigate();

  const SOCIAL_PLATFORMS = [
    { name: 'LinkedIn', value: 'linkedin', icon: <FaLinkedin className="text-blue-600" />, pattern: /^(https?:\/\/)?(www\.)?linkedin\.com\/.+/ },
    { name: 'GitHub', value: 'github', icon: <FaGithub className="text-gray-800" />, pattern: /^(https?:\/\/)?(www\.)?github\.com\/.+/ },
    { name: 'Facebook', value: 'facebook', icon: <FaFacebook className="text-blue-600" />, pattern: /^(https?:\/\/)?(www\.)?facebook\.com\/.+/ },
    { name: 'Instagram', value: 'instagram', icon: <FaInstagram className="text-pink-600" />, pattern: /^(https?:\/\/)?(www\.)?instagram\.com\/.+/ },
    { name: 'YouTube', value: 'YouTube', icon: <FaYoutube className="text-pink-600" />, pattern: /^(https?:\/\/)?(www\.)?youtube\.com\/.+/ },
    { name: 'Medium', value: 'medium', icon: <FaMedium className="text-black" />, pattern: /^(https?:\/\/)?(www\.)?medium\.com\/.+/ },
    { name: 'Reddit', value: 'reddit', icon: <FaReddit className="text-orange-500" />, pattern: /^(https?:\/\/)?(www\.)?reddit\.com\/.+/ },
    { name: 'Other', value: 'other', icon: <FaGlobe className="text-gray-600" /> },
  ];

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

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage("");
    try {

      const auth = getAuth();
      const {email,password} = data;
      
      // Register user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth,email,password);
      const user = userCredential.user;

      let profileImageUrl = "";
      if (profileImage) {
        profileImageUrl = await handleImageUpload();
      }
      
      const formData = { ...data, uid: user.uid, profileImageUrl, specialization: specializations, socialLinks };
    
      const response = await axios.post(`http://localhost:8081/lingocamp/api/tutors/register`, formData);
      setMessage(`Registration successful! Tutor ID: ${response.data}`);
      navigate("/home");

    } catch (error) {
      setMessage("Error registering tutor. Try again.");
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="px-8 py-6 bg-gradient-to-r from-blue-600 to-blue-500">
          <h2 className="text-3xl font-bold text-white text-center">Become a Tutor</h2>
          <p className="text-center text-blue-100 mt-2">Join our community of expert educators</p>
        </div>
  
        <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-6 space-y-8">
          {message && (
            <div className="p-4 bg-green-100 text-green-700 rounded-lg">
              {message}
            </div>
          )}
  
          {/* Section 1: Personal Information */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold border-b pb-2">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                  <input
                    {...register("firstName", { required: "Required" })}
                    className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-500"
                    placeholder="John"
                  />
                </label>
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                )}
              </div>
  
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                  <input
                    {...register("lastName", { required: "Required" })}
                    className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-500"
                    placeholder="Doe"
                  />
                </label>
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                )}
              </div>
  
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                  <input
                    {...register("email", { required: "Required" })}
                    className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-500"
                    placeholder="john@example.com"
                    type="email"
                  />
                </label>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
  
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                  <input
                    {...register("password", { required: "Required" })}
                    className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-500"
                    type="password"
                    placeholder="••••••••"
                  />
                </label>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>
            </div>
          </div>
  
          {/* Section 2: Professional Details */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold border-b pb-2">Professional Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                  <input
                    {...register("phoneNumber")}
                    className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-500"
                    placeholder="+1 234 567 890"
                  />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience (years)
                  <input
                    {...register("experience")}
                    className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-500"
                    type="number"
                    min="0"
                    placeholder="3"
                  />
                </label>
              </div>
  
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Photo
                  <div className="mt-1 flex items-center space-x-4">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-dashed border-gray-300">
                      <input
                        type="file"
                        onChange={(e) => setProfileImage(e.target.files[0])}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                        {profileImage ? (
                          <img 
                            src={URL.createObjectURL(profileImage)} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-400">Upload</span>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">Recommended size: 500x500px</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
  
          {/* Section 3: Specializations */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold border-b pb-2">Teaching Specializations</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={newSpec}
                  onChange={(e) => setNewSpec(e.target.value)}
                  className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., English, French..."
                />
                <button
                  type="button"
                  onClick={addSpecialization}
                  className="px-6 py-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  Add Specialization
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {specializations.map((spec, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm">{spec}</span>
                    <button
                      type="button"
                      onClick={() => removeSpecialization(index)}
                      className="text-red-400 hover:text-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
  
          {/* Section 4: Social Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold border-b pb-2">Social Profiles</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <select
                    value={newLink.platform}
                    onChange={(e) => setNewLink({ ...newLink, platform: e.target.value })}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    <option value="">Select Platform</option>
                    {SOCIAL_PLATFORMS.map((platform) => (
                      <option key={platform.value} value={platform.value}>
                        {platform.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-4 pointer-events-none">
                    <FiChevronDown className="h-5 w-5 text-gray-400" />
                  </div>
                </div>

                {newLink.platform === 'other' && (
                  <input
                    type="text"
                    value={newLink.customPlatform || ''}
                    onChange={(e) => setNewLink({ ...newLink, customPlatform: e.target.value })}
                    className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Platform Name"
                  />
                )}

                <input
                  type="url"
                  value={newLink.url}
                  onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                  className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Profile URL"
                  pattern={SOCIAL_PLATFORMS.find(p => p.value === newLink.platform)?.pattern?.source || ''}
                />

                <button
                  type="button"
                  onClick={addSocialLink}
                  className="px-6 py-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center gap-2"
                >
                  <FiPlus className="h-5 w-5" />
                  Add Profile
                </button>
              </div>

              <div className="space-y-3">
                {socialLinks.map((link, index) => {
                  const platform = SOCIAL_PLATFORMS.find(p => p.value === link.platform) || 
                                  { name: link.customPlatform, icon: <FaGlobe className="text-gray-600" /> };
                  
                  return (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{platform.icon}</span>
                        <div>
                          <p className="font-medium">{platform.name}</p>
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
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
  
          {/* Submit Section */}
          <div className="sticky bottom-0 bg-white pt-6 border-t">
            <button
              type="submit"
              className="w-full py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Registering...
                </>
              ) : (
                'Complete Registration'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TutorRegistration;

