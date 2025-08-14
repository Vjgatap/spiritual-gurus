import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const AdminDashboardPage = () => {
  return (
    // Replicating homepage's gradient background and overall structure
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-orange-100 flex flex-col items-center pt-20">
      <Navbar /> {/* Include Navbar */}
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl p-8 space-y-8 text-center mt-8 md:mt-16 lg:mt-24"> {/* Increased top margin for larger screens */}
        
        {/* Om icon, similar to HeroSection or Login/Register pages */}
        <div className="flex justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#8B5CF6" // Purple color consistent with other Om icons
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

        <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600 text-lg">Manage your spiritual content here.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/admin/categories"
            className="block py-4 px-6 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 transition duration-300 transform hover:scale-105"
          >
            Manage Categories
          </Link>
          <Link
            to="/admin/gurus"
            className="block py-4 px-6 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 transition duration-300 transform hover:scale-105"
          >
            Manage Gurus
          </Link>
        </div>
        {/* You can add more admin-specific functionalities here */}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
