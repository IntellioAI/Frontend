import React from 'react';

interface ConsoleOutputProps {
  output: string;
  error: string | null;
  setOutput: (output: string) => void;
  setError: (error: string | null) => void;
  outputRef: React.RefObject<HTMLDivElement>;
  height: number;
}

const ConsoleOutput: React.FC<ConsoleOutputProps> = ({
  output,
  error,
  setOutput,
  setError,
  outputRef,
  height
}) => {
  const clearConsole = () => {
    setOutput('');
    setError(null);
  };

  const hasContent = output || error;

  return (
    <div 
      className="bg-white border-t border-gray-200 flex flex-col shadow-sm"
      style={{ height: `${height}px` }}
    >
      {/* Console header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-700">Console</span>
          </div>
          
          {hasContent && (
            <div className="text-xs text-gray-500">
              {output.split('\n').length} {output.split('\n').length === 1 ? 'line' : 'lines'}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {hasContent && (
            <button
              onClick={clearConsole}
              className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Clear</span>
            </button>
          )}
          
          <div className="w-px h-4 bg-gray-300"></div>
        </div>
      </div>
      
      {/* Console content */}
      <div className="flex-1 overflow-hidden">
        <div 
          ref={outputRef} 
          className="font-mono text-xs leading-relaxed h-full overflow-y-auto"
        >
          {error && (
            <div className="flex items-start space-x-2 px-4 py-2 bg-red-50 border-l-4 border-red-400 text-red-700">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <div className="font-medium text-red-800">Error</div>
                <div className="mt-1">{error}</div>
              </div>
            </div>
          )}
          
          {output && (
            <div className="p-4 space-y-1">
              {output.split('\n').map((line, index) => {
                const isError = line.startsWith('❌');
                const isWarning = line.startsWith('⚠️');
                const isSuccess = line.startsWith('✓');
                
                return (
                  <div 
                    key={index} 
                    className={`flex items-start space-x-2 py-1 ${
                      isError ? 'text-red-600' : 
                      isWarning ? 'text-yellow-600' : 
                      isSuccess ? 'text-green-600' : 
                      'text-gray-700'
                    }`}
                  >
                    <span className="text-gray-400 text-xs mt-0.5 font-medium min-w-[2rem]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="flex-1 break-all">
                      {line || '\u00A0'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
          
          {!output && !error && (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8">
              <svg className="w-8 h-8 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <div className="text-sm font-medium">Console Output</div>
              <div className="text-xs text-center mt-1 max-w-xs">
                Run your code to see console logs, errors, and warnings here
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsoleOutput;