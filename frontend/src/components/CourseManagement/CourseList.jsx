import React from 'react';
import CourseCard from './CourseCard';

export default function CourseList({ courses, onSelect }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {courses.map(course => (
        <CourseCard key={course.courseId} course={course} onSelect={onSelect} />
      ))}
    </div>
  );
}
