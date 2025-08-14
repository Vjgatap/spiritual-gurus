import React from 'react';

const HeroSection = () => {
  return (
    <section className="min-h-[600px] flex flex-col items-center justify-center pt-24 pb-12 bg-gradient-to-br from-yellow-100 to-orange-100 text-center relative overflow-hidden">
      {/* Background Om Symbol (subtle) */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="300"
          height="300"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-om text-purple-600"
        >
          <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z" />
          <path d="M12 17c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5Z" />
          <path d="M12 17v-2" />
          <path d="M12 7v2" />
          <path d="M12 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2Z" />
          <path d="M12 14c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2-.9 2-2 2Z" />
        </svg>
      </div>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="80"
        height="80"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#8B5CF6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-om relative z-10 mb-6"
      >
        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z" />
        <path d="M12 17c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5Z" />
        <path d="M12 17v-2" />
        <path d="M12 7v2" />
        <path d="M12 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2Z" />
        <path d="M12 14c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2-.9 2-2 2Z" />
      </svg>
      <h1 className="text-6xl font-extrabold text-gray-900 mb-4 relative z-10">
        Spiritual Wisdom
      </h1>
      <p className="text-2xl font-semibold text-gray-700 mb-6 relative z-10">
        आध्यात्मिक ज्ञान की खोज
      </p>
      <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8 relative z-10">
        Discover the profound teachings of India's greatest spiritual masters. Journey through
        centuries of divine wisdom and enlightenment.
      </p>
      <div className="flex space-x-4 relative z-10">
        <button className="px-8 py-4 bg-orange-500 text-white text-lg font-semibold rounded-lg shadow-xl hover:bg-orange-600 transform hover:scale-105 transition duration-300">
          Explore Gurus
        </button>
        <button className="px-8 py-4 bg-transparent border border-orange-500 text-orange-700 text-lg font-semibold rounded-lg hover:bg-orange-50 hover:text-orange-800 transform hover:scale-105 transition duration-300">
          Read Teachings
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
