import React from 'react';

const ExploreByEra = () => {
  const eras = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6B46C1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-building2">
          <path d="M6 22V7H4v15c0 .5.5 1 1 1h14c.5 0 1-.5 1-1V7h-2v15" />
          <path d="M18 2h-6a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z" />
          <path d="M10 7V4a2 2 0 0 1 2-2h2" />
          <path d="M8 22V7h2V22" />
          <path d="M16 7V4a2 2 0 0 0-2-2h-2" />
          <path d="M12 7v3" />
          <path d="M8 13h4" />
          <path d="M8 17h4" />
          <path d="M12 10v4" />
        </svg>
      ),
      title: 'ANCIENT ERA',
      description: 'Vedic sages and ancient wisdom',
      period: '1500 BCE - 500 CE',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6B46C1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-castle">
          <path d="M21 17v-7h-3V7a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v3H3v7c0 1.6 1.4 3 3 3h12c1.6 0 3-1.4 3-3Z" />
          <path d="M7 17v3" />
          <path d="M12 17v3" />
          <path d="M17 17v3" />
        </svg>
      ),
      title: 'MEDIEVAL ERA',
      description: 'Bhakti saints and mystics',
      period: '500 - 1500 CE',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6B46C1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sun-dim">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 4h.01" />
          <path d="M20 12h.01" />
          <path d="M12 20h.01" />
          <path d="M4 12h.01" />
          <path d="M17.657 6.343h.01" />
          <path d="M17.657 17.657h.01" />
          <path d="M6.343 17.657h.01" />
          <path d="M6.343 6.343h.01" />
        </svg>
      ),
      title: 'MODERN ERA',
      description: 'Renaissance spiritual leaders',
      period: '1500 - 1900 CE',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6B46C1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
      title: 'CONTEMPORARY',
      description: 'Present-day spiritual guides',
      period: '1900 CE - Present',
    },
  ];

  return (
    <section className="py-20 px-8 bg-yellow-50 text-center">
      <h2 className="text-4xl font-bold text-gray-800 mb-4">EXPLORE BY ERA</h2>
      <p className="text-gray-600 text-lg mb-12">
        Journey through different periods of spiritual enlightenment
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {eras.map((era, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300"
          >
            <div className="mb-4">{era.icon}</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {era.title}
            </h3>
            <p className="text-gray-600 text-sm mb-1">{era.description}</p>
            <p className="text-gray-500 text-xs mb-4">{era.period}</p>
            <button className="px-6 py-2 border border-orange-500 text-orange-700 rounded-md hover:bg-orange-50 hover:text-orange-800 transition duration-300">
              Explore
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExploreByEra;
