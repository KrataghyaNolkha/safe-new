import React, { useState } from 'react';

// --- Reusable FAQ Item Component ---
// Now stateless: It receives 'isOpen' and 'onClick' from the parent
const FaqItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden transition-all duration-300 hover:border-gray-700">
      {/* Question Button */}
      <button
        onClick={onClick}
        className="flex justify-between items-center w-full p-6 text-left group"
      >
        <span className={`text-lg font-semibold transition-colors duration-300 ${
          isOpen ? 'text-blue-400' : 'text-white group-hover:text-gray-200'
        }`}>
          {question}
        </span>
        
        {/* Plus/Minus Icon */}
        <div className={`flex-shrink-0 ml-4 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 border ${
          isOpen ? 'bg-blue-600 border-blue-600 rotate-180' : 'bg-transparent border-gray-600 group-hover:border-gray-400'
        }`}>
          <svg className={`w-4 h-4 text-white transition-transform duration-300 ${isOpen ? 'rotate-90' : 'rotate-0'}`} 
               fill="none" 
               stroke="currentColor" 
               viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
        </div>
      </button>

      {/* Answer Panel */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-6 pt-0">
          <p className="text-gray-400 leading-relaxed border-l-2 border-blue-500/50 pl-4">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
};


// --- Main FAQ Section Component ---
const FaqSection = () => {
  // State to track which FAQ is currently open (null means all closed)
  const [activeIndex, setActiveIndex] = useState(null);

  // Function to handle click
  const handleToggle = (index) => {
    // If clicked index is already open, close it (set to null). Otherwise, open it.
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What is SafeLink and how does it work?",
      answer: "SafeLink is a real-time threat detection service. When you paste a link, our AI engine and global threat database analyze it for phishing patterns, malware, and fraudulent behavior before you visit the site."
    },
    {
      question: "How is this different from browser protection?",
      answer: "Browser protection is good, but it's often based on blacklists that can be days old. SafeLink uses real-time heuristic analysis (AI) to detect 'zero-day' threats that blacklists don't know about yet."
    },
    {
      question: "What happens when a phishing link is detected?",
      answer: "If a link is deemed malicious, we will immediately block access and present a clear warning page. You will be advised not to proceed, protecting your personal information."
    },
    {
      question: "Do I need to install any software?",
      answer: "No. SafeLink is a web-based service. There is nothing to install or update. You can access our scanning tool from any device with a web browser."
    },
    {
      question: "Is my submitted data safe?",
      answer: "Yes. We value your privacy. Submitted URLs are analyzed in an isolated, secure environment. We do not track your browsing history or store any personal data."
    }
  ];

  return (
    <section id="faq" className="relative bg-gray-950 py-24 sm:py-32">
      
      {/* Background Effects */}
      <div className="absolute left-0 top-1/4 w-1/3 h-1/2 bg-blue-900/10 blur-[100px] pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* GRID LAYOUT: Left Heading, Right Questions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* LEFT COLUMN: Headings (Takes 4/12 columns) */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-widest mb-3">
              Support
            </h2>
            <p className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6">
              Frequently Asked Questions
            </p>
            <p className="text-lg text-gray-400 leading-relaxed">
              Everything you need to know about our real-time threat detection and how we keep you safe from malicious links.
            </p>
            
            {/* Optional CTA */}
            
          </div>

          {/* RIGHT COLUMN: FAQ Items (Takes 8/12 columns) */}
          <div className="lg:col-span-7 space-y-4">
            {faqs.map((faq, index) => (
              <FaqItem 
                key={index} 
                question={faq.question} 
                answer={faq.answer} 
                isOpen={activeIndex === index} // Pass true if this index matches state
                onClick={() => handleToggle(index)} // Pass the toggle function
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

export default FaqSection;