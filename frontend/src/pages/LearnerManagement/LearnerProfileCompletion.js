import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import axios from 'axios';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, storage } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { 
  FiUploadCloud, FiX, FiPlus, FiLink, FiUser, FiBook, 
  FiMapPin, FiBriefcase, FiTrash2, FiChevronDown, FiAward 
} from 'react-icons/fi';
import { 
  FaFacebook, FaInstagram, FaYoutube, FaLinkedin, 
  FaGithub, FaMedium, FaReddit, FaGlobe 
} from 'react-icons/fa';

// Move constants outside component
const SOCIAL_PLATFORMS = [
    { name: 'LinkedIn', value: 'linkedin', icon: <FaLinkedin className="text-blue-600" />, pattern: /^(https?:\/\/)?(www\.)?linkedin\.com\/.+/ },
    { name: 'GitHub', value: 'github', icon: <FaGithub className="text-gray-800" />, pattern: /^(https?:\/\/)?(www\.)?github\.com\/.+/ },
    { name: 'Facebook', value: 'facebook', icon: <FaFacebook className="text-blue-600" />, pattern: /^(https?:\/\/)?(www\.)?facebook\.com\/.+/ },
    { name: 'Instagram', value: 'instagram', icon: <FaInstagram className="text-pink-600" />, pattern: /^(https?:\/\/)?(www\.)?instagram\.com\/.+/ },
    { name: 'YouTube', value: 'youtube', icon: <FaYoutube className="text-red-600" />, pattern: /^(https?:\/\/)?(www\.)?youtube\.com\/.+/ },
    { name: 'Medium', value: 'medium', icon: <FaMedium className="text-black" />, pattern: /^(https?:\/\/)?(www\.)?medium\.com\/.+/ },
    { name: 'Reddit', value: 'reddit', icon: <FaReddit className="text-orange-500" />, pattern: /^(https?:\/\/)?(www\.)?reddit\.com\/.+/ },
    { name: 'Other', value: 'other', icon: <FaGlobe className="text-gray-600" /> },
];

const PROFICIENCY_LEVELS = [
    "Beginner",
    "Intermediate",
    "Advanced",
    "Native"
];

