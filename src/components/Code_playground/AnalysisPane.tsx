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
        icon: '✨',
        title: 'Code Execution',
        loadingText: 'Executing code...'
      },
      debug: {
        color: 'text-rose-600',
        icon: '🐛',
        title: 'Debug Analysis',
        loadingText: 'Finding issues...'
      },
      optimize: {
        color: 'text-amber-600',
        icon: '⚡',
        title: 'Optimization',
        loadingText: 'Optimizing code...'
      },
      analyze: {
        color: 'text-blue-600',
        icon: '📊',
        title: 'Analysis',
        loadingText: 'Analyzing code...'
      }
    };
    return configs[type] || configs.analyze;
  };

  const config = getTypeConfig(analysisType);

  return (
    <div className="flex flex-col bg-white border border-slate-200 rounded-lg" style={{ width }}>
      {/* Clean header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <span className="text-lg">{config.icon}</span>
          <span className="text-sm font-medium text-slate-800">{config.title}</span>
        </div>
        <div className="text-xs text-slate-500 font-medium">AI</div>
      </div>
      
      {/* Content area */}
      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-600 rounded-full animate-spin mx-auto mb-4"></div>
              <div className="text-sm text-slate-600">{config.loadingText}</div>
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
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                
                <div className="text-base font-medium text-slate-800 mb-2">Ready to analyze</div>
                <div className="text-sm text-slate-500 mb-6 max-w-xs">
                  Use AI tools to run, debug, optimize, or analyze your code.
                </div>
                
                {/* Simple feature list */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center space-x-2 text-slate-600">
                    <span>✨</span>
                    <span>Execute</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-600">
                    <span>🐛</span>
                    <span>Debug</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-600">
                    <span>⚡</span>
                    <span>Optimize</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-600">
                    <span>📊</span>
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