import { BookOpen, User, Menu, Search, ChevronDown, Code, Globe, Sun, Moon } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { isMobile } from '../utils/deviceDetection';
import { searchContent, SearchResult } from '../utils/searchUtils';
import { useTheme } from '../context/useTheme';
import './Navbar.css';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  children: React.ReactNode;
}

const Link = ({ to, children, className, ...props }: LinkProps) => (
  <a href={to} className={className} {...props}>
    {children}
  </a>
);



export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  
  // Get theme context
  const { theme, toggleTheme } = useTheme();
  
  const menuRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    // Set mobile detection once - no need to constantly check
    setIsMobileDevice(isMobile());
  }, []);
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  useEffect(() => {
    if (isMenuOpen) {
      // Simple approach - just prevent scrolling
      document.body.classList.add('mobile-menu-open');
    } else {
      // Re-enable scrolling
      document.body.classList.remove('mobile-menu-open');
    }
    
    return () => {
      // Cleanup function
      document.body.classList.remove('mobile-menu-open');
    };
  }, [isMenuOpen]);
  
  const handleLinkClick = () => {
    setIsMenuOpen(false);
    setShowSearchResults(false);
    setIsProfileOpen(false);
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }
    
    setIsSearching(true);
    
    // Reduce debounce time for better responsiveness
    const searchTimeout = setTimeout(() => {
      const filteredResults = searchContent(query);
      setSearchResults(filteredResults);
      setIsSearching(false);
      setShowSearchResults(true);
    }, 150); // Faster response time for all devices
    
    return () => clearTimeout(searchTimeout);
  };
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      console.log(`Searching for: ${searchQuery}`);
    }
  };
  
  // Function removed as it's no longer needed since X button was removed
  
  // Function to get the appropriate icon for each result type
  const getResultIcon = (type: string) => {
    switch (type) {
      case 'course':
        return <BookOpen className="h-4 w-4 text-indigo-400" />;
      case 'playground':
        return <Code className="h-4 w-4 text-amber-400" />;
      default:
        return <Globe className="h-4 w-4 text-blue-400" />;
    }
  };
  
  return (
    <nav className={`fixed w-full z-50 ${theme === 'dark' ? 'bg-gradient-to-r from-black/90 via-gray-950/90 to-black/90 border-b border-gray-800/30' : 'bg-white/90 border-b border-slate-200/60'} backdrop-blur-xl shadow-lg`}>
      {/* Simplified decorative elements for mobile */}
      {!isMobileDevice && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse-slow"></div>
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse-slow-alt"></div>
        </div>
      )}
      
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and main navigation */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className={`p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 ${!isMobileDevice ? 'group-hover:from-indigo-600 group-hover:to-violet-700 transition-all duration-300 shadow-[0_0_15px_rgba(79,70,229,0.4)] group-hover:shadow-[0_0_20px_rgba(79,70,229,0.6)] group-hover:scale-105' : ''}`}>
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className={`text-2xl font-bold text-transparent bg-clip-text ${theme === 'dark' ? 'bg-gradient-to-r from-indigo-400 to-violet-400' : 'bg-gradient-to-r from-indigo-600 to-violet-600'} ${!isMobileDevice ? `${theme === 'dark' ? 'group-hover:from-indigo-300 group-hover:to-violet-300' : 'group-hover:from-indigo-500 group-hover:to-violet-500'} transition-all duration-300` : ''}`}>
                Intellio.ai
              </span>
            </Link>
            
            <div className="hidden lg:flex items-center ml-12 space-x-6">
              {['Products', 'Playground'].map((item) => (
                <Link 
                  key={item}
                  to={`/${item.toLowerCase()}`}
                  className={`px-3 py-2 ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-indigo-600'} rounded-md transition-all duration-300 relative overflow-hidden group`}
                >
                  <span className="relative z-10 font-medium">{item}</span>
                  <span className={`absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 group-hover:w-full group-hover:left-0 transition-all duration-300 opacity-0 group-hover:opacity-100 ${theme === 'light' ? 'group-hover:opacity-80' : ''}`}></span>
                </Link>
              ))}
            </div>
          </div>

          {/* Right side navigation */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search bar - simplified for mobile */}
            <div className="hidden md:block relative" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="relative group">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 ${!isMobileDevice ? 'group-hover:text-indigo-400 transition-colors duration-300' : ''}`} />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className={`pl-9 py-1.5 rounded-full ${theme === 'dark' ? 'bg-slate-800/80 border border-slate-700/80 text-slate-100 placeholder-slate-400' : 'bg-slate-100/80 border border-slate-200 text-slate-800 placeholder-slate-500'} focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent w-56 ${!isMobileDevice ? 'transition-all duration-300 focus:w-72' : ''}`}
                />
                {/* X button removed as requested */}
              </form>
              
              {/* Search results dropdown */}
              {showSearchResults && (
                <div className={`absolute right-0 mt-2 w-72 ${theme === 'dark' ? 'bg-black/90 border border-gray-800/30' : 'bg-white/95 border border-slate-200/60'} backdrop-blur-xl rounded-lg shadow-lg py-1 ${!isMobileDevice ? 'animate-fadeIn' : ''} z-50`}>
                  <div className="px-3 py-2 border-b border-gray-800/30">
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {isSearching ? (
                        "Searching..."
                      ) : searchResults.length > 0 ? (
                        `Found ${searchResults.length} result${searchResults.length === 1 ? '' : 's'}`
                      ) : (
                        "No results found"
                      )}
                    </p>
                  </div>
                  
                  <div className="max-h-60 overflow-y-auto">
                    {searchResults.map((result) => (
                      <Link 
                        key={result.id}
                        to={result.url} 
                        onClick={handleLinkClick}
                        className={`flex items-center px-3 py-3 ${!isMobileDevice ? 'hover:bg-gray-800/50 transition-all duration-200' : ''} border-b border-gray-800/20 last:border-b-0`}
                      >
                        <div className="mr-3">
                          <div className={`p-1.5 rounded-md ${
                            result.type === 'course'
                              ? 'bg-indigo-500/20'
                              : result.type === 'playground'
                              ? 'bg-emerald-500/20'
                              : 'bg-amber-500/20'
                          }`}>
                            {getResultIcon(result.type)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white font-medium truncate">{result.title}</p>
                          <p className="text-xs text-gray-400 line-clamp-1">{result.description}</p>
                          <p className="text-xs text-gray-500 capitalize mt-0.5">{result.type}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  
                  {searchResults.length > 0 && (
                    <div className="px-3 py-2 border-t border-gray-800/30">
                      <Link 
                        to={`/search?q=${encodeURIComponent(searchQuery)}`}
                        onClick={handleLinkClick}
                        className={`text-sm text-indigo-400 ${!isMobileDevice ? 'hover:text-indigo-300 transition-colors duration-200' : ''} flex items-center`}
                      >
                        View all results
                        <svg className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Profile dropdown - simplified for mobile */}
            <div className="relative" ref={profileRef}>
              <button 
                className="flex items-center space-x-1.5 p-1.5 rounded-full touch-target"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <div className={`h-7 w-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md ${!isMobileDevice ? 'transition-all duration-300 hover:shadow-[0_0_10px_rgba(79,70,229,0.4)]' : ''}`}>
                  <User className="h-4 w-4 text-white" />
                </div>
                <ChevronDown className={`h-3.5 w-3.5 text-gray-400 ${!isMobileDevice ? 'transition-transform duration-200' : ''} ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isProfileOpen && (
                <div className={`absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-xl rounded-lg shadow-lg py-1 border border-gray-800/30 ${!isMobileDevice ? 'animate-fadeIn' : ''}`}>
                  <Link to="/profile" className={`flex items-center px-4 py-2 text-gray-300 ${!isMobileDevice ? 'hover:text-white transition-all duration-200 group' : ''}`}>
                    <User className={`h-4 w-4 mr-2 text-gray-400 ${!isMobileDevice ? 'group-hover:text-indigo-400' : ''}`} />
                    <span>Profile</span>
                  </Link>
                  <Link to="/settings" className={`flex items-center px-4 py-2 text-gray-300 ${!isMobileDevice ? 'hover:text-white transition-all duration-200 group' : ''}`}>
                    <svg className={`h-4 w-4 mr-2 text-gray-400 ${!isMobileDevice ? 'group-hover:text-indigo-400' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Settings</span>
                  </Link>
                  <button 
                    onClick={toggleTheme} 
                    className={`flex w-full items-center px-4 py-2 text-gray-300 ${!isMobileDevice ? 'hover:text-white transition-all duration-200 group' : ''}`}
                    aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                  >
                    {theme === 'dark' ? (
                      <Sun className={`h-4 w-4 mr-2 text-amber-400 ${!isMobileDevice ? 'group-hover:text-amber-300' : ''}`} />
                    ) : (
                      <Moon className={`h-4 w-4 mr-2 text-indigo-400 ${!isMobileDevice ? 'group-hover:text-indigo-300' : ''}`} />
                    )}
                    <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                  </button>
                  <hr className="my-1 border-gray-800/30" />
                  <button className={`flex w-full items-center px-4 py-2 text-red-400 ${!isMobileDevice ? 'hover:text-red-300 transition-all duration-200 group' : ''}`}>
                    <svg className={`h-4 w-4 mr-2 text-red-500/70 ${!isMobileDevice ? 'group-hover:text-red-400' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
            
            {/* Mobile menu button */}
            <button
              className="lg:hidden p-1.5 rounded-full touch-target"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <Menu className={`h-5 w-5 text-gray-400 ${!isMobileDevice ? 'hover:text-white transition-colors duration-300' : ''}`} />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile menu overlay */}
        {isMenuOpen && (
          <>
            <div className="mobile-menu-overlay" onClick={() => setIsMenuOpen(false)}></div>
            <div ref={menuRef} className={`lg:hidden py-6 border-t border-gray-800/30 ${!isMobileDevice ? 'animate-fadeIn' : ''} mobile-menu bg-black`}>
            <div className="flex flex-col space-y-3 px-2">
              {['Products', 'Playground'].map((item) => (
                <Link 
                  key={item}
                  to={`/${item.toLowerCase()}`} 
                  onClick={handleLinkClick} 
                  className={`px-4 py-3.5 text-gray-200 ${!isMobileDevice ? 'hover:text-white hover:bg-gray-900 transition-all duration-200' : ''} rounded-xl flex items-center touch-target bg-black/90 border border-gray-800/30 active:bg-gray-900/80`}
                >
                  <div className="mr-3 p-1.5 rounded-md bg-gradient-to-br from-indigo-600/20 to-violet-600/20 backdrop-blur-sm">
                    {item === 'Products' && <BookOpen className="h-4 w-4 text-indigo-400" />}
                    {item === 'Playground' && <Code className="h-4 w-4 text-violet-400" />}
                  </div>
                  <span className="font-medium">{item}</span>
                  <svg className="ml-auto h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
              
              {/* Mobile search */}
              <div className="px-4 py-4 mt-4 bg-black rounded-xl mx-2 border border-gray-800/30 shadow-lg">
                <form onSubmit={handleSearchSubmit}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className={`w-full pl-9 py-2.5 rounded-lg bg-slate-800/80 border border-slate-700/80 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent ${!isMobileDevice ? 'transition-all duration-300' : ''}`}
                    />
                  </div>
                </form>
                
                {/* Mobile search results */}
                {showSearchResults && searchResults.length > 0 && (
                  <div className={`mt-3 bg-gray-900 rounded-lg border border-gray-800/30 ${!isMobileDevice ? 'animate-fadeIn' : ''} max-h-60 overflow-y-auto`}>
                    <div className="overflow-y-auto -webkit-overflow-scrolling-touch">
                      {searchResults.map((result) => (
                        <Link 
                          key={result.id}
                          to={result.url} 
                          onClick={handleLinkClick}
                          className={`flex items-center px-3 py-3 ${!isMobileDevice ? 'hover:bg-gray-800/50 transition-all duration-200' : ''} border-b border-gray-800/20 last:border-b-0`}
                        >
                          <div className="mr-3 flex-shrink-0">
                            <div className={`p-1.5 rounded-md ${
                              result.type === 'course'
                                ? 'bg-indigo-500/20'
                                : result.type === 'playground'
                                ? 'bg-emerald-500/20'
                                : 'bg-amber-500/20'
                            }`}>
                            {getResultIcon(result.type)}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white font-medium truncate">{result.title}</p>
                            <p className="text-xs text-gray-400 line-clamp-1">{result.description}</p>
                            <p className="text-xs text-gray-500 capitalize mt-0.5">{result.type}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                    
                    <div className="px-3 py-2 border-t border-gray-800/30">
                      <Link 
                        to={`/search?q=${encodeURIComponent(searchQuery)}`}
                        onClick={handleLinkClick}
                        className={`text-sm text-indigo-400 ${!isMobileDevice ? 'hover:text-indigo-300 transition-colors duration-200' : ''} flex items-center`}
                      >
                        View all results
                        <svg className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          </>
        )}
      </div>  
    </nav>
  );
}