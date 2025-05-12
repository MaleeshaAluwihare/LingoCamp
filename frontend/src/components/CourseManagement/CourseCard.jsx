import React from 'react';

export default function CourseCard({ course, onSelect }) {
  return (
    <div
      className="bg-white rounded-2xl shadow p-4 cursor-pointer hover:shadow-lg transition"
      onClick={() => onSelect(course)}
    >
      <img src={course.coverImage} alt={course.title} className="w-full h-40 object-cover rounded-xl mb-3" />
      <h3 className="text-lg font-semibold">{course.title}</h3>
      <p className="text-sm text-gray-500">{course.categories}</p>
      <p className="text-blue-600 font-bold">${course.price}</p>
    </div>
  );
}
