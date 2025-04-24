// import React, { useState } from "react";
// import axios from "axios";
// import { useForm } from "react-hook-form";
// import { storage } from "../../firebaseConfig";
// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
// import { useNavigate } from "react-router-dom";

// const TutorRegistration = () => {
//   const { register, handleSubmit, formState: { errors } } = useForm();
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [profileImage, setProfileImage] = useState(null);
//   const [specializations, setSpecializations] = useState([]);
//   const [socialLinks, setSocialLinks] = useState([]);
//   const [newSpec, setNewSpec] = useState("");
//   const [newLink, setNewLink] = useState({ platform: "", url: "" });

//   const navigate = useNavigate();

//   const handleImageUpload = async () => {
//     if (!profileImage) return null;
//     const storageRef = ref(storage, `tutors/${profileImage.name}`);
//     const uploadTask = uploadBytesResumable(storageRef, profileImage);

//     return new Promise((resolve, reject) => {
//       uploadTask.on("state_changed", null, reject, async () => {
//         const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
//         resolve(downloadURL);
//       });
//     });
//   };

//   const addSpecialization = () => {
//     if (newSpec.trim() !== "") {
//       setSpecializations([...specializations, newSpec.trim()]);
//       setNewSpec("");
//     }
//   };

//   const removeSpecialization = (index) => {
//     setSpecializations(specializations.filter((_, i) => i !== index));
//   };

//   const addSocialLink = () => {
//     if (newLink.platform.trim() && newLink.url.trim()) {
//       setSocialLinks([...socialLinks, newLink]);
//       setNewLink({ platform: "", url: "" });
//     }
//   };

//   const removeSocialLink = (index) => {
//     setSocialLinks(socialLinks.filter((_, i) => i !== index));
//   };

//   const onSubmit = async (data) => {
//     setLoading(true);
//     setMessage("");
//     try {

//       const auth = getAuth();
//       const {email,password} = data;
      
//       // Register user in Firebase Authentication
//       const userCredential = await createUserWithEmailAndPassword(auth,email,password);
//       const user = userCredential.user;

//       let profileImageUrl = "";
//       if (profileImage) {
//         profileImageUrl = await handleImageUpload();
//       }
      
//       const formData = { ...data, uid: user.uid, profileImageUrl, specialization: specializations, socialLinks };
//       console.log(formData);
//       const response = await axios.post(`http://localhost:8081/lingocamp/api/tutors/register`, formData);
//       setMessage(`Registration successful! Tutor ID: ${response.data}`);
//       // navigate("/home");
//       navigate(data.type === "company" ? "/jobdashboard" : "/home");


//     } catch (error) {
//       setMessage("Error registering tutor. Try again.");
//       console.error(error);
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md animate-fadeIn">
//       <h2 className="text-2xl font-bold mb-4 text-center">Tutor Registration</h2>
//       {message && <p className="text-center mb-4 text-green-600">{message}</p>}

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

//         <input {...register("firstName", { required: "First name is required" })} className="w-full p-3 border rounded-lg" placeholder="First Name" />
//         {errors.firstName && <p className="text-red-500">{errors.firstName.message}</p>}

//         <input {...register("lastName", { required: "Last name is required" })} className="w-full p-3 border rounded-lg" placeholder="Last Name" />
//         {errors.lastName && <p className="text-red-500">{errors.lastName.message}</p>}

//         <input {...register("email", { required: "Email is required" })} className="w-full p-3 border rounded-lg" placeholder="Email" type="email" />
//         {errors.email && <p className="text-red-500">{errors.email.message}</p>}

//         <input {...register("password", { required: "Password is required" })} className="w-full p-3 border rounded-lg" placeholder="Password" type="password" />
//         {errors.password && <p className="text-red-500">{errors.password.message}</p>}

//         <input {...register("phoneNumber")} className="w-full p-3 border rounded-lg" placeholder="Phone Number" />
//         <input {...register("experience")} className="w-full p-3 border rounded-lg" placeholder="Experience (years)" type="number" />
        
//         {/* Profile Image Upload */}
//         <input type="file" onChange={(e) => setProfileImage(e.target.files[0])} className="w-full p-3 border rounded-lg" />
        
//         {/* Specialization Dynamic Fields */}
//         <div>
//           <h3 className="font-semibold">Specializations</h3>
//           <div className="flex space-x-2">
//             <input type="text" value={newSpec} onChange={(e) => setNewSpec(e.target.value)} className="w-full p-2 border rounded-lg" placeholder="Enter specialization" />
//             <button type="button" onClick={addSpecialization} className="px-3 py-2 bg-blue-500 text-white rounded-lg">Add</button>
//           </div>
//           <ul>
//             {specializations.map((spec, index) => (
//               <li key={index} className="flex justify-between p-2 bg-gray-100 rounded-lg mt-2">
//                 {spec} <button type="button" onClick={() => removeSpecialization(index)} className="text-red-500">Remove</button>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Social Links Dynamic Fields */}
//         <div>
//           <h3 className="font-semibold">Social Links</h3>
//           <div className="flex space-x-2">
//             <input type="text" value={newLink.platform} onChange={(e) => setNewLink({ ...newLink, platform: e.target.value })} className="w-1/3 p-2 border rounded-lg" placeholder="Platform" />
//             <input type="text" value={newLink.url} onChange={(e) => setNewLink({ ...newLink, url: e.target.value })} className="w-2/3 p-2 border rounded-lg" placeholder="URL" />
//             <button type="button" onClick={addSocialLink} className="px-3 py-2 bg-blue-500 text-white rounded-lg">Add</button>
//           </div>
//           <ul>
//             {socialLinks.map((link, index) => (
//               <li key={index} className="flex justify-between p-2 bg-gray-100 rounded-lg mt-2">
//                 {link.platform}: {link.url} <button type="button" onClick={() => removeSocialLink(index)} className="text-red-500">Remove</button>
//               </li>
//             ))}
//           </ul>
//         </div>
        
