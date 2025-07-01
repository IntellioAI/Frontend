import { lazy, ComponentType, LazyExoticComponent } from 'react';

/**
 * Helper function to lazy load components
 * @param importFunc Function that imports the component
 * @returns Lazy loaded component
 */
export function lazyLoad<T extends ComponentType<unknown>>(
  importFunc: () => Promise<{ default: T }>
): LazyExoticComponent<T> {
  return lazy(importFunc);
}

/**
 * Preload a component before it's needed
 * @param importFunc Function that imports the component
 */
export function preloadComponent<T>(importFunc: () => Promise<T>): void {
  importFunc();
}
