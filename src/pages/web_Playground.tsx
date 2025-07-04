import { useEffect, useState } from "react";
import CodePlayground from "../components/web_playground/CodePlayground";
import { Diamond } from "lucide-react";
import {
  isMobile,
  isSlowDevice,
  useReducedMotion,
} from "../utils/deviceDetection";

export function Web_Playground() {
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
    <main
      className="min-h-screen bg-black flex flex-col"
      style={{ backgroundColor: "var(--background)" }}
    >
      {/* Header Section */}
      <section
        className="relative overflow-hidden pt-16 lg:pt-8 pb-100 lg:pb-8"
        style={{ background: "var(--header-bg)" }}
      >
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
                Premium SaaS Collection
              </span>
            </div>

            <h1
              className={`text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight ${
                !shouldReduceMotion ? "animate-fade-in animate-delay-100" : ""
              } drop-shadow-lg`}
            >
              Web Playground
            </h1>

            <p
              className={`text-lg md:text-xl text-indigo-200/80 max-w-3xl ${
                !shouldReduceMotion ? "animate-fade-in animate-delay-200" : ""
              }`} 
            >
              Write, edit, and run HTML, CSS, and JavaScript code in real-time.<br/>
              Perfect for experimenting with web technologies and testing your
              ideas.
            </p>
          </div>
        </div>
      </section>

      {/* Playground Section */}
      <section id="playground" className="flex-1 py-4 md:py-6 lg:py-8 bg-black">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-full">
         

          {/* Code Playground with enhanced styling */}
          <div className="relative rounded-xl overflow-hidden shadow-2xl shadow-indigo-900/20 border border-indigo-500/10 h-full">
            <CodePlayground isMobileDevice={isMobileDevice} />
          </div>
        </div>
      </section>
    </main>
  );
}
