import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Download, Copy, Save, Layout, Code, Monitor, RefreshCw, Bug, Zap, AlertTriangle } from 'lucide-react';
import Editor, { OnMount } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';

interface CodePlaygroundProps {
  isMobileDevice?: boolean;
  shouldReduceMotion?: boolean;
}

export default function CodePlayground({ isMobileDevice = false, shouldReduceMotion = false }: CodePlaygroundProps) {
    const [output, setOutput] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [htmlCode, setHtmlCode] = useState('<div class="container">\n  <h1>Hello World!</h1>\n  <p>Welcome to the Web Playground</p>\n</div>');
    const [cssCode, setCssCode] = useState('.container {\n  max-width: 800px;\n  margin: 0 auto;\n  padding: 20px;\n  font-family: Arial, sans-serif;\n}\n\nh1 {\n  color: #333;\n  text-align: center;\n}');
    const [jsCode, setJsCode] = useState('// JavaScript code\ndocument.addEventListener("DOMContentLoaded", function() {\n  console.log("Page loaded!");\n});');

    const [activeTab, setActiveTab] = useState('html');
    const [layout, setLayout] = useState('split'); // split, editor, preview
    const [theme, setTheme] = useState('vs-dark');
    const [autoRun, setAutoRun] = useState(true);
    const [isExecuting, setIsExecuting] = useState(false);
    const [isDebugging, setIsDebugging] = useState(false);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [debugInfo, setDebugInfo] = useState<string | null>(null);
    const [optimizedCode, setOptimizedCode] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);
    const [livePreview, setLivePreview] = useState<string>('');

    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
    const outputRef = useRef<HTMLDivElement>(null);
    const previewIframeRef = useRef<HTMLIFrameElement>(null);

    // Check if we're on the client side and apply device-specific optimizations
    useEffect(() => {
        setIsClient(true);
        
        // Apply mobile-specific optimizations
        if (isMobileDevice) {
            // Set a more mobile-friendly layout by default
            setLayout('editor');
            
            // Simplify the editor experience for mobile
            if (editorRef.current) {
                editorRef.current.updateOptions({
                    fontSize: 14,
                    minimap: { enabled: false },
                    lineNumbers: 'off',
                    scrollBeyondLastLine: false
                });
            }
        }
        
        // Apply reduced motion settings if needed
        if (shouldReduceMotion) {
            // Disable animations that might affect performance
            setAutoRun(false); // Disable auto-run to reduce processing
        }
    }, [isMobileDevice, shouldReduceMotion]);

    const handleEditorDidMount: OnMount = (editor: editor.IStandaloneCodeEditor) => {
        editorRef.current = editor;
        
        // Apply device-specific editor settings on mount
        if (isMobileDevice) {
            editor.updateOptions({
                fontSize: 14,
                minimap: { enabled: false },
                lineNumbers: 'off',
                scrollBeyondLastLine: false
            });
        }
        
        // Apply performance optimizations for reduced motion
        if (shouldReduceMotion) {
            editor.updateOptions({
                cursorBlinking: 'solid',
                cursorSmoothCaretAnimation: 'off',
                smoothScrolling: false
            });
        }
    };

    const getEditorLanguage = () => {
        switch (activeTab) {
            case 'html': return 'html';
            case 'css': return 'css';
            case 'js': return 'javascript';
            default: return 'html';
        }
    };

    const getEditorValue = () => {
        switch (activeTab) {
            case 'html': return htmlCode;
            case 'css': return cssCode;
            case 'js': return jsCode;
            default: return htmlCode;
        }
    };

    const setEditorValue = (value: string) => {
        switch (activeTab) {
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
    };

    const handleEditorChange = (value: string | undefined) => {
        if (value === undefined) return;
        
        setEditorValue(value);
        
        // Clear optimized code when user edits
        setOptimizedCode(null);
        
        if (autoRun) {
            runCode();
        }
    };

    const generateLivePreview = useCallback(() => {
        // Combine HTML, CSS, and JS
        const combinedCode = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Live Preview</title>
            <style>
                ${cssCode}
            </style>
        </head>
        <body>
            ${htmlCode}
            <script>
                ${jsCode}
            </script>
        </body>
        </html>
        `;
        
        return combinedCode;
    }, [cssCode, htmlCode, jsCode]);

    const runCode = useCallback(async () => {
        try {
            setIsExecuting(true);
            setError(null);
            setDebugInfo(null);
            
            // Generate combined code for live preview
            const previewCode = generateLivePreview();
            setLivePreview(previewCode);
            
            // Simulate execution (in a real app, this might run the code in a sandbox)
            setTimeout(() => {
                setIsExecuting(false);
                setOutput("Code executed successfully!");
            }, 500);
            
        } catch (error) {
            if (error instanceof Error) {
                setOutput('');
                setError(`Error: ${error.message}`);
            } else {
                setOutput('');
                setError(`Error: ${String(error)}`);
            }
        } finally {
            setIsExecuting(false);
        }
    }, [generateLivePreview, setDebugInfo, setError, setIsExecuting, setLivePreview, setOutput]);

    const debugCode = async () => {
        try {
            setIsDebugging(true);
            setDebugInfo("Analyzing code for issues...");
            
            const language = activeTab;
            const code = getEditorValue();
            
            // Built-in debugging logic (no API call)
            const debugResult = await generateDebugInfo(code, language);
            setDebugInfo(debugResult);
            
        } catch (error) {
            setDebugInfo(`Failed to debug code: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            setIsDebugging(false);
        }
    };

    const optimizeCode = async () => {
        try {
            setIsOptimizing(true);
            setDebugInfo("Optimizing code...");
            
            const code = getEditorValue();
            const language = activeTab;
            
            // Built-in optimization logic (no API call)
            const optimizationResult = await generateOptimizedCode(code, language);
            setOptimizedCode(optimizationResult);
            setDebugInfo("Optimization complete! Review the optimized code below.");
            
        } catch (error) {
            setDebugInfo(`Failed to optimize code: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            setIsOptimizing(false);
        }
    };

    // Built-in debugging function (instead of API call)
    const generateDebugInfo = async (code: string, language: string): Promise<string> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (language === 'html') {
                    // HTML code analysis
                    const issues = [];
                    
                    // Check for doctype
                    if (!code.toLowerCase().includes('<!doctype')) {
                        issues.push("- Warning: Missing DOCTYPE declaration");
                    }
                    
                    // Check for html tags
                    if (!code.includes('<html') || !code.includes('</html>')) {
                        issues.push("- Warning: Missing <html> tags");
                    }
                    
                    // Check for head tags
                    if (!code.includes('<head') || !code.includes('</head>')) {
                        issues.push("- Warning: Missing <head> tags");
                    }
                    
                    // Check for body tags
                    if (!code.includes('<body') || !code.includes('</body>')) {
                        issues.push("- Warning: Missing <body> tags");
                    }
                    
                    // Check for meta viewport
                    if (!code.includes('meta') || !code.includes('viewport')) {
                        issues.push("- Best Practice: Consider adding viewport meta tag for responsive design");
                    }
                    
                    // Check for tags without closing
                    const openTags = code.match(/<[a-zA-Z][a-zA-Z0-9]*(?=\s|>)[^>]*>/g) || [];
                    const selfClosingTags = ['img', 'input', 'br', 'hr', 'meta', 'link'];
                    const tagNames: string[] = [];
                    
                    openTags.forEach(tag => {
                        const tagMatch = tag.match(/<([a-zA-Z][a-zA-Z0-9]*)/);
                        if (tagMatch && tagMatch[1]) {
                            const tagName = tagMatch[1].toLowerCase();
                            if (!selfClosingTags.includes(tagName) && !tag.endsWith('/>')) {
                                tagNames.push(tagName);
                            }
                        }
                    });
                    
                    const closeTags = code.match(/<\/[a-zA-Z][a-zA-Z0-9]*>/g) || [];
                    const closeTagNames: string[] = [];
                    
                    closeTags.forEach(tag => {
                        const tagMatch = tag.match(/<\/([a-zA-Z][a-zA-Z0-9]*)>/);
                        if (tagMatch && tagMatch[1]) {
                            const tagName = tagMatch[1].toLowerCase();
                            closeTagNames.push(tagName);
                        }
                    });
                    
                    tagNames.forEach(tag => {
                        const count = tagNames.filter(t => t === tag).length;
                        const closeCount = closeTagNames.filter(t => t === tag).length;
                        
                        if (count !== closeCount) {
                            issues.push(`- Error: Mismatched <${tag}> tags (found ${count} opening and ${closeCount} closing tags)`);
                        }
                    });
                    
                    if (issues.length === 0) {
                        resolve("# HTML Code Analysis\n\nYour code looks good! No major issues detected.\n\nSuggestions for improvement:\n- Add semantic HTML5 elements like `<header>`, `<footer>`, `<nav>`, `<main>`, etc.\n- Consider adding more accessibility attributes");
                    } else {
                        resolve(`# HTML Code Analysis\n\nFound ${issues.length} potential issue(s):\n\n${issues.join('\n')}\n\nRecommendations:\n- Fix the issues listed above\n- Use semantic HTML5 elements\n- Consider adding ARIA attributes for accessibility`);
                    }
                } 
                else if (language === 'css') {
                    // CSS code analysis
                    const issues = [];
                    
                    // Check for vendor prefixes
                    if (code.includes('-webkit-') || code.includes('-moz-') || code.includes('-ms-')) {
                        issues.push("- Best Practice: Consider using a CSS preprocessor or autoprefixer for vendor prefixes");
                    }
                    
                    // Check for !important
                    if (code.includes('!important')) {
                        issues.push("- Warning: Avoid using !important as it breaks the natural cascading of CSS");
                    }
                    
                    // Check for mismatched braces
                    if ((code.match(/{/g) || []).length !== (code.match(/}/g) || []).length) {
                        issues.push("- Error: Mismatched braces in CSS");
                    }
                    
                    // Check for potential issues with units
                    if (code.match(/[0-9]px/g)) {
                        issues.push("- Best Practice: Consider using relative units (rem, em, %) instead of absolute pixels for better responsiveness");
                    }
                    
                    // Check for missing semicolons
                    const properties = code.match(/[a-zA-Z-]+\s*:\s*[^;{}]+/g) || [];
                    const missingSemicolons = properties.filter(prop => !prop.trim().endsWith(';') && !prop.includes('{') && !prop.includes('}'));
                    
                    if (missingSemicolons.length > 0) {
                        issues.push("- Warning: Some CSS properties are missing semicolons");
                    }
                    
                    if (issues.length === 0) {
                        resolve("# CSS Code Analysis\n\nYour code looks good! No major issues detected.\n\nSuggestions for improvement:\n- Consider using CSS custom properties (variables)\n- Organize your styles with a methodology like BEM or SMACSS");
                    } else {
                        resolve(`# CSS Code Analysis\n\nFound ${issues.length} potential issue(s):\n\n${issues.join('\n')}\n\nRecommendations:\n- Fix the issues listed above\n- Consider using CSS preprocessors like Sass or Less\n- Use a CSS methodology to organize your styles`);
                    }
                }
                else if (language === 'js') {
                    // JavaScript code analysis
                    const issues = [];
                    
                    // Check for semicolons
                    const lines = code.split('\n');
                    const missingSemicolons = lines.filter(line => {
                        const trimmed = line.trim();
                        return trimmed.length > 0 && 
                               !trimmed.endsWith(';') && 
                               !trimmed.endsWith('{') && 
                               !trimmed.endsWith('}') && 
                               !trimmed.endsWith(',') && 
                               !trimmed.startsWith('//') && 
                               !trimmed.startsWith('/*') && 
                               !trimmed.startsWith('*') && 
                               !trimmed.startsWith('if') && 
                               !trimmed.startsWith('else') && 
                               !trimmed.startsWith('for') && 
                               !trimmed.startsWith('while') && 
                               !trimmed.startsWith('function') && 
                               !trimmed.startsWith('});');
                    });
                    
                    if (missingSemicolons.length > 0) {
                        issues.push("- Warning: Some statements are missing semicolons");
                    }
                    
                    // Check for var usage
                    if (code.includes('var ')) {
                        issues.push("- Best Practice: Use 'const' or 'let' instead of 'var' for better variable scoping");
                    }
                    
                    // Check for console.log
                    if (code.includes('console.log')) {
                        issues.push("- Warning: Remove console.log statements before production");
                    }
                    
                    // Check for mismatched braces/parentheses
                    if ((code.match(/{/g) || []).length !== (code.match(/}/g) || []).length) {
                        issues.push("- Error: Mismatched curly braces");
                    }
                    
                    if ((code.match(/\(/g) || []).length !== (code.match(/\)/g) || []).length) {
                        issues.push("- Error: Mismatched parentheses");
                    }
                    
                    // Check for eval
                    if (code.includes('eval(')) {
                        issues.push("- Security: Avoid using eval() as it can lead to security vulnerabilities");
                    }
                    
                    if (issues.length === 0) {
                        resolve("# JavaScript Code Analysis\n\nYour code looks good! No major issues detected.\n\nSuggestions for improvement:\n- Use modern ES6+ features\n- Consider adding error handling with try/catch\n- Add comments to explain complex logic");
                    } else {
                        resolve(`# JavaScript Code Analysis\n\nFound ${issues.length} potential issue(s):\n\n${issues.join('\n')}\n\nRecommendations:\n- Fix the issues listed above\n- Use modern JavaScript features (arrow functions, template literals, etc.)\n- Consider adding error handling with try/catch blocks`);
                    }
                }
                else {
                    resolve("# Code Analysis\n\nUnable to analyze this language.");
                }
            }, 800);
        });
    };

    // Built-in optimization function (instead of API call)
    const generateOptimizedCode = async (code: string, language: string): Promise<string> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (language === 'html') {
                    let optimizedCode = code;
                    
                    // Add DOCTYPE if missing
                    if (!optimizedCode.toLowerCase().includes('<!doctype')) {
                        optimizedCode = `<!DOCTYPE html>\n${optimizedCode}`;
                    }
                    
                    // Add html tags if missing
                    if (!optimizedCode.includes('<html')) {
                        optimizedCode = `<!DOCTYPE html>\n<html lang="en">\n${optimizedCode}\n</html>`;
                    }
                    
                    // Add head tags if missing
                    if (!optimizedCode.includes('<head')) {
                        const htmlStartIndex = optimizedCode.indexOf('<html');
                        const htmlEndIndex = optimizedCode.indexOf('>', htmlStartIndex);
                        if (htmlEndIndex !== -1) {
                            optimizedCode = 
                                optimizedCode.substring(0, htmlEndIndex + 1) + 
                                '\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Web Page</title>\n</head>' + 
                                optimizedCode.substring(htmlEndIndex + 1);
                        }
                    }
                    
                    // Add body tags if missing
                    if (!optimizedCode.includes('<body')) {
                        const headEndIndex = optimizedCode.indexOf('</head>');
                        if (headEndIndex !== -1) {
                            optimizedCode = 
                                optimizedCode.substring(0, headEndIndex + 7) + 
                                '\n<body>\n  \n</body>' + 
                                optimizedCode.substring(headEndIndex + 7);
                        } else {
                            const htmlEndIndex = optimizedCode.indexOf('</html>');
                            if (htmlEndIndex !== -1) {
                                optimizedCode = 
                                    optimizedCode.substring(0, htmlEndIndex) + 
                                    '<body>\n  \n</body>\n' + 
                                    optimizedCode.substring(htmlEndIndex);
                            }
                        }
                    }
                    
                    // Format HTML (basic)
                    optimizedCode = optimizedCode
                        .replace(/>\s+</g, '>\n<')
                        .replace(/(<[^/][^>]*>)(?!\s*<)/g, '$1\n  ');
                    
                    resolve(optimizedCode);
                }
                else if (language === 'css') {
                    let optimizedCode = code;
                    
                    // Format CSS (basic)
                    optimizedCode = optimizedCode
                        .replace(/\s*{\s*/g, ' {\n  ')
                        .replace(/;\s*/g, ';\n  ')
                        .replace(/\s*}\s*/g, '\n}\n\n');
                    
                    // Add missing semicolons
                    optimizedCode = optimizedCode.replace(/([a-zA-Z0-9%)"']+)\s*\n\s*}/g, '$1;\n}');
                    
                    // Add CSS reset at the top if not present
                    if (!optimizedCode.includes('box-sizing') && !optimizedCode.includes('margin: 0')) {
                        optimizedCode = `/* Basic CSS Reset */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

${optimizedCode}`;
                    }
                    
                    resolve(optimizedCode);
                }
                else if (language === 'js') {
                    let optimizedCode = code;
                    
                    try {
                        // Wrap all optimizations in a try-catch to prevent any errors from breaking the component
                        // Replace var with const/let - safer implementation
                        const varRegex = /var\s+([a-zA-Z0-9_$]+)\s*=\s*([^;]+);/g;
                        optimizedCode = optimizedCode.replace(varRegex, (_match, varName, value) => {
                            // Check if value contains function-like content
                            if (value.includes('function(') || value.includes('=>') || value.includes('{')) {
                                return `const ${varName} = ${value};`;
                            } else {
                                return `let ${varName} = ${value};`;
                            }
                        });
                        
                        // Convert simple function expressions to arrow functions
                        // More conservative approach that only converts simple functions
                        const funcRegex = /function\s*\(([^)]*)\)\s*{\s*return\s+([^;{}]+);\s*}/g;
                        optimizedCode = optimizedCode.replace(funcRegex, (_match, params, returnValue) => {
                            return `(${params}) => ${returnValue}`;
                        });
                        
                        // Add missing semicolons - more conservative approach
                        const lines = optimizedCode.split('\n');
                        const processedLines = lines.map(line => {
                            const trimmed = line.trim();
                            if (trimmed.length === 0) return line;
                            if (trimmed.endsWith(';')) return line;
                            if (trimmed.endsWith('{')) return line;
                            if (trimmed.endsWith('}')) return line;
                            if (trimmed.endsWith(',')) return line;
                            if (trimmed.startsWith('//')) return line;
                            if (trimmed.startsWith('/*')) return line;
                            if (trimmed.startsWith('*')) return line;
                            if (trimmed.startsWith('if')) return line;
                            if (trimmed.startsWith('else')) return line;
                            if (trimmed.startsWith('for')) return line;
                            if (trimmed.startsWith('while')) return line;
                            if (trimmed.startsWith('function')) return line;
                            
                            // Check if line ends with a valid identifier, number, string, or closing bracket
                            const endsWithValidChar = /[a-zA-Z0-9_$"'`)]$/.test(trimmed);
                            if (endsWithValidChar) {
                                return line + ';';
                            }
                            return line;
                        });
                        optimizedCode = processedLines.join('\n');
                    
                    // Add "use strict" at the top if not present
                    if (!optimizedCode.includes('"use strict"') && !optimizedCode.includes("'use strict'")) {
                        optimizedCode = `"use strict";\n\n${optimizedCode}`;
                    }
                    } catch (error) {
                        // If any error occurs during optimization, return the original code
                        console.error("Error optimizing JavaScript:", error instanceof Error ? error.message : String(error));
                        return code;
                    }
                    
                    resolve(optimizedCode);
                }
                else {
                    resolve(code); // Return original code if language not supported
                }
            }, 1000);
        });
    };

    const applyOptimizedCode = () => {
        if (optimizedCode) {
            setEditorValue(optimizedCode);
            setOptimizedCode(null);
            setDebugInfo("Optimized code applied successfully!");
        }
    };

    const copyCode = () => {
        const codeToCopy = getEditorValue();
        navigator.clipboard.writeText(codeToCopy)
            .then(() => {
                setOutput("Code copied to clipboard!");
                setError(null);
            })
            .catch(err => {
                setError(`Failed to copy: ${err.message}`);
            });
    };

    const downloadCode = () => {
        const codeToCopy = getEditorValue();
        let extension;

        switch (activeTab) {
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
        const file = new Blob([codeToCopy], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `code.${extension}`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const downloadFullProject = () => {
        try {
            // Create a single HTML file with embedded CSS and JS
            const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web Project</title>
    <style>
        ${cssCode}
    </style>
</head>
<body>
    ${htmlCode}
    <script>
        ${jsCode}
    </script>
</body>
</html>`;
            
            // Create download link
            const element = document.createElement('a');
            const file = new Blob([fullHtml], { type: 'text/html' });
            element.href = URL.createObjectURL(file);
            element.download = 'web-project.html';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
            
            setOutput("Project downloaded as a single HTML file");
            setError(null);
        } catch (error) {
            setError(`Failed to download project: ${error instanceof Error ? error.message : String(error)}`);
        }
    };

    // Run the code only on the client side after initial render
    useEffect(() => {
        if (isClient) {
            runCode();
        }
    }, [isClient, runCode]);

    // If we're not on the client side (server-side rendering), show a loading state
    if (!isClient) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <p className="text-gray-600">Loading code playground...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Header */}
                <div className="bg-gray-100 px-4 py-3 flex justify-between items-center border-b">
                    <div className="flex items-center space-x-4">
                        <h2 className="text-lg font-semibold text-gray-800">Web Code Playground</h2>
                        <select
                            value={theme}
                            onChange={(e) => setTheme(e.target.value)}
                            className="bg-white  text-black text-sm border rounded px-2 py-1"
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
                            <label htmlFor="autoRun" className="text-sm text-gray-700">Live Preview</label>
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

                {/* Main content */}
                <div className={`flex ${layout === 'split' ? 'flex-col md:flex-row' : 'flex-col'}`}>
                    {/* Editor */}
                    {(layout === 'editor' || layout === 'split') && (
                        <div className={`${layout === 'split' ? 'md:w-1/2' : 'w-full'} border-r flex flex-col`}>
                            {/* Editor tabs */}
                            <div className="bg-gray-200 text-sm font-medium text-center text-gray-500 border-b border-gray-200">
                                <ul className="flex flex-wrap -mb-px">
                                    <li className="mr-2">
                                        <button
                                            className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'html'
                                                ? 'text-indigo-600 border-indigo-600 active'
                                                : 'border-transparent hover:text-gray-600 hover:border-gray-300'
                                                }`}
                                            onClick={() => setActiveTab('html')}
                                        >
                                            HTML
                                        </button>
                                    </li>
                                    <li className="mr-2">
                                        <button
                                            className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'css'
                                                ? 'text-indigo-600 border-indigo-600 active'
                                                : 'border-transparent hover:text-gray-600 hover:border-gray-300'
                                                }`}
                                            onClick={() => setActiveTab('css')}
                                        >
                                            CSS
                                        </button>
                                    </li>
                                    <li className="mr-2">
                                        <button
                                            className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'js'
                                                ? 'text-indigo-600 border-indigo-600 active'
                                                : 'border-transparent hover:text-gray-600 hover:border-gray-300'
                                                }`}
                                            onClick={() => setActiveTab('js')}
                                        >
                                            JavaScript
                                        </button>
                                    </li>
                                </ul>
                            </div>

                            {/* Editor toolbar */}
                            <div className="bg-gray-800 text-white p-2 flex justify-between items-center">
                                <span className="font-mono text-sm">{activeTab.toUpperCase()} Editor</span>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={runCode}
                                        disabled={isExecuting}
                                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm flex items-center space-x-1 disabled:opacity-50"
                                    >
                                        {isExecuting ? (
                                            <>
                                                <RefreshCw size={14} className="animate-spin" />
                                                <span>Updating...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Play size={14} />
                                                <span>Run</span>
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={debugCode}
                                        disabled={isDebugging}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center space-x-1 disabled:opacity-50"
                                        title="Debug Code"
                                    >
                                        {isDebugging ? (
                                            <>
                                                <RefreshCw size={14} className="animate-spin" />
                                                <span>Debugging...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Bug size={14} />
                                                <span>Debug</span>
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={optimizeCode}
                                        disabled={isOptimizing}
                                        className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm flex items-center space-x-1 disabled:opacity-50"
                                        title="Optimize Code"
                                    >
                                        {isOptimizing ? (
                                            <>
                                                <RefreshCw size={14} className="animate-spin" />
                                                <span>Optimizing...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Zap size={14} />
                                                <span>Optimize</span>
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={copyCode}
                                        className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded text-sm"
                                        title="Copy Code"
                                    >
                                        <Copy size={14} />
                                    </button>
                                    <button
                                        onClick={downloadCode}
                                        className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded text-sm"
                                        title="Download Code"
                                    >
                                        <Download size={14} />
                                    </button>
                                </div>
                            </div>

                            {/* Editor component */}
                            <div className="h-96 flex-grow">
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
                            </div>

                            {/* Debug/Optimize Panel */}
                            {(debugInfo || optimizedCode) && (
                                <div className="border-t overflow-y-auto bg-gray-50 h-64">
                                    <div className="p-2 bg-gray-200 flex justify-between items-center">
                                        <h3 className="font-semibold text-sm">
                                            {optimizedCode ? 'Optimized Code' : 'Debug Information'}
                                        </h3>
                                        <div className="flex space-x-2">
                                            {optimizedCode && (
                                                <button
                                                    onClick={applyOptimizedCode}
                                                    className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs"
                                                >
                                                    Apply Changes
                                                </button>
                                            )}
                                            <button
                                                onClick={() => {
                                                    setDebugInfo(null);
                                                    setOptimizedCode(null);
                                                }}
                                                className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs"
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-4 text-sm">
                                        {optimizedCode ? (
                                            <pre className="whitespace-pre-wrap p-2 bg-gray-100 rounded">{optimizedCode}</pre>
                                        ) : (
                                            <div className="markdown prose">
                                                <pre className="whitespace-pre-wrap p-2 bg-gray-100 rounded">{debugInfo}</pre>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Preview */}
                    {(layout === 'preview' || layout === 'split') && (
                        <div className={`${layout === 'split' ? 'md:w-1/2' : 'w-full'} flex flex-col`}>
                            <div className="bg-gray-800 text-white p-2 flex justify-between items-center">
                                <span className="font-mono text-sm">Preview</span>
                                <button
                                    onClick={runCode}
                                    className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-sm flex items-center space-x-1"
                                    title="Refresh Preview"
                                >
                                    <RefreshCw size={14} />
                                </button>
                            </div>
                            <div className="flex-grow flex flex-col">
                                <div className="flex-grow overflow-auto">
                                    <iframe
                                        ref={previewIframeRef}
                                        className="w-full h-full border-0"
                                        title="Code Preview"
                                        sandbox="allow-scripts allow-same-origin"
                                        srcDoc={livePreview}
                                    />
                                </div>
                                <div className="bg-black text-white p-2 h-32 overflow-y-auto">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs text-gray-400">Console Output</span>
                                        <button
                                            onClick={() => setOutput('')}
                                            className="text-xs text-gray-400 hover:text-white"
                                        >
                                            Clear
                                        </button>
                                    </div>
                                    <div ref={outputRef} className="font-mono text-xs">
                                        {error ? (
                                            <div className="text-red-400 flex items-start">
                                                <AlertTriangle size={12} className="mt-1 mr-1 flex-shrink-0" />
                                                <span>{error}</span>
                                            </div>
                                        ) : (
                                            output && <div className="text-green-400">{output}</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>


        </div>
    );
}