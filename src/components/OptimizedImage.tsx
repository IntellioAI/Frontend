import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  sizes?: string;
}

export function OptimizedImage({
  src,
  alt,
  className = '',
  width,
  height,
  loading = 'lazy',
  priority = false,
  sizes = '100vw'
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Generate srcset for responsive images
  const generateSrcSet = () => {
    if (!src) return '';
    
    // Extract file extension and path
    const lastDot = src.lastIndexOf('.');
    const ext = lastDot !== -1 ? src.substring(lastDot) : '';
    const basePath = lastDot !== -1 ? src.substring(0, lastDot) : src;
    
    // Generate srcset with different sizes
    const widths = [640, 750, 828, 1080, 1200, 1920];
    return widths.map(w => `${basePath}-${w}${ext} ${w}w`).join(', ');
  };
  
  const srcSet = generateSrcSet();
  
  return (
    <img
      src={src}
      alt={alt}
      className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      width={width}
      height={height}
      loading={priority ? 'eager' : loading}
      onLoad={() => setIsLoaded(true)}
      srcSet={srcSet || undefined}
      sizes={sizes}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
    />
  );
}
