import React, { useState } from 'react';
// NOTE: Switch back to the /next import if using Next.js App Router
import Spline from '@splinetool/react-spline';

const Hero = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null); // Will store { prediction: '...', url: '...' }
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form from reloading the page
    if (!url) {
      setError('Please enter a URL to scan.');
      return;
    }

    setIsLoading(true);
    setResult(null);
    setError(null);

    // This is the API call to your Python server
    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url }), // Send the URL in the body
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data); // e.g., { prediction: 'phishing', url: '...' }
      setUrl(''); // Clear input on success

    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to scan URL. Is the Python server running on port 5000?');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // FIX: Removed 'overflow-hidden' from previous step
    <section id="home" className="relative h-screen bg-gray-950 text-white scroll-mt-24">
      
      {/* SPLINE BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <Spline scene="https://prod.spline.design/CQs3Gq9THK8VL0kG/scene.splinecode" />
        <div className="absolute inset-0 bg-gray-950/60 pointer-events-none"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center pointer-events-none">
        
        {/* Logo Element */}
        <div className="flex items-center space-x-2 mb-4 animate-slide-down pointer-events-auto">
          <div className="flex items-center justify-center w-8 h-8 bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-700">
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
          </div>
          <span className="font-semibold text-sm px-3 py-1 rounded-full bg-gray-800/50 backdrop-blur-md border border-gray-700 text-gray-300">
            AI Security Protocol
          </span>
        </div>

        <h1 className="text-4xl md:text-7xl font-extrabold leading-tight mb-8 animate-fade-in-up delay-200 drop-shadow-2xl">
          Stop Phishing Attacks <br className="hidden md:block" /> 
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Before They Click
          </span>
        </h1>

        {/* Link Input Section */}
        <div className="w-full max-w-2xl animate-fade-in-up delay-400 pointer-events-auto">
          <form className="relative flex items-center" onSubmit={handleSubmit}>
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                </svg>
              </div>
              <input 
                type="url" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="block w-full p-4 pl-12 text-sm md:text-base text-white bg-gray-800/60 backdrop-blur-md border border-gray-600 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 shadow-lg transition-all duration-300 hover:bg-gray-800/80" 
                placeholder="Paste suspicious URL here (e.g. https://example.com)" 
                required 
                disabled={isLoading}
              />
              <button 
                type="submit" 
                className="absolute right-2 bottom-2 top-2 px-6 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-full text-sm transition-all duration-300 shadow-md hover:shadow-blue-500/50 disabled:bg-gray-500 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? 'Scanning...' : 'Scan Now'}
              </button>
            </div>
          </form>
          <p className="mt-3 text-gray-400 text-xs md:text-sm font-light">
            Powered by Real-time Heuristic Analysis & Threat Intelligence.
          </p>

          {/* Error Message Display */}
          {error && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 text-red-300 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Result Modal */}
      {result && (
        <ResultModal 
          result={result} 
          onClose={() => setResult(null)} 
        />
      )}

      {/* ANIMATIONS */}
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
        .animate-slide-down { animation: slide-down 0.8s ease-out forwards; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-400 { animation-delay: 0.4s; }
      `}</style>
    </section>
  );
};

// --- Result Modal Component ---
// (You can move this to its own file if you prefer)
const ResultModal = ({ result, onClose }) => {
  const isPhishing = result.prediction === 'phishing';

  return (
    // Backdrop
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Modal Card */}
      <div 
        className={`relative w-full max-w-lg m-4 bg-gray-900/80 backdrop-blur-xl border ${
          isPhishing ? 'border-red-500/50' : 'border-green-500/50'
        } rounded-3xl shadow-2xl p-8`}
        onClick={(e) => e.stopPropagation()} // Prevent modal close on card click
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        {/* Icon */}
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 border-4 ${
          isPhishing 
            ? 'bg-red-500/20 border-red-500/50 text-red-400' 
            : 'bg-green-500/20 border-green-500/50 text-green-400'
        }`}>
          {isPhishing ? (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          ) : (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
          )}
        </div>
        
        {/* Content */}
        <div className="text-center">
          <h2 className={`text-2xl font-bold ${
            isPhishing ? 'text-red-400' : 'text-green-400'
          }`}>
            {isPhishing ? 'Phishing Detected' : 'Site is Legitimate'}
          </h2>
          <p className="text-gray-400 mt-2 mb-4">
            The URL has been scanned and the result is:
          </p>
          <p className="text-sm text-gray-200 bg-gray-800/50 border border-gray-700 rounded-md p-3 break-all">
            {result.url}
          </p>
          <button
            onClick={onClose}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm px-5 py-3 transition-colors"
          >
            Scan Another
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
