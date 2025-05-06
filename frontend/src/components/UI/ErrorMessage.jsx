import React from 'react';
import { FiAlertCircle, FiRefreshCw } from 'react-icons/fi';

export const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="max-w-md mx-auto text-center p-6 bg-red-50 rounded-lg border border-red-100">
      <div className="flex justify-center text-red-600 mb-3">
        <FiAlertCircle className="w-12 h-12" />
      </div>
      <h3 className="text-lg font-medium text-red-800 mb-2">
        Oops! Something went wrong
      </h3>
      <p className="text-red-700 mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        <FiRefreshCw className="mr-2" />
        Try Again
      </button>
    </div>
  );
};

export const EmptyStateMessage = ({ message, onReset }) => {
  return (
    <div className="text-center py-12">
      <div className="mb-4 text-gray-400">
        <svg
          className="mx-auto h-12 w-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 className="text-gray-500 text-lg">{message}</h3>
      {onReset && (
        <button
          onClick={onReset}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};