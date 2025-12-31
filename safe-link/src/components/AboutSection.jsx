import React from 'react';

const AboutSection = () => {
  return (
    <section id="about" className="relative bg-gray-950 py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto z-10">
        
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-blue-500 font-mono text-sm tracking-wider uppercase mb-3">System Architecture</h2>
          <h3 className="text-4xl md:text-5xl font-extrabold text-white">
            Inside the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">SafeLink Engine</span>
          </h3>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            We don't just check lists. We run a complex behavioral analysis on every URL in milliseconds. Hover over the modules below to see them in action.
          </p>
        </div>

        {/* Interactive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* CARD 1: Heuristic AI Analysis */}
          <div className="group relative bg-gray-900/50 border border-gray-800 hover:border-blue-500/50 rounded-3xl p-8 transition-all duration-500 hover:shadow-[0_0_50px_rgba(37,99,235,0.15)] hover:-translate-y-2 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Icon */}
            <div className="relative w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
            </div>

            <h4 className="relative text-xl font-bold text-white mb-2">UCI Dataset</h4>
            <p className="relative text-sm text-gray-400 mb-8">
              Our AI breaks down the URL structure, checking for spoofed characters, odd redirects, and behavioral anomalies in real-time.
            </p>

            {/* INTERACTIVE VISUAL: Scanning Code */}
            <div className="relative h-32 bg-black/60 rounded-lg border border-gray-700/50 overflow-hidden font-mono text-[10px] text-gray-500 p-3 group-hover:border-blue-500/30 transition-colors">
              <div className="opacity-50">
                 <div>01 const analyze = (url) ={'>'} {'{'}</div>
                 <div className="pl-2">02 &nbsp;&nbsp;scanPattern(url);</div>
                 <div className="pl-2">03 &nbsp;&nbsp;checkRedirects();</div>
                 <div className="pl-2 text-blue-400">04 &nbsp;&nbsp;detectAnomaly();</div>
                 <div className="pl-2">05 &nbsp;&nbsp;return score;</div>
                 <div>06 {'}'}</div>
              </div>
              {/* The Laser Scanner Line */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-blue-400 shadow-[0_0_10px_#60A5FA] translate-y-[-10px] group-hover:animate-scan-vertical"></div>
            </div>
          </div>


          {/* CARD 2: Global Threat Database */}
          <div className="group relative bg-gray-900/50 border border-gray-800 hover:border-purple-500/50 rounded-3xl p-8 transition-all duration-500 hover:shadow-[0_0_50px_rgba(168,85,247,0.15)] hover:-translate-y-2 overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-b from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Icon */}
            <div className="relative w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors duration-300">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            </div>

            <h4 className="relative text-xl font-bold text-white mb-2">RandomForest Classifier</h4>
            <p className="relative text-sm text-gray-400 mb-8">
              Random Forest is a machine learning algorithm that combines the results of multiple Decision Trees to make a final decision. Each tree analyzes different parts of the data and predicts whether a URL is Safe or Phishing.
            </p>

            {/* INTERACTIVE VISUAL: Blinking Map Nodes */}
            <div className="relative h-32 bg-black/60 rounded-lg border border-gray-700/50 overflow-hidden flex items-center justify-center group-hover:border-purple-500/30 transition-colors">
               {/* Grid Background */}
               <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#374151 1px, transparent 1px)', backgroundSize: '20px 20px', opacity: 0.3 }}></div>
               
               {/* Nodes */}
               <div className="absolute w-2 h-2 bg-purple-500 rounded-full top-1/3 left-1/4 animate-ping-slow"></div>
               <div className="absolute w-2 h-2 bg-blue-500 rounded-full bottom-1/3 right-1/4 animate-ping-slow delay-700"></div>
               <div className="absolute w-1.5 h-1.5 bg-white rounded-full top-1/2 left-1/2 shadow-[0_0_15px_white] scale-0 group-hover:scale-100 transition-transform duration-500"></div>
               
               {/* Connecting Lines (SVG) */}
               <svg className="absolute inset-0 w-full h-full pointer-events-none">
                 <line x1="25%" y1="33%" x2="50%" y2="50%" stroke="rgba(168, 85, 247, 0.5)" strokeWidth="1" strokeDasharray="4 2" className="opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100" />
                 <line x1="75%" y1="66%" x2="50%" y2="50%" stroke="rgba(168, 85, 247, 0.5)" strokeWidth="1" strokeDasharray="4 2" className="opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-300" />
               </svg>
            </div>
          </div>


          {/* CARD 3: Zero-Day Defense */}
          <div className="group relative bg-gray-900/50 border border-gray-800 hover:border-green-500/50 rounded-3xl p-8 transition-all duration-500 hover:shadow-[0_0_50px_rgba(34,197,94,0.15)] hover:-translate-y-2 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-green-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Icon */}
            <div className="relative w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors duration-300">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>

            <h4 className="relative text-xl font-bold text-white mb-2">Zero-Day Defense</h4>
            <p className="relative text-sm text-gray-400 mb-8">
              We detect attacks that haven't been reported yet. By analyzing site content and code obfuscation, we stop new threats before they execute.
            </p>

            {/* INTERACTIVE VISUAL: Shield Status */}
            <div className="relative h-32 bg-black/60 rounded-lg border border-gray-700/50 overflow-hidden flex flex-col items-center justify-center group-hover:border-green-500/30 transition-colors">
               
               {/* Shield Icon */}
               <div className="relative z-10">
                 <svg className="w-12 h-12 text-gray-600 group-hover:text-green-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
               </div>
               
               {/* Status Text */}
               <div className="mt-2 flex items-center space-x-2">
                 <span className="w-2 h-2 rounded-full bg-gray-500 group-hover:bg-green-500 group-hover:animate-pulse"></span>
                 <span className="text-xs font-mono text-gray-500 group-hover:text-green-400 transition-colors">
                    <span className="hidden group-hover:inline">SECURE</span>
                    <span className="inline group-hover:hidden">IDLE</span>
                 </span>
               </div>

               {/* Scanning Radar Effect behind shield */}
               <div className="absolute inset-0 bg-green-500/10 scale-0 rounded-full group-hover:scale-150 transition-transform duration-1000 opacity-0 group-hover:opacity-100"></div>
            </div>
          </div>

        </div>
      </div>

      {/* Keyframes for Custom Animations */}
      <style>{`
        @keyframes scan-vertical {
          0% { transform: translateY(-10px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(120px); opacity: 0; }
        }
        .animate-scan-vertical {
          animation: scan-vertical 2s linear infinite;
        }
        
        @keyframes ping-slow {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </section>
  );
};

export default AboutSection;