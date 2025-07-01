import { useState, useEffect, useRef, ReactNode } from 'react';

interface LazySectionProps {
  id: string;
  className?: string;
  children: ReactNode;
  threshold?: number;
  rootMargin?: string;
  placeholder?: ReactNode;
  ariaLabelledBy?: string;
}

export function LazySection({
  id,
  className = '',
  children,
  threshold = 0.1,
  rootMargin = '100px 0px',
  placeholder,
  ariaLabelledBy
}: LazySectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin]);
  
  // Set hasLoaded after a small delay once visible
  useEffect(() => {
    if (isVisible && !hasLoaded) {
      const timer = setTimeout(() => {
        setHasLoaded(true);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, hasLoaded]);
  
  return (
    <section 
      id={id} 
      ref={sectionRef} 
      className={`${className} ${hasLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
      aria-labelledby={ariaLabelledBy}
    >
      {isVisible ? children : placeholder || <div className="min-h-[200px]"></div>}
    </section>
  );
}
