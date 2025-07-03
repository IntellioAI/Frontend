import { useEffect, useState } from 'react';
import CodePlayground from '../components/Code_playground/CodePlayground';
import { Code, Cpu, Smartphone, Laptop } from 'lucide-react';
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
      <section className="relative overflow-hidden pt-16 lg:pt-8 pb-8 lg:pb-12" style={{ background: 'var(--header-bg)' }}>
        {/* Background image */}
        <div className="absolute inset-0 bg-[url('/images/playground/code_playground_hero.webp')] opacity-10 bg-cover bg-center"></div>
        
        {/* Animated background elements for desktop */}
        {!isMobileDevice && !shouldReduceMotion && (
          <>
            <div className="absolute top-0 -left-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob animate-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob animate-delay-4000"></div>
          </>
        )}
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center md:text-left max-w-4xl">
            <div className={`inline-flex items-center px-4 py-2 rounded-full bg-indigo-500/30 border border-indigo-400/50 text-indigo-100 backdrop-blur-sm mb-6 ${!shouldReduceMotion ? 'animate-fade-in' : ''}`}>
              <span className={`flex h-2 w-2 rounded-full bg-indigo-300 ${!shouldReduceMotion ? 'animate-pulse' : ''} mr-2`}></span>
              <Code className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">AI-Powered Programming</span>
              {isMobileDevice && (
                <span className="ml-2 flex items-center text-xs bg-indigo-500/20 px-1.5 py-0.5 rounded-full">
                  <Smartphone className="w-3 h-3 mr-1" />
                  Mobile Ready
                </span>
              )}
            </div>
            
            <h1 className={`text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight ${!shouldReduceMotion ? 'animate-fade-in animate-delay-100' : ''} drop-shadow-lg`}>
              AI Code Playground
            </h1>
            
            <p className={`text-lg md:text-xl text-indigo-200/80 max-w-3xl mb-6 ${!shouldReduceMotion ? 'animate-fade-in animate-delay-200' : ''}`}>
              Write, debug, and optimize programming code with AI assistance. Support for Python, C, and Java with intelligent analysis and real-time feedback.
            </p>

            {/* Feature highlights */}
            <div className={`flex flex-wrap gap-4 mb-6 ${!shouldReduceMotion ? 'animate-fade-in animate-delay-300' : ''}`}>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Cpu className="w-4 h-4 text-indigo-300" />
                <span className="text-sm text-indigo-100">AI Code Analysis</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <svg className="w-4 h-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-green-100">Auto Debug</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <svg className="w-4 h-4 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-sm text-yellow-100">Code Optimization</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <span className="text-sm text-purple-100">3 Languages</span>
              </div>
            </div>

            {/* Device-specific info */}
            <div className={`text-sm text-indigo-200/60 ${!shouldReduceMotion ? 'animate-fade-in animate-delay-400' : ''}`}>
              {isMobileDevice ? (
                <span className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-indigo-400" />
                  <span>Optimized for mobile with touch-friendly controls and simplified interface</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-indigo-400" />
                  <span>Full-featured editor with advanced AI tools, debugging, and optimization</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Playground Section */}
      <section id="playground" className="flex-1 py-4 md:py-6 lg:py-8 bg-black">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-full">
          <div className="mb-4 md:mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200 inline-block">
                  Interactive Programming Environment
                </h2>
                <p className="text-sm md:text-base text-gray-300">
                  {isMobileDevice ? (
                    <span className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-indigo-400" />
                      <span>Mobile-optimized coding with AI assistance</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Laptop className="w-4 h-4 text-indigo-400" />
                      <span>Professional coding environment with AI-powered features</span>
                    </span>
                  )}
                </p>
              </div>

              {/* Language support indicator */}
              <div className="hidden md:flex items-center space-x-4 mt-4 md:mt-0">
                <div className="text-xs text-gray-400">Supported Languages:</div>
                <div className="flex items-center space-x-2">
                  {[
                    { name: 'Python', color: 'bg-blue-500' },
                    { name: 'C', color: 'bg-purple-500' },
                    { name: 'Java', color: 'bg-orange-500' }
                  ].map((lang) => (
                    <div key={lang.name} className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${lang.color}`}></div>
                      <span className="text-xs text-gray-300">{lang.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>  
          
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