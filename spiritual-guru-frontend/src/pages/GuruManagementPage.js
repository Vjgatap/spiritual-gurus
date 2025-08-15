import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const GuruManagementPage = () => {
  const { user, loading: authLoading } = useAuth(); // Get user and authLoading state
  const [gurus, setGurus] = useState([]);
  const [categories, setCategories] = useState([]); // For era dropdown
  const [loading, setLoading] = useState(true); // Loading state for guru data
  const [error, setError] = useState(null);
  
  // Expanded formData to include all new guru schema fields
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '', // Date format: YYYY-MM-DD for input type="date"
    dod: '', // Date format: YYYY-MM-DD for input type="date"
    birthPlace: '',
    guruType: 'Other', // Default value for select
    aashram: '',
    era: '', // Category ObjectId
    bio: '',
    profileImageUrl: '',
    bgImageUrl: '',
    images: [{ url: '', caption: '' }], // Array of { url, caption }
    videos: [{ url: '', title: '' }], // Array of { url, title }
    books: [{ title: '', pdfUrl: '' }], // Array of { title, pdfUrl }
  });

  const [editingGuru, setEditingGuru] = useState(null); // Stores guru being edited
  const [message, setMessage] = useState(''); // For success/error messages

  const GURU_API_URL = 'http://localhost:5000/api/gurus';
  const CATEGORY_API_URL = 'http://localhost:5000/api/categories';

  // Function to fetch all gurus from the backend
  const fetchGurus = async () => {
    if (!user || !user.token) {
        setLoading(false);
        setError('Not authorized. Please log in as an administrator.');
        return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      // Fetch all guru details for admin view
      const res = await axios.get(GURU_API_URL, config); 
      setGurus(res.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch gurus:', err);
      if (err.response && err.response.status === 401) {
        setError('Session expired or not authorized. Please log in again.');
      } else {
        setError('Failed to load spiritual masters. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch categories for the 'era' dropdown
  const fetchCategories = async () => {
    if (!user || !user.token) { 
        return; 
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const res = await axios.get(CATEGORY_API_URL, config);
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to fetch categories for dropdown:', err);
    }
  };

  // Initial data fetch on component mount and when auth state changes
  useEffect(() => {
    if (!authLoading && user && user.token) {
      fetchGurus();
      fetchCategories();
    } else if (!authLoading && (!user || !user.token)) {
      setLoading(false);
      setError('Not authorized. Please log in as an administrator.');
    }
  }, [user, authLoading]); // Dependencies

  // General handler for scalar input fields
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Helper to format Date objects to YYYY-MM-DD for input type="date"
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Handlers for dynamic array fields (images, videos, books)
  const handleArrayChange = (arrayName, index, field, value) => {
    const newArray = [...formData[arrayName]];
    newArray[index][field] = value;
    setFormData({ ...formData, [arrayName]: newArray });
  };

  const handleAddArrayItem = (arrayName, initialItem) => {
    setFormData({ ...formData, [arrayName]: [...formData[arrayName], initialItem] });
  };

  const handleRemoveArrayItem = (arrayName, index) => {
    const newArray = formData[arrayName].filter((_, i) => i !== index);
    setFormData({ ...formData, [arrayName]: newArray });
  };

  // Form submission logic (Create/Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!user || !user.token) {
        setMessage('Not authorized. Please log in again.');
        return;
    }
    // Basic validation for required fields
    if (!formData.fullName.trim() || !formData.dob || !formData.birthPlace.trim() || 
        !formData.guruType.trim() || !formData.era || !formData.bio.trim() || !formData.profileImageUrl.trim()) {
      setMessage('Please fill in all required fields: Full Name, DOB, Birth Place, Guru Type, Era, Bio, Profile Image URL.');
      return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      // Clean up array fields: remove empty entries
      const cleanedImages = formData.images.filter(item => item.url.trim() !== '');
      const cleanedVideos = formData.videos.filter(item => item.url.trim() !== '');
      const cleanedBooks = formData.books.filter(item => item.title.trim() !== ''); // PDF URL can be optional

      const dataToSend = { 
        ...formData, 
        images: cleanedImages, 
        videos: cleanedVideos, 
        books: cleanedBooks,
        dob: formData.dob ? new Date(formData.dob).toISOString() : '', // Convert to ISO string for backend
        dod: formData.dod ? new Date(formData.dod).toISOString() : '', // Convert to ISO string or empty
      };

      if (editingGuru) {
        await axios.put(`${GURU_API_URL}/${editingGuru._id}`, dataToSend, config);
        setMessage('Spiritual Master updated successfully!');
      } else {
        await axios.post(GURU_API_URL, dataToSend, config);
        setMessage('Spiritual Master added successfully!');
      }
      
      // Reset form to initial empty state after successful operation
      setFormData({ 
        fullName: '', dob: '', dod: '', birthPlace: '', guruType: 'Other', aashram: '', 
        era: '', bio: '', profileImageUrl: '', bgImageUrl: '',
        images: [{ url: '', caption: '' }],
        videos: [{ url: '', title: '' }],
        books: [{ title: '', pdfUrl: '' }],
      });
      setEditingGuru(null);
      fetchGurus(); // Re-fetch gurus to update list
    } catch (err) {
      console.error('Guru operation failed:', err.response?.data?.message || err.message);
      setMessage(err.response?.data?.message || 'Operation failed. Ensure all fields are valid and you are authorized.');
    }
  };

  // Set form data when editing an existing guru
  const handleEdit = (guru) => {
    setEditingGuru(guru);
    setFormData({
      fullName: guru.fullName,
      dob: formatDateForInput(guru.dob), // Format date for input
      dod: guru.dod ? formatDateForInput(guru.dod) : '', // Format date or empty
      birthPlace: guru.birthPlace,
      guruType: guru.guruType,
      aashram: guru.aashram || '', // Ensure it's not null/undefined
      era: guru.era._id, // Category ObjectId
      bio: guru.bio,
      profileImageUrl: guru.profileImageUrl,
      bgImageUrl: guru.bgImageUrl || '', // Ensure it's not null/undefined
      // Ensure arrays are not empty, if so, add a blank entry for input
      images: guru.images.length > 0 ? guru.images : [{ url: '', caption: '' }],
      videos: guru.videos.length > 0 ? guru.videos : [{ url: '', title: '' }],
      books: guru.books.length > 0 ? guru.books : [{ title: '', pdfUrl: '' }],
    });
    setMessage('');
  };

  // Handle guru deletion
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this spiritual master? This action cannot be undone.')) {
      if (!user || !user.token) {
        setMessage('Not authorized. Please log in again.');
        return;
      }
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        await axios.delete(`${GURU_API_URL}/${id}`, config);
        setMessage('Spiritual master deleted successfully!');
        fetchGurus();
      } catch (err) {
        console.error('Guru deletion failed:', err.response?.data?.message || err.message);
        setMessage(err.response?.data?.message || 'Deletion failed. You might not be authorized.');
      }
    }
  };

  // Conditional rendering for loading and errors
  if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-20"><p>Loading...</p></div>;
  if (error) return <div className="min-h-screen flex items-center justify-center bg-red-100 text-red-700 pt-20"><p>{error}</p></div>;

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <Navbar />
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Manage Spiritual Masters</h1>

        {message && (
          <div className={`p-3 rounded-lg text-center mb-4 ${message.includes('successful') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        {/* Guru Add/Edit Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {editingGuru ? 'Edit Spiritual Master' : 'Add New Spiritual Master'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                name="fullName"
                id="fullName"
                placeholder="Guru's Full Name"
                value={formData.fullName}
                onChange={handleInputChange}
                className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
                required
              />
            </div>

            {/* DOB and DOD */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  id="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
                  required
                />
              </div>
              <div>
                <label htmlFor="dod" className="block text-sm font-medium text-gray-700">Date of Death (Optional)</label>
                <input
                  type="date"
                  name="dod"
                  id="dod"
                  value={formData.dod}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>
            </div>

            {/* Birth Place */}
            <div>
              <label htmlFor="birthPlace" className="block text-sm font-medium text-gray-700">Birth Place</label>
              <input
                type="text"
                name="birthPlace"
                id="birthPlace"
                placeholder="Guru's Birth Place"
                value={formData.birthPlace}
                onChange={handleInputChange}
                className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
                required
              />
            </div>

            {/* Guru Type */}
            <div>
              <label htmlFor="guruType" className="block text-sm font-medium text-gray-700">Guru Type</label>
              <select
                name="guruType"
                id="guruType"
                value={formData.guruType}
                onChange={handleInputChange}
                className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
                required
              >
                <option value="Nastik">Nastik (Atheistic)</option>
                <option value="Bhaktiyog">Bhaktiyog (Devotion)</option>
                <option value="Karmyogi">Karmyogi (Action)</option>
                <option value="Jnanayog">Jnanayog (Knowledge)</option>
                <option value="Rajayog">Rajayog (Meditation)</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Aashram */}
            <div>
              <label htmlFor="aashram" className="block text-sm font-medium text-gray-700">Aashram / Organization (Optional)</label>
              <input
                type="text"
                name="aashram"
                id="aashram"
                placeholder="Guru's Aashram or Main Organization"
                value={formData.aashram}
                onChange={handleInputChange}
                className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>

            {/* Era (Category) */}
            <div>
              <label htmlFor="era" className="block text-sm font-medium text-gray-700">Era</label>
              <select
                name="era"
                id="era"
                value={formData.era}
                onChange={handleInputChange}
                className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
                required
              >
                <option value="">Select Era</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Biography</label>
              <textarea
                name="bio"
                id="bio"
                placeholder="Detailed Biography"
                value={formData.bio}
                onChange={handleInputChange}
                rows="4"
                className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
                required
              ></textarea>
            </div>

            {/* Profile Image URL */}
            <div>
              <label htmlFor="profileImageUrl" className="block text-sm font-medium text-gray-700">Profile Image URL (for circular image)</label>
              <input
                type="text"
                name="profileImageUrl"
                id="profileImageUrl"
                placeholder="e.g., https://example.com/guru_profile.jpg"
                value={formData.profileImageUrl}
                onChange={handleInputChange}
                className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
                required
              />
            </div>

            {/* Background Image URL */}
            <div>
              <label htmlFor="bgImageUrl" className="block text-sm font-medium text-gray-700">Background Image URL (Optional, for hero banner)</label>
              <input
                type="text"
                name="bgImageUrl"
                id="bgImageUrl"
                placeholder="e.g., https://example.com/guru_background.jpg"
                value={formData.bgImageUrl}
                onChange={handleInputChange}
                className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>

            {/* Multiple Images Section */}
            <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-2">Image Gallery (Min 5 recommended)</h3>
            {formData.images.map((img, index) => (
              <div key={index} className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 items-center">
                <input
                  type="text"
                  placeholder={`Image URL ${index + 1}`}
                  value={img.url}
                  onChange={(e) => handleArrayChange('images', index, 'url', e.target.value)}
                  className="flex-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
                <input
                  type="text"
                  placeholder={`Caption ${index + 1} (Optional)`}
                  value={img.caption}
                  onChange={(e) => handleArrayChange('images', index, 'caption', e.target.value)}
                  className="flex-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveArrayItem('images', index)}
                  className="w-full md:w-auto bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition duration-300"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddArrayItem('images', { url: '', caption: '' })}
              className="w-full py-2 px-4 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition duration-300"
            >
              Add Image
            </button>

            {/* Multiple Videos Section */}
            <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-2">Videos (Min 5 recommended)</h3>
            {formData.videos.map((vid, index) => (
              <div key={index} className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 items-center">
                <input
                  type="text"
                  placeholder={`YouTube URL ${index + 1}`}
                  value={vid.url}
                  onChange={(e) => handleArrayChange('videos', index, 'url', e.target.value)}
                  className="flex-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
                <input
                  type="text"
                  placeholder={`Video Title ${index + 1} (Optional)`}
                  value={vid.title}
                  onChange={(e) => handleArrayChange('videos', index, 'title', e.target.value)}
                  className="flex-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveArrayItem('videos', index)}
                  className="w-full md:w-auto bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition duration-300"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddArrayItem('videos', { url: '', title: '' })}
              className="w-full py-2 px-4 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition duration-300"
            >
              Add Video
            </button>

            {/* Multiple Books Section */}
            <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-2">Books</h3>
            {formData.books.map((book, index) => (
              <div key={index} className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 items-center">
                <input
                  type="text"
                  placeholder={`Book Title ${index + 1}`}
                  value={book.title}
                  onChange={(e) => handleArrayChange('books', index, 'title', e.target.value)}
                  className="flex-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
                <input
                  type="text"
                  placeholder={`Book PDF URL ${index + 1} (Optional)`}
                  value={book.pdfUrl}
                  onChange={(e) => handleArrayChange('books', index, 'pdfUrl', e.target.value)}
                  className="flex-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveArrayItem('books', index)}
                  className="w-full md:w-auto bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition duration-300"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddArrayItem('books', { title: '', pdfUrl: '' })}
              className="w-full py-2 px-4 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition duration-300"
            >
              Add Book
            </button>

            {/* Form Action Buttons */}
            <div className="flex space-x-4 mt-6">
              <button
                type="submit"
                className="flex-1 py-3 px-6 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 transition duration-300 transform hover:scale-105"
              >
                {editingGuru ? 'Update Spiritual Master' : 'Add Spiritual Master'}
              </button>
              {editingGuru && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingGuru(null);
                    setFormData({ // Reset to initial empty state
                      fullName: '', dob: '', dod: '', birthPlace: '', guruType: 'Other', aashram: '', 
                      era: '', bio: '', profileImageUrl: '', bgImageUrl: '',
                      images: [{ url: '', caption: '' }],
                      videos: [{ url: '', title: '' }],
                      books: [{ title: '', pdfUrl: '' }],
                    });
                    setMessage('');
                  }}
                  className="flex-1 py-3 px-6 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-400 transition duration-300 transform hover:scale-105"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Existing Gurus List Table */}
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Existing Spiritual Masters</h2>
          {gurus.length === 0 ? (
            <p className="text-gray-500">No spiritual masters found. Add one above!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Era</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guru Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bio (Excerpt)</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {gurus.map((guru) => (
                    <tr key={guru._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {guru.fullName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {guru.era ? guru.era.name : 'N/A'}
                      </td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {guru.guruType}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {guru.bio ? guru.bio.substring(0, 50) : ''}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEdit(guru)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(guru._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuruManagementPage;
