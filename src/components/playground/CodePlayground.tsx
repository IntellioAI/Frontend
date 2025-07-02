import { useState, useEffect, useRef, useCallback } from 'react';
import type { editor } from 'monaco-editor';

// Import components
import PlaygroundHeader from './PlaygroundHeader';
import EditorPane from './EditorPane';
import PreviewPane from './PreviewPane';
import ConsoleOutput from './ConsoleOutput';

interface CodePlaygroundProps {
  isMobileDevice?: boolean;
}

export default function CodePlayground({ 
  isMobileDevice = false
}: CodePlaygroundProps) {
  // State management
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  // Code states
  const [htmlCode, setHtmlCode] = useState(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My App</title>
</head>
<body>
    <div class="container">
        <h1>Welcome to Code Playground</h1>
        <p>Start building your web application here.</p>
        <button onclick="greet()">Click me</button>
    </div>
</body>
</html>`);

  const [cssCode, setCssCode] = useState(`* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f8fafc;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    text-align: center;
}

h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: #1e293b;
}

p {
    font-size: 1.1rem;
    margin-bottom: 2rem;
    color: #64748b;
}

button {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
}

button:hover {
    background: #2563eb;
}`);

  const [jsCode, setJsCode] = useState(`function greet() {
    console.log('Hello from the playground!');
    alert('Welcome to Code Playground!');
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded successfully');
});`);

  // UI States
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
  const [layout, setLayout] = useState<'split' | 'editor' | 'preview'>('split');
  const [autoRun, setAutoRun] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [livePreview, setLivePreview] = useState<string>('');
  const [showConsole, setShowConsole] = useState(false);
  
  // Resizer states - Fixed for smooth resizing
  const [isResizing, setIsResizing] = useState(false);
  const [resizeType, setResizeType] = useState<'horizontal' | 'vertical' | null>(null);
  const [editorWidth, setEditorWidth] = useState(50); // percentage
  const [consoleHeight, setConsoleHeight] = useState(200); // pixels

  // Refs
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const previewIframeRef = useRef<HTMLIFrameElement>(null);
  const playgroundRef = useRef<HTMLDivElement>(null);
  const autoRunTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resizeStartPosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const resizeStartDimensions = useRef<{ width: number; height: number }>({ width: 50, height: 200 });

  // Initialize client-side
  useEffect(() => {
    setIsClient(true);
    if (isMobileDevice) {
      setLayout('editor');
      setConsoleHeight(150);
    }
  }, [isMobileDevice]);

  // Editor handlers
  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    if (isMobileDevice) {
      editor.updateOptions({
        fontSize: 14,
        minimap: { enabled: false },
        lineNumbers: 'off',
        scrollBeyondLastLine: false
      });
    }
  };

  const setEditorValue = (value: string) => {
    switch (activeTab) {
      case 'html': setHtmlCode(value); break;
      case 'css': setCssCode(value); break;
      case 'js': setJsCode(value); break;
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value === undefined) return;
    setEditorValue(value);
  };

  // Improved resizer handlers with smooth movement
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !playgroundRef.current) return;
    
    e.preventDefault();
    
    if (resizeType === 'horizontal') {
      const rect = playgroundRef.current.getBoundingClientRect();
      const deltaX = e.clientX - resizeStartPosition.current.x;
      const containerWidth = rect.width;
      const deltaPercent = (deltaX / containerWidth) * 100;
      const newWidth = resizeStartDimensions.current.width + deltaPercent;
      
      setEditorWidth(Math.max(20, Math.min(80, newWidth)));
    } else if (resizeType === 'vertical') {
      const deltaY = resizeStartPosition.current.y - e.clientY;
      const newHeight = resizeStartDimensions.current.height + deltaY;
      
      setConsoleHeight(Math.max(120, Math.min(500, newHeight)));
    }
  }, [isResizing, resizeType]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    setResizeType(null);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    document.body.style.pointerEvents = '';
  }, []);

  const startHorizontalResize = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setResizeType('horizontal');
    setIsResizing(true);
    resizeStartPosition.current = { x: e.clientX, y: e.clientY };
    resizeStartDimensions.current = { width: editorWidth, height: consoleHeight };
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    document.body.style.pointerEvents = 'none';
  };

  const startVerticalResize = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setResizeType('vertical');
    setIsResizing(true);
    resizeStartPosition.current = { x: e.clientX, y: e.clientY };
    resizeStartDimensions.current = { width: editorWidth, height: consoleHeight };
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';
    document.body.style.pointerEvents = 'none';
  };

  // Add global event listeners for resizing
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove, { passive: false });
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  // Code execution
  const generateLivePreview = useCallback(() => {
    const combinedCode = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Preview</title>
        <style>
            /* Custom minimalistic scrollbar */
            ::-webkit-scrollbar {
              width: 6px;
              height: 6px;
            }
            
            ::-webkit-scrollbar-track {
              background: transparent;
            }
            
            ::-webkit-scrollbar-thumb {
              background-color: #cbd5e1;
              border-radius: 3px;
            }
            
            ::-webkit-scrollbar-thumb:hover {
              background-color: #94a3b8;
            }
            
            ::-webkit-scrollbar-corner {
              background: transparent;
            }
            
            /* Firefox scrollbar */
            * {
              scrollbar-width: thin;
              scrollbar-color: #cbd5e1 transparent;
            }
            
            ${cssCode}
        </style>
    </head>
    <body>
        ${htmlCode.replace(/<html[^>]*>|<\/html>|<head[^>]*>|<\/head>|<body[^>]*>|<\/body>/gi, '')}
        <script>
            // Override console.log to capture output
            (function() {
                const originalLog = console.log;
                const originalError = console.error;
                const originalWarn = console.warn;
                
                console.log = function(...args) {
                    originalLog.apply(console, args);
                    window.parent.postMessage({
                        type: 'console',
                        level: 'log',
                        message: args.join(' ')
                    }, '*');
                };
                
                console.error = function(...args) {
                    originalError.apply(console, args);
                    window.parent.postMessage({
                        type: 'console',
                        level: 'error',
                        message: args.join(' ')
                    }, '*');
                };
                
                console.warn = function(...args) {
                    originalWarn.apply(console, args);
                    window.parent.postMessage({
                        type: 'console',
                        level: 'warn',
                        message: args.join(' ')
                    }, '*');
                };
            })();
            
            // Error handling
            window.addEventListener('error', function(e) {
                window.parent.postMessage({
                    type: 'error',
                    message: e.message,
                    line: e.lineno,
                    filename: e.filename
                }, '*');
            });
            
            ${jsCode}
        </script>
    </body>
    </html>
    `;
    return combinedCode;
  }, [cssCode, htmlCode, jsCode]);

  // Manual run function for button clicks
  const handleManualRun = useCallback((switchToPreview = false) => {
    try {
      setError(null);
      const previewCode = generateLivePreview();
      setLivePreview(previewCode);
      setOutput("✓ Code executed successfully");
      
      if (switchToPreview && layout === 'editor') {
        setLayout('preview');
      }
    } catch (error) {
      if (error instanceof Error) {
        setOutput('');
        setError(`Error: ${error.message}`);
      } else {
        setOutput('');
        setError(`Error: ${String(error)}`);
      }
    }
  }, [generateLivePreview, layout]);

  // Auto-run function (separate from manual run)
  const handleAutoRun = useCallback(() => {
    if (!autoRun) return; // Double check autoRun state
    
    try {
      setError(null);
      const previewCode = generateLivePreview();
      setLivePreview(previewCode);
      setOutput("✓ Code executed successfully");
    } catch (error) {
      if (error instanceof Error) {
        setOutput('');
        setError(`Error: ${error.message}`);
      } else {
        setOutput('');
        setError(`Error: ${String(error)}`);
      }
    }
  }, [generateLivePreview, autoRun]);

  // Wrapper function for the run button that switches layout
  const handleRunButtonClick = useCallback(() => {
    handleManualRun(true); // Pass true to switch to preview if in editor mode
  }, [handleManualRun]);

  // Refresh function that resets the entire playground
  const handleRefresh = useCallback(() => {
    // Clear console
    setOutput('');
    setError(null);
    
    // Reset to default code
    const defaultHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My App</title>
</head>
<body>
    <div class="container">
        <h1>Welcome to Code Playground</h1>
        <p>Start building your web application here.</p>
        <button onclick="greet()">Click me</button>
    </div>
</body>
</html>`;

    const defaultCss = `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f8fafc;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    text-align: center;
}

h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: #1e293b;
}

