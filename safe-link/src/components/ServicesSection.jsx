import React, { useState } from 'react';

const ServicesSection = () => {
  const [activeService, setActiveService] = useState(0);

  const services = [
    {
      id: 0,
      title: "Real-Time Scanning",
      description: "Our engine intercepts clicks in milliseconds, analyzing heuristic patterns and SSL validity.",
      color: "text-blue-400"
    },
    {
      id: 1,
      title: "API Integration",
      description: "Connect our threat database directly to your firewall via our low-latency REST API.",
      color: "text-purple-400"
    },
    {
      id: 2,
      title: "Phishing Simulation",
      description: "Train your employees with safe, simulated phishing emails to identify weak points.",
      color: "text-green-400"
    },
    {
      id: 3,
      title: "Brand Protection",
      description: "Monitor the web for look-alike domains trying to impersonate your brand.",
      color: "text-red-400"
    }
  ];

  // Generated "Photo Cards" matching your reference image
  const cardColumn1 = [
    { title: "Global Network", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80" },
    { title: "Fraud Prevention", img: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=400&q=80" },
    { title: "Instant Verification", img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&q=80" },
    { title: "Cloud Security", img: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=400&q=80" },
  ];

  const cardColumn2 = [
    { title: "Zero-Day Defense", img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=80" },
    { title: "Identity Shield", img: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=400&q=80" },
    { title: "Data Encryption", img: "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=400&q=80" },
    { title: "Threat Analytics", img: "https://images.unsplash.com/photo-1551808525-51a943718d56?auto=format&fit=crop&w=400&q=80" },
  ];

  return (
    <section id="services" className="relative bg-gray-950 py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* LEFT SIDE: Content Accordion */}
        <div className="space-y-8 z-10">
          <div>
             <h2 className="text-blue-500 font-mono text-sm tracking-wider uppercase mb-3">Our Services</h2>
             <h3 className="text-4xl font-extrabold text-white mb-6">
               Defensive Capabilities
             </h3>
          </div>

          <div className="space-y-4">
            {services.map((service, index) => (
              <div 
                key={service.id}
                onClick={() => setActiveService(index)}
                className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                  activeService === index 
                    ? 'bg-gray-800/80 border-gray-600 shadow-lg' 
                    : 'bg-transparent border-transparent hover:bg-gray-900/30'
                }`}
              >
                <h4 className={`text-xl font-bold mb-2 ${activeService === index ? 'text-white' : 'text-gray-500'}`}>
                  <span className="mr-4 opacity-50 font-mono text-sm">0{index + 1}.</span>
                  {service.title}
                </h4>
                
                <div className={`overflow-hidden transition-all duration-500 ${
                  activeService === index ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'
                }`}>
                  <p className="text-gray-400 leading-relaxed pl-10 border-l-2 border-gray-700">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE: Dual Column Marquee */}
        <div className="relative h-[700px] overflow-hidden flex gap-6 mask-linear-gradient">
           {/* Overlay Gradients for smooth fade in/out */}
           <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-gray-950 to-transparent z-20 pointer-events-none"></div>
           <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-950 to-transparent z-20 pointer-events-none"></div>

           {/* Column 1 - Moving UP */}
           <div className="w-1/2 space-y-6 animate-marquee-up">
              {[...cardColumn1, ...cardColumn1, ...cardColumn1].map((card, i) => (
                <ServiceCard key={i} img={card.img} title={card.title} />
              ))}
           </div>

           {/* Column 2 - Moving DOWN (or slower UP for parallax) */}
           <div className="w-1/2 space-y-6 animate-marquee-up-slow mt-12">
              {[...cardColumn2, ...cardColumn2, ...cardColumn2].map((card, i) => (
                <ServiceCard key={i} img={card.img} title={card.title} />
              ))}
           </div>
        </div>

      </div>

      <style>{`
        @keyframes marquee-up {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        .animate-marquee-up {
          animation: marquee-up 40s linear infinite;
        }
        .animate-marquee-up-slow {
          animation: marquee-up 50s linear infinite;
        }
      `}</style>
    </section>
  );
};

// UPDATED: Reusable Card Component with Dark Theme
const ServiceCard = ({ img, title }) => (
  <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-xl transform transition-transform hover:scale-105 duration-300 group">
    {/* Image Section */}
    <div className="h-48 overflow-hidden relative">
      <img 
        src={img} 
        alt={title} 
        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transform group-hover:scale-110 transition-all duration-700" 
      />
      {/* Dark Overlay on Image */}
      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
    </div>
    
    {/* Text Section - Now Dark with White Text */}
    <div className="p-6 bg-gray-900 relative">
      {/* Removed the blue tick icon here */}
      <h3 className="text-lg font-bold text-white text-center tracking-wide">{title}</h3>
    </div>
  </div>
);

export default ServicesSection;