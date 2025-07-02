import React from 'react';

interface PlaygroundHeaderProps {
  autoRun: boolean;
  setAutoRun: (value: boolean) => void;
  layout: 'split' | 'editor' | 'preview';
  setLayout: (layout: 'split' | 'editor' | 'preview') => void;
}

const PlaygroundHeader: React.FC<PlaygroundHeaderProps> = ({
  autoRun,
  setAutoRun,
  layout,
  setLayout
}) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Playground</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="autoRun"
              checked={autoRun}
              onChange={() => setAutoRun(!autoRun)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="autoRun" className="text-sm text-gray-700">
              Auto-run
            </label>
          </div>
        </div>

        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setLayout('editor')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${layout === 'editor' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'}`}
          >
            Code
          </button>
          <button
            onClick={() => setLayout('split')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${layout === 'split' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'}`}
          >
            Split
          </button>
          <button
            onClick={() => setLayout('preview')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${layout === 'preview' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'}`}
          >
            Preview
          </button>
        </div>
      </div>
    </header>
  );
};

export default PlaygroundHeader;