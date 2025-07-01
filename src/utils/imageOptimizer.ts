/**
 * Utility functions for image optimization
 */

/**
 * Generates a responsive image URL with width parameter
 * @param src Original image source
 * @param width Desired width
 * @returns Optimized image URL
 */
export function getResponsiveImageUrl(src: string, width: number): string {
  if (!src) return '';
  
  // Extract file extension and path
  const lastDot = src.lastIndexOf('.');
  const ext = lastDot !== -1 ? src.substring(lastDot) : '';
  const basePath = lastDot !== -1 ? src.substring(0, lastDot) : src;
  
  return `${basePath}-${width}${ext}`;
}

/**
 * Generates a srcSet string for responsive images
 * @param src Original image source
 * @param sizes Array of widths to include in srcSet
 * @returns srcSet string
 */
export function generateSrcSet(src: string, sizes: number[] = [640, 750, 828, 1080, 1200, 1920]): string {
  if (!src) return '';
  
  // Extract file extension and path
  const lastDot = src.lastIndexOf('.');
  const ext = lastDot !== -1 ? src.substring(lastDot) : '';
  const basePath = lastDot !== -1 ? src.substring(0, lastDot) : src;
  
  // Generate srcset with different sizes
  return sizes.map(w => `${basePath}-${w}${ext} ${w}w`).join(', ');
}

/**
 * Determines if an image should be loaded with high priority
 * @param src Image source
 * @param priorityPatterns Array of patterns that indicate high priority images
 * @returns Boolean indicating if image should be high priority
 */
export function isHighPriorityImage(src: string, priorityPatterns: string[] = ['HERO', 'logo', 'banner']): boolean {
  if (!src) return false;
  
  return priorityPatterns.some(pattern => src.includes(pattern));
}

/**
 * Converts image format to WebP if supported
 * @param src Original image source
 * @returns WebP version of the image if possible
 */
export function getWebPVersion(src: string): string {
  if (!src) return '';
  
  // Extract file extension and path
  const lastDot = src.lastIndexOf('.');
  if (lastDot === -1) return src;
  
  const ext = src.substring(lastDot).toLowerCase();
  const basePath = src.substring(0, lastDot);
  
  // Only convert jpg, jpeg, and png to webp
  if (['.jpg', '.jpeg', '.png'].includes(ext)) {
    return `${basePath}.webp`;
  }
  
  return src;
}
