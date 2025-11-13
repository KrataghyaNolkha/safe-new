import React from 'react';
import Hero from './components/Hero'; // Adjust path as needed
import Navbar from './components/Navbar';
import AboutSection from './components/AboutSection';
import ServicesSection from './components/ServicesSection';
import FaqSection from './components/FaqSection';
import Footer from './components/Footer';

function App() {
  return (
    // Add 'scroll-smooth' to the <html> tag in your index.html for the best effect,
    // but this will work on its own.
    <div className="App bg-gray-950">
      {/* Navbar is fixed, so it stays outside the scrolling sections */}
      <Navbar />

      {/* Each section now has an 'id' that matches the Navbar links */}
      {/* 'scroll-mt-24' adds a top margin to offset the fixed navbar */}
      
      <section id="home" className="scroll-mt-24">
        <Hero />
      </section>

      <section id="about" className="scroll-mt-24">
        <AboutSection />
      </section>

      <section id="services" className="scroll-mt-24">
        <ServicesSection />
      </section>

      <section id="faqs" className="scroll-mt-24">
        <FaqSection />
      </section>

      <section id="footer">
        <Footer />
      </section>
    </div>
  );
}

export default App;