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
  const [showConsole, setShowConsole] = useState(true);
  
  // Resizer states
  const [isResizing, setIsResizing] = useState(false);
  const [resizeType, setResizeType] = useState<'horizontal' | 'vertical' | null>(null);
  const [editorWidth, setEditorWidth] = useState(50); // percentage
  const [consoleHeight, setConsoleHeight] = useState(200); // pixels

  // Refs
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const previewIframeRef = useRef<HTMLIFrameElement>(null);
  const playgroundRef = useRef<HTMLDivElement>(null);

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
    // Auto-run is now handled in useEffect with debouncing
  };

  // Resizer handlers
  const handleHorizontalResize = useCallback((e: MouseEvent) => {
    if (resizeType !== 'horizontal' || !playgroundRef.current) return;
    
    const rect = playgroundRef.current.getBoundingClientRect();
    const newWidth = ((e.clientX - rect.left) / rect.width) * 100;
    setEditorWidth(Math.max(25, Math.min(75, newWidth)));
  }, [resizeType]);

  const handleVerticalResize = useCallback((e: MouseEvent) => {
    if (resizeType !== 'vertical' || !playgroundRef.current) return;
    
    const rect = playgroundRef.current.getBoundingClientRect();
    const headerHeight = 80;
    const availableHeight = rect.height - headerHeight;
    const newHeight = availableHeight - (e.clientY - rect.top - headerHeight);
    setConsoleHeight(Math.max(120, Math.min(500, newHeight)));
  }, [resizeType]);

  const startHorizontalResize = () => {
    setResizeType('horizontal');
    setIsResizing(true);
  };

  const startVerticalResize = () => {
    setResizeType('vertical');
    setIsResizing(true);
  };

  const stopResize = useCallback(() => {
    setIsResizing(false);
    setResizeType(null);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  useEffect(() => {
    if (isResizing && resizeType) {
      const handleMouseMove = resizeType === 'horizontal' ? handleHorizontalResize : handleVerticalResize;
      const cursor = resizeType === 'horizontal' ? 'col-resize' : 'row-resize';
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', stopResize);
      document.body.style.cursor = cursor;
      document.body.style.userSelect = 'none';

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', stopResize);
      };
    }
  }, [isResizing, resizeType, handleHorizontalResize, handleVerticalResize, stopResize]);

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

  const runCode = useCallback(async (switchToPreview = false) => {
    try {
      setError(null);
      const previewCode = generateLivePreview();
      setLivePreview(previewCode);
      setOutput("✓ Code executed successfully");
      
      // Only switch to preview when explicitly requested (from run button)
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
  }, [generateLivePreview, layout, setLayout]);

  // Wrapper function for the run button that switches layout
  const handleRunButtonClick = useCallback(() => {
    runCode(true); // Pass true to switch to preview if in editor mode
  }, [runCode]);

  // Regular run function that doesn't switch layout (for auto-run and refresh)
  const handleRefresh = useCallback(() => {
    runCode(false); // Pass false to not switch layout
  }, [runCode]);

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

  // Run code on initial load and when autoRun is enabled
  useEffect(() => {
    if (isClient) {
      runCode(false); // Don't switch layout on initial load
    }
  }, [isClient, runCode]);

  // Auto-run when code changes and autoRun is enabled
  useEffect(() => {
    if (autoRun && isClient) {
      const timeoutId = setTimeout(() => {
        runCode(false); // Don't switch layout for auto-run
      }, 500); // Debounce auto-run

      return () => clearTimeout(timeoutId);
    }
  }, [htmlCode, cssCode, jsCode, autoRun, isClient, runCode]);

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
    <div ref={playgroundRef} className="h-screen bg-gray-50 flex flex-col">
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
            layout={layout}
            handleEditorDidMount={handleEditorDidMount}
            handleEditorChange={handleEditorChange}
            width={layout === 'split' ? `${editorWidth}%` : '100%'}
          />
        )}

        {layout === 'split' && (
          <div
            className="w-1 bg-gray-300 hover:bg-blue-500 cursor-col-resize transition-colors flex-shrink-0"
            onMouseDown={startHorizontalResize}
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
          className="h-1 bg-gray-300 hover:bg-blue-500 cursor-row-resize transition-colors flex-shrink-0"
          onMouseDown={startVerticalResize}
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