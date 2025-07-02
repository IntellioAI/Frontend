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

  // Refs
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const previewIframeRef = useRef<HTMLIFrameElement>(null);

  // Initialize client-side
  useEffect(() => {
    setIsClient(true);
    if (isMobileDevice) {
      setLayout('editor');
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
    if (autoRun) {
      runCode();
    }
  };

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
                console.log = function(...args) {
                    originalLog.apply(console, args);
                    window.parent.postMessage({
                        type: 'console',
                        message: args.join(' ')
                    }, '*');
                };
            })();
            
            // Error handling
            window.addEventListener('error', function(e) {
                window.parent.postMessage({
                    type: 'error',
                    message: e.message
                }, '*');
            });
            
            ${jsCode}
        </script>
    </body>
    </html>
    `;
    return combinedCode;
  }, [cssCode, htmlCode, jsCode]);

  const runCode = useCallback(async () => {
    try {
      setError(null);
      const previewCode = generateLivePreview();
      setLivePreview(previewCode);
      setOutput("Code executed successfully");
    } catch (error) {
      if (error instanceof Error) {
        setOutput('');
        setError(`Error: ${error.message}`);
      } else {
        setOutput('');
        setError(`Error: ${String(error)}`);
      }
    }
  }, [generateLivePreview]);

  // Listen for console messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'console') {
        setOutput(prev => prev + '\n> ' + event.data.message);
      } else if (event.data.type === 'error') {
        setError(event.data.message);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Run code on initial load
  useEffect(() => {
    if (isClient) {
      runCode();
    }
  }, [isClient, runCode]);

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

  return (
    <div className="h-screen bg-white flex flex-col">
      <PlaygroundHeader 
        autoRun={autoRun}
        setAutoRun={setAutoRun}
        layout={layout}
        setLayout={setLayout}
      />

      <div className="flex-1 flex overflow-hidden">
        {(layout === 'editor' || layout === 'split') && (
          <EditorPane 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            htmlCode={htmlCode}
            cssCode={cssCode}
            jsCode={jsCode}
            runCode={runCode}
            layout={layout}
            handleEditorDidMount={handleEditorDidMount}
            handleEditorChange={handleEditorChange}
          />
        )}

        {(layout === 'preview' || layout === 'split') && (
          <div className="flex flex-col flex-1">
            <PreviewPane 
              layout={layout}
              runCode={runCode}
              livePreview={livePreview}
              previewIframeRef={previewIframeRef}
            />
            <ConsoleOutput 
              output={output}
              error={error}
              setOutput={setOutput}
              setError={setError}
              outputRef={outputRef}
            />
          </div>
        )}
      </div>
    </div>
  );
}