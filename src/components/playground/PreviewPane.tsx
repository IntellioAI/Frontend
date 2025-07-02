import React, { useState } from 'react';

interface PreviewPaneProps {
  layout: 'split' | 'editor' | 'preview';
  runCode: () => void;
  livePreview: string;
  previewIframeRef: React.RefObject<HTMLIFrameElement>;
  width: string;
}

const PreviewPane: React.FC<PreviewPaneProps> = ({
  layout,
  runCode,
  livePreview,
  previewIframeRef,
  width
}) => {
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const deviceSpecs = {
    desktop: { 
      width: '100%', 
      height: '100%', 
      label: 'Desktop',
      resolution: 'Full Width'
    },
    tablet: { 
      width: '768px', 
      height: '600px', 
      label: 'Tablet',
      resolution: '768 × 600'
    },
    mobile: { 
      width: '375px', 
      height: '600px', 
      label: 'Mobile',
      resolution: '375 × 600'
    }
  };

  const currentDevice = deviceSpecs[previewMode];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    // Add a small delay to show the refresh animation
    setTimeout(() => {
      runCode();
      setIsRefreshing(false);
    }, 500);
  };

  const getPreviewContainerStyles = () => {
    if (previewMode === 'desktop') {
      return { 
        width: '100%', 
        height: '100%',
        display: 'flex',
        alignItems: 'stretch'
      };
    }
    
    // Calculate available space for responsive design
    const containerPadding = 40;
    const availableWidth = `calc(100% - ${containerPadding}px)`;
    const availableHeight = `calc(100% - ${containerPadding}px)`;
    
    return {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '400px'
    };
  };

  const getIframeStyles = () => {
    if (previewMode === 'desktop') {
      return { 
        width: '100%', 
        height: '100%',
        border: 'none',
        background: 'white'
      };
    }
    
    // Responsive scaling for tablet and mobile
    const baseStyles = {
      border: 'none',
      borderRadius: '12px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
      background: 'white',
      transformOrigin: 'center center'
    };
    
    if (previewMode === 'tablet') {
      return {
        ...baseStyles,
        width: '768px',
        height: '600px', // Reduced height for better fit
        maxWidth: '90%',
        maxHeight: '90%'
      };
    }
    
    // mobile
    return {
      ...baseStyles,
      width: '375px',
      height: '600px', // Adjusted for better mobile preview
      maxWidth: '90%',
      maxHeight: '90%'
    };
  };

  return (
    <div 
      className="flex flex-col bg-white shadow-sm"
      style={{ width }}
    >
      {/* Preview header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-700">Preview</span>
          </div>
          
          <div className="text-xs text-gray-500">
            {currentDevice.resolution}
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Device selector */}
          <div className="flex items-center bg-white border border-gray-200 rounded-lg shadow-sm">
            {Object.entries(deviceSpecs).map(([key, device]) => (
              <button
                key={key}
                onClick={() => setPreviewMode(key as 'desktop' | 'tablet' | 'mobile')}
                className={`p-2 first:rounded-l-lg last:rounded-r-lg transition-all duration-200 ${
                  previewMode === key 
                    ? 'text-blue-600 bg-blue-50 shadow-sm' 
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }`}
                title={`${device.label} (${device.resolution})`}
              >
                {key === 'desktop' && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                )}
                {key === 'tablet' && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                )}
                {key === 'mobile' && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v16a1 1 0 001 1z" />
                  </svg>
                )}
              </button>
            ))}
          </div>
          
          <div className="w-px h-4 bg-gray-300"></div>
          
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`p-2 rounded-md transition-colors duration-200 ${
              isRefreshing 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 border border-gray-200'
            }`}
            title="Refresh preview"
          >
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Preview content */}
      <div className="flex-1 overflow-hidden">
        <div style={getPreviewContainerStyles()}>
          <iframe
            ref={previewIframeRef}
            style={getIframeStyles()}
            title="Preview"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            srcDoc={livePreview}
            key={livePreview} // Force re-render when content changes
          />
        </div>
      </div>
      
      {/* Custom scrollbar styles for iframe content */}
      <style>{`
        iframe {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }
        
        iframe::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        iframe::-webkit-scrollbar-track {
          background: transparent;
        }
        
        iframe::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 3px;
        }
        
        iframe::-webkit-scrollbar-thumb:hover {
          background-color: #94a3b8;
        }
        
        iframe::-webkit-scrollbar-corner {
          background: transparent;
        }
      `}</style>
      
      {/* Preview status bar */}
      <div className="bg-gray-50 border-t border-gray-200 px-4 py-1 text-xs text-gray-500 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span>Mode: {currentDevice.label}</span>
          <span>Viewport: {currentDevice.resolution}</span>
          {previewMode !== 'desktop' && (
            <span className="text-green-600">● Responsive</span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span>{isRefreshing ? 'Refreshing' : 'Ready'}</span>
          <div className={`w-2 h-2 rounded-full ${isRefreshing ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPane;