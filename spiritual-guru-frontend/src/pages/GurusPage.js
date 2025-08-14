import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
// REMOVED: import { useAuth } from '../context/AuthContext'; // Not needed for this public page

const GurusPage = () => {
  const [gurus, setGurus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state for gurus
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEra, setSelectedEra] = useState('All Eras');

  const GURU_API_URL = 'http://localhost:5000/api/gurus';
  const CATEGORY_API_URL = 'http://localhost:5000/api/categories';

  // Fetch categories for the filter buttons (public endpoint, no token needed)
  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const res = await axios.get(CATEGORY_API_URL);
        setCategories(res.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategoriesData();
  }, []);

  // Fetch gurus based on search term and selected era
  useEffect(() => {
    const fetchGurusData = async () => {
      setLoading(true); // Start loading for gurus
      setError(null); // Clear previous errors
      try {
        const params = {};
        if (selectedEra !== 'All Eras') {
          const eraObject = categories.find(cat => cat.name === selectedEra);
          if (eraObject) {
            params.era = eraObject._id;
          }
        }
        
        const res = await axios.get(GURU_API_URL, { params });
        
        const filteredGurus = res.data.filter(guru => {
            const matchesSearchTerm = searchTerm ? 
                guru.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                (guru.bio && guru.bio.toLowerCase().includes(searchTerm.toLowerCase())) || 
                (guru.era && guru.era.name && guru.era.name.toLowerCase().includes(searchTerm.toLowerCase())) : true; 
            return matchesSearchTerm;
        });

        setGurus(filteredGurus);
      } catch (err) {
        console.error('Error fetching gurus:', err);
        setError('Failed to load spiritual masters. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (selectedEra === 'All Eras' || (categories.length > 0 && categories.some(cat => cat.name === selectedEra))) {
        fetchGurusData();
    }
  }, [searchTerm, selectedEra, categories]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEraSelect = (eraName) => {
    setSelectedEra(eraName);
  };

  return (
    <div className="min-h-screen bg-yellow-50 flex flex-col items-center pt-24">
      <Navbar />

      {/* Hero Section */}
      <section className="w-full text-center py-12 bg-gradient-to-br from-yellow-100 to-orange-100">
        <div className="flex justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#8B5CF6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-om"
          >
            <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z" />
            <path d="M12 17c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5Z" />
            <path d="M12 17v-2" />
            <path d="M12 7v2" />
            <path d="M12 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2Z" />
            <path d="M12 14c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2-.9 2-2 2Z" />
          </svg>
        </div>
        <h1 className="text-5xl font-extrabold text-gray-800 mb-4">Spiritual Masters</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover the profound wisdom of India's greatest spiritual teachers across different eras
        </p>
      </section>

      {/* Search and Filter Section */}
      <section className="w-full max-w-6xl px-8 py-8 bg-white rounded-xl shadow-lg mt-[-50px] z-10">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
          {/* Search Input */}
          <div className="relative flex-grow w-full md:w-auto">
            <input
              type="text"
              placeholder="Search gurus, teachings, or categories..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>

          {/* Era Filter Buttons */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <button
              onClick={() => handleEraSelect('All Eras')}
              className={`px-6 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors duration-200 ${
                selectedEra === 'All Eras'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All Eras
            </button>
            {categories.map((category) => (
              <button
                key={category._id}
                onClick={() => handleEraSelect(category.name)}
                className={`px-6 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors duration-200 ${
                  selectedEra === category.name
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Results Count */}
      <section className="w-full max-w-6xl px-8 mt-8">
        {loading ? (
          <p className="text-gray-600 text-lg">Loading spiritual masters...</p>
        ) : error ? (
          <p className="text-red-600 text-lg">{error}</p>
        ) : (
          <p className="text-gray-600 text-lg">
            Showing {gurus.length} of {gurus.length} spiritual masters
          </p>
        )}
      </section>

      {/* Guru Cards Display */}
      <section className="w-full max-w-6xl px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gurus.map((guru) => (
            <div key={guru._id} className="bg-white rounded-xl shadow-lg flex flex-col items-center text-center overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <img src={guru.imageUrl} alt={guru.name} className="w-full h-48 object-cover mb-4" />
              <div className="p-6">
                <span className="bg-yellow-200 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full mb-3 inline-block">
                  {guru.era ? guru.era.name : 'Era Not Defined'}
                </span>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{guru.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{guru.bio ? guru.bio.substring(0, 100) : ''}...</p>
                <button className="px-6 py-2 bg-orange-500 text-white font-semibold rounded-md shadow-md hover:bg-orange-600 transition duration-300">
                  Learn More
                </button>
              </div>
            </div>
          ))}
          {gurus.length === 0 && !loading && !error && (
            <p className="text-gray-500 text-center col-span-full">No spiritual masters found matching your criteria.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default GurusPage;
