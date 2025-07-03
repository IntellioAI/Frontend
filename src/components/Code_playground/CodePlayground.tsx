import { useState, useRef, useEffect } from 'react';
import { Play, Download, Copy, Save, Layout, Code, Monitor, RefreshCw, Bug, Zap, Terminal, Check, AlertTriangle, ChevronDown } from 'lucide-react';
import Editor from '@monaco-editor/react';

// Use environment variable for API key
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export default function CodePlayground() {
  // Language state and categories
  const [activeCategory, setActiveCategory] = useState('programming');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  
  // Code states for different languages
  const [pythonCode, setPythonCode] = useState('# Python code\nprint("Hello World!")');
  const [cCode, setCCode] = useState('// C code\n#include <stdio.h>\n\nint main() {\n    printf("Hello World!\\n");\n    return 0;\n}');
  const [javaCode, setJavaCode] = useState('// Java code\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello World!");\n    }\n}');
  const [htmlCode, setHtmlCode] = useState('<!-- HTML code -->\n<!DOCTYPE html>\n<html>\n<head>\n    <title>Hello World</title>\n</head>\n<body>\n    <h1>Hello World!</h1>\n</body>\n</html>');
  const [cssCode, setCssCode] = useState('/* CSS code */\nbody {\n    font-family: Arial, sans-serif;\n    background-color: #f0f0f0;\n}\n\nh1 {\n    color: #333;\n    text-align: center;\n}');
  const [jsCode, setJsCode] = useState('// JavaScript code\nconsole.log("Hello World!");\n\ndocument.addEventListener("DOMContentLoaded", function() {\n    alert("Hello World!");\n});');
  
  const [activeTab, setActiveTab] = useState('python');
  const [output, setOutput] = useState('');
  const [layout, setLayout] = useState('split');
  const [theme, setTheme] = useState('vs-dark');
  const [autoRun, setAutoRun] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [showInputPanel, setShowInputPanel] = useState(false);
  const [optimizedCode, setOptimizedCode] = useState('');
  const [showOptimizedCode, setShowOptimizedCode] = useState(false);
  const [showChangeNotification, setShowChangeNotification] = useState(false);
  const [changeNotificationType, setChangeNotificationType] = useState('success');
  const [changeNotificationMessage, setChangeNotificationMessage] = useState('');
  const [originalCodeBeforeOptimization, setOriginalCodeBeforeOptimization] = useState('');
  const [optimizationView, setOptimizationView] = useState('code'); // 'analysis' or 'code'
  const [optimizationAnalysis, setOptimizationAnalysis] = useState('');
  
  // Updated state for debugging with view toggle
  const [debuggingData, setDebuggingData] = useState({
    fixedCode: '',
    analysis: '',
    showFixedCode: false,
    originalCodeBeforeDebugging: '',
    debugView: 'analysis' // 'analysis' or 'code'
  });
  
  const editorRef = useRef(null);
  const optimizedEditorRef = useRef(null);
  const fixedCodeEditorRef = useRef(null);
  
  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleOptimizedEditorDidMount = (editor) => {
    optimizedEditorRef.current = editor;
  };

  const handleFixedCodeEditorDidMount = (editor) => {
    fixedCodeEditorRef.current = editor;
  };

  useEffect(() => {
    console.log("API Key value:", GEMINI_API_KEY);
    if (!GEMINI_API_KEY) {
      setOutput('Warning: Gemini API key not found in environment variables. Please add VITE_GEMINI_API_KEY to your .env file.');
    }
  }, []);

  useEffect(() => {
    if (showChangeNotification) {
      const timer = setTimeout(() => {
        setShowChangeNotification(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showChangeNotification]);
  
  // Handle category change
  useEffect(() => {
    if (activeCategory === 'programming') {
      if (!['python', 'c', 'java'].includes(activeTab)) {
        setActiveTab('python');
      }
    } else if (activeCategory === 'web') {
      if (!['html', 'css', 'js'].includes(activeTab)) {
        setActiveTab('html');
      }
    }
  }, [activeCategory]);

  const getEditorLanguage = () => {
    switch (activeTab) {
      case 'python': return 'python';
      case 'c': return 'c';
      case 'java': return 'java';
      case 'html': return 'html';
      case 'css': return 'css';
      case 'js': return 'javascript';
      default: return 'python';
    }
  };

  const getEditorValue = () => {
    switch (activeTab) {
      case 'python': return pythonCode;
      case 'c': return cCode;
      case 'java': return javaCode;
      case 'html': return htmlCode;
      case 'css': return cssCode;
      case 'js': return jsCode;
      default: return pythonCode;
    }
  };

  const handleEditorChange = (value) => {
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
      case 'html':
        setHtmlCode(value);
        break;
      case 'css':
        setCssCode(value);
        break;
      case 'js':
        setJsCode(value);
        break;
    }
    
    if (autoRun) {
      runCode();
    }
  };

  const callGeminiAPI = async (prompt, outputMode) => {
    if (!GEMINI_API_KEY) {
      setOutput('Error: Gemini API key is missing. Please add REACT_APP_GEMINI_API_KEY to your .env file.');
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
        processedResponse = `${debuggingReport || ''}\n\n${fixedCode || ''}`;
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
  
  const extractSection = (text, sectionName) => {
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

  const runCode = async () => {
    const code = getEditorValue();
    const language = getEditorLanguage();
    
    // Special handling for web languages
    if (['html', 'css', 'js'].includes(activeTab)) {
      // For web languages, show a preview
      if (activeTab === 'html') {
        const previewHtml = `<iframe srcdoc="${code.replace(/"/g, '&quot;')}" style="width: 100%; height: 100%; border: none;"></iframe>`;
        setOutput(previewHtml);
        return;
      } else if (activeTab === 'css') {
        const previewHtml = `<div style="padding: 10px; background-color: #fff;">
          <p>CSS Preview:</p>
          <style>${code}</style>
          <div class="preview-element">
            <h1>Heading 1</h1>
            <p>Paragraph text</p>
            <button>Button</button>
          </div>
        </div>`;
        setOutput(previewHtml);
        return;
      } else if (activeTab === 'js') {
        try {
          // Create a sandbox environment to run JS code
          const consoleOutput = [];
          const originalConsoleLog = console.log;
          console.log = (...args) => {
            consoleOutput.push(args.join(' '));
            originalConsoleLog(...args);
          };
          
          // Execute the JS code in a safe way
          const executeJS = new Function(code);
          executeJS();
          
          // Restore original console.log
          console.log = originalConsoleLog;
          
          setOutput(`Console Output:\n${consoleOutput.join('\n')}`);
        } catch (error) {
          setOutput(`JavaScript Error: ${error.message}`);
        }
        return;
      }
    }
    
    const requiresInput = detectInputRequirement(code, language);
    
    if (requiresInput && !userInput && !showInputPanel) {
      setShowInputPanel(true);
      setOutput("This code appears to require user input. Please provide input in the input panel below, then run the code again.");
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
      setOutput(result);
      setShowOptimizedCode(false);
      setDebuggingData(prev => ({ ...prev, showFixedCode: false }));
    }
  };

  const detectInputRequirement = (code, language) => {
    if (language === 'python') {
      return code.includes('input(') || code.includes('raw_input(');
    } else if (language === 'c') {
      return code.includes('scanf') || code.includes('gets') || code.includes('fgets');
    } else if (language === 'java') {
      return code.includes('Scanner') || code.includes('readLine') || code.includes('System.in');
    }
    return false;
  };

  const debugCode = async () => {
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
      setDebuggingData({
        fixedCode: result.fixedCode,
        analysis: result.analysis,
        showFixedCode: true,
        originalCodeBeforeDebugging: getEditorValue(),
        debugView: 'analysis'
      });
      setShowOptimizedCode(false);
    }
  };

  const applyDebuggedCode = () => {
    if (!debuggingData.fixedCode) {
      setChangeNotificationType('error');
      setChangeNotificationMessage('No fixed code available to apply');
      setShowChangeNotification(true);
      return;
    }
    
    switch (activeTab) {
      case 'python':
        setPythonCode(debuggingData.fixedCode);
        break;
      case 'c':
        setCCode(debuggingData.fixedCode);
        break;
      case 'java':
        setJavaCode(debuggingData.fixedCode);
        break;
      case 'html':
        setHtmlCode(debuggingData.fixedCode);
        break;
      case 'css':
        setCssCode(debuggingData.fixedCode);
        break;
      case 'js':
        setJsCode(debuggingData.fixedCode);
        break;
    }
    
    setChangeNotificationType('success');
    setChangeNotificationMessage('Debugged code applied successfully!');
    setShowChangeNotification(true);
    
    setDebuggingData(prev => ({ ...prev, showFixedCode: false }));
    
    if (autoRun) {
      setTimeout(() => {
        runCode();
      }, 100);
    }
  };

  const revertDebuggedChanges = () => {
    if (!debuggingData.originalCodeBeforeDebugging) {
      setChangeNotificationType('warning');
      setChangeNotificationMessage('No original code to revert to');
      setShowChangeNotification(true);
      return;
    }
    
    switch (activeTab) {
      case 'python':
        setPythonCode(debuggingData.originalCodeBeforeDebugging);
        break;
      case 'c':
        setCCode(debuggingData.originalCodeBeforeDebugging);
        break;
      case 'java':
        setJavaCode(debuggingData.originalCodeBeforeDebugging);
        break;
      case 'html':
        setHtmlCode(debuggingData.originalCodeBeforeDebugging);
        break;
      case 'css':
        setCssCode(debuggingData.originalCodeBeforeDebugging);
        break;
      case 'js':
        setJsCode(debuggingData.originalCodeBeforeDebugging);
        break;
    }
    
    setChangeNotificationType('info');
    setChangeNotificationMessage('Reverted to original code');
    setShowChangeNotification(true);
    
    setDebuggingData(prev => ({ ...prev, showFixedCode: false }));
  };

  const optimizeCode = async () => {
    const code = getEditorValue();
    const language = getEditorLanguage();
    
    const prompt = `Optimize the following ${language} code. Provide only the optimized version of the code without any analysis or explanation.

Code:
\`\`\`${language}
${code}
\`\`\`

Format your response like this:
=== OPTIMIZED CODE ===
[Improved version of the code]`;
    
    const result = await callGeminiAPI(prompt, 'optimize');
    if (result) {
      setOriginalCodeBeforeOptimization(getEditorValue());
      setOptimizedCode(result);
      setShowOptimizedCode(true);
      setOptimizationView('code');
      setOutput("Optimized code generated. Switch to 'Analysis' view to see optimization details.");
      setDebuggingData(prev => ({ ...prev, showFixedCode: false }));
    }
  };

  const getOptimizationAnalysis = async () => {
    const code = originalCodeBeforeOptimization || getEditorValue();
    const language = getEditorLanguage();
    
    const prompt = `Analyze the optimizations for the following ${language} code. Provide:
1. Detailed explanation of optimizations made compared to the original code
2. Performance comparison (time/space complexity)
3. Alternative approaches if applicable

Original Code:
\`\`\`${language}
${code}
\`\`\`

Optimized Code:
\`\`\`${language}
${optimizedCode}
\`\`\`

Format your response like this:
=== OPTIMIZATION ANALYSIS ===
[Explanation of current code's inefficiencies]

=== PERFORMANCE GAINS ===
[Comparison of before/after performance]

=== ALTERNATIVE APPROACHES ===
[Other possible optimization strategies]`;
    
    const result = await callGeminiAPI(prompt, 'optimizeAnalysis');
    if (result) {
      setOptimizationAnalysis(result);
      setOptimizationView('analysis');
    }
  };

  const fullAnalysis = async () => {
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
      setOutput(result);
      setShowOptimizedCode(false);
      setDebuggingData(prev => ({ ...prev, showFixedCode: false }));
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(getEditorValue());
    setChangeNotificationType('success');
    setChangeNotificationMessage('Code copied to clipboard!');
    setShowChangeNotification(true);
  };

  const copyOptimizedCode = () => {
    navigator.clipboard.writeText(optimizedCode);
    setChangeNotificationType('success');
    setChangeNotificationMessage('Optimized code copied to clipboard!');
    setShowChangeNotification(true);
  };

  const copyFixedCode = () => {
    navigator.clipboard.writeText(debuggingData.fixedCode);
    setChangeNotificationType('success');
    setChangeNotificationMessage('Fixed code copied to clipboard!');
    setShowChangeNotification(true);
  };

  const downloadCode = () => {
    let extension;
    
    switch (activeTab) {
      case 'python': 
        extension = 'py';
        break;
      case 'c': 
        extension = 'c';
        break;
      case 'java': 
        extension = 'java';
        break;
      case 'html':
        extension = 'html';
        break;
      case 'css':
        extension = 'css';
        break;
      case 'js':
        extension = 'js';
        break;
      default: 
        extension = 'txt';
    }
    
    const element = document.createElement('a');
    const file = new Blob([getEditorValue()], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `code.${extension}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadFullProject = () => {
    alert('Download project functionality would create a ZIP with all language files');
  };

  const downloadOptimizedCode = () => {
    let extension;
    
    switch (activeTab) {
      case 'python': 
        extension = 'py';
        break;
      case 'c': 
        extension = 'c';
        break;
      case 'java': 
        extension = 'java';
        break;
      case 'html':
        extension = 'html';
        break;
      case 'css':
        extension = 'css';
        break;
      case 'js':
        extension = 'js';
        break;
      default: 
        extension = 'txt';
    }
    
    const element = document.createElement('a');
    const file = new Blob([optimizedCode], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `optimized_code.${extension}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadFixedCode = () => {
    let extension;
    
    switch (activeTab) {
      case 'python': 
        extension = 'py';
        break;
      case 'c': 
        extension = 'c';
        break;
      case 'java': 
        extension = 'java';
        break;
      case 'html':
        extension = 'html';
        break;
      case 'css':
        extension = 'css';
        break;
      case 'js':
        extension = 'js';
        break;
      default: 
        extension = 'txt';
    }
    
    const element = document.createElement('a');
    const file = new Blob([debuggingData.fixedCode], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `fixed_code.${extension}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const toggleInputPanel = () => {
    setShowInputPanel(!showInputPanel);
  };

  const applyOptimizedCode = () => {
    if (!optimizedCode) {
      setChangeNotificationType('error');
      setChangeNotificationMessage('No optimized code available to apply');
      setShowChangeNotification(true);
      return;
    }
    
    switch (activeTab) {
      case 'python':
        setPythonCode(optimizedCode);
        break;
      case 'c':
        setCCode(optimizedCode);
        break;
      case 'java':
        setJavaCode(optimizedCode);
        break;
      case 'html':
        setHtmlCode(optimizedCode);
        break;
      case 'css':
        setCssCode(optimizedCode);
        break;
      case 'js':
        setJsCode(optimizedCode);
        break;
    }
    
    setChangeNotificationType('success');
    setChangeNotificationMessage('Changes applied successfully!');
    setShowChangeNotification(true);
    
    if (autoRun) {
      setTimeout(() => {
        runCode();
      }, 100);
    }
    
    setShowOptimizedCode(false);
  };

  const revertChanges = () => {
    if (!originalCodeBeforeOptimization) {
      setChangeNotificationType('warning');
      setChangeNotificationMessage('No original code to revert to');
      setShowChangeNotification(true);
      return;
    }
    
    switch (activeTab) {
      case 'python':
        setPythonCode(originalCodeBeforeOptimization);
        break;
      case 'c':
        setCCode(originalCodeBeforeOptimization);
        break;
      case 'java':
        setJavaCode(originalCodeBeforeOptimization);
        break;
      case 'html':
        setHtmlCode(originalCodeBeforeOptimization);
        break;
      case 'css':
        setCssCode(originalCodeBeforeOptimization);
        break;
      case 'js':
        setJsCode(originalCodeBeforeOptimization);
        break;
    }
    
    setChangeNotificationType('info');
    setChangeNotificationMessage('Reverted to original code');
    setShowChangeNotification(true);
    
    setShowOptimizedCode(false);
  };

  const compareCode = () => {
    setOutput(`=== ORIGINAL CODE ===\n${originalCodeBeforeOptimization}\n\n=== OPTIMIZED CODE ===\n${optimizedCode}`);
    setOptimizationView('analysis');
  };

  const toggleDebugView = (view) => {
    setDebuggingData(prev => ({ ...prev, debugView: view }));
  };

  // Toggle the category dropdown
  const toggleCategoryDropdown = () => {
    setShowCategoryDropdown(!showCategoryDropdown);
  };

  // Switch to a different category
  const switchCategory = (category) => {
    setActiveCategory(category);
    setShowCategoryDropdown(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gray-100 px-4 py-3 flex justify-between items-center border-b">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-800">AI Code Playground (Gemini Powered)</h2>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="bg-white text-black text-sm border rounded px-2 py-1"
            >
              <option value="vs-dark">Dark</option>
              <option value="light">Light</option>
            </select>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="autoRun"
                checked={autoRun}
                onChange={() => setAutoRun(!autoRun)}
                className="mr-1"
              />
              <label htmlFor="autoRun" className="text-sm text-gray-700">Auto-run</label>
              <button 
                onClick={downloadFullProject}
                className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded text-sm"
                title="Download Full Project"
              >
                <Save size={14} />
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setLayout('split')}
              className={`p-1 rounded ${layout === 'split' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:bg-gray-200'}`}
              title="Split View"
            >
              <Layout size={18} />
            </button>
            <button 
              onClick={() => setLayout('editor')}
              className={`p-1 rounded ${layout === 'editor' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:bg-gray-200'}`}
              title="Editor Only"
            >
              <Code size={18} />
            </button>
            <button 
              onClick={() => setLayout('preview')}
              className={`p-1 rounded ${layout === 'preview' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:bg-gray-200'}`}
              title="Preview Only"
            >
              <Monitor size={18} />
            </button>
          </div>
        </div>
        
        {/* Category and Language Tabs */}
        <div className="bg-white border-b flex items-center p-2">
          {/* Category Selector */}
          <div className="relative mr-4">
            <button 
              onClick={toggleCategoryDropdown}
              className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-3 rounded"
            >
              <span>{activeCategory === 'programming' ? 'Programming' : 'Web'}</span>
              <ChevronDown size={14} />
            </button>
            
            {showCategoryDropdown && (
              <div className="absolute top-full left-0 mt-1 bg-white border rounded shadow-lg z-10">
                <button 
                  onClick={() => switchCategory('programming')}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${activeCategory === 'programming' ? 'bg-indigo-50 text-indigo-700' : ''}`}
                >
                  Programming
                </button>
                <button 
                  onClick={() => switchCategory('web')}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${activeCategory === 'web' ? 'bg-indigo-50 text-indigo-700' : ''}`}
                >
                  Web
                </button>
              </div>
            )}
          </div>
          
          {/* Language Tabs */}
          <div className="flex space-x-1">
            {activeCategory === 'programming' ? (
              <>
                <button 
                  onClick={() => setActiveTab('python')}
                  className={`px-3 py-1 rounded-md text-sm ${activeTab === 'python' ? 'bg-indigo-100 text-black' : 'hover:bg-gray-100'}`}
                >
                  Python
                </button>
                <button 
                  onClick={() => setActiveTab('c')}
                  className={`px-3 py-1  rounded-md text-sm ${activeTab === 'c' ? 'bg-indigo-100 text-black' : 'hover:bg-gray-100'}`}
                >
                  C
                </button>
                <button 
                  onClick={() => setActiveTab('java')}
                  className={`px-3 py-1 rounded-md text-sm ${activeTab === 'java' ? 'bg-indigo-100 text-black' : 'hover:bg-gray-100'}`}
                >
                  Java
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setActiveTab('html')}
                  className={`px-3 py-1 rounded-md text-sm ${activeTab === 'html' ? 'bg-indigo-100 text-black' : 'hover:bg-gray-100'}`}
                >
                  HTML
                </button>
                <button 
                  onClick={() => setActiveTab('css')}
                  className={`px-3 py-1 rounded-md text-sm ${activeTab === 'css' ? 'bg-indigo-100 text-black' : 'hover:bg-gray-100'}`}
                >
                  CSS
                </button>
                <button 
                  onClick={() => setActiveTab('js')}
                  className={`px-3 py-1 rounded-md text-sm ${activeTab === 'js' ? 'bg-indigo-100 text-black' : 'hover:bg-gray-100'}`}
                >
                  JavaScript
                </button>
              </>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row h-[calc(100vh-200px)]">
          {/* Code Editor */}
          {layout !== 'preview' && (
            <div className={`${layout === 'split' ? 'w-full md:w-1/2' : 'w-full'} border-r`}>
              <div className="flex items-center justify-between bg-gray-100 px-3 py-1 border-b">
                <div className="text-sm font-medium">Code Editor</div>
                <div className="flex space-x-2">
                  <button 
                    onClick={runCode}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm flex items-center"
                    disabled={isLoading}
                  >
                    <Play size={14} className="mr-1" />
                    Run
                  </button>
                  <button 
                    onClick={copyCode}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded-md text-sm"
                    title="Copy Code"
                  >
                    <Copy size={14} />
                  </button>
                  <button 
                    onClick={downloadCode}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded-md text-sm"
                    title="Download Code"
                  >
                    <Download size={14} />
                  </button>
                </div>
              </div>
              
              <Editor
                height="100%"
                language={getEditorLanguage()}
                value={getEditorValue()}
                theme={theme}
                onChange={handleEditorChange}
                onMount={handleEditorDidMount}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                }}
              />
              
              {showInputPanel && (
                <div className="border-t p-2">
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
            </div>
          )}
          
          {/* Output/Preview Panel */}
          {layout !== 'editor' && (
            <div className={`${layout === 'split' ? 'w-full md:w-1/2' : 'w-full'} flex flex-col`}>
              <div className="flex items-center justify-between bg-gray-100 px-3 py-1 border-b">
                <div className="text-sm font-medium">Output / Preview</div>
                <div className="flex space-x-2">
                  <button 
                    onClick={debugCode}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded-md text-sm flex items-center"
                    disabled={isLoading}
                  >
                    <Bug size={14} className="mr-1" />
                    Debug
                  </button>
                  <button 
                    onClick={optimizeCode}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded-md text-sm flex items-center"
                    disabled={isLoading}
                  >
                    <Zap size={14} className="mr-1" />
                    Optimize
                  </button>
                  <button 
                    onClick={fullAnalysis}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded-md text-sm flex items-center"
                    disabled={isLoading}
                  >
                    <Terminal size={14} className="mr-1" />
                    Analyze
                  </button>
                </div>
              </div>
              
              {isLoading ? (
                <div className="flex-1 flex items-center justify-center bg-gray-50 p-4">
                  <div className="text-center">
                    <RefreshCw size={24} className="mx-auto mb-2 animate-spin text-indigo-600" />
                    <p className="text-gray-600">Processing your code...</p>
                  </div>
                </div>
              ) : showOptimizedCode ? (
                <div className="flex-1 flex flex-col">
                  <div className="bg-gray-100 px-3 py-1 flex justify-between items-center border-b">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setOptimizationView('code')}
                        className={`px-2 py-1 text-xs rounded ${optimizationView === 'code' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-200'}`}
                      >
                        Optimized Code
                      </button>
                      <button
                        onClick={() => {
                          if (optimizationAnalysis) {
                            setOptimizationView('analysis');
                          } else {
                            getOptimizationAnalysis();
                          }
                        }}
                        className={`px-2 py-1 text-xs rounded ${optimizationView === 'analysis' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-200'}`}
                      >
                        Analysis
                      </button>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={applyOptimizedCode}
                        className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs flex items-center"
                        title="Apply Optimized Code"
                      >
                        <Check size={12} className="mr-1" />
                        Apply
                      </button>
                      <button
                        onClick={revertChanges}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 rounded text-xs flex items-center"
                        title="Revert Changes"
                      >
                        <RefreshCw size={12} className="mr-1" />
                        Revert
                      </button>
                      <button
                        onClick={copyOptimizedCode}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded text-xs"
                        title="Copy Optimized Code"
                      >
                        <Copy size={12} />
                      </button>
                      <button
                        onClick={downloadOptimizedCode}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded text-xs"
                        title="Download Optimized Code"
                      >
                        <Download size={12} />
                      </button>
                    </div>
                  </div>
                  
                  {optimizationView === 'code' ? (
                    <Editor
                      height="100%"
                      language={getEditorLanguage()}
                      value={optimizedCode}
                      theme={theme}
                      onMount={handleOptimizedEditorDidMount}
                      options={{
                        readOnly: true,
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: 'on',
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                      }}
                    />
                  ) : (
                    <div className="flex-1 overflow-auto p-4 whitespace-pre-wrap font-mono text-sm bg-gray-50">
                      {optimizationAnalysis || "Loading optimization analysis..."}
                    </div>
                  )}
                </div>
              ) : debuggingData.showFixedCode ? (
                <div className="flex-1 flex flex-col">
                  <div className="bg-gray-100 px-3 py-1 flex justify-between items-center border-b">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleDebugView('analysis')}
                        className={`px-2 py-1 text-xs rounded ${debuggingData.debugView === 'analysis' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-200'}`}
                      >
                        Debug Report
                      </button>
                      <button
                        onClick={() => toggleDebugView('code')}
                        className={`px-2 py-1 text-xs rounded ${debuggingData.debugView === 'code' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-200'}`}
                      >
                        Fixed Code
                      </button>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={applyDebuggedCode}
                        className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs flex items-center"
                        title="Apply Fixed Code"
                      >
                        <Check size={12} className="mr-1" />
                        Apply
                      </button>
                      <button
                        onClick={revertDebuggedChanges}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 rounded text-xs flex items-center"
                        title="Revert Changes"
                      >
                        <RefreshCw size={12} className="mr-1" />
                        Revert
                      </button>
                      <button
                        onClick={copyFixedCode}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded text-xs"
                        title="Copy Fixed Code"
                      >
                        <Copy size={12} />
                      </button>
                      <button
                        onClick={downloadFixedCode}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded text-xs"
                        title="Download Fixed Code"
                      >
                        <Download size={12} />
                      </button>
                    </div>
                  </div>
                  
                  {debuggingData.debugView === 'analysis' ? (
                    <div className="flex-1 overflow-auto p-4 whitespace-pre-wrap font-mono text-sm bg-gray-50">
                      {debuggingData.analysis || "No debugging analysis available."}
                    </div>
                  ) : (
                    <Editor
                      height="100%"
                      language={getEditorLanguage()}
                      value={debuggingData.fixedCode}
                      theme={theme}
                      onMount={handleFixedCodeEditorDidMount}
                      options={{
                        readOnly: true,
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: 'on',
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                      }}
                    />
                  )}
                </div>
              ) : (
                <div className="flex-1 overflow-auto p-4 bg-gray-50">
                  {output.startsWith('<iframe') || output.startsWith('<div') ? (
                    <div dangerouslySetInnerHTML={{ __html: output }} className="h-full" />
                  ) : (
                    <pre className="whitespace-pre-wrap font-mono text-sm">{output}</pre>
                  )}
                </div>
              )}
              
              {(!showInputPanel && detectInputRequirement(getEditorValue(), getEditorLanguage())) && (
                <div className="border-t py-1 px-2 bg-gray-50">
                  <button 
                    onClick={toggleInputPanel}
                    className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
                  >
                    <Terminal size={14} className="mr-1" />
                    Show Input Panel
                  </button>
                </div>
              )}
            </div>
          )}
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
    </div>
  );
}