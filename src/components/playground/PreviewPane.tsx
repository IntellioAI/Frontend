import React, { useState } from 'react';

interface PreviewPaneProps {
  layout: 'split' | 'editor' | 'preview';
  runCode: () => void;
  livePreview: string;
  previewIframeRef: React.RefObject<HTMLIFrameElement>;
}

const PreviewPane: React.FC<PreviewPaneProps> = ({
  layout,
  runCode,
  livePreview,
  previewIframeRef
}) => {
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const getPreviewStyles = () => {
    switch (previewMode) {
      case 'mobile':
        return { width: '375px', height: '667px', margin: '20px auto' };
      case 'tablet':
        return { width: '768px', height: '1024px', margin: '20px auto' };
      default:
        return { width: '100%', height: '100%' };
    }
  };

  return (
    <div className={`${layout === 'split' ? 'w-1/2' : 'w-full'} flex flex-col bg-white`}>
      {/* Preview header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Preview</span>
          
          {/* Device selector */}
          <div className="flex items-center bg-white border border-gray-200 rounded-md">
            <button
              onClick={() => setPreviewMode('desktop')}
              className={`p-2 ${previewMode === 'desktop' ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-gray-600'}`}
              title="Desktop view"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </button>
            <button
              onClick={() => setPreviewMode('tablet')}
              className={`p-2 border-l border-r border-gray-200 ${previewMode === 'tablet' ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-gray-600'}`}
              title="Tablet view"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </button>
            <button
              onClick={() => setPreviewMode('mobile')}
              className={`p-2 ${previewMode === 'mobile' ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-gray-600'}`}
              title="Mobile view"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v16a1 1 0 001 1z" />
              </svg>
            </button>
          </div>
        </div>
        
        <button
          onClick={runCode}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          title="Refresh"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
      
      {/* Preview content */}
      <div className="flex-1 overflow-auto bg-gray-100">
        <div style={getPreviewStyles()}>
          <iframe
            ref={previewIframeRef}
            className={`border-0 bg-white ${previewMode !== 'desktop' ? 'rounded-lg shadow-lg' : ''}`}
            style={{ width: '100%', height: '100%' }}
            title="Preview"
            sandbox="allow-scripts allow-same-origin"
            srcDoc={livePreview}
          />
        </div>
      </div>
    </div>
  );
};

export default PreviewPane; 