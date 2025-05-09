import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { storage } from "../../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaLinkedin,
  FaGithub,
  FaMedium,
  FaReddit,
  FaGlobe,
} from "react-icons/fa";
import { FiChevronDown, FiTrash2, FiPlus } from "react-icons/fi";

const TutorRegistration = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type: "",
      firstName: "",
      lastName: "",
      companyName: "",
      username: "",
      address: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      experience: "",
      about: "",
      learningGoals: "", // New field for learners
      preferredLanguages: "", // New field for learners
      proficiencyLevel: "", // New field for learners
    },
    mode: "onBlur",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [specializations, setSpecializations] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [newSpec, setNewSpec] = useState("");
  const [newLink, setNewLink] = useState({
    platform: "",
    url: "",
    customPlatform: "",
  });
  const navigate = useNavigate();
  const userType = watch("type");

  const SOCIAL_PLATFORMS = [
    {
      name: "LinkedIn",
      value: "linkedin",
      icon: <FaLinkedin className="text-blue-600" />,
      pattern: /^(https?:\/\/)?(www\.)?linkedin\.com\/.+/,
    },
    {
      name: "GitHub",
      value: "github",
      icon: <FaGithub className="text-gray-800" />,
      pattern: /^(https?:\/\/)?(www\.)?github\.com\/.+/,
    },
    {
      name: "Facebook",
      value: "facebook",
      icon: <FaFacebook className="text-blue-600" />,
      pattern: /^(https?:\/\/)?(www\.)?facebook\.com\/.+/,
    },
    {
      name: "Instagram",
      value: "instagram",
      icon: <FaInstagram className="text-pink-600" />,
      pattern: /^(https?:\/\/)?(www\.)?instagram\.com\/.+/,
    },
    {
      name: "YouTube",
      value: "youtube",
      icon: <FaYoutube className="text-red-600" />,
      pattern: /^(https?:\/\/)?(www\.)?youtube\.com\/.+/,
    },
    {
      name: "Medium",
      value: "medium",
      icon: <FaMedium className="text-black" />,
      pattern: /^(https?:\/\/)?(www\.)?medium\.com\/.+/,
    },
    {
      name: "Reddit",
      value: "reddit",
      icon: <FaReddit className="text-orange-500" />,
      pattern: /^(https?:\/\/)?(www\.)?reddit\.com\/.+/,
    },
    {
      name: "Other",
      value: "other",
      icon: <FaGlobe className="text-gray-600" />,
    },
  ];

  // Proficiency levels for learners
  const PROFICIENCY_LEVELS = [
    { name: "Beginner", value: "beginner" },
    { name: "Elementary", value: "elementary" },
    { name: "Intermediate", value: "intermediate" },
    { name: "Upper Intermediate", value: "upper_intermediate" },
    { name: "Advanced", value: "advanced" },
    { name: "Proficient", value: "proficient" },
  ];

  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:8081";

  const handleImageUpload = async () => {
    if (!profileImage) return null;
    const storageRef = ref(
      storage,
      `${userType === "learner" ? "learners" : "tutors"}/${Date.now()}_${
        profileImage.name
      }`
    );
    const uploadTask = uploadBytesResumable(storageRef, profileImage);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.error("Upload error:", error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            console.error("Download URL error:", error);
            reject(error);
          }
        }
      );
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
    if (!newLink.platform.trim()) {
      setMessage("Please select a social platform");
      return;
    }
    if (!newLink.url.trim()) {
      setMessage("Please enter a profile URL");
      return;
    }

    const selectedPlatform = SOCIAL_PLATFORMS.find(
      (p) => p.value === newLink.platform
    );
    if (
      selectedPlatform?.pattern &&
      !selectedPlatform.pattern.test(newLink.url)
    ) {
      setMessage(`Please enter a valid ${selectedPlatform.name} URL`);
      return;
    }

    const platformName =
      newLink.platform === "other" ? newLink.customPlatform : newLink.platform;
    setSocialLinks([
      ...socialLinks,
      {
        platform: newLink.platform,
        platformName,
        url: newLink.url,
      },
    ]);
    setNewLink({ platform: "", url: "", customPlatform: "" });
    setMessage("");
  };

  const removeSocialLink = (index) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage("");
    try {
      // Validate form data
      if (!data.type) {
        throw new Error("Please select a user type");
      }
      if (data.password !== data.confirmPassword) {
        throw new Error("Passwords don't match");
      }

      console.log("Starting registration process...");

      // Firebase authentication
      const auth = getAuth();
      const { email, password } = data;

      console.log("Creating Firebase user...");
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("Firebase user created:", user.uid);

      // Handle profile image upload
      let profileImageUrl = "";
      if (profileImage) {
        try {
          console.log("Uploading profile image...");
          profileImageUrl = await handleImageUpload();
          console.log("Profile image uploaded:", profileImageUrl);
        } catch (uploadError) {
          console.error(
            "Image upload failed, continuing without image:",
            uploadError
          );
        }
      }

      // Prepare data for backend based on user type
      const formData = {
        ...data,
        uid: user.uid,
        profileImageUrl,
        socialLinks,
        confirmPassword: undefined, // Remove from submission
      };

      // Add user type specific data
      if (userType === "tutor" || userType === "learner") {
        formData.firstName = data.firstName;
        formData.lastName = data.lastName;
        if (userType === "tutor") {
          formData.specializations = specializations;
        } else if (userType === "learner") {
          // Add learner-specific fields
          formData.learningGoals = data.learningGoals;
          formData.preferredLanguages = data.preferredLanguages;
          formData.proficiencyLevel = data.proficiencyLevel;
        }
      } else if (userType === "company") {
        formData.companyName = data.companyName;
        formData.username = data.username;
        formData.address = data.address;
      }

      console.log("Submitting to backend:", formData);

      // Send to backend - different endpoints based on user type
      const endpoint =
        userType === "learner"
          ? `${API_BASE_URL}/lingocamp/api/learners/register`
          : `${API_BASE_URL}/lingocamp/api/tutors/register`;

      const response = await axios.post(endpoint, formData, {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000, // 10 second timeout
      });

      console.log("Backend response:", response.data);

      if (!response.data) {
        throw new Error("No response data from server");
      }

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      setMessage(`Registration successful! Redirecting...`);
    setTimeout(() => {
      if (userType === "company") {
        navigate("/jobdashboard");
      } else if (userType === "learner") {
        navigate("/learner-home"); // New learner homepage route
      } else {
        navigate("/home"); // Default for tutors
      }
    }, 1500);
    } catch (error) {
      console.error("Full registration error:", error);

      let errorMessage = "Registration failed. Please try again.";

      if (error.code) {
        // Firebase auth errors
        switch (error.code) {
          case "auth/email-already-in-use":
            errorMessage = "This email is already registered";
            break;
          case "auth/invalid-email":
            errorMessage = "Please enter a valid email address";
            break;
          case "auth/weak-password":
            errorMessage = "Password should be at least 6 characters";
            break;
          case "auth/network-request-failed":
            errorMessage = "Network error. Please check your connection";
            break;
        }
      } else if (error.response) {
        // Backend API errors
        console.error("Backend error response:", error.response.data);
        errorMessage =
          error.response.data.message ||
          error.response.data.error ||
          `Server error: ${error.response.status}`;
      } else if (error.request) {
        // No response received
        console.error("No response received:", error.request);
        errorMessage = "No response from server. Check your connection.";
      } else if (error.message) {
        // Other errors
        errorMessage = error.message;
      }

      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to determine the title based on user type
  const getUserTypeTitle = () => {
    switch (userType) {
      case "company":
        return "Company Registration";
      case "learner":
        return "Learner Registration";
      case "tutor":
        return "Become a Tutor";
      default:
        return "Registration";
    }
  };

  // Helper function to determine the subtitle based on user type
  const getUserTypeSubtitle = () => {
    switch (userType) {
      case "company":
        return "Join our platform as an employer";
      case "learner":
        return "Join our community of language learners";
      case "tutor":
        return "Join our community of expert educators";
      default:
        return "Create your account";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="px-8 py-6 bg-gradient-to-r from-blue-600 to-blue-500">
          <h2 className="text-3xl font-bold text-white text-center">
            {getUserTypeTitle()}
          </h2>
          <p className="text-center text-blue-100 mt-2">
            {getUserTypeSubtitle()}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-6 space-y-8">
          {message && (
            <div
              className={`p-4 rounded-lg mb-6 ${
                message.includes("successful") ||
                message.includes("Redirecting")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              <div className="flex items-center">
                {message.includes("successful") ||
                message.includes("Redirecting") ? (
                  <svg
                    className="h-5 w-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                <span>{message}</span>
              </div>
            </div>
          )}

          {/* Role Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Register As *
            </label>
            <select
              {...register("type", { required: "Please select a user type" })}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Type</option>
              <option value="learner">Learner</option>
              <option value="tutor">Tutor</option>
              <option value="company">Company</option>
            </select>
            {errors.type && (
              <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
            )}
          </div>

          {/* Section 1: Personal/Company Information */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold border-b pb-2">
              {userType === "company"
                ? "Company Information"
                : "Personal Information"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userType === "tutor" || userType === "learner" ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                      <input
                        {...register("firstName", {
                          required: "First name is required",
                        })}
                        className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-500"
                        placeholder="John"
                      />
                    </label>
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                      <input
                        {...register("lastName", {
                          required: "Last name is required",
                        })}
                        className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-500"
                        placeholder="Doe"
                      />
                    </label>
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name *
                      <input
                        {...register("companyName", {
                          required: "Company name is required",
                        })}
                        className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-500"
                        placeholder="Acme Inc."
                      />
                    </label>
                    {errors.companyName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.companyName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username *
                      <input
                        {...register("username", {
                          required: "Username is required",
                          minLength: {
                            value: 4,
                            message: "Username must be at least 4 characters",
                          },
                        })}
                        className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-500"
                        placeholder="company_username"
                      />
                    </label>
                    {errors.username && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.username.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                      <input
                        {...register("address", {
                          required: "Address is required",
                        })}
                        className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-500"
                        placeholder="123 Main St, City"
                      />
                    </label>
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.address.message}
                      </p>
                    )}
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                  <input
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-500"
                    placeholder="john@example.com"
                    type="email"
                  />
                </label>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                  <input
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-500"
                    type="password"
                    placeholder="••••••••"
                  />
                </label>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                  <input
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === watch("password") || "Passwords don't match",
                    })}
                    className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-500"
                    type="password"
                    placeholder="••••••••"
                  />
                </label>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Professional Details */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold border-b pb-2">
              {userType === "company"
                ? "Professional Details"
                : userType === "tutor"
                ? "Teaching Details"
                : "Learning Details"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                  <input
                    {...register("phoneNumber", {
                      pattern: {
                        value: /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/,
                        message: "Invalid phone number",
                      },
                    })}
                    className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-500"
                    placeholder="+1 234 567 890"
                  />
                </label>
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>

              {userType === "tutor" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience (years)
                    <input
                      {...register("experience", {
                        min: {
                          value: 0,
                          message: "Experience cannot be negative",
                        },
                        max: {
                          value: 50,
                          message: "Experience seems too high",
                        },
                      })}
                      className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-500"
                      type="number"
                      min="0"
                      placeholder="3"
                    />
                  </label>
                  {errors.experience && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.experience.message}
                    </p>
                  )}
                </div>
              )}

              {/* Learner-specific fields */}
              {userType === "learner" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Languages *
                      <input
                        {...register("preferredLanguages", {
                          required:
                            "Please specify languages you want to learn",
                        })}
                        className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-500"
                        placeholder="English, Spanish, French..."
                      />
                    </label>
                    {errors.preferredLanguages && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.preferredLanguages.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Proficiency Level *
                      <select
                        {...register("proficiencyLevel", {
                          required: "Please select your proficiency level",
                        })}
                        className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Level</option>
                        {PROFICIENCY_LEVELS.map((level) => (
                          <option key={level.value} value={level.value}>
                            {level.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    {errors.proficiencyLevel && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.proficiencyLevel.message}
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* About section for all user types */}
              <div
                className={
                  userType === "company" ? "md:col-span-2" : "md:col-span-2"
                }
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {userType === "company"
                    ? "About the Company"
                    : userType === "learner"
                    ? "Learning Goals"
                    : "About Me"}
                  <textarea
                    {...register(
                      userType === "learner" ? "learningGoals" : "about",
                      {
                        maxLength: {
                          value: 500,
                          message:
                            "Description should be less than 500 characters",
                        },
                        ...(userType === "learner" && {
                          required: "Please share your learning goals",
                        }),
                      }
                    )}
                    className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder={
                      userType === "company"
                        ? "Brief description of your company..."
                        : userType === "learner"
                        ? "Share your language learning goals and objectives..."
                        : "Share a bit about yourself and your teaching philosophy..."
                    }
                  />
                </label>
                {errors.learningGoals && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.learningGoals.message}
                  </p>
                )}
                {errors.about && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.about.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Photo
                  <div className="mt-1 flex items-center space-x-4">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-dashed border-gray-300">
                      <input
                        type="file"
                        accept="image/*"
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
                    <span className="text-sm text-gray-500">
                      {profileImage
                        ? profileImage.name
                        : "Recommended size: 500x500px"}
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Section 3: Specializations (Tutor only) */}
          {userType === "tutor" && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold border-b pb-2">
                Teaching Specializations
              </h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={newSpec}
                    onChange={(e) => setNewSpec(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      e.preventDefault() &&
                      addSpecialization()
                    }
                    className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., English, French, Math..."
                  />
                  <button
                    type="button"
                    onClick={addSpecialization}
                    className="px-6 py-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2"
                  >
                    <FiPlus className="h-5 w-5" />
                    Add
                  </button>
                </div>

                {specializations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {specializations.map((spec, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                      >
                        <span className="text-sm">{spec}</span>
                        <button
                          type="button"
                          onClick={() => removeSpecialization(index)}
                          className="text-red-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    No specializations added yet
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Section 4: Social Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold border-b pb-2">
              Social Profiles
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Platform
                    <div className="relative">
                      <select
                        value={newLink.platform}
                        onChange={(e) =>
                          setNewLink({ ...newLink, platform: e.target.value })
                        }
                        className="w-full p-3 border rounded-lg appearance-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Platform</option>
                        {SOCIAL_PLATFORMS.map((platform) => (
                          <option key={platform.value} value={platform.value}>
                            {platform.name}
                          </option>
                        ))}
                      </select>
                      <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </label>
                </div>

                {newLink.platform === "other" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Custom Platform
                      <input
                        type="text"
                        value={newLink.customPlatform}
                        onChange={(e) =>
                          setNewLink({
                            ...newLink,
                            customPlatform: e.target.value,
                          })
                        }
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Platform name"
                      />
                    </label>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile URL *
                    <input
                      type="text"
                      value={newLink.url}
                      onChange={(e) =>
                        setNewLink({ ...newLink, url: e.target.value })
                      }
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="https://..."
                    />
                  </label>
                </div>
              </div>

              <button
                type="button"
                onClick={addSocialLink}
                className="px-6 py-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2"
              >
                <FiPlus className="h-5 w-5" />
                Add Social Link
              </button>

              {socialLinks.length > 0 ? (
                <div className="space-y-3">
                  {socialLinks.map((link, index) => {
                    const platform = SOCIAL_PLATFORMS.find(
                      (p) => p.value === link.platform
                    ) || {
                      name: link.customPlatform || "Other",
                      icon: <FaGlobe />,
                    };
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="text-lg">
                            {platform.icon || <FaGlobe />}
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {platform.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate max-w-xs">
                              {link.url}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSocialLink(index)}
                          className="text-red-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  No social links added yet
                </p>
              )}
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                required
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="font-medium text-gray-700">
                I agree to the{" "}
                <a href="/terms" className="text-blue-600 hover:text-blue-500">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="/privacy"
                  className="text-blue-600 hover:text-blue-500"
                >
                  Privacy Policy
                </a>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 px-6 rounded-lg text-white font-bold ${
                loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              } transition-colors flex justify-center items-center`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                `Register as ${
                  userType === "company"
                    ? "a Company"
                    : userType === "tutor"
                    ? "a Tutor"
                    : "a Learner"
                }`
              )}
            </button>
          </div>

          {/* Login Link */}
          <div className="text-center pt-4">
            <p className="text-gray-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-blue-600 font-medium hover:text-blue-500"
              >
                Log in
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TutorRegistration;
