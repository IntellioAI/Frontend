import React from 'react';

interface ConsoleOutputProps {
  output: string;
  error: string | null;
  setOutput: (output: string) => void;
  setError: (error: string | null) => void;
  outputRef: React.RefObject<HTMLDivElement>;
}

const ConsoleOutput: React.FC<ConsoleOutputProps> = ({
  output,
  error,
  setOutput,
  setError,
  outputRef
}) => {
  const clearConsole = () => {
    setOutput('');
    setError(null);
  };

  const hasContent = output || error;

  return (
    <div className="h-32 bg-gray-900 border-t border-gray-200 flex flex-col">
      {/* Console header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <span className="text-sm font-medium text-gray-300">Console</span>
        
        {hasContent && (
          <button
            onClick={clearConsole}
            className="text-xs text-gray-400 hover:text-gray-200 transition-colors"
          >
            Clear
          </button>
        )}
      </div>
      
      {/* Console content */}
      <div className="flex-1 overflow-y-auto p-3">
        <div ref={outputRef} className="font-mono text-xs space-y-1">
          {error ? (
            <div className="text-red-400">
              {error}
            </div>
          ) : (
            output && (
              <div className="text-green-400">
                {output.split('\n').map((line, index) => (
                  <div key={index}>
                    {line || '\u00A0'}
                  </div>
                ))}
              </div>
            )
          )}
          
          {!output && !error && (
            <div className="text-gray-500 text-center py-4">
              Console output will appear here
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsoleOutput;