import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, storage } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from "uuid";
import { FiUploadCloud, FiX, FiPlus, FiLink, FiUser, FiBriefcase, FiAward, FiTrash } from 'react-icons/fi';

const CourseUpdate = () => {
    const { courseId } = useParams();
    const { register, handleSubmit, control, setValue, formState: { errors } } = useForm();
    const [user] = useAuthState(auth);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [coverImage, setCoverImage] = useState(null);
    const [previewImage, setPreviewImage] = useState('');
    const [existingCoverImage, setExistingCoverImage] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);

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
                        } else if (key === 'categories') {
                            setValue('categories', data.categories.join(', '));
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
        try {
            setLoading(true);
            const token = await user.getIdToken();
            const payload = {
                ...data,
                categories: data.categories.split(',').map(c => c.trim()),
                durationWeeks: Number(data.durationWeeks),
                price: Number(data.price)
            };

            await axios.put(
                `http://localhost:8081/lingocamp/api/courses/course/${courseId}`,
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            navigate(`/courses/${courseId}`);
        } catch (error) {
            console.error('Update failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Update Course</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Cover Image Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
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
                        <FiUploadCloud className="w-12 h-12 mx-auto text-gray-400" />
                        <p className="mt-2 text-gray-600">
                            {previewImage || existingCoverImage ? 'Change Cover Image' : 'Upload Cover Image'}
                        </p>
                        {(previewImage || existingCoverImage) && (
                            <img
                                src={previewImage || existingCoverImage}
                                alt="Cover preview"
                                className="mt-4 mx-auto h-48 object-cover rounded-lg"
                            />
                        )}
                        {uploadProgress > 0 && (
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                                <div
                                    className="bg-blue-600 h-2.5 rounded-full"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                        )}
                    </label>
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Course Title</label>
                        <input
                            {...register('title', { required: 'Title is required' })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            {...register('description', { required: 'Description is required' })}
                            rows={4}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                {...register('price', { required: 'Price is required', min: 0 })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Duration (Weeks)</label>
                            <input
                                type="number"
                                {...register('durationWeeks', { required: 'Duration is required', min: 1 })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            {errors.durationWeeks && (
                                <p className="text-red-500 text-sm mt-1">{errors.durationWeeks.message}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Categories (comma separated)</label>
                        <input
                            {...register('categories', { required: 'Categories are required' })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        {errors.categories && <p className="text-red-500 text-sm mt-1">{errors.categories.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <select
                            {...register('status', { required: 'Status is required' })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="DRAFT">Draft</option>
                            <option value="PUBLISHED">Published</option>
                            <option value="ARCHIVED">Archived</option>
                        </select>
                    </div>
                </div>

                {/* Study Materials */}
                <div className="border-t pt-6">
                    <h3 className="text-lg font-medium mb-4">Study Materials</h3>
                    
                    {fields.map((item, index) => (
                        <div key={item.id} className="border rounded-lg p-4 mb-4 relative">
                            <button
                                type="button"
                                onClick={() => remove(index)}
                                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            >
                                <FiTrash className="w-5 h-5" />
                            </button>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Title</label>
                                    <input
                                        {...register(`studyMaterials.${index}.title`, { required: true })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Type</label>
                                    <select
                                        {...register(`studyMaterials.${index}.type`, { required: true })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="PDF">PDF</option>
                                        <option value="VIDEO">Video</option>
                                        <option value="QUIZ">Quiz</option>
                                        <option value="LINK">Link</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700">Content</label>
                                <input
                                    type="file"
                                    accept=".pdf,.mp4"
                                    onChange={(e) => handleFileUpload(e.target.files[0], index)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                />
                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={() => append({ title: '', type: 'PDF', fileUrl: '', order: fields.length + 1 })}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                        <FiPlus className="w-4 h-4 mr-2" />
                        Add Study Material
                    </button>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CourseUpdate;