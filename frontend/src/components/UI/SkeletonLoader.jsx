import React from 'react';
import { FiBox } from 'react-icons/fi';

export const SkeletonLoader = ({ count = 3 }) => {
  return (
    <div className="animate-pulse space-y-4">
      {[...Array(count)].map((_, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex gap-4">
            <div className="w-32 h-32 bg-gray-200 rounded-lg" />
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
              <div className="h-3 bg-gray-200 rounded w-1/4" />
              <div className="flex gap-2 mt-4">
                <div className="h-8 bg-gray-200 rounded w-24" />
                <div className="h-8 bg-gray-200 rounded w-24" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// For filter controls loading state
export const FilterSkeleton = () => (
  <div className="animate-pulse grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
    {[...Array(3)].map((_, index) => (
      <div key={index} className="h-12 bg-gray-200 rounded-lg" />
    ))}
  </div>
);

// For empty state loading
export const EmptyStateSkeleton = () => (
  <div className="text-center py-12 space-y-4">
    <FiBox className="mx-auto text-gray-300 h-16 w-16" />
    <div className="h-4 bg-gray-200 rounded w-48 mx-auto" />
  </div>
);

// New component for individual skeleton elements with variants
export const SkeletonElement = ({ variant, className }) => {
  const baseClasses = "bg-gray-200 animate-pulse rounded";
  
  if (variant === 'circle') {
    return <div className={`${baseClasses} rounded-full ${className}`} />;
  }
  
  return <div className={`${baseClasses} ${className}`} />;
};

// New component for instructor/profile loading
export const InstructorSkeleton = () => (
  <div className="flex items-center">
    <SkeletonElement variant="circle" className="w-12 h-12" />
    <div className="ml-3 space-y-2">
      <SkeletonElement className="w-32 h-4" />
      <SkeletonElement className="w-24 h-3" />
    </div>
  </div>
);