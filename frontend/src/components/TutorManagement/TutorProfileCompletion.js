import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import axios from 'axios';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, storage } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const ProfileCompletion = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [user] = useAuthState(auth);
    const navigate = useNavigate();
    const [loading] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [specializations, setSpecializations] = useState([]);
    const [socialLinks, setSocialLinks] = useState([]);
    const [newSpec, setNewSpec] = useState("");
    const [newLink, setNewLink] = useState({ platform: "", url: "" });

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
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-center">Complete Your Profile</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <input {...register("firstName", { required: true })} className="w-full p-3 border rounded-lg" placeholder="First Name" />
                {errors.firstName && <p className="text-red-500">{errors.firstName.message}</p>}

                <input {...register("lastName", { required: "Last name is required" })} className="w-full p-3 border rounded-lg" placeholder="Last Name" />
                {errors.lastName && <p className="text-red-500">{errors.lastName.message}</p>}

                <input {...register("phoneNumber")} className="w-full p-3 border rounded-lg" placeholder="Phone Number" />
                <input {...register("experience")} className="w-full p-3 border rounded-lg" placeholder="Experience (years)" type="number" />
                
                {/* Profile Image Upload */}
                <input type="file" onChange={(e) => setProfileImage(e.target.files[0])} className="w-full p-3 border rounded-lg" />
                
                {/* Specialization Dynamic Fields */}
                <div>
                <h3 className="font-semibold">Specializations</h3>
                <div className="flex space-x-2">
                    <input type="text" value={newSpec} onChange={(e) => setNewSpec(e.target.value)} className="w-full p-2 border rounded-lg" placeholder="Enter specialization" />
                    <button type="button" onClick={addSpecialization} className="px-3 py-2 bg-blue-500 text-white rounded-lg">Add</button>
                </div>
                <ul>
                    {specializations.map((spec, index) => (
                    <li key={index} className="flex justify-between p-2 bg-gray-100 rounded-lg mt-2">
                        {spec} <button type="button" onClick={() => removeSpecialization(index)} className="text-red-500">Remove</button>
                    </li>
                    ))}
                </ul>
                </div>

                {/* Social Links Dynamic Fields */}
                <div>
                <h3 className="font-semibold">Social Links</h3>
                <div className="flex space-x-2">
                    <input type="text" value={newLink.platform} onChange={(e) => setNewLink({ ...newLink, platform: e.target.value })} className="w-1/3 p-2 border rounded-lg" placeholder="Platform" />
                    <input type="text" value={newLink.url} onChange={(e) => setNewLink({ ...newLink, url: e.target.value })} className="w-2/3 p-2 border rounded-lg" placeholder="URL" />
                    <button type="button" onClick={addSocialLink} className="px-3 py-2 bg-blue-500 text-white rounded-lg">Add</button>
                </div>
                <ul>
                    {socialLinks.map((link, index) => (
                    <li key={index} className="flex justify-between p-2 bg-gray-100 rounded-lg mt-2">
                        {link.platform}: {link.url} <button type="button" onClick={() => removeSocialLink(index)} className="text-red-500">Remove</button>
                    </li>
                    ))}
                </ul>
                </div>
                
                <button type="submit" className="w-full p-3 bg-blue-600 text-white rounded-lg">
                    {loading ? 'Saving...' : 'Complete Profile'}
                </button>
            </form>
            
            <button 
                onClick={() => navigate('/home')}
                className="mt-4 w-full p-3 bg-gray-200 text-gray-700 rounded-lg"
            >
                Complete Later
            </button>
        </div>
    );
};

export default ProfileCompletion;