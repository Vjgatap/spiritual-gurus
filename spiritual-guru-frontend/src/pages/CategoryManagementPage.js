import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const CategoryManagementPage = () => {
  const { user, loading: authLoading } = useAuth(); // Get user and authLoading state
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state for data fetching
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [editingCategory, setEditingCategory] = useState(null);
  const [message, setMessage] = useState('');

  const API_URL = 'http://localhost:5000/api/categories';

  const fetchCategories = async () => {
    // Only attempt to fetch if user and token are available
    if (!user || !user.token) {
        setLoading(false); // Stop loading if no user/token
        setError('Not authorized. Please log in as an administrator.');
        return;
    }

    try {
      setLoading(true);
      const config = { // Define config with token here
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const res = await axios.get(API_URL, config); // Pass config to GET request
      setCategories(res.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      // More specific error handling for authorization
      if (err.response && err.response.status === 401) {
        setError('Session expired or not authorized. Please log in again.');
      } else {
        setError('Failed to load categories. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch categories only AFTER auth state is resolved AND user/token are available
    if (!authLoading && user && user.token) {
      fetchCategories();
    } else if (!authLoading && (!user || !user.token)) {
      // If authLoading is false but no user/token, it means not logged in or token invalid
      setLoading(false);
      setError('Not authorized. Please log in as an administrator.');
    }
  }, [user, authLoading]); // Dependency on user and authLoading

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!user || !user.token) {
        setMessage('Not authorized. Please log in again.');
        return;
    }
    if (!formData.name.trim() || !formData.description.trim()) {
        setMessage('Please fill in all fields.');
        return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      if (editingCategory) {
        await axios.put(`${API_URL}/${editingCategory._id}`, formData, config);
        setMessage('Category updated successfully!');
      } else {
        await axios.post(API_URL, formData, config);
        setMessage('Category added successfully!');
      }
      setFormData({ name: '', description: '' });
      setEditingCategory(null);
      fetchCategories(); // Re-fetch categories
    } catch (err) {
      console.error('Category operation failed:', err.response?.data?.message || err.message);
      setMessage(err.response?.data?.message || 'Operation failed. Check if category name is unique or you are authorized.');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, description: category.description });
    setMessage('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
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
        await axios.delete(`${API_URL}/${id}`, config);
        setMessage('Category deleted successfully!');
        fetchCategories();
      } catch (err) {
        console.error('Category deletion failed:', err.response?.data?.message || err.message);
        setMessage(err.response?.data?.message || 'Deletion failed. You might not be authorized.');
      }
    }
  };

  // Display loading for auth context or category data
  if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-20"><p>Loading...</p></div>;
  
  // Display error if user is not authorized
  if (error) return <div className="min-h-screen flex items-center justify-center bg-red-100 text-red-700 pt-20"><p>{error}</p></div>;

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <Navbar />
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Manage Categories</h1>

        {message && (
          <div className={`p-3 rounded-lg text-center mb-4 ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        {/* Category Form for Add/Edit */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 max-w-xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {editingCategory ? 'Edit Category' : 'Add New Category'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                name="name"
                placeholder="Category Name (e.g., Ancient Era)"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
                required
              />
            </div>
            <div>
              <textarea
                name="description"
                placeholder="Category Description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
                required
              ></textarea>
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex-1 py-3 px-6 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 transition duration-300 transform hover:scale-105"
              >
                {editingCategory ? 'Update Category' : 'Add Category'}
              </button>
              {editingCategory && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingCategory(null);
                    setFormData({ name: '', description: '' });
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

        {/* Categories List */}
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Existing Categories</h2>
          {categories.length === 0 ? (
            <p className="text-gray-500">No categories found. Add one above!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {categories.map((category) => (
                    <tr key={category._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {category.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {category.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(category._id)}
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

export default CategoryManagementPage;
