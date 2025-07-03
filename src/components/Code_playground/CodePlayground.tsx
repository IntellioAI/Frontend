import { useState, useRef, useEffect, useCallback } from 'react';
import { Check, AlertTriangle, Terminal } from 'lucide-react';
import Editor from '@monaco-editor/react';
import type { editor } from 'monaco-editor';

// Import components
import PlaygroundHeader from './PlaygroundHeader';
import EditorPane from './EditorPane';
import ConsoleOutput from './ConsoleOutput';

// Use environment variable for API key
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

interface CodePlaygroundProps {
  isMobileDevice?: boolean;
}

export default function CodePlayground({ 
  isMobileDevice = false 
}: CodePlaygroundProps) {
  // Code states for programming languages only
  const [pythonCode, setPythonCode] = useState('# Python code\nprint("Hello World!")');
  const [cCode, setCCode] = useState('// C code\n#include <stdio.h>\n\nint main() {\n    printf("Hello World!\\n");\n    return 0;\n}');
  const [javaCode, setJavaCode] = useState('// Java code\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello World!");\n    }\n}');
  
  const [activeTab, setActiveTab] = useState('python');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [layout, setLayout] = useState<'split' | 'editor' | 'preview'>('editor');
  const [autoRun, setAutoRun] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [showInputPanel, setShowInputPanel] = useState(false);
  const [showConsole, setShowConsole] = useState(true);
  const [isClient, setIsClient] = useState(false);
  
  // Analysis states - for split view
  const [analysisType, setAnalysisType] = useState<'output' | 'debug' | 'optimize' | 'analyze'>('output');
  const [analysisResult, setAnalysisResult] = useState('');
  
  // Enhanced optimization states
  const [optimizedCode, setOptimizedCode] = useState('');
  const [showOptimizedCode, setShowOptimizedCode] = useState(false);
  const [originalCodeBeforeOptimization, setOriginalCodeBeforeOptimization] = useState('');
  const [optimizationView, setOptimizationView] = useState<'code' | 'analysis'>('code');
  const [optimizationAnalysis, setOptimizationAnalysis] = useState('');
  
  // Enhanced debugging states
  const [debuggingData, setDebuggingData] = useState({
    fixedCode: '',
    analysis: '',
    showFixedCode: false,
    originalCodeBeforeDebugging: '',
    debugView: 'analysis' as 'analysis' | 'code'
  });

  // Notification states
  const [showChangeNotification, setShowChangeNotification] = useState(false);
  const [changeNotificationType, setChangeNotificationType] = useState<'success' | 'error' | 'warning' | 'info'>('success');
  const [changeNotificationMessage, setChangeNotificationMessage] = useState('');

  // Resizer states
  const [isResizing, setIsResizing] = useState(false);
  const [resizeType, setResizeType] = useState<'horizontal' | 'vertical' | 'playground' | null>(null);
  const [editorWidth, setEditorWidth] = useState(50);
  const [consoleHeight, setConsoleHeight] = useState(200);
  const [playgroundHeight, setPlaygroundHeight] = useState(650);
  
  // Refs
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const optimizedEditorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const fixedCodeEditorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const playgroundRef = useRef<HTMLDivElement>(null);
  const resizeStartPosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const resizeStartDimensions = useRef<{ width: number; height: number; playgroundHeight: number }>({ 
    width: 50, 
    height: 200, 
    playgroundHeight: 650
  });

  // Initialize client-side
  useEffect(() => {
    setIsClient(true);
    console.log("API Key value:", GEMINI_API_KEY);
    if (!GEMINI_API_KEY) {
      setOutput('Warning: Gemini API key not found in environment variables. Please add VITE_GEMINI_API_KEY to your .env file.');
    }
    
    if (isMobileDevice) {
      setLayout('editor');
      setConsoleHeight(150);
      setPlaygroundHeight(600);
    }
  }, [isMobileDevice]);

  // Handle notification auto-hide
  useEffect(() => {
    if (showChangeNotification) {
      const timer = setTimeout(() => {
        setShowChangeNotification(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showChangeNotification]);
  
  // Handle category change - removed since we only have programming languages
  useEffect(() => {
    if (!['python', 'c', 'java'].includes(activeTab)) {
      setActiveTab('python');
    }
  }, [activeTab]);

  // Editor helper functions - programming languages only
  const getEditorLanguage = () => {
    switch (activeTab) {
      case 'python': return 'python';
      case 'c': return 'c';
      case 'java': return 'java';
      default: return 'python';
    }
  };

  const getEditorValue = () => {
    switch (activeTab) {
      case 'python': return pythonCode;
      case 'c': return cCode;
      case 'java': return javaCode;
      default: return pythonCode;
    }
  };

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

  const handleOptimizedEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
    optimizedEditorRef.current = editor;
  };

  const handleFixedCodeEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
    fixedCodeEditorRef.current = editor;
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value === undefined) return;
    
    switch (activeTab) {
      case 'python':
        setPythonCode(value);
        break;
      case 'c':
        setCCode(value);
        break;
      case 'java':
        setJavaCode(value);
        break;
    }
    
    if (autoRun) {
      runCode();
    }
  };

  // Enhanced resizer handlers
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !playgroundRef.current) return;
    
    e.preventDefault();
    
    if (resizeType === 'horizontal') {
      const rect = playgroundRef.current.getBoundingClientRect();
      const deltaX = e.clientX - resizeStartPosition.current.x;
      const containerWidth = rect.width;
      const deltaPercent = (deltaX / containerWidth) * 100;
      const newWidth = resizeStartDimensions.current.width + deltaPercent;
      
      setEditorWidth(Math.max(35, Math.min(70, newWidth)));
    } else if (resizeType === 'vertical') {
      const deltaY = resizeStartPosition.current.y - e.clientY;
      const newHeight = resizeStartDimensions.current.height + deltaY;
      
      setConsoleHeight(Math.max(120, Math.min(500, newHeight)));
    } else if (resizeType === 'playground') {
      const deltaY = e.clientY - resizeStartPosition.current.y;
      const newHeight = resizeStartDimensions.current.playgroundHeight + deltaY;
      
      setPlaygroundHeight(Math.max(600, newHeight));
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
    resizeStartDimensions.current = { 
      width: editorWidth, 
      height: consoleHeight, 
      playgroundHeight: playgroundHeight 
    };
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
    resizeStartDimensions.current = { 
      width: editorWidth, 
      height: consoleHeight, 
      playgroundHeight: playgroundHeight 
    };
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';
    document.body.style.pointerEvents = 'none';
  };

  const startPlaygroundResize = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setResizeType('playground');
    setIsResizing(true);
    resizeStartPosition.current = { x: e.clientX, y: e.clientY };
    resizeStartDimensions.current = { 
      width: editorWidth, 
      height: consoleHeight, 
      playgroundHeight: playgroundHeight 
    };
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

  // API call function
  const callGeminiAPI = async (prompt: string, outputMode: string) => {
    if (!GEMINI_API_KEY) {
      setOutput('Error: Gemini API key is missing. Please add VITE_GEMINI_API_KEY to your .env file.');
      return null;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        if (data.error) {
          throw new Error(`Gemini API error: ${data.error.message}`);
        }
        throw new Error(`API request failed with status ${response.status}`);
      }

      if (!data.candidates || !data.candidates[0].content.parts[0].text) {
        throw new Error('Unexpected response format from Gemini API');
      }
      
      const fullResponse = data.candidates[0].content.parts[0].text;
      let processedResponse = '';
      
      if (outputMode === 'run') {
        const outputSection = extractSection(fullResponse, 'EXPECTED OUTPUT');
        processedResponse = outputSection || "No output was generated.";
        
        if (userInput) {
          const inputSection = extractSection(fullResponse, 'INPUT HANDLING');
          if (inputSection) {
            processedResponse = `=== INPUT ===\n${userInput}\n\n=== OUTPUT ===\n${processedResponse}`;
          }
        }
      } else if (outputMode === 'debug') {
        const debuggingReport = extractSection(fullResponse, 'DEBUGGING REPORT');
        const fixedCode = extractSection(fullResponse, 'FIXED CODE');
        return { analysis: debuggingReport, fixedCode: fixedCode };
      } else if (outputMode === 'optimize') {
        const optimizedCode = extractSection(fullResponse, 'OPTIMIZED CODE');
        return optimizedCode || "No optimized code was generated.";
      } else if (outputMode === 'optimizeAnalysis') {
        const optimizationAnalysis = extractSection(fullResponse, 'OPTIMIZATION ANALYSIS');
        return optimizationAnalysis || "No optimization analysis was generated.";
      } else if (outputMode === 'analyze') {
        processedResponse = fullResponse;
      }
      
      return processedResponse || fullResponse;
      
    } catch (error) {
      let errorMessage = 'An unknown error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
        
        if (errorMessage.includes('API key not valid')) {
          errorMessage = 'Invalid Gemini API key. Please check your API key in the .env file.';
        } else if (errorMessage.includes('content policy')) {
          errorMessage = 'Content violation: The request was blocked for safety reasons.';
        }
      }
      
      setOutput(`Error: ${errorMessage}\n\nPlease try again with different code or check your API key.`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const extractSection = (text: string, sectionName: string) => {
    const regex = new RegExp(`===\\s*${sectionName}\\s*===\\s*([\\s\\S]*?)(?:===\\s*|$)`, 'i');
    const match = text.match(regex);
    
    if (sectionName.includes('CODE')) {
      const codeBlockRegex = /```[\w]*\n([\s\S]*?)```/g;
      const codeMatches = text.matchAll(codeBlockRegex);
      
      for (const codeMatch of codeMatches) {
        return codeMatch[1];
      }
    }
    
    return match ? match[1].trim() : null;
  };

  // Code execution functions
  const detectInputRequirement = (code: string, language: string) => {
    if (language === 'python') {
      return code.includes('input(') || code.includes('raw_input(');
    } else if (language === 'c') {
      return code.includes('scanf') || code.includes('gets') || code.includes('fgets');
    } else if (language === 'java') {
      return code.includes('Scanner') || code.includes('readLine') || code.includes('System.in');
    }
    return false;
  };

  const runCode = async () => {
    setLayout('split'); // Auto-switch to split view
    setAnalysisType('output');
    
    const code = getEditorValue();
    const language = getEditorLanguage();
    
    const requiresInput = detectInputRequirement(code, language);
    
    if (requiresInput && !userInput && !showInputPanel) {
      setShowInputPanel(true);
      setAnalysisResult("This code appears to require user input. Please provide input in the input panel below, then run the code again.");
      return;
    }
    
    const prompt = `You are a ${language} code analyzer and executor. Please:
1. Check if this code is syntactically correct
2. If correct, run this code ${userInput ? `with the following input: "${userInput}"` : 'without any input'}
3. Show the expected output
4. If incorrect, explain the errors and how to fix them
5. Provide a corrected version if there are errors

Code:
\`\`\`${language}
${code}
\`\`\`

Format your response like this:
=== CODE ANALYSIS ===
[Brief assessment of code correctness]

=== EXPECTED OUTPUT ===
[Output if correct or error messages if incorrect]

=== INPUT HANDLING ===
[If the code requires input, explain how the input was processed]

=== SUGGESTED FIXES ===
[If errors exist, provide specific fixes]`;
    
    const result = await callGeminiAPI(prompt, 'run');
    if (result) {
      setAnalysisResult(result);
      setError(null);
    }
  };

  const debugCode = async () => {
    setLayout('split'); // Auto-switch to split view
    setAnalysisType('debug');
    
    const code = getEditorValue();
    const language = getEditorLanguage();
    
    const prompt = `Debug the following ${language} code. Perform these tasks:
1. Identify all syntax errors, runtime errors, and logical errors
2. Explain each error in detail
3. Provide fixed code with explanations
4. Suggest best practices to avoid similar errors
${userInput ? `5. Consider how the code handles this input: "${userInput}"` : ''}

Code:
\`\`\`${language}
${code}
\`\`\`

Format your response like this:
=== DEBUGGING REPORT ===
[Detailed error analysis]

=== FIXED CODE ===
\`\`\`${language}
[Corrected code]
\`\`\`

=== EXPLANATION ===
[Explanation of fixes]

=== BEST PRACTICES ===
[Suggestions for better coding practices]`;
    
    const result = await callGeminiAPI(prompt, 'debug');
    if (result) {
      setAnalysisResult(`=== DEBUGGING REPORT ===\n${result.analysis}\n\n=== FIXED CODE ===\n\`\`\`${getEditorLanguage()}\n${result.fixedCode}\n\`\`\``);
      setDebuggingData({
        fixedCode: result.fixedCode,
        analysis: result.analysis,
        showFixedCode: true,
        originalCodeBeforeDebugging: getEditorValue(),
        debugView: 'analysis'
      });
    }
  };

  const optimizeCode = async () => {
    setLayout('split'); // Auto-switch to split view
    setAnalysisType('optimize');
    
    const code = getEditorValue();
    const language = getEditorLanguage();
    
    const prompt = `Optimize the following ${language} code. Provide both the optimized code and detailed analysis.

Code:
\`\`\`${language}
${code}
\`\`\`

Format your response like this:
=== OPTIMIZATION ANALYSIS ===
[Detailed explanation of optimizations]

=== OPTIMIZED CODE ===
\`\`\`${language}
[Improved version of the code]
\`\`\`

=== PERFORMANCE GAINS ===
[Expected performance improvements]`;
    
    const result = await callGeminiAPI(prompt, 'optimize');
    if (result) {
      setOriginalCodeBeforeOptimization(getEditorValue());
      setOptimizedCode(result);
      setAnalysisResult(`=== OPTIMIZATION ANALYSIS ===\nCode has been optimized for better performance and readability.\n\n=== OPTIMIZED CODE ===\n\`\`\`${getEditorLanguage()}\n${result}\n\`\``);
    }
  };

  const fullAnalysis = async () => {
    setLayout('split'); // Auto-switch to split view
    setAnalysisType('analyze');
    
    const code = getEditorValue();
    const language = getEditorLanguage();
    
    const prompt = `Comprehensively analyze the following ${language} code. Provide:
1. Code correctness assessment
2. Detailed execution flow
3. Potential edge cases
4. Security vulnerabilities
5. Optimization opportunities
6. Best practices review
${userInput ? `7. Analysis of how the code handles this input: "${userInput}"` : ''}

Code:
\`\`\`${language}
${code}
\`\`\`

Format your response like this:
=== CODE CORRECTNESS ===
[Assessment of code correctness]

=== EXECUTION FLOW ===
[Step-by-step execution analysis]

=== EDGE CASES ===
[Potential edge cases and handling]

=== SECURITY ===
[Security vulnerabilities and fixes]

=== OPTIMIZATIONS ===
[Performance optimization suggestions]

=== BEST PRACTICES ===
[Recommended coding best practices]`;
    
    const result = await callGeminiAPI(prompt, 'analyze');
    if (result) {
      setAnalysisResult(result);
      setError(null);
    }
  };

  // Utility functions
  const showNotification = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    setChangeNotificationType(type);
    setChangeNotificationMessage(message);
    setShowChangeNotification(true);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(getEditorValue());
    showNotification('success', 'Code copied to clipboard!');
  };

  const copyOptimizedCode = () => {
    navigator.clipboard.writeText(optimizedCode);
    showNotification('success', 'Optimized code copied to clipboard!');
  };

  const copyFixedCode = () => {
    navigator.clipboard.writeText(debuggingData.fixedCode);
    showNotification('success', 'Fixed code copied to clipboard!');
  };

  const downloadCode = () => {
    let extension: string;
    
    switch (activeTab) {
      case 'python': extension = 'py'; break;
      case 'c': extension = 'c'; break;
      case 'java': extension = 'java'; break;
      default: extension = 'txt';
    }
    
    const element = document.createElement('a');
    const file = new Blob([getEditorValue()], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `code.${extension}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const applyOptimizedCode = () => {
    if (!optimizedCode) {
      showNotification('error', 'No optimized code available to apply');
      return;
    }
    
    switch (activeTab) {
      case 'python': setPythonCode(optimizedCode); break;
      case 'c': setCCode(optimizedCode); break;
      case 'java': setJavaCode(optimizedCode); break;
    }
    
    showNotification('success', 'Changes applied successfully!');
    
    if (autoRun) {
      setTimeout(() => runCode(), 100);
    }
    
    setShowOptimizedCode(false);
  };

  const applyDebuggedCode = () => {
    if (!debuggingData.fixedCode) {
      showNotification('error', 'No fixed code available to apply');
      return;
    }
    
    switch (activeTab) {
      case 'python': setPythonCode(debuggingData.fixedCode); break;
      case 'c': setCCode(debuggingData.fixedCode); break;
      case 'java': setJavaCode(debuggingData.fixedCode); break;
    }
    
    showNotification('success', 'Debugged code applied successfully!');
    
    setDebuggingData(prev => ({ ...prev, showFixedCode: false }));
    
    if (autoRun) {
      setTimeout(() => runCode(), 100);
    }
  };

  const revertChanges = () => {
    if (!originalCodeBeforeOptimization) {
      showNotification('warning', 'No original code to revert to');
      return;
    }
    
    switch (activeTab) {
      case 'python': setPythonCode(originalCodeBeforeOptimization); break;
      case 'c': setCCode(originalCodeBeforeOptimization); break;
      case 'java': setJavaCode(originalCodeBeforeOptimization); break;
    }
    
    showNotification('info', 'Reverted to original code');
    setShowOptimizedCode(false);
  };

  const revertDebuggedChanges = () => {
    if (!debuggingData.originalCodeBeforeDebugging) {
      showNotification('warning', 'No original code to revert to');
      return;
    }
    
    switch (activeTab) {
      case 'python': setPythonCode(debuggingData.originalCodeBeforeDebugging); break;
      case 'c': setCCode(debuggingData.originalCodeBeforeDebugging); break;
      case 'java': setJavaCode(debuggingData.originalCodeBeforeDebugging); break;
    }
    
    showNotification('info', 'Reverted to original code');
    setDebuggingData(prev => ({ ...prev, showFixedCode: false }));
  };

  const toggleInputPanel = () => {
    setShowInputPanel(!showInputPanel);
  };

  const toggleDebugView = (view: 'analysis' | 'code') => {
    setDebuggingData(prev => ({ ...prev, debugView: view }));
  };

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

  const mainContentHeight = showConsole ? `${playgroundHeight - 80 - consoleHeight}px` : `${playgroundHeight - 80}px`;

  return (
    <div className="bg-gray-50 flex flex-col select-none">
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
      
      {/* Main playground container with dynamic height */}
      <div 
        ref={playgroundRef} 
        className="bg-gray-50 flex flex-col select-none border border-gray-200 rounded-lg shadow-lg overflow-hidden"
        style={{ height: `${playgroundHeight}px` }}
      >
        <PlaygroundHeader 
          autoRun={autoRun}
          setAutoRun={setAutoRun}
          layout={layout}
          setLayout={setLayout}
          showConsole={showConsole}
          setShowConsole={setShowConsole}
        />

        <div className="flex-1 flex overflow-hidden" style={{ height: mainContentHeight }}>
          {/* Editor Pane */}
          <EditorPane 
            activeTab={activeTab as 'python' | 'c' | 'java'}
            setActiveTab={setActiveTab}
            pythonCode={pythonCode}
            cCode={cCode}
            javaCode={javaCode}
            runCode={runCode}
            debugCode={debugCode}
            optimizeCode={optimizeCode}
            fullAnalysis={fullAnalysis}
            autoRun={autoRun}
            isLoading={isLoading}
            layout={layout}
            handleEditorDidMount={handleEditorDidMount}
            handleEditorChange={handleEditorChange}
            width={layout === 'split' ? `${editorWidth}%` : '100%'}
          />

          {/* Resizer */}
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

          {/* Analysis Pane - Only show in split layout */}
          {layout === 'split' && (
            <div className="flex flex-col bg-white shadow-sm" style={{ width: `${100 - editorWidth}%` }}>
              {/* Analysis header */}
              <div className="flex items-center justify-between bg-gray-100 px-3 py-2 border-b">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    analysisType === 'output' ? 'bg-green-500' :
                    analysisType === 'debug' ? 'bg-yellow-500' :
                    analysisType === 'optimize' ? 'bg-blue-500' :
                    'bg-purple-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-700">
                    {analysisType === 'output' ? 'Code Output' :
                     analysisType === 'debug' ? 'Debug Analysis' :
                     analysisType === 'optimize' ? 'Code Optimization' :
                     'Full Analysis'}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="text-xs text-gray-500">AI-Powered</div>
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></div>
                </div>
              </div>
              
              {/* Analysis content */}
              <div className="flex-1 overflow-hidden">
                {isLoading ? (
                  <div className="flex-1 flex items-center justify-center p-8">
                    <div className="text-center">
                      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                      <div className="text-sm text-gray-600 font-medium">Analyzing your code...</div>
                      <div className="text-xs text-gray-500 mt-1">Please wait while AI processes your request</div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full overflow-y-auto p-4">
                    <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-gray-700">
                      {analysisResult || 'Run your code or use AI tools to see analysis results here.'}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Input Panel */}
        {showInputPanel && (
          <div className="border-t p-2 bg-white">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="userInput" className="text-sm font-medium">Input for Program:</label>
              <button 
                onClick={toggleInputPanel}
                className="text-gray-500 hover:text-gray-700 text-xs"
              >
                Hide
              </button>
            </div>
            <textarea
              id="userInput"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="w-full h-20 p-2 border rounded text-sm font-mono"
              placeholder="Enter input for your program here..."
            />
          </div>
        )}

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

      {/* Playground height resize handle - positioned at the bottom */}
      <div
        className="h-2 bg-gray-200 hover:bg-blue-400 cursor-row-resize transition-colors flex-shrink-0 active:bg-blue-500 border-t border-gray-300 flex items-center justify-center group"
        onMouseDown={startPlaygroundResize}
        style={{ 
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none'
        }}
      >
        {/* Visual indicator for resize handle */}
        <div className="flex space-x-1 opacity-50 group-hover:opacity-75 transition-opacity">
          <div className="w-6 h-0.5 bg-gray-400 rounded"></div>
          <div className="w-6 h-0.5 bg-gray-400 rounded"></div>
          <div className="w-6 h-0.5 bg-gray-400 rounded"></div>
        </div>
      </div>

      {/* Notification */}
      {showChangeNotification && (
        <div className={`fixed bottom-4 right-4 px-4 py-2 rounded-md text-white flex items-center shadow-lg
          ${changeNotificationType === 'success' ? 'bg-green-600' : 
          changeNotificationType === 'error' ? 'bg-red-600' : 
          changeNotificationType === 'warning' ? 'bg-yellow-600' : 'bg-blue-600'}`}
        >
          {changeNotificationType === 'success' && <Check size={18} className="mr-2" />}
          {changeNotificationType === 'error' && <AlertTriangle size={18} className="mr-2" />}
          {changeNotificationType === 'warning' && <AlertTriangle size={18} className="mr-2" />}
          {changeNotificationType === 'info' && <Terminal size={18} className="mr-2" />}
          {changeNotificationMessage}
        </div>
      )}
    </div>
  );
}