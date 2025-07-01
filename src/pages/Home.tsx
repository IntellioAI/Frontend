import { useEffect, useState, useRef } from 'react';
import { BookOpen, Code, Video, Users, Award, Brain, ArrowRight, Star, Check, Target, Medal, Globe, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { isMobile, isSlowDevice, useReducedMotion } from '../utils/deviceDetection';

const FEATURED_Products = [
  {
    id: '1',
    title: 'Advanced Data Structures & Algorithms',
    description: 'Master complex algorithms and data structures with hands-on practice and real-world applications.',
    instructor: 'Dr. Sarah Johnson',
    thumbnail: '/images/products/code-playground.webp',
    duration: '12 weeks',
    level: 'Advanced',
    students: 1200,
    rating: 4.9,
    price: '$199',
    category: 'Computer Science',
    tags: ['Algorithms', 'Data Structures', 'Problem Solving'],
    features: ['24/7 Support', 'Certificate', 'Live Sessions']
  },
  {
    id: '2',
    title: 'ML & Neural Networks',
    description: 'Deep dive into ML algorithms, neural networks, and practical AI applications.',
    instructor: 'Prof. Michael Chen',
    thumbnail: '/images/products/digital-clone.webp',
    duration: '10 weeks',
    level: 'Intermediate',
    students: 950,
    rating: 4.8,
    price: '$179',
    category: 'AI',
    tags: ['Machine Learning', 'AI', 'Neural Networks'],
    features: ['Projects', 'Mentorship', 'Career Guidance']
  },
  {
    id: '3',
    title: 'Full Stack Development',
    description: 'Build scalable web applications using cutting-edge technologies and best practices.',
    instructor: 'Emily Rodriguez',
    thumbnail: '/images/products/faculty-dashboard.webp',
    duration: '14 weeks',
    level: 'Intermediate',
    students: 1500,
    rating: 4.7,
    price: '$249',
    category: 'Web Development',
    tags: ['React', 'Node.js', 'MongoDB'],
    features: ['Portfolio Projects', 'Code Reviews', 'Job Prep']
  }
];

const STATS = [
  { label: 'Active Students', value: '50K+', icon: Users },
  { label: 'Expert Instructors', value: '200+', icon: Star },
  { label: 'Course Completion', value: '94%', icon: Target },
  { label: 'Student Satisfaction', value: '4.8/5', icon: Medal },
];

export default function Home() {
  // State for controlling animations and device-specific behavior
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const testimonialSliderRef = useRef<HTMLDivElement>(null);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  
  // Use the proper React Hook at the component level
  const prefersReducedMotion = useReducedMotion();
  
  // Handle swipe functionality for testimonials
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.touches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (touchStartX - touchEndX > 50) {
      // Swipe left - go to next testimonial
      setCurrentTestimonialIndex(prev => Math.min(3, prev + 1));
    }
    
    if (touchEndX - touchStartX > 50) {
      // Swipe right - go to previous testimonial
      setCurrentTestimonialIndex(prev => Math.max(0, prev - 1));
    }
    
    // Reset touch positions
    setTouchStartX(0);
    setTouchEndX(0);
  };
  
  useEffect(() => {
    setIsMobileDevice(isMobile());
    setShouldReduceMotion(isSlowDevice() || prefersReducedMotion);
    // Initialize component based on device capabilities
  }, [prefersReducedMotion]);
  
  return (
    <main className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Hero Section */}
      <section id="hero" className="relative overflow-hidden" style={{ background: 'var(--header-bg)' }}>
        <a href="#Products" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-indigo-600 focus:text-white focus:rounded-md">
          Skip to main content
        </a>
        
        {/* Static gradient background on mobile, animated on desktop */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/10 via-violet-950/5 to-transparent pointer-events-none"></div>
        
        {/* Simplified blobs for mobile */}
        {!isMobileDevice && !shouldReduceMotion && (
          <>
            <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animate-delay-200"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animate-delay-400"></div>
          </>
        )}
        
        <div className="absolute inset-0 bg-[url('/images/HERO.avif')] opacity-10 bg-cover bg-center" aria-hidden="true" role="presentation"></div>
        
        {/* Remove pattern on mobile */}
        {!isMobileDevice && (
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <svg width="100%" height="100%" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="1" cy="1" r="1" fill="#fff" opacity="0.1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dots)" />
            </svg>
          </div>
        )}
        
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative py-20 md:py-32 flex flex-col items-center justify-center">
          <div className="text-center max-w-4xl mx-auto">
            <div className={`inline-flex items-center px-4 py-2 rounded-full bg-indigo-500/30 backdrop-blur-sm border border-indigo-400/50 text-indigo-100 mb-8 ${!shouldReduceMotion ? 'animate-fade-in' : ''} sm:mt-10`}>
              <span className={`flex h-2 w-2 rounded-full bg-indigo-300 ${!shouldReduceMotion ? 'animate-pulse' : ''} mr-2`}></span>
              Trusted by 50,000+ BTech students worldwide
            </div>
            <h1 className={`text-5xl md:text-7xl font-extrabold text-white mb-8 tracking-tight ${!shouldReduceMotion ? 'animate-fade-in animate-delay-100' : ''} drop-shadow-lg`}>
              Transform Your
              <span className={`block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500 mt-2 ${!shouldReduceMotion ? 'animate-pulse-slow' : ''} leading-[1.2] py-1`}>
                Engineering Journey
              </span>
            </h1>
            <div className={`flex justify-center mt-8 mb-3 ${!shouldReduceMotion ? 'animate-fade-in animate-delay-200' : ''}`}>
              <span className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 text-white font-semibold shadow-lg backdrop-blur-sm text-base md:text-lg ${!shouldReduceMotion ? 'animate-float' : ''}`}>
                Empowering Future Engineers
              </span>
            </div>
            <p className={`text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-12 leading-relaxed ${!shouldReduceMotion ? 'animate-fade-in animate-delay-200' : ''}`}>
              Access world-class engineering education with interactive Products, AI-powered learning, and a global community of peers and mentors.
            </p>
            <div className={`flex flex-col sm:flex-row justify-center gap-6 ${!shouldReduceMotion ? 'animate-fade-in-up animate-delay-300' : ''}`}>
              <Link
                to="/Products"
                className="px-8 py-4 bg-white/10 text-white border border-white/30 rounded-xl hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl"
                aria-label="Explore all available Products"
              >
                Explore Products
                <ArrowRight className={`ml-2 h-5 w-5 ${!shouldReduceMotion ? 'group-hover:translate-x-1 transition-transform' : ''}`} />
              </Link>
              <Link
                to="/register"
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl transition-all duration-300"
                aria-label="Start your free trial"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
        
        {/* Stats Bar - simplified for mobile */}
        <div className="relative bg-gradient-to-r from-black/90 via-gray-900/80 to-black/90 backdrop-blur-xl border-y border-gray-800/30 shadow-lg" aria-labelledby="stats-bar-heading">
          {!isMobileDevice && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse-glow"></div>
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse-glow animation-delay-700"></div>
            </div>
          )}
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative z-10">

            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6 md:gap-x-8 lg:gap-x-12">
              {STATS.map((stat, index) => (
                <div key={index} className={`text-center group ${!shouldReduceMotion ? (index === 0 ? 'animate-count-up-delay-0' : index === 1 ? 'animate-count-up-delay-1' : index === 2 ? 'animate-count-up-delay-2' : 'animate-count-up-delay-3') : ''}`}>
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/10 mb-4 ${!isMobileDevice ? 'group-hover:from-indigo-500/30 group-hover:to-violet-500/20 transition-all duration-300' : ''} backdrop-blur-sm border border-indigo-500/10 shadow-lg`}>
                    <stat.icon className={`w-7 h-7 text-indigo-400 ${!isMobileDevice ? 'group-hover:text-indigo-300 transition-colors duration-300' : ''}`} />
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-100 mb-2">{stat.value}</div>
                  <div className="text-slate-300 text-sm sm:text-base font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - optimized for mobile */}
      <section id="features" className="py-32 relative bg-gradient-to-br from-black via-gray-950 to-black overflow-hidden" aria-labelledby="features-heading">
        {!isMobileDevice && (
          <>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob animate-delay-2000"></div>
            <div className="absolute bottom-0 -left-4 w-72 h-72 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob"></div>
          </>
        )}
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 id="features-heading" className="text-4xl font-bold mb-6 text-white">A Revolutionary Learning Experience</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">Our platform combines cutting-edge technology with proven pedagogical methods</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Video,
                title: 'HD Video Lectures',
                description: 'Crystal-clear explanations from world-class professors with interactive transcripts',
                features: ['4K quality videos', 'Downloadable content', 'Closed captions'],
                gradient: 'from-sky-400 to-blue-500',
                bgHover: 'from-sky-400/10 to-blue-400/10',
                iconColor: 'text-blue-400'
              },
              {
                icon: Code,
                title: 'Live Coding Labs',
                description: 'Interactive coding environments with AI-powered feedback and assistance',
                features: ['Real-time compilation', 'AI code analysis', 'Instant feedback'],
                gradient: 'from-violet-400 to-fuchsia-500',
                bgHover: 'from-violet-400/10 to-fuchsia-400/10',
                iconColor: 'text-purple-400'
              },
              {
                icon: Brain,
                title: 'AI-Powered Learning',
                description: 'Personalized learning paths that adapt to your pace and style',
                features: ['Adaptive learning', 'Smart recommendations', 'Progress tracking'],
                gradient: 'from-cyan-400 to-sky-500',
                bgHover: 'from-cyan-400/10 to-sky-400/10',
                iconColor: 'text-cyan-400'
              },
              {
                icon: Users,
                title: 'Peer Collaboration',
                description: 'Study groups, discussion forums, and real-time collaboration tools',
                features: ['Study groups', 'Live discussions', 'Project collaboration'],
                gradient: 'from-emerald-400 to-teal-500',
                bgHover: 'from-emerald-400/10 to-teal-400/10',
                iconColor: 'text-green-400'
              },
              {
                icon: Award,
                title: 'Industry Certifications',
                description: 'Earn recognized certificates to showcase your expertise',
                features: ['Verified certificates', 'Industry recognized', 'LinkedIn integration'],
                gradient: 'from-amber-400 to-yellow-500',
                bgHover: 'from-amber-400/10 to-yellow-400/10',
                iconColor: 'text-yellow-400'
              },
              {
                icon: BookOpen,
                title: 'Rich Resources',
                description: 'Comprehensive study materials, notes, and project templates',
                features: ['Study materials', 'Cheat sheets', 'Project templates'],
                gradient: 'from-rose-400 to-pink-500',
                bgHover: 'from-rose-400/10 to-pink-400/10',
                iconColor: 'text-rose-400'
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className={`group relative p-8 rounded-3xl bg-gradient-to-br from-black/80 to-gray-900/40 backdrop-blur-xl border border-gray-800/30 ${!isMobileDevice ? 'hover:border-sky-400/70 hover:-translate-y-2 hover:shadow-xl hover:shadow-sky-400/20' : ''} transition-all duration-500`}
              >
                {!isMobileDevice && (
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.iconColor === 'text-blue-400' ? 'from-sky-400/10 to-blue-300/5' : 
                  feature.iconColor === 'text-purple-400' ? 'from-violet-400/10 to-fuchsia-300/5' : 
                  feature.iconColor === 'text-cyan-400' ? 'from-cyan-400/10 to-sky-300/5' : 
                  feature.iconColor === 'text-green-400' ? 'from-emerald-400/10 to-teal-300/5' : 
                  feature.iconColor === 'text-yellow-400' ? 'from-amber-400/10 to-yellow-300/5' : 
                  'from-rose-400/10 to-pink-300/5'} rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-700 ease-in-out`}></div>
                )}
                <div className="relative z-10">
                  <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${feature.gradient} p-3 mb-8 ${!isMobileDevice ? 'group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-sky-400/20' : ''} transition-all duration-500 shadow-lg`}>
                    <feature.icon className="w-full h-full text-white" />
                  </div>
                  <h3 className={`text-2xl font-bold text-white mb-4 ${!isMobileDevice ? 
                  feature.iconColor === 'text-blue-400' ? 'group-hover:text-sky-300' : 
                  feature.iconColor === 'text-purple-400' ? 'group-hover:text-violet-300' : 
                  feature.iconColor === 'text-cyan-400' ? 'group-hover:text-cyan-300' : 
                  feature.iconColor === 'text-green-400' ? 'group-hover:text-emerald-300' : 
                  feature.iconColor === 'text-yellow-400' ? 'group-hover:text-amber-300' : 
                  'group-hover:text-rose-300' : ''} transition-colors duration-300`}>{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed mb-6">{feature.description}</p>
                  <ul className="space-y-3">
                    {feature.features.map((item, i) => (
                      <li key={i} className={`flex items-center text-gray-400 ${!isMobileDevice ? 'group-hover:text-gray-200' : ''} transition-colors duration-300`}>
                        <Check className={`w-5 h-5 ${feature.iconColor} mr-3 ${!isMobileDevice ? 
                        feature.iconColor === 'text-blue-400' ? 'group-hover:text-sky-300 group-hover:scale-110' : 
                        feature.iconColor === 'text-purple-400' ? 'group-hover:text-violet-300 group-hover:scale-110' : 
                        feature.iconColor === 'text-cyan-400' ? 'group-hover:text-cyan-300 group-hover:scale-110' : 
                        feature.iconColor === 'text-green-400' ? 'group-hover:text-emerald-300 group-hover:scale-110' : 
                        feature.iconColor === 'text-yellow-400' ? 'group-hover:text-amber-300 group-hover:scale-110' : 
                        'group-hover:text-rose-300 group-hover:scale-110' : ''} transition-all duration-300`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Products Section - optimized for mobile */}
      <section id="Products" className="py-24 md:py-32 relative bg-gradient-to-br from-black via-gray-950/90 to-black overflow-hidden" aria-labelledby="Products-heading">
        {!isMobileDevice && !shouldReduceMotion && (
          <>
            <div className="absolute top-0 -left-4 w-72 h-72 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob animate-delay-4000"></div>
            <div className="absolute bottom-0 right-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob animate-delay-1000"></div>
          </>
        )}
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10 md:mb-16">
            <div>
              <div className="inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-indigo-500/10 text-indigo-300 mb-4 md:mb-6">
                <Globe className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 md:mr-2" />
                <span className="text-xs md:text-sm font-medium">Popular Products</span>
              </div>
              <h2 id="Products-heading" className="text-2xl md:text-4xl font-bold mb-2 md:mb-4 text-white">Start Your Learning Journey</h2>
              <p className="text-base md:text-xl text-slate-300">Begin with our most sought-after programs</p>
            </div>
            <Link 
              to="/Products" 
              className="hidden md:inline-flex items-center text-indigo-400 hover:text-indigo-300 font-semibold group"
              aria-label="View all available Products"
            >
              View All Products 
              <ArrowRight className={`ml-2 h-5 w-5 ${!shouldReduceMotion ? 'transform group-hover:translate-x-1 transition-transform' : ''}`} />
            </Link>
          </div>
          
          {/* Mobile-optimized course grid with improved performance */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {FEATURED_Products.map((course, index) => {
              // Apply will-change only to visible Products for better performance
              const applyWillChange = index < 3;
              const transitionDuration = isMobileDevice ? '250ms' : '300ms';
              
              return (
                <div 
                  key={course.id} 
                  className={`group relative rounded-2xl md:rounded-3xl overflow-hidden bg-black/70 backdrop-blur-sm md:backdrop-blur-xl border border-gray-800/50 ${!isMobileDevice ? 'hover:border-indigo-500/50' : ''} transition-colors shadow-md md:shadow-lg`}
                  style={applyWillChange && !isMobileDevice ? { willChange: 'transform, opacity' } : undefined}
                >
                  {/* Only render hover effects on non-mobile */}
                  {!isMobileDevice && (
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  )}
                  <div className="relative">
                    {/* Optimized image container */}
                    <div className="relative h-48 md:h-56 overflow-hidden">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className={`w-full h-full object-cover ${!isMobileDevice && !shouldReduceMotion ? 'transform group-hover:scale-105 transition-transform' : ''}`}
                        style={{ transitionDuration }}
                        loading="lazy"
                        width="400"
                        height="225"
                        decoding="async"
                      />
                      {/* Simplified gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                      <div className="absolute top-3 left-3 md:top-4 md:left-4">
                        <span className="px-2 py-1 md:px-3 md:py-1 bg-indigo-500/90 text-white text-xs md:text-sm font-medium rounded-full">
                          {course.category}
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 md:bottom-4 md:left-4 md:right-4 flex items-center justify-between">
                        <span className="px-2 py-1 md:px-3 md:py-1 bg-white/10 text-white text-xs md:text-sm font-medium rounded-full">
                          {course.level}
                        </span>
                        <span className="px-2 py-1 md:px-3 md:py-1 bg-white/10 text-white text-xs md:text-sm font-medium rounded-full">
                          {course.duration}
                        </span>
                      </div>
                    </div>
                    
                    {/* Optimized content area with reduced padding on mobile */}
                    <div className="p-4 md:p-6 lg:p-8">
                      {/* Simplified tags for mobile */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-3 md:mb-4">
                        {isMobileDevice ? 
                          // Show only first tag on mobile
                          course.tags.slice(0, 1).map((tag, index) => (
                            <span key={index} className="px-2 py-0.5 bg-indigo-500/10 text-indigo-300 text-xs font-medium rounded-full">
                              {tag}
                            </span>
                          )) : 
                          // Show all tags on desktop
                          course.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-0.5 bg-indigo-500/10 text-indigo-300 text-xs font-medium rounded-full">
                              {tag}
                            </span>
                          ))
                        }
                      </div>
                      
                      <h3 className={`text-lg md:text-xl font-bold text-white mb-2 md:mb-3 ${!isMobileDevice ? 'group-hover:text-indigo-400' : ''} transition-colors`}>
                        {course.title}
                      </h3>
                      <p className="text-sm md:text-base text-slate-300 mb-4 md:mb-6 line-clamp-2">{course.description}</p>
                      
                      {/* Simplified instructor and rating section */}
                      <div className="flex items-center justify-between mb-4 md:mb-6">
                        <div className="flex items-center">
                          <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-xs md:text-sm mr-2 md:mr-3">
                            {course.instructor.charAt(0)}
                          </div>
                          <div>
                            <div className="text-xs md:text-sm font-medium text-white">{course.instructor}</div>
                            <div className="text-xs text-slate-400">Instructor</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm md:text-base text-white font-medium">{course.rating}</span>
                          <span className="text-xs md:text-sm text-slate-400">({course.students})</span>
                        </div>
                      </div>
                      
                      {/* Simplified features section - only show on desktop */}
                      {!isMobileDevice && (
                        <div className="flex flex-wrap items-center gap-3 mb-6">
                          {course.features.map((feature, index) => (
                            <div key={index} className="flex items-center text-slate-400 text-xs md:text-sm">
                              <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-indigo-400 mr-1" />
                              {feature}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Simplified pricing and CTA section */}
                      <div className="flex items-center justify-between pt-4 md:pt-6 border-t border-slate-700/50">
                        <div className="text-xl md:text-3xl font-bold text-transparent bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text">
                          {course.price}
                        </div>
                        <button 
                          className={`px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm md:text-base rounded-lg md:rounded-xl ${!isMobileDevice ? 'hover:from-indigo-700 hover:to-violet-700' : ''} transition-colors font-semibold shadow-md md:shadow-lg`}
                          aria-label={`Enroll in ${course.title}`}
                        >
                          Enroll Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Mobile-only View All button */}
          <div className="mt-8 flex justify-center md:hidden">
            <Link 
              to="/Products" 
              className="inline-flex items-center justify-center w-full max-w-xs px-6 py-3 bg-indigo-600/90 text-white rounded-xl font-semibold shadow-md transition-colors duration-300"
              aria-label="View all available Products"
            >
              View All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

     {/* Testimonials Section - simplified for mobile */}
<section id="testimonials" className="py-16 md:py-24 bg-gradient-to-br from-black via-gray-950/95 to-black section-padding relative overflow-hidden" aria-labelledby="testimonials-heading">
  {!isMobileDevice && (
    <>
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob"></div>
      <div className="absolute bottom-0 -right-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob animate-delay-2000"></div>
    </>
  )}
  
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-8 md:mb-16 relative z-10">
      <div className={`inline-flex items-center px-4 py-2 rounded-full bg-indigo-500/20 backdrop-blur-sm border border-indigo-400/30 text-indigo-100 mb-6 ${!shouldReduceMotion ? 'animate-fade-in' : ''}`}>
        <span className={`flex h-2 w-2 rounded-full bg-indigo-300 ${!shouldReduceMotion ? 'animate-pulse' : ''} mr-2`}></span>
        <span className="text-sm font-medium">Student Testimonials</span>
      </div>
      <h2 id="testimonials-heading" className="text-2xl md:text-4xl font-bold mb-2 md:mb-4 text-white">What Our Students Say</h2>
      <p className="text-base md:text-xl text-indigo-200/80 max-w-2xl mx-auto">Join thousands of satisfied learners who've transformed their careers with our Products</p>
    </div>
    
    {(() => {
        const testimonials = [
          {
            quote: "Genius transformed my understanding of complex algorithms. The interactive labs make learning both fun and effective.",
            name: "Rahul Sharma",
            role: "CS Student, IIT Delhi",
            avatar: "/images/testimonials/user1.webp",
            color: "indigo"
          },
          {
            quote: "The AI-powered feedback helped me identify gaps in my knowledge. I've improved drastically in just 3 months.",
            name: "Priya Kapoor",
            role: "ECE Student, BITS Pilani",
            avatar: "/images/testimonials/user2.webp",
            color: "purple"
          },
          {
            quote: "The community support is amazing. I found study partners and mentors who helped me excel in my Products.",
            name: "Amit Verma",
            role: "ME Student, NIT Trichy",
            avatar: "/images/testimonials/user3.webp",
            color: "pink"
          },
          {
            quote: "The personalized learning path helped me focus on areas where I needed improvement. The results speak for themselves!",
            name: "Ananya Patel",
            role: "CSE Student, VIT Vellore",
            avatar: "/images/testimonials/user1.webp",
            color: "indigo"
          },
          {
            quote: "As someone who struggled with programming, Genius.AI's step-by-step approach made complex concepts accessible.",
            name: "Vikram Singh",
            role: "IT Student, IIIT Hyderabad",
            avatar: "/images/testimonials/user2.webp",
            color: "purple"
          },
          {
            quote: "The practice problems and real-world projects helped me build a portfolio that impressed recruiters during my internship search.",
            name: "Neha Gupta",
            role: "ECE Student, DTU Delhi",
            avatar: "/images/testimonials/user3.webp",
            color: "pink"
          }
        ];

        // Calculate slides based on screen size
        const slidesPerView = isMobileDevice ? 1 : 3;
        const totalSlides = Math.ceil(testimonials.length / slidesPerView);
        const maxIndex = totalSlides - 1;

        return (
          <>
            {/* Modern testimonial slider with enhanced UI */}
            <div className="relative max-w-6xl mx-auto px-0 sm:px-6">
              {/* Main slider container with minimal design */}
              <div className="relative overflow-hidden rounded-lg bg-black/20 p-0 sm:p-4">
                {/* Slider track */}
                <div 
                  ref={testimonialSliderRef}
                  className="overflow-hidden relative rounded-lg"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <div 
                    className="flex transition-transform duration-700 ease-out"
                    style={{ transform: `translateX(-${currentTestimonialIndex * 100}%)` }}
                  >
                    {testimonials.map((testimonial, index) => (
                      <div 
                        key={index} 
                        className="min-w-full sm:min-w-[85%] md:min-w-[33.333%] px-0 sm:px-1 py-0 sm:py-1"
                      >
                        <div 
                          className={`h-full bg-black/80 rounded-lg relative group overflow-hidden transition-all duration-300 ${!isMobileDevice ? 'hover:-translate-y-1' : ''}`}
                        >
                          {/* Color accent bar above the testimonial */}
                          <div className={`absolute top-0 left-0 right-0 h-1 ${testimonial.color === 'indigo' ? 'bg-gradient-to-r from-indigo-600 to-indigo-400' : testimonial.color === 'purple' ? 'bg-gradient-to-r from-purple-600 to-purple-400' : 'bg-gradient-to-r from-pink-600 to-pink-400'}`}></div>
                          
                          <div className="p-2 sm:p-4 h-full relative z-10">
                            {/* Minimal rating display */}
                            <div className="flex items-center mb-1 sm:mb-3">
                              <div className="text-yellow-400 text-xs sm:text-sm">★★★★★</div>
                              <span className="text-gray-500 text-xs ml-1">5.0</span>
                            </div>
                            
                            {/* Compact quote with clean styling */}
                            <div className="mb-2 sm:mb-4">
                              <p className="text-white text-xs sm:text-sm leading-relaxed">
                                "{testimonial.quote}"
                              </p>
                            </div>
                            
                            {/* Compact user profile layout */}
                            <div className="flex items-center pt-1 mt-1 sm:pt-3 sm:mt-3 border-t border-gray-800/30">
                              <div className="mr-2 sm:mr-3">
                                <img 
                                  src={testimonial.avatar} 
                                  alt={testimonial.name} 
                                  className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover"
                                  loading="lazy"
                                />
                              </div>
                              <div>
                                <div className="font-medium text-white text-xs sm:text-sm">{testimonial.name}</div>
                                <div className="text-xs text-gray-400">{testimonial.role}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Navigation arrows */}
                <button 
                  onClick={() => setCurrentTestimonialIndex(prev => Math.max(0, prev - 1))} 
                  disabled={currentTestimonialIndex === 0}
                  className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 h-full flex items-center justify-center px-1 sm:px-2 ${currentTestimonialIndex === 0 ? 'opacity-0 cursor-default' : 'opacity-70 hover:opacity-100'} transition-opacity duration-300`}
                  aria-label="Previous testimonials"
                >
                  <span className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center bg-black/60 rounded text-white">
                    <ChevronLeft className="w-4 h-4" />
                  </span>
                </button>
                
                <button 
                  onClick={() => setCurrentTestimonialIndex(prev => Math.min(maxIndex, prev + 1))}
                  disabled={currentTestimonialIndex === maxIndex} 
                  className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 h-full flex items-center justify-center px-1 sm:px-2 ${currentTestimonialIndex === maxIndex ? 'opacity-0 cursor-default' : 'opacity-70 hover:opacity-100'} transition-opacity duration-300`}
                  aria-label="Next testimonials"
                >
                  <span className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center bg-black/60 rounded text-white">
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </button>
              </div>
              
              {/* Pagination indicators - only visible on desktop */}
              {!isMobileDevice && (
                <div className="flex justify-center items-center mt-4 space-x-3">
                  {Array.from({ length: totalSlides }, (_, pageIndex) => (
                    <button 
                      key={pageIndex} 
                      onClick={() => setCurrentTestimonialIndex(pageIndex)}
                      className={`${currentTestimonialIndex === pageIndex ? 
                        'w-4 bg-gradient-to-r from-indigo-600 to-violet-600' : 
                        'w-1.5 bg-gray-700 hover:bg-gray-600'} 
                        h-1.5 rounded-full transition-all duration-300`}
                      aria-label={`Go to testimonial page ${pageIndex + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        );
      })()}
  </div>
</section>
      {/* CTA Section - simplified */}
      <section id="cta" className="py-20 md:py-28 bg-gradient-to-br from-black via-gray-950/95 to-black relative overflow-hidden" aria-labelledby="cta-heading">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/10 via-violet-950/5 to-transparent pointer-events-none" aria-hidden="true"></div>
        <div className="absolute inset-0 bg-[url('/images/cta-background.webp')] opacity-10 bg-cover bg-center" aria-hidden="true"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto">
            <div className={`inline-flex items-center px-4 md:px-6 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-indigo-400/30 text-indigo-100 mb-6 ${!shouldReduceMotion ? 'animate-fade-in' : ''}`}>
              <svg className="w-5 h-5 md:w-6 md:h-6 mr-2 text-indigo-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v4m0 8v4m8-8h-4m-8 0H4" />
              </svg>
              <span className="font-medium tracking-wide text-sm md:text-base">Ready to unlock your potential?</span>
            </div>
            <h2 id="cta-heading" className={`text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight ${!shouldReduceMotion ? 'animate-fade-in animate-delay-100' : ''} drop-shadow-xl`}>
              Ready to Start Your Journey?
            </h2>
            <p className={`text-xl md:text-2xl text-indigo-100 mb-8 md:mb-10 ${!shouldReduceMotion ? 'animate-fade-in animate-delay-200' : ''}`}>
              Join 50,000+ students mastering engineering with Genius. Take the first step toward your dream career today!
            </p>
            <div className={`flex flex-col sm:flex-row justify-center gap-4 md:gap-6 ${!shouldReduceMotion ? 'animate-fade-in animate-delay-300' : ''}`}>
              <Link
                to="/register"
                className="px-8 md:px-10 py-4 md:py-5 bg-white text-indigo-700 rounded-xl text-base md:text-lg font-bold hover:bg-indigo-50 transition-all duration-300 shadow-xl hover:shadow-2xl"
                aria-label="Start your free trial"
              >
                Start Free Trial
              </Link>
              <Link
                to="/Products"
                className="px-8 md:px-10 py-4 md:py-5 bg-transparent text-white border-2 border-white rounded-xl text-base md:text-lg font-bold hover:bg-white/10 transition-all duration-300"
                aria-label="Browse all Products"
              >
                Browse Products
              </Link>
            </div>
          </div>  
        </div>
      </section>
    </main>
  );
}