"use client";

import type React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import type { editor } from "monaco-editor";

// Import enhanced components
import PlaygroundHeader from "./PlaygroundHeader";
import EditorPane from "./EditorPane";
import AnalysisPane from "./AnalysisPane";
import EnhancedConsole from "./ConsolePanel";
import { formatAIResponse } from "./aiFormatterUtils";

// Use environment variable for the API key
const GEMINI_API_KEY =
  (typeof import.meta !== "undefined" &&
    import.meta.env?.VITE_GEMINI_API_KEY) ||
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_GEMINI_API_KEY) ||
  "";

interface CodePlaygroundProps {
  isMobileDevice?: boolean;
}

interface ConsoleMessage {
  id: string;
  type: "input" | "output" | "error" | "info" | "success" | "warning";
  content: string;
  timestamp: Date;
}

export default function CodePlayground({
  isMobileDevice = false,
}: CodePlaygroundProps) {
  // Code states for programming languages
  const [pythonCode, setPythonCode] =
    useState(`# Python Example - Fibonacci Calculator
def fibonacci(n):
    """Calculate the nth Fibonacci number"""
    if n <= 0:
        return "Please enter a positive integer"
    elif n == 1:
        return 0
    elif n == 2:
        return 1
    else:
        a, b = 0, 1
        for _ in range(2, n):
            a, b = b, a + b
        return b

# Test the function
number = 10
result = fibonacci(number)
print(f"The {number}th Fibonacci number is: {result}")

# Interactive input example
# user_input = int(input("Enter a number: "))
# print(f"Fibonacci of {user_input} is {fibonacci(user_input)}")`);

  const [cCode, setCCode] = useState(`// C Example - Array Operations
#include <stdio.h>
#include <stdlib.h>

void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n-1; i++) {
        for (int j = 0; j < n-i-1; j++) {
            if (arr[j] > arr[j+1]) {
                // Swap elements
                int temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
            }
        }
    }
}

void printArray(int arr[], int size) {
    for (int i = 0; i < size; i++) {
        printf("%d ", arr[i]);
    }
    printf("\\n");
}

int main() {
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int n = sizeof(arr)/sizeof(arr[0]);
    
    printf("Original array: ");
    printArray(arr, n);
    
    bubbleSort(arr, n);
    
    printf("Sorted array: ");
    printArray(arr, n);
    
    return 0;
}`);

  const [javaCode, setJavaCode] =
    useState(`// Java Example - Object-Oriented Calculator
public class Calculator {
    private String name;
    
    public Calculator(String name) {
        this.name = name;
    }
    
    public double add(double a, double b) {
        return a + b;
    }
    
    public double subtract(double a, double b) {
        return a - b;
    }
    
    public double multiply(double a, double b) {
        return a * b;
    }
    
    public double divide(double a, double b) {
        if (b == 0) {
            throw new IllegalArgumentException("Cannot divide by zero!");
        }
        return a / b;
    }
    
    public static void main(String[] args) {
        Calculator calc = new Calculator("Scientific Calculator");
        
        System.out.println("=== " + calc.name + " ===");
        System.out.println("Addition: 10 + 5 = " + calc.add(10, 5));
        System.out.println("Subtraction: 10 - 5 = " + calc.subtract(10, 5));
        System.out.println("Multiplication: 10 * 5 = " + calc.multiply(10, 5));
        System.out.println("Division: 10 / 5 = " + calc.divide(10, 5));
        
        // Example with error handling
        try {
            System.out.println("Division by zero: " + calc.divide(10, 0));
        } catch (IllegalArgumentException e) {
            System.out.println("Error: " + e.getMessage());
        }
    }
}`);

  const [activeTab, setActiveTab] = useState("python");
  const [layout, setLayout] = useState<"split" | "editor">("editor");
  const [autoRun, setAutoRun] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Console states
  const [consoleOutput, setConsoleOutput] = useState<ConsoleMessage[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [inputHistory, setInputHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [waitingForInput, setWaitingForInput] = useState(false);
  const [programInput, setProgramInput] = useState<string[]>([]);

  // Analysis states
  const [analysisType, setAnalysisType] = useState<
    "output" | "debug" | "optimize" | "analyze"
  >("output");
  const [analysisResult, setAnalysisResult] = useState("");

  // Resizer states
  const [isResizing, setIsResizing] = useState(false);
  const [resizeType, setResizeType] = useState<
    "horizontal" | "playground" | null
  >(null);
  const [editorWidth, setEditorWidth] = useState(50);
  const [playgroundHeight, setPlaygroundHeight] = useState(700);

  // Refs
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const consoleRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const playgroundRef = useRef<HTMLDivElement>(null);
  const resizeStartPosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const resizeStartDimensions = useRef<{
    width: number;
    playgroundHeight: number;
  }>({ width: 50, playgroundHeight: 700 });

  // Initialize client-side
  useEffect(() => {
    setIsClient(true);
    if (!GEMINI_API_KEY) {
      addConsoleMessage(
        "warning",
        "⚠️ Gemini API key not found. Add NEXT_PUBLIC_GEMINI_API_KEY to your environment variables."
      );
    } else {
      addConsoleMessage(
        "success",
        "🤖 AI Code Playground ready! Select a programming language and start coding."
      );
    }

    if (isMobileDevice) {
      setLayout("editor");
      setPlaygroundHeight(650);
    }
  }, [isMobileDevice]);

  // Console helper functions
  const addConsoleMessage = (type: ConsoleMessage["type"], content: string) => {
    const id = Date.now().toString();
    setConsoleOutput((prev) => [
      ...prev,
      { id, type, content, timestamp: new Date() },
    ]);
  };

  const clearConsole = () => {
    setConsoleOutput([]);
    addConsoleMessage("info", "🧹 Console cleared");
  };

  const handleInputSubmit = () => {
    if (!currentInput.trim()) return;

    addConsoleMessage("input", currentInput);
    setInputHistory((prev) => [...prev, currentInput]);
    setHistoryIndex(-1);

    if (waitingForInput) {
      setProgramInput((prev) => [...prev, currentInput]);
      setWaitingForInput(false);
      addConsoleMessage("success", "✅ Input provided to program");
    } else {
      addConsoleMessage("info", `💬 Command executed: ${currentInput}`);
    }

    setCurrentInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleInputSubmit();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (inputHistory.length > 0) {
        const newIndex =
          historyIndex === -1
            ? inputHistory.length - 1
            : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentInput(inputHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= inputHistory.length) {
          setHistoryIndex(-1);
          setCurrentInput("");
        } else {
          setHistoryIndex(newIndex);
          setCurrentInput(inputHistory[newIndex]);
        }
      }
    } else if (e.key === "Escape") {
      setCurrentInput("");
      setHistoryIndex(-1);
    } else if (e.ctrlKey && e.key === "c") {
      clearConsole();
    }
  };

  // Editor helper functions
  const getEditorLanguage = () => {
    switch (activeTab) {
      case "python":
        return "python";
      case "c":
        return "c";
      case "java":
        return "java";
      default:
        return "python";
    }
  };

  const getEditorValue = () => {
    switch (activeTab) {
      case "python":
        return pythonCode;
      case "c":
        return cCode;
      case "java":
        return javaCode;
      default:
        return pythonCode;
    }
  };

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    if (isMobileDevice) {
      editor.updateOptions({
        fontSize: 14,
        minimap: { enabled: false },
        lineNumbers: "off",
        scrollBeyondLastLine: false,
      });
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value === undefined) return;

    switch (activeTab) {
      case "python":
        setPythonCode(value);
        break;
      case "c":
        setCCode(value);
        break;
      case "java":
        setJavaCode(value);
        break;
    }

    if (autoRun) {
      runCode();
    }
  };

  // Enhanced resizer handlers
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing || !playgroundRef.current) return;
      e.preventDefault();

      if (resizeType === "horizontal") {
        const rect = playgroundRef.current.getBoundingClientRect();
        const deltaX = e.clientX - resizeStartPosition.current.x;
        const containerWidth = rect.width;
        const deltaPercent = (deltaX / containerWidth) * 100;
        const newWidth = resizeStartDimensions.current.width + deltaPercent;
        setEditorWidth(Math.max(30, Math.min(80, newWidth)));
      } else if (resizeType === "playground") {
        const deltaY = e.clientY - resizeStartPosition.current.y;
        const newHeight =
          resizeStartDimensions.current.playgroundHeight + deltaY;
        setPlaygroundHeight(Math.max(400, Math.min(1400, newHeight)));
      }
    },
    [isResizing, resizeType]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    setResizeType(null);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
    document.body.style.pointerEvents = "";
  }, []);

  const startResize = (
    type: "horizontal" | "playground",
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setResizeType(type);
    setIsResizing(true);
    resizeStartPosition.current = { x: e.clientX, y: e.clientY };
    resizeStartDimensions.current = {
      width: editorWidth,
      playgroundHeight: playgroundHeight,
    };
    document.body.style.cursor =
      type === "horizontal" ? "col-resize" : "row-resize";
    document.body.style.userSelect = "none";
    document.body.style.pointerEvents = "none";
  };

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove, {
        passive: false,
      });
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  // Enhanced API call function
  const callGeminiAPI = async (prompt: string, outputMode: string) => {
    if (!GEMINI_API_KEY) {
      addConsoleMessage("error", "❌ Gemini API key is missing.");
      return null;
    }
    setIsLoading(true);
    addConsoleMessage("info", `🤖 AI ${outputMode} analysis started...`);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
          }),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error?.message ||
            `API request failed with status ${response.status}`
        );
      }
      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error("Unexpected response format from Gemini API");
      }

      const fullResponse = data.candidates[0].content.parts[0].text;
      addConsoleMessage("success", `✅ AI ${outputMode} analysis completed`);
      return fullResponse;
    } catch (error) {
      let errorMessage = "An unknown error occurred";
      if (error instanceof Error) {
        errorMessage = error.message;
        if (errorMessage.includes("API key not valid")) {
          errorMessage = "Invalid Gemini API key. Please check your API key.";
        }
      }
      addConsoleMessage("error", `❌ Error: ${errorMessage}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced code execution functions
  const detectInputRequirement = (code: string, language: string) => {
    if (language === "python") {
      return code.includes("input(") || code.includes("raw_input(");
    } else if (language === "c") {
      return (
        code.includes("scanf") ||
        code.includes("gets") ||
        code.includes("fgets")
      );
    } else if (language === "java") {
      return (
        code.includes("Scanner") ||
        code.includes("readLine") ||
        code.includes("System.in")
      );
    }
    return false;
  };

  const runCode = async () => {
    setLayout("split");
    setAnalysisType("output");

    const code = getEditorValue();
    const language = getEditorLanguage();
    const requiresInput = detectInputRequirement(code, language);

    if (requiresInput && programInput.length === 0) {
      setAnalysisResult(
        formatAIResponse(
          `### Input Required

This code appears to require user input. Please provide input using the console below:

**How to provide input:**
- Type your input values in the console
- Press Enter to submit each input
- Run the code again after providing input

**Input Methods Detected:**
${
  language === "python"
    ? "• `input()` function calls"
    : language === "c"
    ? "• `scanf()` or `gets()` function calls"
    : "• `Scanner` or `System.in` usage"
}

**Example:**
If your code asks for a number, simply type \`42\` in the console and press Enter.
      `,
          "output"
        )
      );

      setWaitingForInput(true);
      addConsoleMessage(
        "warning",
        "⚠️ This program requires input. Please type your input below and press Enter."
      );
      return;
    }

    const prompt = `You are an expert ${language} code executor. Please execute this code and show ONLY the program output:

${
  programInput.length > 0
    ? `**User Input Provided:** ${programInput.join(", ")}`
    : ""
}

**Code to Execute:**
\`\`\`${language}
${code}
\`\`\`

IMPORTANT: Show ONLY the exact output that this program would produce when executed. Do not include:
- Code analysis
- Explanations
- Educational insights
- Step-by-step breakdowns
- Quality assessments

Just show the clean program output as it would appear in a terminal or console.

Format the output clearly and concisely.`;

    const result = await callGeminiAPI(prompt, "execution");
    if (result) {
      setAnalysisResult(formatAIResponse(result, "output"));
    }
  };

  const debugCode = async () => {
    setLayout("split");
    setAnalysisType("debug");

    const code = getEditorValue();
    const language = getEditorLanguage();

    const prompt = `You are an expert ${language} debugging specialist. Please thoroughly debug this code:

\`\`\`${language}
${code}
\`\`\`

Provide a comprehensive debugging report in this format:

=== DEBUGGING REPORT ===
Overall assessment of potential issues and code health.

=== SYNTAX ANALYSIS ===
Check for syntax errors, typos, and structural issues.

=== LOGIC ANALYSIS ===
Identify logical errors, edge cases, and potential runtime issues.

=== PERFORMANCE ANALYSIS ===
Highlight performance bottlenecks and inefficiencies.

=== SECURITY ANALYSIS ===
Identify potential security vulnerabilities and unsafe practices.

=== FIXED CODE ===
\`\`\`${language}
[Provide the corrected version of the code with all issues fixed]
\`\`\`

=== EXPLANATION OF FIXES ===
Detailed explanation of each fix and why it was necessary.

=== PREVENTION TIPS ===
Best practices to avoid similar issues in the future.

Be thorough and educational. Include specific line references where applicable.`;

    const result = await callGeminiAPI(prompt, "debugging");
    if (result) {
      setAnalysisResult(formatAIResponse(result, "debug"));
    }
  };

  const optimizeCode = async () => {
    setLayout("split");
    setAnalysisType("optimize");

    const code = getEditorValue();
    const language = getEditorLanguage();

    const prompt = `You are an expert ${language} optimization specialist. Please optimize this code for performance, readability, and maintainability:

\`\`\`${language}
${code}
\`\`\`

Provide a comprehensive optimization analysis:

=== OPTIMIZATION OVERVIEW ===
Summary of optimization opportunities and potential improvements.

=== PERFORMANCE ANALYSIS ===
**Time Complexity:** Current vs optimized
**Space Complexity:** Memory usage analysis
**Bottlenecks:** Identified performance issues

=== OPTIMIZED CODE ===
\`\`\`${language}
[Highly optimized version with improved algorithms and best practices]
\`\`\`

=== OPTIMIZATION TECHNIQUES ===
Detailed explanation of optimization techniques applied:
- Algorithm improvements
- Data structure optimizations
- Code restructuring
- Modern language features utilized

=== PERFORMANCE METRICS ===
Expected performance improvements with benchmarks and comparisons.

=== READABILITY ENHANCEMENTS ===
How the code was made more maintainable and readable.

=== BEST PRACTICES APPLIED ===
Modern ${language} conventions and industry standards implemented.

Focus on both micro and macro optimizations while maintaining code clarity.`;

    const result = await callGeminiAPI(prompt, "optimization");
    if (result) {
      setAnalysisResult(formatAIResponse(result, "optimize"));
    }
  };

  const fullAnalysis = async () => {
    setLayout("split");
    setAnalysisType("analyze");

    const code = getEditorValue();
    const language = getEditorLanguage();

    const prompt = `You are a senior software engineer providing a comprehensive code review for this ${language} code:

\`\`\`${language}
${code}
\`\`\`

Provide an in-depth analysis covering all aspects:

=== EXECUTIVE SUMMARY ===
High-level overview of code quality and key findings.

=== ARCHITECTURE ANALYSIS ===
Code structure, design patterns, and architectural decisions.

=== FUNCTIONALITY ASSESSMENT ===
What the code does, how it works, and its intended purpose.

=== CODE QUALITY METRICS ===
**Readability:** How easy is it to understand?
**Maintainability:** How easy is it to modify?
**Testability:** How well can it be tested?
**Reusability:** How modular and reusable is it?

=== TECHNICAL ANALYSIS ===
**Algorithm Efficiency:** Time and space complexity
**Error Handling:** Robustness and edge case coverage
**Security Considerations:** Potential vulnerabilities
**Concurrency:** Thread safety and parallel processing

=== ADHERENCE TO STANDARDS ===
Compliance with ${language} conventions and industry best practices.

=== IMPROVEMENT RECOMMENDATIONS ===
Prioritized list of specific improvements:
1. Critical issues requiring immediate attention
2. Performance optimizations
3. Code quality enhancements
4. Long-term architectural improvements

=== EDUCATIONAL VALUE ===
Programming concepts and patterns demonstrated in this code.

=== OVERALL RATING ===
**Functionality:** [1-10]/10
**Performance:** [1-10]/10
**Readability:** [1-10]/10
**Maintainability:** [1-10]/10
**Security:** [1-10]/10
**Overall Score:** [1-10]/10

Provide detailed, actionable feedback with specific examples and suggestions.`;

    const result = await callGeminiAPI(prompt, "analysis");
    if (result) {
      setAnalysisResult(formatAIResponse(result, "analyze"));
    }
  };

  if (!isClient) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
              <span className="text-white text-xs font-bold">AI</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl opacity-20 animate-pulse"></div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Loading AI Code Playground
          </h3>
          <p className="text-gray-600">
            Initializing your intelligent coding environment...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50/80 flex flex-col select-none">
      <style>{`
        /* Enhanced scrollbar styling */
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { 
          background: linear-gradient(135deg, #cbd5e1, #94a3b8); 
          border-radius: 4px; 
          border: 1px solid rgba(148, 163, 184, 0.3);
        }
        ::-webkit-scrollbar-thumb:hover { background: linear-gradient(135deg, #94a3b8, #64748b); }
        ::-webkit-scrollbar-corner { background: transparent; }
        * { scrollbar-width: thin; scrollbar-color: #cbd5e1 transparent; }
        
        /* Smooth animations */
        .console-message { animation: slideInUp 0.3s ease-out; }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        /* Resize handle styling */
        .resize-handle {
          position: relative;
          transition: all 0.2s ease;
        }
        .resize-handle:hover::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          opacity: 0.1;
        }
        
        /* Scrollbar styling for console */
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }
        .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>

      <div
        ref={playgroundRef}
        className="bg-white flex flex-col select-none border border-gray-200/80 rounded-2xl shadow-xl shadow-gray-900/5 overflow-hidden backdrop-blur-sm"
        style={{ height: `${playgroundHeight}px` }}
      >
        <PlaygroundHeader
          autoRun={autoRun}
          setAutoRun={setAutoRun}
          layout={layout}
          setLayout={setLayout}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex overflow-hidden">
            <EditorPane
              activeTab={activeTab as "python" | "c" | "java"}
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
              width={layout === "split" ? `${editorWidth}%` : "100%"}
            />

            {layout === "split" && (
              <div
                className="w-1 bg-gray-200/80 hover:bg-blue-400 cursor-col-resize transition-all duration-200 flex-shrink-0 resize-handle group"
                onMouseDown={(e) => startResize("horizontal", e)}
              ></div>
            )}

            {layout === "split" && (
              <AnalysisPane
                analysisType={analysisType}
                analysisResult={analysisResult}
                isLoading={isLoading}
                width={`${100 - editorWidth}%`}
              />
            )}
          </div>

          {/* Console Component - Now properly positioned */}
          <EnhancedConsole
            consoleOutput={consoleOutput}
            currentInput={currentInput}
            setCurrentInput={setCurrentInput}
            waitingForInput={waitingForInput}
            handleInputSubmit={handleInputSubmit}
            handleKeyDown={handleKeyDown}
            clearConsole={clearConsole}
            consoleRef={consoleRef}
            inputRef={inputRef}
            initialHeight={isMobileDevice ? 200 : 250}
            minHeight={150}
            maxHeight={400}
          />
        </div>
      </div>

      {/* Enhanced playground resize handle */}
      <div
        className="h-3 bg-gray-200 hover:bg-blue-400 cursor-row-resize transition-colors flex-shrink-0 active:bg-blue-500 border-t border-gray-300 flex items-center justify-center group"
        onMouseDown={(e) => startResize("playground", e)}
      >
        <div className="flex space-x-1 opacity-50 group-hover:opacity-75 transition-opacity">
          <div className="w-8 h-0.5 bg-gray-400 rounded"></div>
          <div className="w-8 h-0.5 bg-gray-400 rounded"></div>
          <div className="w-8 h-0.5 bg-gray-400 rounded"></div>
        </div>
      </div>
    </div>
  );
}