//         <div>
//           <label className="block font-semibold">Register As:</label>
//           <select
//             {...register("type", { required: "Please select a user type" })}
//             className="w-full p-3 border rounded-lg"
//           >
//             <option value="">Select Type</option>
//             <option value="tutor">Tutor</option>
//             <option value="company">Company</option>
//           </select>
//           {errors.type && <p className="text-red-500">{errors.type.message}</p>}
//         </div>



//         <button type="submit" className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300" disabled={loading}>
//           {loading ? "Registering..." : "Register"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default TutorRegistration;
import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { storage } from "../../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const TutorRegistration = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [specializations, setSpecializations] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [newSpec, setNewSpec] = useState("");
  const [newLink, setNewLink] = useState({ platform: "", url: "" });

  const navigate = useNavigate();
  const userType = watch("type");

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
      const { email, password } = data;
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      let profileImageUrl = "";
      if (profileImage) {
        profileImageUrl = await handleImageUpload();
      }

      const formData = {
        ...data,
        uid: user.uid,
        profileImageUrl,
        socialLinks,
        specialization: userType === "tutor" ? specializations : undefined,
      };

      const response = await axios.post(`http://localhost:8081/lingocamp/api/tutors/register`, formData);
      setMessage(`Registration successful! Tutor ID: ${response.data}`);
      navigate(userType === "company" ? "/jobdashboard" : "/home");

    } catch (error) {
      setMessage("Error registering user. Try again.");
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md animate-fadeIn">
      <h2 className="text-2xl font-bold mb-4 text-center">User Registration</h2>
      {message && <p className="text-center mb-4 text-green-600">{message}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* Shared Fields */}
        <input {...register("email", { required: "Email is required" })} className="w-full p-3 border rounded-lg" placeholder="Email" type="email" />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}

        <input {...register("password", { required: "Password is required" })} className="w-full p-3 border rounded-lg" placeholder="Password" type="password" />
        {errors.password && <p className="text-red-500">{errors.password.message}</p>}

        <input {...register("phoneNumber")} className="w-full p-3 border rounded-lg" placeholder="Phone Number" />

        <input type="file" onChange={(e) => setProfileImage(e.target.files[0])} className="w-full p-3 border rounded-lg" />

        {/* Role Selection */}
        <div>
          <label className="block font-semibold">Register As:</label>
          <select
            {...register("type", { required: "Please select a user type" })}
            className="w-full p-3 border rounded-lg"
          >
            <option value="">Select Type</option>
            <option value="tutor">Tutor</option>
            <option value="company">Company</option>
          </select>
          {errors.type && <p className="text-red-500">{errors.type.message}</p>}
        </div>

        {/* Tutor Fields */}
        {userType === "tutor" && (
          <>
            <input {...register("firstName", { required: "First name is required" })} className="w-full p-3 border rounded-lg" placeholder="First Name" />
            {errors.firstName && <p className="text-red-500">{errors.firstName.message}</p>}

            <input {...register("lastName", { required: "Last name is required" })} className="w-full p-3 border rounded-lg" placeholder="Last Name" />
            {errors.lastName && <p className="text-red-500">{errors.lastName.message}</p>}

            <input {...register("experience")} className="w-full p-3 border rounded-lg" placeholder="Experience (years)" type="number" />

            {/* Specializations */}
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
          </>
        )}

        {/* Company Fields */}
        {userType === "company" && (
          <>
            <input {...register("companyName", { required: "Company name is required" })} className="w-full p-3 border rounded-lg" placeholder="Company Name" />
            {errors.companyName && <p className="text-red-500">{errors.companyName.message}</p>}

            <input {...register("username", { required: "Username is required" })} className="w-full p-3 border rounded-lg" placeholder="Username" />
            {errors.username && <p className="text-red-500">{errors.username.message}</p>}

            <input {...register("address", { required: "Address is required" })} className="w-full p-3 border rounded-lg" placeholder="Address" />
            {errors.address && <p className="text-red-500">{errors.address.message}</p>}

            <textarea {...register("about")} className="w-full p-3 border rounded-lg" placeholder="About the company" />
          </>
        )}

        {/* Social Links */}
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

        <button type="submit" className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default TutorRegistration;

