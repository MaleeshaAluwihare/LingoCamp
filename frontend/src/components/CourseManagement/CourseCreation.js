import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { storage } from "../../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import axios from "axios";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const CourseCreation = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [newMaterial, setNewMaterial] = useState({
    title: "",
    type: "PDF",
    file: null
  });

  const handleFileUpload = async (file) => {
    const storageRef = ref(storage, `courses/${user.uid}/${uuidv4()}`);
    await uploadBytesResumable(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const addStudyMaterial = async () => {
    if (!newMaterial.file || !newMaterial.title) return;
    
    setLoading(true);
    try {
      const fileUrl = await handleFileUpload(newMaterial.file);
      
      setStudyMaterials([...studyMaterials, {
        ...newMaterial,
        fileUrl,
        order: studyMaterials.length + 1,
        materialId: uuidv4()
      }]);
      
      setNewMaterial({ title: "", type: "PDF", file: null });
    } catch (error) {
      console.error("File upload failed:", error);
    }
    setLoading(false);
  };

  const removeMaterial = (index) => {
    setStudyMaterials(studyMaterials.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const courseData = {
        ...data,
        tutorId: user.uid,
        studyMaterials,
        price: parseFloat(data.price),
        durationWeeks: parseInt(data.durationWeeks),
        status: "DRAFT"
      };

      await axios.post(`http://localhost:8081/lingocamp/api/courses/create`, courseData);
      navigate("/courses");
    } catch (error) {
      console.error("Course creation failed:", error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Create New Course</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Course Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-medium">Course Title</label>
            <input
              {...register("title", { required: "Title is required" })}
              className="w-full p-3 border rounded-lg"
            />
            {errors.title && <p className="text-red-500">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block mb-2 font-medium">Price ($)</label>
            <input
              type="number"
              step="0.01"
              {...register("price", { required: "Price is required" })}
              className="w-full p-3 border rounded-lg"
            />
            {errors.price && <p className="text-red-500">{errors.price.message}</p>}
          </div>

          <div>
            <label className="block mb-2 font-medium">Duration (weeks)</label>
            <input
              type="number"
              {...register("durationWeeks", { required: "Duration is required" })}
              className="w-full p-3 border rounded-lg"
            />
            {errors.durationWeeks && <p className="text-red-500">{errors.durationWeeks.message}</p>}
          </div>

          <div>
            <label className="block mb-2 font-medium">Status</label>
            <select
              {...register("status")}
              className="w-full p-3 border rounded-lg"
              defaultValue="DRAFT"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block mb-2 font-medium">Description</label>
          <textarea
            {...register("description", { required: "Description is required" })}
            className="w-full p-3 border rounded-lg h-32"
          />
          {errors.description && <p className="text-red-500">{errors.description.message}</p>}
        </div>

        {/* Study Materials Section */}
        <div className="border-t pt-4">
          <h3 className="text-xl font-bold mb-4">Study Materials</h3>
          
          {/* Add New Material */}
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block mb-2">Material Title</label>
                <input
                  value={newMaterial.title}
                  onChange={(e) => setNewMaterial({...newMaterial, title: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block mb-2">Type</label>
                <select
                  value={newMaterial.type}
                  onChange={(e) => setNewMaterial({...newMaterial, type: e.target.value})}
                  className="w-full p-2 border rounded"
                >
                  <option value="PDF">PDF</option>
                  <option value="DOC">Word Document</option>
                  <option value="VIDEO">Video</option>
                  <option value="LINK">External Link</option>
                </select>
              </div>

              <div>
                <label className="block mb-2">File</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,application/msword"
                  onChange={(e) => setNewMaterial({...newMaterial, file: e.target.files[0]})}
                  className="w-full"
                />
              </div>
            </div>
            
            <button
              type="button"
              onClick={addStudyMaterial}
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {loading ? "Uploading..." : "Add Material"}
            </button>
          </div>

          {/* Materials List */}
          {studyMaterials.map((material, index) => (
            <div key={material.materialId} className="border p-4 rounded-lg mb-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium">{material.title}</h4>
                  <p className="text-sm text-gray-600">
                    {material.type} • {material.file?.name || "Uploaded"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeMaterial(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
              {material.fileUrl && (
                <a
                  href={material.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 text-sm"
                >
                  Preview File
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400"
          >
            {loading ? "Saving..." : "Create Course"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseCreation;