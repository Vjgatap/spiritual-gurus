import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Initial loading state for auth check
  const navigate = useNavigate();

  // useEffect for initial authentication check on component mount
  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Attempt to get user profile with the stored token
          const res = await axios.get('http://localhost:5000/api/users/profile', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(res.data); // Set user from profile data, which includes the role
          // console.log('User fetched on load:', res.data); // Debugging: Check user object
          
          // No immediate redirect here. Let the routes in App.js handle initial rendering based on URL.
          // After auth state is set, if the user then tries to access a protected route,
          // AdminRoute/ProtectedUserRoute will redirect them if they don't have access.

        } catch (error) {
          console.error('Failed to fetch user profile on load or token invalid:', error);
          localStorage.removeItem('token'); // Clear invalid/expired token
          setUser(null); // Clear user state
          // No immediate redirect here either. Let the routes handle it.
        } finally {
          setLoading(false); // ALWAYS set loading to false after check completes
        }
      } else {
        setLoading(false); // If no token, finish loading immediately
      }
    };
    checkUser();
  }, [/* No navigate dependency here, as it's not performing a direct navigation */]); // Removed navigate from dependencies for this effect

  // Login function
  const login = async (email, password) => {
    try {
      const res = await axios.post('http://localhost:5000/api/users/login', { email, password });
      localStorage.setItem('token', res.data.token); // Store new token
      setUser(res.data); // Set user data (includes role)
      
      // Redirect based on user role after successful login
      if (res.data.role === 'admin') {
        navigate('/admin'); // Admin goes to admin dashboard
      } else {
        navigate('/user-dashboard'); // Regular user goes to user dashboard
      }
      return { success: true };
    } catch (err) {
      console.error('Login failed:', err.response?.data?.message || err.message);
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    }
  };

  // Register function
  const register = async (name, email, password, role = 'user') => {
    try {
      await axios.post('http://localhost:5000/api/users/register', { name, email, password, role });
      
      // After successful registration, always redirect to login page for explicit sign-in
      navigate('/login', { state: { message: 'Registration successful! Please log in.' } }); // Pass message via state
      return { success: true, message: 'Registration successful! Please log in.' };
    } catch (err) {
      console.error('Registration failed:', err.response?.data?.message || err.message);
      return { success: false, message: err.response?.data?.message || 'Registration failed' };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token'); // Clear token from storage
    setUser(null); // Clear user state
    navigate('/login'); // Redirect to login page
  };

  // Render loading indicator while authentication status is being determined initially
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 to-orange-100">
        <p className="text-xl text-gray-700">Loading user session...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
