import React from 'react';
import Navbar from '../components/Navbar'; // Assuming Navbar is shared
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserDashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  if (!user) {
    // Should ideally be caught by AuthProvider's redirect, but good for direct access
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-orange-100 flex flex-col items-center pt-20">
      <Navbar />
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl p-8 space-y-8 text-center mt-8">
        <h1 className="text-4xl font-bold text-gray-800">Welcome, {user.name}!</h1>
        <p className="text-gray-600 text-lg">This is your personal dashboard.</p>
        <p className="text-gray-500">You are logged in as a: <span className="font-semibold text-gray-700">{user.role}</span></p>
        
        <div className="flex flex-col space-y-4">
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 transform hover:scale-105"
          >
            Go to Homepage
          </button>
          <button
            onClick={handleLogout}
            className="w-full py-3 px-6 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 transition duration-300 transform hover:scale-105"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;
