import React from 'react';
import IntegrationCenter from './IntegrationCenter';

const Hero: React.FC = () => {
  return (
    <section className="relative pt-20 pb-12 px-4 text-center overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
         <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-blue-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob"></div>
         <div className="absolute top-[10%] right-[20%] w-[400px] h-[400px] bg-indigo-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center px-3 py-1 rounded-full border border-blue-200 bg-blue-50 text-virality-blue text-xs font-medium mb-4">
            <span className="flex h-2 w-2 rounded-full bg-virality-blue mr-2"></span>
            v2.0 Now Available with Gemini 2.5
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 leading-tight">
          Go Viral, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-virality-blue to-indigo-600">
            Autonomously
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          The first AI social media manager that doesn't just schedule posts—it engineers them for maximum engagement using predictive analytics.
        </p>

        <IntegrationCenter />
      </div>
    </section>
  );
};

export default Hero;