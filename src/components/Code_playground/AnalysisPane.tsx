import React from 'react';

interface AnalysisPaneProps {
  analysisType: 'output' | 'debug' | 'optimize' | 'analyze';
  analysisResult: string;
  isLoading: boolean;
  width: string;
}

const AnalysisPane: React.FC<AnalysisPaneProps> = ({
  analysisType,
  analysisResult,
  isLoading,
  width
}) => {
  const getTypeConfig = (type: 'output' | 'debug' | 'optimize' | 'analyze') => {
    const configs = {
      output: {
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h1m4 0h1M9 6h6a2 2 0 012 2v8a2 2 0 01-2 2H9a2 2 0 01-2-2V8a2 2 0 012-2z" />
          </svg>
        ),
        title: 'Code Execution',
        loadingText: 'Executing code...'
      },
      debug: {
        color: 'text-rose-600',
        bgColor: 'bg-rose-50',
        borderColor: 'border-rose-200',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        ),
        title: 'Debug Analysis',
        loadingText: 'Finding issues...'
      },
      optimize: {
        color: 'text-amber-600',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        ),
        title: 'Code Optimization',
        loadingText: 'Optimizing code...'
      },
      analyze: {
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        ),
        title: 'Code Analysis',
        loadingText: 'Analyzing code...'
      }
    };
    return configs[type] || configs.analyze;
  };

  const config = getTypeConfig(analysisType);

  return (
    <div className="flex flex-col bg-white shadow-sm" style={{ width }}>
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 border-b border-gray-200 ${config.bgColor}`}>
        <div className="flex items-center space-x-3">
          <div className={`${config.color}`}>
            {config.icon}
          </div>
          <span className="text-sm font-medium text-gray-800">{config.title}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-xs text-gray-500 font-medium bg-white px-2 py-1 rounded border">AI</div>
        </div>
      </div>
      
      {/* Content area */}
      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <div className="text-center">
              <div className={`w-8 h-8 border-2 border-gray-200 border-t-current rounded-full animate-spin mx-auto mb-4 ${config.color}`}></div>
              <div className="text-sm text-gray-600">{config.loadingText}</div>
            </div>
          </div>
        ) : (
          <div className="h-full overflow-y-auto">
            {analysisResult ? (
              <div className="p-4">
                <div 
                  className="ai-response-container"
                  dangerouslySetInnerHTML={{ __html: analysisResult }}
                  style={{
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    lineHeight: '1.6'
                  }}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className={`w-16 h-16 ${config.bgColor} ${config.borderColor} border-2 rounded-xl flex items-center justify-center mb-4`}>
                  <div className={config.color}>
                    {config.icon}
                  </div>
                </div>
                
                <div className="text-base font-medium text-gray-800 mb-2">Ready for AI Analysis</div>
                <div className="text-sm text-gray-500 mb-6 max-w-xs">
                  Use AI tools to run, debug, optimize, or analyze your programming code with intelligent assistance.
                </div>
                
                {/* Feature grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center space-x-2 text-gray-600 bg-gray-50 px-3 py-2 rounded-md">
                    <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h1m4 0h1M9 6h6a2 2 0 012 2v8a2 2 0 01-2 2H9a2 2 0 01-2-2V8a2 2 0 012-2z" />
                    </svg>
                    <span>Execute</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600 bg-gray-50 px-3 py-2 rounded-md">
                    <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span>Debug</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600 bg-gray-50 px-3 py-2 rounded-md">
                    <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Optimize</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600 bg-gray-50 px-3 py-2 rounded-md">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span>Analyze</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisPane;