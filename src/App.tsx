import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from 'react';
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { ThemeProvider } from "./context/ThemeContext";

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Courses = lazy(() => import('./pages/Courses'));
const Profile = lazy(() => import('./pages/Profile').then(module => ({ default: module.Profile })));
const Playground = lazy(() => import('./pages/Playground').then(module => ({ default: module.Playground })));
const Community = lazy(() => import('./pages/Community').then(module => ({ default: module.Community })));
const Register = lazy(() => import('./pages/Register').then(module => ({ default: module.Register })));
const Resources = lazy(() => import('./pages/Resources').then(module => ({ default: module.Resources })));

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
                <Route path="/courses" element={<Courses />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/playground" element={<Playground />} />
                <Route path="/community" element={<Community />} />
                <Route path="/resources" element={<Resources />} />
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