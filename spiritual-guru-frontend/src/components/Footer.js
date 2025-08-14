import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="container mx-auto py-12 px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="purple"
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
              <span className="text-xl font-bold text-white">SPIRITUAL GURU</span>
              <span className="text-gray-400 text-xs mt-[-4px]">भारत के आध्यात्मिक गुरु</span>
            </div>
          </div>
          <p className="text-sm">
            Discover the profound wisdom of spiritual gurus across different eras in India. Explore
            teachings, books, and divine knowledge that has guided humanity for centuries.
          </p>
          <div className="flex space-x-2">
            <span role="img" aria-label="om" className="text-2xl">🕉️</span>
            <span role="img" aria-label="lotus" className="text-2xl">🌸</span>
            <span role="img" aria-label="praying hands" className="text-2xl">🙏</span>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">QUICK LINKS</h3>
          <ul className="space-y-2">
            <li><Link to="/gurus" className="text-sm hover:text-orange-400 transition duration-200">All Gurus</Link></li>
            <li><Link to="/teachings" className="text-sm hover:text-orange-400 transition duration-200">Teachings</Link></li>
            <li><Link to="/books" className="text-sm hover:text-orange-400 transition duration-200">Sacred Books</Link></li>
            <li><Link to="/about" className="text-sm hover:text-orange-400 transition duration-200">About Us</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">CATEGORIES</h3>
          <ul className="space-y-2">
            <li><Link to="/category/ancient" className="text-sm hover:text-orange-400 transition duration-200">Ancient Era</Link></li>
            <li><Link to="/category/medieval" className="text-sm hover:text-orange-400 transition duration-200">Medieval Era</Link></li>
            <li><Link to="/category/modern" className="text-sm hover:text-orange-400 transition duration-200">Modern Era</Link></li>
            <li><Link to="/category/contemporary" className="text-sm hover:text-orange-400 transition duration-200">Contemporary</Link></li>
          </ul>
        </div>
      </div>
      <div className="bg-amber-800 text-center py-4 text-sm text-gray-400">
        © 2024 Spiritual Guru in India. All rights reserved. सर्वं भवतु सुखिनः
      </div>
    </footer>
  );
};

export default Footer;
