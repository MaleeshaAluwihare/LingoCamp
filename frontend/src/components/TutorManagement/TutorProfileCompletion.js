import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import axios from 'axios';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, storage } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { FiUploadCloud, FiX, FiPlus, FiLink, FiUser, FiBriefcase, FiTrash2, FiAward, FiChevronDown } from 'react-icons/fi';
import { FaFacebook, FaInstagram, FaYoutube, FaLinkedin, FaGithub, FaMedium, FaReddit, FaGlobe,  } from 'react-icons/fa';

const ProfileCompletion = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [user] = useAuthState(auth);
    const [profileImage, setProfileImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [specializations, setSpecializations] = useState([]);
    const [socialLinks, setSocialLinks] = useState([]);
    const [newSpec, setNewSpec] = useState("");
    const [newLink, setNewLink] = useState({ platform: "", url: "" });
    const [loading, setLoading] = useState(false);
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

    useEffect(() => {
        if(!user) navigate('/tutorlogin');
    }, [user, navigate]);

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
        try {
            const formData = {
                ...data,
                uid: user.uid,
                email: user.email, // Auto-populate from Google
                profileImageUrl: await handleImageUpload(),
                specialization: specializations,
                socialLinks: socialLinks,
                profileComplete: true
            };

            await axios.post(`http://localhost:8081/lingocamp/api/tutors/completeprofile/${user.uid}`, formData);
            navigate('/home');
        } catch (error) {
            console.error('Profile completion failed:', error);
        } finally {
            setLoading(false);
        }
    };

return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="px-8 py-6 bg-gradient-to-r from-blue-600 to-blue-500">
                <h1 className="text-2xl font-bold text-white">Complete Your Profile</h1>
                <p className="text-blue-100 mt-1">Help students get to know you better</p>
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
                            {/* File input moved to the end of the container */}
                            {previewImage && (
                                <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                            )}
                            <div className={`absolute inset-0 flex flex-col items-center justify-center bg-gray-50 transition-opacity ${previewImage ? 'opacity-0 group-hover:opacity-100' : ''}`}>
                                <FiUploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                                <span className="text-sm text-gray-500">Upload Photo</span>
                            </div>
                            {/* File input with z-index adjustment */}
                            <input 
                                type="file" 
                                onChange={handleImageChange} 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                accept="image/*"
                            />
                            {previewImage && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setProfileImage(null);
                                        setPreviewImage(null);
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
                                First Name *
                            </label>
                            <input
                                {...register("firstName", { required: "Required" })}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="John"
                            />
                            {errors.firstName && (
                                <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                            )}
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
                                Saving...
                            </>
                        ) : 'Complete Profile'}
                    </button>
                    
                    <button 
                        type="button"
                        onClick={() => navigate('/home')}
                        className="w-full py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Complete Later
                    </button>
                </div>
            </form>
        </div>
    </div>
    );
};

export default ProfileCompletion;