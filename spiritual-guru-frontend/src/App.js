import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext'; // Import useAuth to check user role

// Public Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GurusPage from './pages/GurusPage';

// Admin Pages
import AdminDashboardPage from './pages/AdminDashboardPage';
import CategoryManagementPage from './pages/CategoryManagementPage';
import GuruManagementPage from './pages/GuruManagementPage';

// User Dashboard Page
import UserDashboardPage from './pages/UserDashboardPage';


// Component to protect routes requiring admin access
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth(); // Get user and loading state from AuthContext

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-700">Checking authentication...</p>
      </div>
    );
  }

  // If user is logged in AND has admin role, render children
  // Otherwise, redirect to login
  return user && user.role === 'admin' ? children : <Navigate to="/login" replace />;
};

// Component to protect routes requiring any logged-in user access
const ProtectedUserRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-700">Checking authentication...</p>
      </div>
    );
  }
  // If any user is logged in, render children. Otherwise, redirect to login.
  return user ? children : <Navigate to="/login" replace />;
};


function App() {
  return (
    <Router>
      {/* AuthProvider wraps the entire application to provide global authentication state */}
      <AuthProvider>
        <Routes>
          {/* Publicly Accessible Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/gurus" element={<GurusPage />} />
          <Route path="/teachings" element={<div>Teachings Page (Public)</div>} /> {/* Placeholder */}
          <Route path="/about" element={<div>About Page (Public)</div>} /> {/* Placeholder */}
          <Route path="/books" element={<div>Sacred Books Page (Public)</div>} /> {/* Placeholder */}
          <Route path="/category/:eraName" element={<div>Category Detail Page (Public)</div>} /> {/* Placeholder */}

          {/* User Protected Routes (for any logged-in user) */}
          <Route path="/user-dashboard" element={<ProtectedUserRoute><UserDashboardPage /></ProtectedUserRoute>} />

          {/* Admin Protected Routes: Use AdminRoute to wrap components that only admins can see */}
          <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
          <Route path="/admin/categories" element={<AdminRoute><CategoryManagementPage /></AdminRoute>} />
          <Route path="/admin/gurus" element={<AdminRoute><GuruManagementPage /></AdminRoute>} />

          {/* Catch-all route for unmatched paths */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