p {
    font-size: 1.1rem;
    margin-bottom: 2rem;
    color: #64748b;
}

button {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
}

button:hover {
    background: #2563eb;
}`;

    const defaultJs = `function greet() {
    console.log('Hello from the playground!');
    alert('Welcome to Code Playground!');
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded successfully');
});`;

    // Reset all code states
    setHtmlCode(defaultHtml);
    setCssCode(defaultCss);
    setJsCode(defaultJs);
    
    // Reset UI states
    setActiveTab('html');
    setLayout('split');
    setShowConsole(false);
    
    // Reset dimensions
    setEditorWidth(50);
    setConsoleHeight(200);
    
    // Clear preview and regenerate
    setLivePreview('');
    setTimeout(() => {
      handleManualRun(false);
      setOutput("✓ Playground refreshed successfully");
    }, 100);
  }, [handleManualRun]);

  // Listen for console messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'console') {
        const prefix = event.data.level === 'error' ? '❌' : 
                     event.data.level === 'warn' ? '⚠️' : '>';
        setOutput(prev => prev + (prev ? '\n' : '') + `${prefix} ${event.data.message}`);
      } else if (event.data.type === 'error') {
        const errorMsg = event.data.line ? 
          `Line ${event.data.line}: ${event.data.message}` : 
          event.data.message;
        setError(errorMsg);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Run code on initial load ONLY
  useEffect(() => {
    if (isClient) {
      // Initial load - run once
      try {
        setError(null);
        const previewCode = generateLivePreview();
        setLivePreview(previewCode);
        setOutput("✓ Code executed successfully");
      } catch (error) {
        if (error instanceof Error) {
          setOutput('');
          setError(`Error: ${error.message}`);
        }
      }
    }
  }, [isClient, generateLivePreview]); // Only dependencies needed for initial load

  // Auto-run functionality - COMPLETELY SEPARATED
  useEffect(() => {
    // Skip entirely if autoRun is disabled
    if (!autoRun || !isClient) {
      return;
    }

    // Clear any existing timeout
    if (autoRunTimeoutRef.current) {
      clearTimeout(autoRunTimeoutRef.current);
      autoRunTimeoutRef.current = null;
    }

    // Set debounced auto-run
    autoRunTimeoutRef.current = setTimeout(() => {
      handleAutoRun();
    }, 300);

    // Cleanup function
    return () => {
      if (autoRunTimeoutRef.current) {
        clearTimeout(autoRunTimeoutRef.current);
        autoRunTimeoutRef.current = null;
      }
    };
  }, [autoRun, isClient, htmlCode, cssCode, jsCode, handleAutoRun]); // All dependencies included

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (autoRunTimeoutRef.current) {
        clearTimeout(autoRunTimeoutRef.current);
      }
    };
  }, []);

  // Loading state
  if (!isClient) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading playground...</p>
        </div>
      </div>
    );
  }

  const mainContentHeight = showConsole ? `calc(100vh - 80px - ${consoleHeight}px)` : 'calc(100vh - 80px)';

  return (
    <div ref={playgroundRef} className="h-screen bg-gray-50 flex flex-col select-none">
      <style>{`
        /* Universal minimalistic scrollbar design */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        
        ::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background-color: #94a3b8;
        }
        
        ::-webkit-scrollbar-corner {
          background: transparent;
        }
        
        /* Firefox scrollbar */
        * {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }
      `}</style>
      
      <PlaygroundHeader 
        autoRun={autoRun}
        setAutoRun={setAutoRun}
        layout={layout}
        setLayout={setLayout}
        showConsole={showConsole}
        setShowConsole={setShowConsole}
      />

      <div className="flex-1 flex overflow-hidden" style={{ height: mainContentHeight }}>
        {(layout === 'editor' || layout === 'split') && (
          <EditorPane 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            htmlCode={htmlCode}
            cssCode={cssCode}
            jsCode={jsCode}
            runCode={handleRunButtonClick}
            autoRun={autoRun}
            layout={layout}
            handleEditorDidMount={handleEditorDidMount}
            handleEditorChange={handleEditorChange}
            width={layout === 'split' ? `${editorWidth}%` : '100%'}
          />
        )}

        {layout === 'split' && (
          <div
            className="w-1 bg-gray-300 hover:bg-blue-500 cursor-col-resize transition-colors flex-shrink-0 active:bg-blue-600"
            onMouseDown={startHorizontalResize}
            style={{ 
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none'
            }}
          />
        )}

        {(layout === 'preview' || layout === 'split') && (
          <PreviewPane 
            layout={layout}
            runCode={handleRefresh}
            livePreview={livePreview}
            previewIframeRef={previewIframeRef}
            width={layout === 'split' ? `${100 - editorWidth}%` : '100%'}
          />
        )}
      </div>

      {/* Console resize handle */}
      {showConsole && (
        <div
          className="h-1 bg-gray-300 hover:bg-blue-500 cursor-row-resize transition-colors flex-shrink-0 active:bg-blue-600"
          onMouseDown={startVerticalResize}
          style={{ 
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none'
          }}
        />
      )}

      {/* Console */}
      {showConsole && (
        <ConsoleOutput 
          output={output}
          error={error}
          setOutput={setOutput}
          setError={setError}
          outputRef={outputRef}
          height={consoleHeight}
        />
      )}
    </div>
  );
}