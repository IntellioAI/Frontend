import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from 'react';
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { ThemeProvider } from "./context/ThemeContext";

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const Profile = lazy(() => import('./pages/Profile').then(module => ({ default: module.Profile })));
const Playground = lazy(() => import('./pages/Playground').then(module => ({ default: module.Playground })));
const Register = lazy(() => import('./pages/Register').then(module => ({ default: module.Register })));

// Import global styles
import "./styles/global.css";

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-black">
    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {  
  return (
    <ThemeProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Products" element={<Products />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/playground" element={<Playground />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />  
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;