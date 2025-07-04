import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense, createContext, useContext, useState } from 'react';
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { SidebarStandalone } from "./components/sidebar";
import { ThemeProvider } from "./context/ThemeContext";

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const WebPlayground = lazy(() => import('./pages/Web_playground').then(module => ({ default: module.Web_Playground })));
const CodePlayground = lazy(() => import('./pages/Code_playground').then(module => ({ default: module.Playground })));

// Import global styles
import "./styles/global.css";

// Sidebar context to manage sidebar state across components
const SidebarContext = createContext<{
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}>({
  isCollapsed: true,
  setIsCollapsed: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-black">
    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Layout component that handles conditional navigation
function AppLayout() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const showSidebar = location.pathname === '/products' || location.pathname === '/Products' || location.pathname === '/playground' || location.pathname === '/web-playground';
  const { isCollapsed } = useSidebar();

  return (
    <div className="flex min-h-screen bg-black overflow-hidden">
      {/* Conditional Sidebar */}
      {showSidebar && (
        <div className="z-40 flex-shrink-0">
          <SidebarStandalone />
        </div>
      )}
      
      {/* Main Content Area */}
      <div 
        className={`flex flex-col min-h-screen w-full transition-all duration-300 overflow-hidden ${
          showSidebar 
            ? `${isCollapsed ? 'ml-0' : 'ml-72'} lg:${isCollapsed ? 'ml-0' : 'ml-72'}` 
            : ''
        }`}
      >
        {/* Conditional Navbar - only on home page */}
        {isHomePage && <Navbar />}
        
        {/* Main Content */}
        <main className={`flex-grow ${showSidebar ? 'overflow-auto' : 'overflow-auto'}`}>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Products" element={<Products />} />
              <Route path="/playground" element={<CodePlayground />} />
              <Route path="/web-playground" element={<WebPlayground />} />
            </Routes>
          </Suspense>
        </main>
        
        {/* Footer - only on home page */}
        {isHomePage && <Footer />}
      </div>
    </div>
  );
}

function App() {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <ThemeProvider>
      <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
        <Router>
          <AppLayout />
        </Router>
      </SidebarContext.Provider>
    </ThemeProvider>
  );
}

export default App;