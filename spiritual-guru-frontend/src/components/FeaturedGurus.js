import React from 'react';

const FeaturedGurus = () => {
  const gurus = [
    {
      era: 'Ancient Era',
      name: 'ADI SHANKARACHARYA',
      description: 'Great philosopher and theologian who consolidated Advaita Vedanta.',
      imageUrl: 'https://placehold.co/300x200/F3F4F6/9CA3AF?text=Guru+Image', // Placeholder
    },
    {
      era: 'Medieval Era',
      name: 'KABIR DAS',
      description: 'Mystic poet-saint whose verses bridged Hindu and Islamic traditions.',
      imageUrl: 'https://placehold.co/300x200/F3F4F6/9CA3AF?text=Guru+Image', // Placeholder
    },
    {
      era: 'Modern Era',
      name: 'SWAMI VIVEKANANDA',
      description: 'Key figure in introducing Vedanta and Yoga to the Western world.',
      imageUrl: 'https://placehold.co/300x200/F3F4F6/9CA3AF?text=Guru+Image', // Placeholder
    },
  ];

  return (
    <section className="py-20 px-8 bg-yellow-50 text-center">
      <h2 className="text-4xl font-bold text-gray-800 mb-4">FEATURED SPIRITUAL MASTERS</h2>
      <p className="text-gray-600 text-lg mb-12">
        Learn from the greatest spiritual teachers of all time
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {gurus.map((guru, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg flex flex-col items-center text-center overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <img src={guru.imageUrl} alt={guru.name} className="w-full h-48 object-cover mb-4" />
            <div className="p-6">
              <span className="bg-yellow-200 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full mb-3 inline-block">
                {guru.era}
              </span>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{guru.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{guru.description}</p>
              <button className="px-6 py-2 bg-orange-500 text-white font-semibold rounded-md shadow-md hover:bg-orange-600 transition duration-300">
                Learn More
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedGurus;
