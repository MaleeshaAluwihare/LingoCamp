import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CourseDetails from '../../components/CourseManagement/CourseDetails';
import CourseList from '../../components/CourseManagement/CourseList';
import { SkeletonLoader } from '../../components/UI/SkeletonLoader';
import { ErrorMessage } from '../../components/UI/ErrorMessage';
import { FiFilter, FiArrowUp, FiArrowDown, FiX } from 'react-icons/fi';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selected, setSelected] = useState(null);
  const [languageFilter, setLanguageFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:8081/lingocamp/api/courses/all");

        const fetchedCourses = response.data.courses;
        const uniqueLanguages = [...new Set(fetchedCourses.map(c => c.categories))];
        
        setCourses(fetchedCourses);
        setFiltered(fetchedCourses);
        setLanguages(uniqueLanguages);
        setLoading(false);
      } catch (err) {
        setError('Failed to load courses. Please try again later.');
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    let data = [...courses];
    
    // Apply filters
    if (languageFilter) {
      data = data.filter(c => c.categories === languageFilter);
    }
    
    // Apply search
    if (searchQuery) {
      data = data.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    data.sort((a, b) => sortOrder === 'asc' ? a.price - b.price : b.price - a.price);
    
    setFiltered(data);
  }, [languageFilter, sortOrder, courses, searchQuery]);

  const clearFilters = () => {
    setLanguageFilter('');
    setSearchQuery('');
  };

  if (loading) {
    return (
      <div className="p-4 max-w-6xl mx-auto">
        <SkeletonLoader count={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 max-w-6xl mx-auto">
        <ErrorMessage message={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {!selected ? (
        <>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              Explore Language Courses
              <span className="text-lg ml-2 text-gray-500">({filtered.length} available)</span>
            </h1>
            <button
              onClick={clearFilters}
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
              disabled={!languageFilter && !searchQuery}
            >
              <FiX className="mr-1" /> Clear Filters
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search courses..."
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <select
                className="w-full px-4 py-2 border rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={languageFilter}
                onChange={e => setLanguageFilter(e.target.value)}
              >
                <option value="">All Languages</option>
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
              <FiFilter className="absolute right-3 top-3 text-gray-400" />
            </div>

            <div className="relative">
              <select
                className="w-full px-4 py-2 border rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={sortOrder}
                onChange={e => setSortOrder(e.target.value)}
              >
                <option value="asc">Price: Low to High</option>
                <option value="desc">Price: High to Low</option>
              </select>
              {sortOrder === 'asc' ? (
                <FiArrowUp className="absolute right-3 top-3 text-gray-400" />
              ) : (
                <FiArrowDown className="absolute right-3 top-3 text-gray-400" />
              )}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl text-gray-500 mb-4">No courses found matching your criteria</h2>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Search & Filters
              </button>
            </div>
          ) : (
            <CourseList 
              courses={filtered} 
              onSelect={setSelected}
              searchQuery={searchQuery}
            />
          )}
        </>
      ) : (
        <CourseDetails 
          course={selected} 
          onBack={() => setSelected(null)}
          onEnroll={() => {/* Add enrollment logic */}}
        />
      )}
    </div>
  );
}

export default Courses;