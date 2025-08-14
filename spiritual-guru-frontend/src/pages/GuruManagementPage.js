import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // To access the logged-in user's token
import Navbar from '../components/Navbar'; // Assuming you have a Navbar component

const GuruManagementPage = () => {
  const { user } = useAuth(); // Get authenticated user data, specifically the token
  const [gurus, setGurus] = useState([]); // State to store the list of gurus
  const [categories, setCategories] = useState([]); // State to store categories for the 'era' dropdown
  const [loading, setLoading] = useState(true); // Loading state for data fetching
  const [error, setError] = useState(null); // Error state for fetch operations
  const [formData, setFormData] = useState({ // State for form inputs (add/edit)
    name: '',
    era: '', // This will store the Category ObjectId
    bio: '',
    imageUrl: '',
    youtubeVideoUrl: '',
    books: [{ title: '' }], // Array of book objects, initialized with one empty book
  });
  const [editingGuru, setEditingGuru] = useState(null); // Stores the guru object when in edit mode
  const [message, setMessage] = useState(''); // General message for success/failure feedback

  // Base URLs for API calls
  const GURU_API_URL = 'http://localhost:5000/api/gurus';
  const CATEGORY_API_URL = 'http://localhost:5000/api/categories';

  // Function to fetch all gurus from the backend
  const fetchGurus = async () => {
    try {
      setLoading(true); // Set loading true before fetching
      const res = await axios.get(GURU_API_URL); // Make GET request for gurus
      setGurus(res.data); // Update gurus state
      setError(null); // Clear previous errors
    } catch (err) {
      console.error('Failed to fetch gurus:', err);
      setError('Failed to load spiritual masters. Please try again.'); // Set error message
    } finally {
      setLoading(false); // Set loading false after fetch attempt
    }
  };

  // Function to fetch categories for the 'era' dropdown
  const fetchCategories = async () => {
    try {
      const res = await axios.get(CATEGORY_API_URL); // Make GET request for categories
      setCategories(res.data); // Update categories state
    } catch (err) {
      console.error('Failed to fetch categories for dropdown:', err);
      // Log error but don't set global error state as it's secondary
    }
  };

  // useEffect to fetch data when the component mounts
  useEffect(() => {
    fetchGurus();
    fetchCategories(); // Fetch categories as well for the dropdown
  }, []); // Empty dependency array ensures it runs only once on mount

  // Handle changes in main form input fields (name, era, bio, etc.)
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle changes in individual book title input fields
  const handleBookChange = (index, e) => {
    const newBooks = [...formData.books];
    newBooks[index].title = e.target.value; // Update specific book title
    setFormData({ ...formData, books: newBooks });
  };

  // Add a new empty book input field
  const handleAddBook = () => {
    setFormData({ ...formData, books: [...formData.books, { title: '' }] });
  };

  // Remove a book input field
  const handleRemoveBook = (index) => {
    const newBooks = formData.books.filter((_, i) => i !== index);
    setFormData({ ...formData, books: newBooks });
  };

  // Handle form submission (Add or Update Guru)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default browser form submission
    setMessage(''); // Clear previous messages

    // Basic validation for required fields
    if (!formData.name.trim() || !formData.era || !formData.bio.trim() || !formData.imageUrl.trim() || !formData.youtubeVideoUrl.trim()) {
      setMessage('Please fill in all required fields (Name, Era, Bio, Image URL, YouTube URL).');
      return;
    }

    try {
      // Configuration for Axios request, including Authorization header with JWT
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`, // Attach admin's JWT token
        },
      };

      // Filter out any empty book titles before sending to backend
      const cleanedBooks = formData.books.filter(book => book.title.trim() !== '');
      const dataToSend = { ...formData, books: cleanedBooks };

      if (editingGuru) {
        // If in editing mode, send a PUT request to update the guru
        await axios.put(`${GURU_API_URL}/${editingGuru._id}`, dataToSend, config);
        setMessage('Guru updated successfully!');
      } else {
        // If not in editing mode, send a POST request to create a new guru
        await axios.post(GURU_API_URL, dataToSend, config);
        setMessage('Guru added successfully!');
      }

      // Reset form and editing state after successful operation
      setFormData({
        name: '',
        era: '',
        bio: '',
        imageUrl: '',
        youtubeVideoUrl: '',
        books: [{ title: '' }], // Reset to one empty book input
      });
      setEditingGuru(null);
      
      fetchGurus(); // Re-fetch gurus to update the displayed list
    } catch (err) {
      console.error('Guru operation failed:', err.response?.data?.message || err.message);
      setMessage(err.response?.data?.message || 'Operation failed. Ensure all fields are valid and you are authorized.');
    }
  };

  // Function to set the form for editing an existing guru
  const handleEdit = (guru) => {
    setEditingGuru(guru); // Set the guru object to be edited
    setFormData({
      name: guru.name,
      era: guru.era._id, // IMPORTANT: Set era to its ObjectId for the dropdown
      bio: guru.bio,
      imageUrl: guru.imageUrl,
      youtubeVideoUrl: guru.youtubeVideoUrl,
      // Ensure books array is not empty; if so, add a blank entry for user to type
      books: guru.books.length > 0 ? guru.books : [{ title: '' }],
    });
    setMessage(''); // Clear messages when starting edit
  };

  // Function to handle deleting a guru
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this spiritual master? This action cannot be undone.')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`, // Attach admin's JWT token
          },
        };
        await axios.delete(`${GURU_API_URL}/${id}`, config); // Send DELETE request
        setMessage('Spiritual master deleted successfully!'); // Success message
        fetchGurus(); // Re-fetch gurus to update the list
      } catch (err) {
        console.error('Guru deletion failed:', err.response?.data?.message || err.message);
        setMessage(err.response?.data?.message || 'Deletion failed. You might not be authorized.');
      }
    }
  };

  // Display loading message while data is being fetched
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-20"><p>Loading spiritual masters...</p></div>;
  // Display error message if fetching fails
  if (error) return <div className="min-h-screen flex items-center justify-center bg-red-100 text-red-700 pt-20"><p>{error}</p></div>;

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <Navbar />
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Manage Spiritual Masters</h1>

        {/* Message display area */}
        {message && (
          <div className={`p-3 rounded-lg text-center mb-4 ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        {/* Guru Add/Edit Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {editingGuru ? 'Edit Spiritual Master' : 'Add New Spiritual Master'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                name="name"
                placeholder="Guru Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
                required
              />
            </div>
            <div>
              <select
                name="era"
                value={formData.era} // This must be the ObjectId of the selected category
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
                required
              >
                <option value="">Select Era</option>
                {/* Populate dropdown with fetched categories */}
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <textarea
                name="bio"
                placeholder="Biography"
                value={formData.bio}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
                required
              ></textarea>
            </div>
            <div>
              <input
                type="text"
                name="imageUrl"
                placeholder="Image URL"
                value={formData.imageUrl}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
                required
              />
            </div>
            <div>
              <input
                type="text"
                name="youtubeVideoUrl"
                placeholder="YouTube Video URL"
                value={formData.youtubeVideoUrl}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
                required
              />
            </div>
            {/* Books Section: Dynamically add/remove book title inputs */}
            <h3 className="text-lg font-semibold text-gray-700 mt-4 mb-2">Books</h3>
            {formData.books.map((book, index) => (
              <div key={index} className="flex space-x-2 items-center">
                <input
                  type="text"
                  placeholder={`Book Title ${index + 1}`}
                  value={book.title}
                  onChange={(e) => handleBookChange(index, e)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveBook(index)}
                  className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition duration-300"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddBook}
              className="w-full py-2 px-4 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition duration-300"
            >
              Add Book
            </button>

            <div className="flex space-x-4 mt-6">
              <button
                type="submit"
                className="flex-1 py-3 px-6 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 transition duration-300 transform hover:scale-105"
              >
                {editingGuru ? 'Update Spiritual Master' : 'Add Spiritual Master'}
              </button>
              {editingGuru && ( // Show cancel button only when editing
                <button
                  type="button"
                  onClick={() => {
                    setEditingGuru(null); // Exit editing mode
                    setFormData({ // Reset form
                      name: '',
                      era: '',
                      bio: '',
                      imageUrl: '',
                      youtubeVideoUrl: '',
                      books: [{ title: '' }],
                    });
                    setMessage(''); // Clear messages
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Era</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bio (Excerpt)</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {gurus.map((guru) => (
                    <tr key={guru._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {guru.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {/* Displays era name, handles case where era might not be populated or linked */}
                        {guru.era ? guru.era.name : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {guru.bio.substring(0, 70)}... {/* Display a short excerpt of the bio */}
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
