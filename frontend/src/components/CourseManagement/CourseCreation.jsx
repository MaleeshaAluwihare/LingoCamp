import React, { useState } from "react";
import { useForm } from "react-hook-form";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { storage } from "../../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import axios from "axios";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import MDEditor from '@uiw/react-md-editor';
import { useDropzone } from 'react-dropzone';

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
  const [description, setDescription] = useState("");
  const [materialContent, setMaterialContent] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    multiple: false,
    onDrop: files => handleCoverImageUpload(files[0])
  });

  const handleCoverImageUpload = async (file) => {
    if (!file || !user){
      console.error("User not authenticated");
      return;
    } 
    
    const storageRef = ref(storage, `covers/${user.uid}/${uuidv4()}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => console.error("Upload failed:", error),
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setCoverImage(downloadURL);
      }
    );
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };
  
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'script', 'indent',
    'direction', 'color', 'font', 'background',
    'align', 'link', 'image', 'video'
  ];

  const addStudyMaterial = async () => {
    setLoading(true);
    try {
      let fileUrl = "";

      if (newMaterial.type === "TEXT") {
        fileUrl = materialContent;
      } else if (newMaterial.file) {
        fileUrl = await handleFileUpload(newMaterial.file);
      }

      setStudyMaterials([...studyMaterials, {
        ...newMaterial,
        fileUrl,
        content: materialContent,
        order: studyMaterials.length + 1,
        materialId: uuidv4()
      }]);

      setNewMaterial({ title: "", type: "PDF", file: null });
      setMaterialContent("");
    } catch (error) {
      console.error("Material creation failed:", error);
    }
    setLoading(false);
  };

  const handleFileUpload = async (file) => {
    const storageRef = ref(storage, `courses/${user.uid}/${uuidv4()}`);
    await uploadBytesResumable(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const removeMaterial = (index) => {
    setStudyMaterials(studyMaterials.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const token = await user.getIdToken(); 

      const courseData = {
        ...data,
        tutorId: user.uid,
        studyMaterials,
        price: parseFloat(data.price),
        durationWeeks: parseInt(data.durationWeeks),
        description,
        coverImage,
        status: "DRAFT"
      };

      await axios.post(`http://localhost:8081/lingocamp/api/courses/create`, courseData,
        {headers: {Authorization: `Bearer ${token}`}});

      navigate("/courses");
      
    } catch (error) {
      console.error("Course creation failed:", error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Create New Course</h2>

      {/* Cover Image Upload */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-3">Course Cover Image</label>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
            ${coverImage ? 'border-green-100 bg-green-50' : 'border-gray-300 hover:border-blue-500'}`}
        >
          <input {...getInputProps()} />
          
          {coverImage ? (
            <div className="relative group">
              <img src={coverImage} alt="Course cover" className="w-full h-48 object-cover rounded-lg" />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white">Click to change cover image</span>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="text-sm text-gray-600">
                Drag and drop your cover image here, or click to select
              </p>
              <p className="text-xs text-gray-500">Recommended size: 1200x600 pixels</p>
            </div>
          )}
        </div>
        {uploadProgress > 0 && !coverImage && (
          <div className="mt-2 h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
      </div>

      {/* Course Details */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
            <input
              {...register("title", { required: "Title is required" })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
            <input
              type="number"
              step="0.01"
              {...register("price", { required: "Price is required" })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Duration (weeks)</label>
            <input
              type="number"
              {...register("durationWeeks", { required: "Duration is required" })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.durationWeeks && <p className="mt-1 text-sm text-red-600">{errors.durationWeeks.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              {...register("status")}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              defaultValue="DRAFT"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </div>
        </div>

        {/* Course Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Course Content</label>
          <ReactQuill
          theme="snow"
          value={description}
          onChange={setDescription}
          modules={modules}
          formats={formats}
          className="h-64 mb-8 bg-white rounded-lg border-gray-300"
          placeholder="Write your course description here..."
        />
        </div>

        {/* Study Materials Section */}
        <div className="border-t pt-8">
          <h3 className="text-xl font-semibold mb-6 text-gray-800">Study Materials</h3>

          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block mb-2">Material Title</label>
                <input
                  value={newMaterial.title}
                  onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">Type</label>
                <select
                  value={newMaterial.type}
                  onChange={(e) => setNewMaterial({ ...newMaterial, type: e.target.value })}
                  className="w-full p-2 border rounded"
                >
                  <option value="PDF">PDF</option>
                  <option value="DOC">Word Document</option>
                  <option value="TEXT">Rich Text</option>
                  <option value="VIDEO">Video</option>
                  <option value="LINK">External Link</option>
                </select>
              </div>

              {newMaterial.type === "TEXT" ? (
                <div className="col-span-2">
                  <label className="block mb-2">Content</label>
                  <MDEditor
                    value={materialContent}
                    onChange={setMaterialContent}
                    height={200}
                  />
                </div>
              ) : (
                <div>
                  <label className="block mb-2">File</label>
                  <input
                    type="file"
                    accept={newMaterial.type === "VIDEO" ? "video/*" : ".pdf,.doc,.docx"}
                    onChange={(e) => setNewMaterial({ ...newMaterial, file: e.target.files[0] })}
                    className="w-full"
                  />
                </div>
              )}
            </div>

            <button
            type="button"
            onClick={addStudyMaterial}
            disabled={loading}
            className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center justify-center"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                {/* spinner icon */}
              </svg>
            ) : (
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
            )}
            {loading ? "Adding..." : "Add Study Material"}
          </button>
        </div>

          {/* Materials List */}
          {studyMaterials.map((material, index) => (
            <div key={material.materialId} className="border p-4 rounded-lg mb-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium">{material.title}</h4>
                  <p className="text-sm text-gray-600">
                    {material.type} • {material.file?.name || "Content"}
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

              {material.type === "TEXT" ? (
                <div className="mt-2">
                  <MDEditor.Markdown source={material.content} />
                </div>
              ) : (
                material.fileUrl && (
                  <a
                    href={material.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 text-sm"
                  >
                    {material.type === "VIDEO" ? "Watch Video" : "View File"}
                  </a>
                )
              )}
            </div>
          ))}
        </div>

        {/* Form Buttons */}
        <div className="flex justify-end space-x-4 mt-10">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors flex items-center"
          >
            {loading && (
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                {/* spinner icon */}
              </svg>
            )}
            {loading ? "Saving..." : "Publish Course"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseCreation;
