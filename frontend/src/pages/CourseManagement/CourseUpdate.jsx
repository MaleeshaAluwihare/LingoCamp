import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, storage } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from "uuid";
import ReactQuill from 'react-quill-new';
import { FiUploadCloud, FiPlus, FiTrash,FiX,FiAward,FiBriefcase,FiBookOpen,FiLink,FiLoader } from 'react-icons/fi';

const CourseUpdate = () => {
    const { courseId } = useParams();
    const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm();
    const [user] = useAuthState(auth);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [coverImage, setCoverImage] = useState(null);
    const [previewImage, setPreviewImage] = useState('');
    const [existingCoverImage, setExistingCoverImage] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const description = watch('description');


    const { fields, append, remove } = useFieldArray({
        control,
        name: 'studyMaterials'
    });

    useEffect(() => {
        const fetchCourseData = async () => {
            if (user) {
                try {
                    const token = await user.getIdToken();
                    const response = await axios.get(
                        `http://localhost:8081/lingocamp/api/courses/course/${courseId}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    const data = response.data;
                    
                    // Set form values
                    Object.keys(data).forEach(key => {
                        if (key === 'studyMaterials') {
                            setValue('studyMaterials', data.studyMaterials);
                        } else {
                            setValue(key, data[key]);
                        }
                    });
                    
                    setExistingCoverImage(data.coverImage);
                } catch (error) {
                    console.error('Error fetching course:', error);
                }
            }
        };
        fetchCourseData();
    }, [user, setValue, courseId]);

    const handleCoverImageUpload = async (file) => {
        const storageRef = ref(storage, `covers/${user.uid}/${uuidv4()}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress);
            },
            (error) => {
                console.error('Upload failed:', error);
            },
            async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                setValue('coverImage', downloadURL);
                setPreviewImage(downloadURL);
                setUploadProgress(0);
            }
        );
    };

    const handleFileUpload = async (file, index) => {
        const storageRef = ref(storage, `courses/${user.uid}/${uuidv4()}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                // Update progress for specific material
            },
            (error) => {
                console.error('Upload failed:', error);
            },
            async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                setValue(`studyMaterials.${index}.fileUrl`, downloadURL);
            }
        );
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const { createdAt, updatedAt, ...filteredData } = data;
            
            const payload = {
                ...filteredData,
                durationWeeks: Number(filteredData.durationWeeks),
                price: Number(filteredData.price)
            };
            const token = await user.getIdToken();
            
            await axios.put(`http://localhost:8081/lingocamp/api/courses/update/${courseId}`,
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            navigate(`/mycourses`);
        } catch (error) {
            console.error('Update failed:', error);
        } finally {
            setLoading(false);
        }
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

    const Label = ({ children }) => (
        <label className="block text-sm font-medium text-gray-700 mb-2">{children}</label>
    );
    
    const Input = ({ error, ...props }) => (
        <div>
            <input
                className={`w-full px-4 py-2 rounded-lg border ${
                    error ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                {...props}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
        </div>
    );
    
    const FileUploadInput = ({ onFileUpload, acceptedTypes }) => (
        <div className="flex items-center gap-4">
            <input
                type="file"
                accept={acceptedTypes}
                onChange={(e) => onFileUpload(e.target.files[0])}
                className="hidden"
                id="fileUpload"
            />
            <label
                htmlFor="fileUpload"
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 cursor-pointer"
            >
                <FiUploadCloud />
                Choose File
            </label>
            <span className="text-sm text-gray-500">Max file size: 50MB</span>
        </div>
    );
    
    
    return (
            <div className="max-w-5xl mx-auto p-8 bg-gray-50 min-h-screen">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Edit Course</h2>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-600 hover:text-gray-800"
                    >
                        <FiX className="mr-1" /> Cancel
                    </button>
                </div>
    
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Cover Image Section */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                            <FiAward className="mr-2 text-blue-600" />
                            Course Cover Image
                        </h3>
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-blue-200 transition-colors">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    setCoverImage(file);
                                    setPreviewImage(URL.createObjectURL(file));
                                    handleCoverImageUpload(file);
                                }}
                                className="hidden"
                                id="coverUpload"
                            />
                            <label htmlFor="coverUpload" className="cursor-pointer">
                                <div className="space-y-4">
                                    <FiUploadCloud className="w-12 h-12 mx-auto text-gray-400" />
                                    <p className="text-gray-600 font-medium">
                                        {previewImage || existingCoverImage 
                                            ? 'Click to change cover image'
                                            : 'Drag & drop or click to upload'}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Recommended size: 1200x600 pixels
                                    </p>
                                    {(previewImage || existingCoverImage) && (
                                        <img
                                            src={previewImage || existingCoverImage}
                                            alt="Cover preview"
                                            className="mt-4 mx-auto h-48 object-cover rounded-lg shadow-sm"
                                        />
                                    )}
                                </div>
                            </label>
                        </div>
                    </div>
    
                    {/* Basic Information Section */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-700 mb-6 flex items-center">
                            <FiBriefcase className="mr-2 text-blue-600" />
                            Basic Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label>Course Title</Label>
                                <Input
                                    {...register('title', { required: 'Title is required' })}
                                    error={errors.title}
                                />
                            </div>
    
                            <div>
                                <Label>Categories (comma separated)</Label>
                                <Input
                                    {...register('categories', { required: 'Categories are required' })}
                                    error={errors.categories}
                                    placeholder="e.g., English, Grammar, Business"
                                />
                            </div>
    
                            <div>
                                <Label>Price ($)</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    {...register('price', { required: 'Price is required', min: 0 })}
                                    error={errors.price}
                                />
                            </div>
    
                            <div>
                                <Label>Duration (Weeks)</Label>
                                <Input
                                    type="number"
                                    {...register('durationWeeks', { required: 'Duration is required', min: 1 })}
                                    error={errors.durationWeeks}
                                />
                            </div>
    
                            <div className="md:col-span-2">
                                <Label>Status</Label>
                                <select
                                    {...register('status', { required: 'Status is required' })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="DRAFT" className="text-orange-500">Draft</option>
                                    <option value="PUBLISHED" className="text-green-500">Published</option>
                                    <option value="ARCHIVED" className="text-gray-500">Archived</option>
                                </select>
                            </div>
                        </div>
                    </div>
    
                    {/* Course Content Section */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-700 mb-6 flex items-center">
                            <FiBookOpen className="mr-2 text-blue-600" />
                            Course Content
                        </h3>
                        <div className="space-y-4">
                            <Label>Detailed Description</Label>
                            <ReactQuill
                                theme="snow"
                                value={description || ""}
                                onChange={(value) => setValue('description', value)}
                                modules={modules}
                                formats={formats}
                                className="h-96 mb-8 bg-white rounded-lg border-gray-200"
                                placeholder="Write your course content here..."
                            />
                        </div>
                    </div>
    
                    {/* Study Materials Section */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-700 mb-6 flex items-center">
                            <FiLink className="mr-2 text-blue-600" />
                            Study Materials
                        </h3>
                        <div className="space-y-6">
                            {fields.map((item, index) => (
                                <div key={item.id} className="border border-gray-100 rounded-lg p-4 bg-gray-50 relative group">
                                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <FiTrash className="w-5 h-5" />
                                        </button>
                                    </div>
    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label>Material Title</Label>
                                            <Input
                                                {...register(`studyMaterials.${index}.title`, { required: true })}
                                                error={errors.studyMaterials?.[index]?.title}
                                            />
                                        </div>
    
                                        <div>
                                            <Label>Material Type</Label>
                                            <select
                                                {...register(`studyMaterials.${index}.type`, { required: true })}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="PDF">PDF Document</option>
                                                <option value="VIDEO">Video</option>
                                                <option value="QUIZ">Quiz</option>
                                                <option value="LINK">External Link</option>
                                            </select>
                                        </div>
    
                                        <div className="md:col-span-2">
                                            <Label>Upload File</Label>
                                            <FileUploadInput 
                                                onFileUpload={(file) => handleFileUpload(file, index)}
                                                acceptedTypes=".pdf,.mp4,.doc,.docx"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
    
                            <button
                                type="button"
                                onClick={() => append({ title: '', type: 'PDF', fileUrl: '', order: fields.length + 1 })}
                                className="w-full py-3 border-2 border-dashed border-gray-200 hover:border-blue-300 rounded-xl flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                            >
                                <FiPlus className="w-5 h-5" />
                                Add New Material
                            </button>
                        </div>
                    </div>
    
                    {/* Submit Section */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="px-6 py-2.5 text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-2"
                            >
                                {loading && <FiLoader className="animate-spin" />}
                                {loading ? 'Saving Changes...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
    );
};

export default CourseUpdate;