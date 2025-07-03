import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense } from 'react';
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

  return (
    <div className="flex min-h-screen">
      {/* Conditional Sidebar */}
      {showSidebar && (
        <div className="z-40">
          <SidebarStandalone />
        </div>
      )}
      
      {/* Main Content Area */}
      <div className={`flex flex-col min-h-screen w-full transition-all duration-300 ${
        showSidebar ? 'lg:ml-0' : ''
      }`}>
        {/* Conditional Navbar - only on home page */}
        {isHomePage && <Navbar />}
        
        {/* Main Content */}
        <main className={`flex-grow ${showSidebar ? 'overflow-hidden' : ''}`}>
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
  return (
    <ThemeProvider>
      <Router>
        <AppLayout />
      </Router>
    </ThemeProvider>
  );
}

export default App;