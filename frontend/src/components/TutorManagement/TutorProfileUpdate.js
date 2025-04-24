import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import axios from 'axios';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, storage } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const TutorProfileUpdate = () => {
  const { register, handleSubmit, setValue } = useForm();
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
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
          const response = await axios.get(`http://localhost:8081/lingocamp/api/tutors/${user.uid}`);
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

      await axios.patch(
        `http://localhost:8081/lingocamp/api/tutors/updateprofile/${user.uid}`,
        formData
      );
      navigate('/home');
    } catch (error) {
      console.error('Update failed:', error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Update Profile</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        <input {...register("firstName")} className="w-full p-3 border rounded-lg" placeholder="First Name"/>
        <input {...register("lastName", { required: "Last name is required" })} className="w-full p-3 border rounded-lg" placeholder="Last Name" />
        <input {...register("phoneNumber")} className="w-full p-3 border rounded-lg" placeholder="Phone Number" />
        <input {...register("experience")} className="w-full p-3 border rounded-lg" placeholder="Experience (years)" type="number" />
        
        {/* Profile Image Section */}
        <div>
          <label className="block mb-2">Profile Image</label>
          {existingImage && (
            <img 
              src={existingImage} 
              alt="Current Profile" 
              className="w-32 h-32 rounded-full mb-4"
            />
          )}
          <input 
            type="file" 
            onChange={(e) => setProfileImage(e.target.files[0])}
            className="w-full p-3 border rounded-lg"
          />
        </div>

        <div>
          <h3 className="font-semibold">Specializations</h3>
          <div className="flex space-x-2">
            <input 
              type="text" 
              value={newSpec} 
              onChange={(e) => setNewSpec(e.target.value)} 
              className="w-full p-2 border rounded-lg" 
              placeholder="Enter specialization" 
            />
            <button 
              type="button" 
              onClick={addSpecialization} 
              className="px-3 py-2 bg-blue-500 text-white rounded-lg"
            >
              Add
            </button>
          </div>
          <ul>
            {specializations.map((spec, index) => (
              <li key={index} className="flex justify-between p-2 bg-gray-100 rounded-lg mt-2">
                {spec} 
                <button 
                  type="button" 
                  onClick={() => removeSpecialization(index)} 
                  className="text-red-500"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Add Social Links Section */}
        <div>
          <h3 className="font-semibold">Social Links</h3>
          <div className="flex space-x-2">
            <input 
              type="text" 
              value={newLink.platform} 
              onChange={(e) => setNewLink({ ...newLink, platform: e.target.value })} 
              className="w-1/3 p-2 border rounded-lg" 
              placeholder="Platform" 
            />
            <input 
              type="text" 
              value={newLink.url} 
              onChange={(e) => setNewLink({ ...newLink, url: e.target.value })} 
              className="w-2/3 p-2 border rounded-lg" 
              placeholder="URL" 
            />
            <button 
              type="button" 
              onClick={addSocialLink} 
              className="px-3 py-2 bg-blue-500 text-white rounded-lg"
            >
              Add
            </button>
          </div>
          <ul>
            {socialLinks.map((link, index) => (
              <li key={index} className="flex justify-between p-2 bg-gray-100 rounded-lg mt-2">
                {link.platform}: {link.url} 
                <button 
                  type="button" 
                  onClick={() => removeSocialLink(index)} 
                  className="text-red-500"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        <button 
          type="submit"
          className="w-full p-3 bg-blue-600 text-white rounded-lg"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default TutorProfileUpdate;