const LearnerProfileCompletion = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [user] = useAuthState(auth);
    const [profileImage, setProfileImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [socialLinks, setSocialLinks] = useState([]);
    const [newLink, setNewLink] = useState({ platform: "", url: "" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // New state for additional fields
    const [skills, setSkills] = useState([]);
    const [newSkill, setNewSkill] = useState("");
    const [certificates, setCertificates] = useState([]);
    const [newCertificate, setNewCertificate] = useState({ name: "", issuer: "", date: "" });
    const [education, setEducation] = useState([]);
    const [newEducation, setNewEducation] = useState({ institution: "", degree: "", years: "" });
    const [experience, setExperience] = useState([]);
    const [newExperience, setNewExperience] = useState({ role: "", company: "", duration: "" });

    useEffect(() => {
        if(!user) navigate('/learnerlogin');
    }, [user, navigate]);

    const handleImageUpload = async () => {
        if (!profileImage) return null;
        const storageRef = ref(storage, `learners/${profileImage.name}`);
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
    
    const addSocialLink = () => {
        if (newLink.platform.trim() && newLink.url.trim()) {
            setSocialLinks([...socialLinks, newLink]);
            setNewLink({ platform: "", url: "" });
        }
    };
    
    const removeSocialLink = (index) => {
        setSocialLinks(socialLinks.filter((_, i) => i !== index));
    };

    // New handlers for additional fields
    const addSkill = () => {
        if (newSkill.trim()) {
            setSkills([...skills, newSkill.trim()]);
            setNewSkill("");
        }
    };

    const removeSkill = (index) => {
        setSkills(skills.filter((_, i) => i !== index));
    };

    const addCertificate = () => {
        if (newCertificate.name.trim() && newCertificate.issuer.trim()) {
            setCertificates([...certificates, { ...newCertificate }]);
            setNewCertificate({ name: "", issuer: "", date: "" });
        }
    };

    const removeCertificate = (index) => {
        setCertificates(certificates.filter((_, i) => i !== index));
    };

    const addEducation = () => {
        if (newEducation.institution.trim() && newEducation.degree.trim()) {
            setEducation([...education, { ...newEducation }]);
            setNewEducation({ institution: "", degree: "", years: "" });
        }
    };

    const removeEducation = (index) => {
        setEducation(education.filter((_, i) => i !== index));
    };

    const addExperience = () => {
        if (newExperience.role.trim() && newExperience.company.trim()) {
            setExperience([...experience, { ...newExperience }]);
            setNewExperience({ role: "", company: "", duration: "" });
        }
    };

    const removeExperience = (index) => {
        setExperience(experience.filter((_, i) => i !== index));
    };
    
    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const formData = {
                ...data,
                uid: user.uid,
                email: user.email,
                profileImageUrl: await handleImageUpload(),
                socialLinks: socialLinks,
                skills: skills,
                certificates: certificates,
                education: education,
                experience: experience,
                profileComplete: true
            };

            await axios.post(`http://localhost:8081/lingocamp/api/learners/completeprofile/${user.uid}`, formData);
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
                    <p className="text-blue-100 mt-1">Help us personalize your learning experience</p>
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

                    {/* Learning Details */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <FiBook className="w-5 h-5" />
                            Learning Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Preferred Languages *
                                </label>
                                <input
                                    {...register("preferredLanguages", { required: "Required" })}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="English, Spanish..."
                                />
                                {errors.preferredLanguages && (
                                    <p className="text-red-500 text-sm mt-1">{errors.preferredLanguages.message}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Proficiency Level *
                                </label>
                                <select
                                    {...register("proficiencyLevel", { required: "Required" })}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select your level</option>
                                    {PROFICIENCY_LEVELS.map(level => (
                                        <option key={level} value={level}>{level}</option>
                                    ))}
                                </select>
                                {errors.proficiencyLevel && (
                                    <p className="text-red-500 text-sm mt-1">{errors.proficiencyLevel.message}</p>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Learning Goals
                            </label>
                            <textarea
                                {...register("learningGoals")}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                rows={3}
                                placeholder="What do you want to achieve with your language learning?"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                About You
                            </label>
                            <textarea
                                {...register("about")}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                rows={3}
                                placeholder="Tell us about yourself, your interests, and why you're learning languages..."
                            />
                        </div>
                    </div>

                    {/* Skills Section */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <FiAward className="w-5 h-5" />
                            Skills
                        </h3>
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., Public Speaking, IELTS 8.0..."
                                />
                                <button
                                    type="button"
                                    onClick={addSkill}
                                    className="px-6 py-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2"
                                >
                                    <FiPlus className="w-5 h-5" />
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill, index) => (
                                    <div key={index} className="flex items-center bg-blue-50 rounded-full px-4 py-2">
                                        <span className="text-sm">{skill}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeSkill(index)}
                                            className="ml-2 text-red-400 hover:text-red-600"
                                        >
                                            <FiX className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Certificates Section */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <FiAward className="w-5 h-5" />
                            Certificates
                        </h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <input
                                    type="text"
                                    value={newCertificate.name}
                                    onChange={(e) => setNewCertificate({...newCertificate, name: e.target.value})}
                                    className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Certificate Name"
                                />
                                <input
                                    type="text"
                                    value={newCertificate.issuer}
                                    onChange={(e) => setNewCertificate({...newCertificate, issuer: e.target.value})}
                                    className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Issuing Organization"
                                />
                                <input
                                    type="date"
                                    value={newCertificate.date}
                                    onChange={(e) => setNewCertificate({...newCertificate, date: e.target.value})}
                                    className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={addCertificate}
                                className="px-6 py-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2"
                            >
                                <FiPlus className="w-5 h-5" />
                                Add Certificate
                            </button>
                            <div className="space-y-3">
                                {certificates.map((cert, index) => (
                                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-medium">{cert.name}</p>
                                            <p className="text-sm text-gray-600">{cert.issuer} • {cert.date}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeCertificate(index)}
                                            className="text-red-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50"
                                        >
                                            <FiTrash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Education Section */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <FiBook className="w-5 h-5" />
                            Education
                        </h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <input
                                    type="text"
                                    value={newEducation.institution}
                                    onChange={(e) => setNewEducation({...newEducation, institution: e.target.value})}
                                    className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Institution"
                                />
                                <input
                                    type="text"
                                    value={newEducation.degree}
                                    onChange={(e) => setNewEducation({...newEducation, degree: e.target.value})}
                                    className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Degree/Program"
                                />
                                <input
                                    type="text"
                                    value={newEducation.years}
                                    onChange={(e) => setNewEducation({...newEducation, years: e.target.value})}
                                    className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Years (e.g., 2015-2019)"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={addEducation}
                                className="px-6 py-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2"
                            >
                                <FiPlus className="w-5 h-5" />
                                Add Education
                            </button>
                            <div className="space-y-3">
                                {education.map((edu, index) => (
                                    <div key={index} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-medium">{edu.institution}</p>
                                            <p className="text-sm text-gray-600">{edu.degree} • {edu.years}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeEducation(index)}
                                            className="text-red-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50"
                                        >
                                            <FiTrash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Experience Section */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <FiBriefcase className="w-5 h-5" />
                            Experience
                        </h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <input
                                    type="text"
                                    value={newExperience.role}
                                    onChange={(e) => setNewExperience({...newExperience, role: e.target.value})}
                                    className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Role/Position"
                                />
                                <input
                                    type="text"
                                    value={newExperience.company}
                                    onChange={(e) => setNewExperience({...newExperience, company: e.target.value})}
                                    className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Company/Organization"
                                />
                                <input
                                    type="text"
                                    value={newExperience.duration}
                                    onChange={(e) => setNewExperience({...newExperience, duration: e.target.value})}
                                    className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Duration (e.g., 2 years)"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={addExperience}
                                className="px-6 py-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2"
                            >
                                <FiPlus className="w-5 h-5" />
                                Add Experience
                            </button>
                            <div className="space-y-3">
                                {experience.map((exp, index) => (
                                    <div key={index} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-medium">{exp.role}</p>
                                            <p className="text-sm text-gray-600">{exp.company} • {exp.duration}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeExperience(index)}
                                            className="text-red-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50"
                                        >
                                            <FiTrash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <FiMapPin className="w-5 h-5" />
                            Contact Information
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
                                    Address
                                </label>
                                <input
                                    {...register("address")}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Your address"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Company/Organization
                            </label>
                            <input
                                {...register("companyName")}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Where you work or study"
                            />
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

export default LearnerProfileCompletion;