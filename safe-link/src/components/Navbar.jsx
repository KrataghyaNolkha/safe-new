import React, { useState, useEffect } from 'react';

const Navbar = () => {
  const [activeItem, setActiveItem] = useState('home');

  // Data for navigation links
  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'FAQs', href: '#faqs' },
  ];

  // Function to handle smooth scrolling
  const handleScroll = (e, href) => {
    // 1. Prevent the default "jump" scroll
    e.preventDefault();
    
    // 2. Find the target element by its ID
    const targetElement = document.querySelector(href);
    if (targetElement) {
      // 3. Smoothly scroll to the element
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start' // Aligns to the top of the section
      });
    }
    
    // 4. Update the active state
    setActiveItem(href.substring(1)); // Remove the '#'
  };

  // BONUS: Update active state as user scrolls manually
  useEffect(() => {
    const sections = navItems.map(item => document.querySelector(item.href));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveItem(entry.target.id);
        }
      });
    }, {
      rootMargin: '-50% 0px -50% 0px', // Triggers when section is in middle of viewport
      threshold: 0
    });

    sections.forEach(section => {
      if (section) observer.observe(section);
    });

    return () => {
      sections.forEach(section => {
        if (section) observer.disconnect(section);
      });
    };
  }, []); // Empty dependency array ensures this runs only once

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-4">
      <div className="bg-gray-900/90 backdrop-blur-xl border border-gray-700/50 rounded-full shadow-2xl flex items-center justify-between p-2 pl-6 pr-2">
        
        {/* 1. Logo Section - Can also be a link to scroll to top */}
        <a 
          href="#home" 
          onClick={(e) => handleScroll(e, '#home')} 
          className="flex items-center justify-start mr-auto cursor-pointer"
        >
          <span className="text-white text-2xl font-extrabold tracking-widest uppercase font-sans">
            SafeLink
          </span>
        </a>

        {/* 2. Navigation Links - Changed to <a> tags */}
        <div className="hidden md:flex items-center gap-1 bg-gray-800/50 rounded-full p-1 border border-gray-700/50">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => handleScroll(e, item.href)}
              className={`
                relative px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ease-out cursor-pointer
                ${activeItem === item.href.substring(1)
                  ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.5)] ring-1 ring-white/20' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }
              `}
            >
              {item.name}
            </a>
          ))}
        </div>
        
      </div>
    </nav>
  );
};

export default Navbar;