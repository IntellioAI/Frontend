import React from 'react';

interface PlaygroundHeaderProps {
  autoRun: boolean;
  setAutoRun: (value: boolean) => void;
  layout: 'split' | 'editor' | 'preview';
  setLayout: (layout: 'split' | 'editor' | 'preview') => void;
  showConsole: boolean;
  setShowConsole: (value: boolean) => void;

}

const PlaygroundHeader: React.FC<PlaygroundHeaderProps> = ({
  autoRun,
  setAutoRun,
  layout,
  setLayout,
  showConsole,
  setShowConsole,
}) => {
  

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Code Playground</h1>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="autoRun"
                checked={autoRun}
                onChange={() => setAutoRun(!autoRun)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label htmlFor="autoRun" className="text-sm text-gray-700 font-medium">
                Auto-run
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowConsole(!showConsole)}
                className={`flex items-center space-x-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                  showConsole 
                    ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span>Console</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center bg-gray-100 rounded-lg p-1 shadow-sm">
          <button
            onClick={() => setLayout('editor')}
            className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              layout === 'editor' 
                ? 'bg-white text-gray-900 shadow-sm border border-gray-200' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            <span>Code</span>
          </button>
          <button
            onClick={() => setLayout('split')}
            className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              layout === 'split' 
                ? 'bg-white text-gray-900 shadow-sm border border-gray-200' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
            <span>Split</span>
          </button>
          <button
            onClick={() => setLayout('preview')}
            className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              layout === 'preview' 
                ? 'bg-white text-gray-900 shadow-sm border border-gray-200' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>Preview</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default PlaygroundHeader;