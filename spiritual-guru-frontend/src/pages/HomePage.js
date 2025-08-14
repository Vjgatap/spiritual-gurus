import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import ExploreByEra from '../components/ExploreByEra';
import FeaturedGurus from '../components/FeaturedGurus';
import CallToAction from '../components/CallToAction';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ExploreByEra />
      <FeaturedGurus />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default HomePage;
