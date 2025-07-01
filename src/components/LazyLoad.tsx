import { ReactNode, Suspense } from 'react';

interface LazyLoadProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Wrapper component for lazy loading content
 */
export function LazyLoad({ children, fallback }: LazyLoadProps) {
  return (
    <Suspense 
      fallback={
        fallback || (
          <div className="min-h-[100px] flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )
      }
    >
      {children}
    </Suspense>
  );
}

// Utility functions have been moved to src/utils/lazyUtils.ts
