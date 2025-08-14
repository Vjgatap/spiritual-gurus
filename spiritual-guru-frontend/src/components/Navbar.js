import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg shadow-md py-4 px-8 flex justify-between items-center fixed top-0 w-full z-10 rounded-b-lg">
      <div className="flex items-center space-x-2">
        {/* Om Logo/Icon for Navbar */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
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
        <div className="flex flex-col">
          <span className="text-xl font-bold text-gray-800">SPIRITUAL GURU</span>
          <span className="text-gray-500 text-xs mt-[-4px]">भारत के आध्यात्मिक गुरु</span>
        </div>
      </div>
      <div className="flex items-center space-x-8">
        <Link to="/" className="text-gray-700 hover:text-orange-600 font-medium transition duration-200">
          Home
        </Link>
        <Link to="/gurus" className="text-gray-700 hover:text-orange-600 font-medium transition duration-200">
          Gurus
        </Link>
        <Link to="/teachings" className="text-gray-700 hover:text-orange-600 font-medium transition duration-200">
          Teachings
        </Link>
        <Link to="/about" className="text-gray-700 hover:text-orange-600 font-medium transition duration-200">
          About
        </Link>
        {/* Admin Dashboard Link - only visible to admins */}
        {user && user.role === 'admin' && (
          <Link to="/admin" className="text-purple-600 hover:text-purple-800 font-bold transition duration-200">
            Admin Dashboard
          </Link>
        )}
        {/* Manage Gurus Link for Admins directly in Navbar - Color Changed */}
        {user && user.role === 'admin' && (
          <Link to="/admin/gurus" className="text-orange-600 hover:text-orange-800 font-bold transition duration-200">
            Manage Gurus
          </Link>
        )}
      </div>
      <div className="flex items-center space-x-4">
        {user ? (
          <button
            onClick={handleLogout}
            className="px-5 py-2 bg-orange-500 text-white font-semibold rounded-md shadow-md hover:bg-orange-600 transition duration-300"
          >
            Logout
          </button>
        ) : (
          <>
            <button
              onClick={() => navigate('/login')}
              className="px-5 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition duration-300"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-5 py-2 bg-orange-500 text-white font-semibold rounded-md shadow-md hover:bg-orange-600 transition duration-300"
            >
              Register
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
