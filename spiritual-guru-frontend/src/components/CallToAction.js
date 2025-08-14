import React from 'react';

const CallToAction = () => {
  return (
    <section className="py-20 px-8 bg-amber-800 text-center text-white">
      <div className="flex justify-center mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#EF4444" // Red-orange for contrast
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-flower2"
        >
          <path d="M12 8a4 4 0 0 1 0 8 4 4 0 0 1 0-8Z" />
          <path d="M12 2v2" />
          <path d="M16.2 3.7l-1.4 1.4" />
          <path d="M20 8h-2" />
          <path d="M20.3 12.2l-1.4-1.4" />
          <path d="M16.2 20.3l-1.4-1.4" />
          <path d="M12 22v-2" />
          <path d="M7.8 20.3l-1.4-1.4" />
          <path d="M4 16h2" />
          <path d="M3.7 12.2l1.4-1.4" />
          <path d="M7.8 3.7l-1.4 1.4" />
          <path d="M4 8h2" />
        </svg>
      </div>
      <h2 className="text-4xl font-bold mb-4">BEGIN YOUR SPIRITUAL JOURNEY</h2>
      <p className="text-lg mb-8 max-w-2xl mx-auto">
        Join thousands of seekers exploring the timeless wisdom of India's spiritual masters
      </p>
      <button className="px-8 py-4 bg-orange-500 text-white text-lg font-semibold rounded-lg shadow-xl hover:bg-orange-600 transform hover:scale-105 transition duration-300">
        Start Your Journey
      </button>
    </section>
  );
};

export default CallToAction;
