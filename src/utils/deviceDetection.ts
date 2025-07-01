import { useState, useEffect } from 'react';

// Extend the Navigator interface to include deviceMemory property
interface NavigatorWithMemory extends Navigator {
  deviceMemory?: number;
}

// Check if the device is mobile based on screen width or user agent
export const isMobile = () => {
  return window.innerWidth <= 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
};

// Check if the device has low-end hardware specifications
export const isSlowDevice = () => {
  const hardwareConcurrency = navigator.hardwareConcurrency || 1;
  const deviceMemory = (navigator as NavigatorWithMemory).deviceMemory || 2;
  
  return hardwareConcurrency <= 2 || deviceMemory <= 2;
};

// Regular function to check reduced motion preference
export const checkReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Proper React Hook for reduced motion
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    // Check initial value
    setPrefersReducedMotion(checkReducedMotion());
    
    // Set up listener for changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    
    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } 
    // Older browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);
  
  return prefersReducedMotion;
};

// Check if the device is a low-end mobile device that needs special optimizations
export const isLowEndMobile = () => {
  return isMobile() && isSlowDevice();
};

// Get appropriate image quality based on device capabilities
export const getImageQuality = () => {
  if (isLowEndMobile()) {
    return 'low'; // For very low-end devices
  } else if (isMobile()) {
    return 'medium'; // For average mobile devices
  }
  return 'high'; // For desktop and high-end devices
};

// Determine if heavy animations should be disabled
export const shouldDisableHeavyAnimations = () => {
  return isLowEndMobile() || checkReducedMotion();
};

// Get appropriate number of items to render based on device capabilities
// Useful for optimizing course card rendering
export const getOptimalBatchSize = () => {
  if (isLowEndMobile()) {
    return 3; // Render fewer items on low-end mobile
  } else if (isMobile()) {
    return 6; // Render moderate number on regular mobile
  }
  return 9; // Render more on desktop
};

// Check if the device supports backdrop blur efficiently
export const supportsEfficientBlur = () => {
  // Most modern browsers support backdrop-filter efficiently now,
  // but older/low-end mobile devices might struggle
  return !isLowEndMobile();
};

// Get appropriate transition duration based on device capabilities
export const getTransitionDuration = () => {
  if (isLowEndMobile()) {
    return 150; // Faster transitions for low-end devices (less smooth but more responsive)
  } else if (isMobile()) {
    return 250; // Moderate transition speed for mobile
  }
  return 300; // Full transition duration for desktop
};