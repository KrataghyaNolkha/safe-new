import React, { useState } from 'react';
import Spline from '@splinetool/react-spline';
import { Tab } from '@headlessui/react';

// Helper function for styling tabs
function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const Hero = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null); 
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    setResult(null);
    setError(null);
    
    if (!url) {
      setError('Please enter a URL to scan.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || `HTTP error! Status: ${response.status}`);
      }

      setResult(data);

      setUrl('');

    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'Failed to scan URL. Is the Python server running on port 8000?');
    } finally {
      setIsLoading(false);
    }
  };

  return (
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

      {/* RESULT MODALS - Only one is displayed at a time */}
      {/* 1. Loading State */}
      {isLoading && <LoadingModal />}

      {/* 2. Success Result State */}
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

// --- Loading Modal Component (Processing Image) ---
const LoadingModal = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-gray-900/80 p-6 rounded-3xl border border-gray-700/50 flex items-center space-x-4 shadow-xl">
        <span className="w-8 h-8 border-4 border-t-4 border-blue-500 rounded-full animate-spin"></span>
        <p className="text-xl font-semibold text-white">
          Scanning URL for threats...
        </p>
      </div>
    </div>
  );
};


// --- Result Modal Component (Phishing/Legitimate Images) ---
const ResultModal = ({ result, onClose }) => {
  const report = result.report;
  const isPhishing = report.ml_prediction === 'phishing';
  
  const detectionColor = isPhishing ? 'bg-red-500' : 'bg-green-500';
  const progressBarWidth = (report.report_summary.detection_count / report.report_summary.total_vendors) * 100;
  
  // Get confidence score from the report object (NEW)
  const confidencePercent = parseFloat(report.confidence_score) * 100;


  // Render the result cards/widgets
  const renderDetectionModuleCard = (module) => {
    const isMalicious = module.status === 'Malicious';
    return (
      <div key={module.name} className={`p-3 rounded-lg flex justify-between items-center text-sm ${isMalicious ? 'bg-red-900/40' : 'bg-green-900/30'}`}>
        <span className="text-white">{module.name}</span>
        <span className={`font-semibold ${isMalicious ? 'text-red-400' : 'text-green-400'}`}>{module.status}</span>
      </div>
    );
  };

  const renderCategoryBar = (category) => {
    const barWidth = category.relevance || 0;
    return (
      <div key={category.name} className="mb-2">
        <div className="flex justify-between items-center text-xs mb-1 text-gray-400">
          <span>{category.name}</span>
          <span>{barWidth}%</span>
        </div>
        <div className="w-full bg-gray-700/50 rounded-full h-2">
          <div 
            className="h-2 rounded-full bg-purple-500/70" 
            style={{ width: `${barWidth}%` }}
          ></div>
        </div>
      </div>
    );
  };
  
  const renderHeuristicFeature = (feature) => {
    // Treat any non-zero value or 'No' as a potential flag for simplified display
    const isFlagged = feature.value > 0 || feature.value === 'No'; 
    return (
      <div key={feature.name} className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isFlagged ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
        }`}>
          {isFlagged ? '!' : '✓'}
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">{feature.name}: {feature.value}</h4>
          <p className="text-xs text-gray-400">{feature.check}</p>
        </div>
      </div>
    );
  };


  return (
    // Backdrop
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Modal Card */}
      <div 
        className={`relative w-full max-w-4xl m-4 bg-gray-900/80 backdrop-blur-xl border ${
          isPhishing ? 'border-red-500/50' : 'border-green-500/50'
        } rounded-3xl shadow-2xl p-8 transition-all duration-300 transform scale-100 opacity-100`}
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

        {/* --- 1. Header and Summary --- */}
        <div className="text-center pb-6 border-b border-gray-700/50">
          <div className="flex justify-center items-center space-x-4 mb-1">
             <p className="text-gray-400 text-sm">{report.report_summary.analysis_category.toUpperCase()} - {report.technical_details.analysis_time}</p>
             {/* ADDED CONFIDENCE SCORE DISPLAY */}
             <div className={`px-3 py-0.5 rounded-full text-xs font-bold ${
                isPhishing ? 'bg-red-900 text-red-300' : 'bg-green-900 text-green-300'
             }`}>
                CONFIDENCE: {confidencePercent.toFixed(2)}%
             </div>
          </div>
          
          <h2 className={`text-3xl font-bold ${
            isPhishing ? 'text-red-400' : 'text-green-400'
          }`}>
            {isPhishing ? '🚨 PHISHING DETECTED' : '✅ SITE IS LEGITIMATE'}
          </h2>
          
          <p className="text-gray-200 mt-2 text-sm bg-gray-800/50 border border-gray-700 rounded-lg p-3 break-all">
            {result.url}
          </p>
        </div>

        {/* --- 2. Detection Details and Progress Bar --- */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-semibold text-white">Detection Rate</span>
            <span className={`text-xl font-bold ${isPhishing ? 'text-red-400' : 'text-green-400'}`}>
              {report.report_summary.detection_count} / {report.report_summary.total_vendors}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-800 rounded-full h-3.5 mb-4">
            <div 
              className={`h-3.5 rounded-full transition-all duration-700 ${detectionColor}`} 
              style={{ width: `${progressBarWidth}%` }}
            ></div>
          </div>

          <p className="text-gray-400 text-sm">{report.report_summary.detection_details}</p>
        </div>
        
        {/* --- 3. Tabbed Information (Detection, Technical, Features) --- */}
        <div className="mt-8">
            <Tab.Group>
                <Tab.List className="flex p-1 space-x-1 bg-gray-800/70 rounded-xl">
                    <Tab
                        className={({ selected }) =>
                            classNames(
                                'w-full py-2.5 text-sm leading-5 font-medium rounded-lg',
                                'focus:outline-none ring-offset-2 ring-white ring-opacity-60',
                                selected
                                    ? 'bg-gray-900 text-white shadow'
                                    : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                            )
                        }
                    >
                        Scanner Modules
                    </Tab>
                    <Tab
                        className={({ selected }) =>
                            classNames(
                                'w-full py-2.5 text-sm leading-5 font-medium rounded-lg',
                                'focus:outline-none ring-offset-2 ring-white ring-opacity-60',
                                selected
                                    ? 'bg-gray-900 text-white shadow'
                                    : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                            )
                        }
                    >
                        Technical Report
                    </Tab>
                    <Tab
                        className={({ selected }) =>
                            classNames(
                                'w-full py-2.5 text-sm leading-5 font-medium rounded-lg',
                                'focus:outline-none ring-offset-2 ring-white ring-opacity-60',
                                selected
                                    ? 'bg-gray-900 text-white shadow'
                                    : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                            )
                        }
                    >
                        ML Feature Breakdown
                    </Tab>
                </Tab.List>

                <Tab.Panels className="mt-4">
                    {/* Panel 1: Scanner Modules & Categories (Matches Image 1) */}
                    <Tab.Panel className="p-4 bg-gray-900/50 rounded-xl grid grid-cols-2 gap-6">
                        {/* Column 1: Module Comparison */}
                        <div className="space-y-2">
                           <h4 className="text-sm font-semibold text-gray-300 mb-2 border-b border-gray-700 pb-1">Vendor Comparison (Simulated)</h4>
                           <div className="space-y-2">
                               {report.comparison_modules.map(renderDetectionModuleCard)}
                           </div>
                        </div>
                        
                        {/* Column 2: Website Categories */}
                        <div className="space-y-2">
                           <h4 className="text-sm font-semibold text-gray-300 mb-4 border-b border-gray-700 pb-1">Website Categories (Relevance)</h4>
                           <div className="space-y-4">
                               {report.categories.map(renderCategoryBar)}
                           </div>
                        </div>
                    </Tab.Panel>

                    {/* Panel 2: Technical Information (Matches Image 2) */}
                    <Tab.Panel className="p-4 bg-gray-900/50 rounded-xl">
                        <dl className="grid grid-cols-2 gap-4 text-sm">
                            <div className="col-span-1">
                                <dt className="text-gray-500 font-medium">Domain Name:</dt>
                                <dd className="text-white">{report.technical_details.domain}</dd>
                            </div>
                            <div className="col-span-1">
                                <dt className="text-gray-500 font-medium">IP Address:</dt>
                                <dd className="text-white">{report.technical_details.ip_address}</dd>
                            </div>
                            <div className="col-span-1">
                                <dt className="text-gray-500 font-medium">Registrar:</dt>
                                <dd className="text-white">{report.technical_details.registrar}</dd>
                            </div>
                            <div className="col-span-1">
                                <dt className="text-gray-500 font-medium">Creation Date:</dt>
                                <dd className="text-white">{report.technical_details.creation_date}</dd>
                            </div>
                            <div className="col-span-2">
                                <dt className="text-gray-500 font-medium">SSL Status (HTTPS):</dt>
                                <dd className={`font-bold ${report.technical_details.ssl_status === 'Valid' ? 'text-green-400' : 'text-red-400'}`}>
                                    {report.technical_details.ssl_status}
                                </dd>
                            </div>
                            <div className="col-span-2 mt-2">
                                <dt className="text-gray-500 font-medium">ML Model Verdict:</dt>
                                <dd className={`font-bold uppercase ${isPhishing ? 'text-red-400' : 'text-green-400'}`}>
                                    {report.report_summary.final_verdict}
                                </dd>
                            </div>
                        </dl>
                    </Tab.Panel>
                    
                    {/* Panel 3: ML Feature Breakdown (New) */}
                    <Tab.Panel className="p-4 bg-gray-900/50 rounded-xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {report.heuristic_features.map(renderHeuristicFeature)}
                        </div>
                        <p className="text-xs text-gray-500 mt-4">
                            These are the raw features extracted from the URL and fed directly into the Random Forest Classifier for prediction.
                        </p>
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
        </div>

        {/* --- 4. Close Button --- */}
        <button
            onClick={onClose}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm px-5 py-3 transition-colors"
        >
            Scan Another URL
        </button>

      </div>
    </div>
  );
};

export default Hero;