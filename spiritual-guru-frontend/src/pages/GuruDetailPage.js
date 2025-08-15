import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const GuruDetailPage = () => {
  const { id } = useParams();
  const [guru, setGuru] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const GURU_API_URL = 'http://localhost:5000/api/gurus';

  useEffect(() => {
    const fetchGuruDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${GURU_API_URL}/${id}`);
        setGuru(res.data);
      } catch (err) {
        console.error('Failed to fetch guru details:', err);
        setError('Failed to load spiritual master details. Please try again.');
        setGuru(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchGuruDetails();
    }
  }, [id]);

  const getYouTubeEmbedUrl = (url) => {
    try {
      const videoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|)([\w-]{11})(?:\S+)?/);
      return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : '';
    } catch (e) {
      console.error("Invalid YouTube URL:", url);
      return '';
    }
  };

  const calculateAge = (dob, dod) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const deathDate = dod ? new Date(dod) : new Date();

    let age = deathDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = deathDate.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && deathDate.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = guru ? calculateAge(guru.dob, guru.dod) : null;

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 to-orange-100 pt-20"><p className="text-xl text-gray-700 font-inter">Loading spiritual master details...</p></div>;
  if (error) return <div className="min-h-screen flex items-center justify-center bg-red-800 text-white pt-20"><p className="text-xl font-inter">{error}</p></div>;
  if (!guru) return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 to-orange-100 pt-20"><p className="text-xl text-gray-700 font-inter">Spiritual master not found.</p></div>;

  return (
    // Apply the consistent background gradient and font-inter globally to the page
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-orange-100 flex flex-col font-inter">
      <Navbar />

      {/* Hero Banner Section (full-width background image) */}
      {/* pt-20 for Navbar clearance */}
      <section className="relative w-full overflow-hidden pt-20"> 
        {guru.bgImageUrl ? (
          <img
            src={guru.bgImageUrl}
            alt={`${guru.fullName} background`}
            className="w-full h-64 object-cover object-center" // h-64 for the banner height
            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/1200x256/F3F4F6/9CA3AF?text=Background_Image_Missing"; }} // Fallback
          />
        ) : (
          // Fallback to gradient background if no specific image URL is provided, matching homepage hero
          <div className="w-full h-64 bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center">
            <p className="text-gray-600 text-lg">No Background Image</p>
          </div>
        )}
      </section>

      {/* Main Content Area (White Card) */}
      {/* -mt-20 pulls the card up by 80px (half the profile pic's height) to meet the profile image overlap exactly */}
      <div className="container mx-auto p-8 bg-white shadow-xl rounded-xl -mt-20 mb-8 relative z-0"> 
        {/* Profile Image (Circular) - Now positioned within this main card, pulled up by negative margin */}
        <div className="mx-auto w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg z-10 -mt-16 bg-gray-200">
          <img
            src={guru.profileImageUrl}
            alt={guru.fullName}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/128x128/F3F4F6/9CA3AF?text=Profile"; }}
          />
        </div>

        {/* Guru Basic Info - NEW HERO-LIKE STYLING */}
        <div className="text-center pt-4 pb-8 border-b border-gray-200 mb-10"> {/* Adjusted padding and added border-b */}
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-3 leading-tight"> {/* Larger font, tighter leading */}
            {guru.fullName}
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 font-semibold mb-4"> {/* Larger and more prominent */}
            {guru.guruType} | {guru.era?.name || 'Era Not Defined'}
          </p>
          <div className="text-gray-600 text-base space-y-1"> {/* Consistent text size, better line spacing */}
            <p>Born: {new Date(guru.dob).toLocaleDateString()} in {guru.birthPlace}</p>
            {guru.dod && <p>Died: {new Date(guru.dod).toLocaleDateString()}</p>}
            {age !== null && <p>Age: {age} years</p>}
            {guru.aashram && <p>Aashram: {guru.aashram}</p>}
          </div>
        </div>

        {/* Bio Section */}
        <div className="mb-10 p-6 bg-gray-50 rounded-lg shadow-inner">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Biography</h2>
          <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line">{guru.bio}</p>
        </div>

        {/* Videos Section */}
        {guru.videos && guru.videos.length > 0 && (
          <div className="mb-10 p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guru.videos.map((video, index) => {
                const embedUrl = getYouTubeEmbedUrl(video.url);
                return embedUrl && (
                  <div key={index} className="bg-gray-100 rounded-lg shadow-md overflow-hidden transform hover:scale-[1.02] transition-all duration-300">
                    <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}>
                      <iframe
                        src={embedUrl}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={video.title || `Video ${index + 1}`}
                        className="absolute top-0 left-0 w-full h-full"
                      ></iframe>
                    </div>
                    {video.title && (
                      <p className="p-3 text-center text-gray-700 font-medium text-sm">{video.title}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Image Gallery Section */}
        {guru.images && guru.images.length > 0 && (
          <div className="mb-10 p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Image Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {guru.images.map((img, index) => (
                <div key={index} className="relative w-full h-40 bg-gray-200 rounded-lg overflow-hidden shadow-md transform hover:scale-[1.05] transition-all duration-300">
                  <img
                    src={img.url}
                    alt={img.caption || `Image ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x300/E5E7EB/6B7280?text=Image_Placeholder"; }}
                  />
                  {img.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2 truncate">
                      {img.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Books Section */}
        {guru.books && guru.books.length > 0 && (
          <div className="mb-10 p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Books</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guru.books.map((book, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-md p-5 flex flex-col justify-between items-center text-center transform hover:scale-[1.02] transition-all duration-300">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">{book.title}</h3>
                  {book.pdfUrl && (
                    <a
                      href={book.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-orange-500 text-white font-semibold rounded-md shadow-sm hover:bg-orange-600 transition duration-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6a2 2 0 01.586 1.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 10a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                      Read PDF
                    </a>
                  )}
                  {!book.pdfUrl && (
                    <p className="text-gray-500 text-sm">PDF not available</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default GuruDetailPage;
