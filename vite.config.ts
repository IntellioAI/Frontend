import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // ✅ Required for alias resolution

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Use SWC for faster builds
      jsxRuntime: 'automatic',
      babel: {
        parserOpts: {
          plugins: ['decorators-legacy']
        }
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src') // ✅ This enables "@/..." imports
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['react', 'react-dom', 'react-router-dom']
  },
  server: {
    host: true,
    hmr: {
      overlay: false // Disable error overlay on mobile
    }
  },
  build: {
    // Optimize build for production
    target: 'es2015',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          icons: ['lucide-react']
        }
      }
    },
    sourcemap: false,
    // Optimize chunks
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
    // Enable brotli compression
    reportCompressedSize: false
  },
  // Optimize CSS
  css: {
    modules: {
      localsConvention: 'camelCase'
    },
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/styles/variables.scss";`
      }
    }
  },
  // Experimental features for better performance
  esbuild: {
    legalComments: 'none'
  }
})
