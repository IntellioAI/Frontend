import { useEffect, useState } from 'react';
import CodePlayground from '../components/Code_playground/CodePlayground';
import { Cpu,  Diamond } from 'lucide-react';
import { isMobile, isSlowDevice, useReducedMotion } from '../utils/deviceDetection';

export function Playground() {
  // State for controlling animations and device-specific behavior
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  
  // Use the proper React Hook at the component level
  const prefersReducedMotion = useReducedMotion();
  
  useEffect(() => {
    setIsMobileDevice(isMobile());
    setShouldReduceMotion(isSlowDevice() || prefersReducedMotion);
  }, [prefersReducedMotion]);

  return (
       <main className="min-h-screen bg-black flex flex-col" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header Section */}
      <section className="relative overflow-hidden pt-16 lg:pt-8 pb-100 lg:pb-12" style={{ background: 'var(--header-bg)' }}>
        {/* Background image */}
        <div className="absolute inset-0 bg-[url('/images/playground/playground_hero.webp')] opacity-10 bg-cover bg-center"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center md:text-left max-w-3xl">
             <div
              className={`inline-flex items-center px-4 py-2 rounded-full bg-white/10 border border-white/10 text-white backdrop-blur-sm mb-6 -ml-1 ${
                !shouldReduceMotion ? "animate-fade-in" : ""
              }`}
            >
              <Diamond className="w-3.5 h-3.5 mr-2 text-white" />
              <span className="text-sm font-medium">
                Interactive Coding
              </span>
            </div>
            
            <h1 className={`text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight ${!shouldReduceMotion ? 'animate-fade-in animate-delay-100' : ''} drop-shadow-lg`}>
              Code Playground
            </h1>
            
            <p className={`text-lg md:text-xl text-indigo-200/80 max-w-3xl ${!shouldReduceMotion ? 'animate-fade-in animate-delay-200' : ''}`}>
              Write, debug, and optimize programming code with AI assistance. Support for Python, C, and Java with intelligent analysis and real-time feedback.
            </p>
          </div>
        </div>
      </section>
      {/* Playground Section */}
      <section id="playground" className="flex-1 py-4 md:py-6 lg:py-8 bg-black">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-full">
          {/* Code Playground with enhanced styling */}
          <div className="relative rounded-xl overflow-hidden shadow-2xl shadow-indigo-900/20 border border-indigo-500/10 h-full">
            <CodePlayground isMobileDevice={isMobileDevice}/>
          </div>

          {/* Features info for mobile */}
          {isMobileDevice && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 text-center">
                <Cpu className="w-5 h-5 text-indigo-400 mx-auto mb-1" />
                <div className="text-xs text-gray-300">AI Analysis</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 text-center">
                <svg className="w-5 h-5 text-green-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-xs text-gray-300">Auto Debug</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 text-center">
                <svg className="w-5 h-5 text-yellow-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>  
                <div className="text-xs text-gray-300">Optimize</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 text-center">
                <svg className="w-5 h-5 text-purple-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <div className="text-xs text-gray-300">3 Languages</div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}