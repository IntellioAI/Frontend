"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Check, AlertTriangle, Terminal } from "lucide-react"
import type { editor } from "monaco-editor"

// Import components
import PlaygroundHeader from "./PlaygroundHeader"
import EditorPane from "./EditorPane"
import ConsolePanel from "./ConsolePanel"
import AnalysisPane from "./AnalysisPane"
import { formatAIResponse } from "./AIFormatter"

// Use environment variable for the API key.
// • Vite → `import.meta.env.VITE_GEMINI_API_KEY`
// • Next → `process.env.NEXT_PUBLIC_GEMINI_API_KEY`
// Guard the access so neither path crashes when it’s undefined.
const GEMINI_API_KEY =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_GEMINI_API_KEY) ||
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_GEMINI_API_KEY) ||
  "" // fallback (empty string) so later checks handle “missing key” gracefully

interface CodePlaygroundProps {
  isMobileDevice?: boolean
}

export default function CodePlayground({ isMobileDevice = false }: CodePlaygroundProps) {
  // Code states for programming languages
  const [pythonCode, setPythonCode] = useState('# Python code\nprint("Hello World!")')
  const [cCode, setCCode] = useState(
    '// C code\n#include <stdio.h>\n\nint main() {\n    printf("Hello World!\\n");\n    return 0;\n}',
  )
  const [javaCode, setJavaCode] = useState(
    '// Java code\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello World!");\n    }\n}',
  )

  const [activeTab, setActiveTab] = useState("python")
  const [layout, setLayout] = useState<"split" | "editor">("editor")
  const [autoRun, setAutoRun] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showConsole, setShowConsole] = useState(true)
  const [isClient, setIsClient] = useState(false)

  // Console states
  const [consoleOutput, setConsoleOutput] = useState<
    Array<{
      id: string
      type: "input" | "output" | "error" | "info" | "success" | "warning"
      content: string
      timestamp: Date
    }>
  >([])
  const [currentInput, setCurrentInput] = useState("")
  const [inputHistory, setInputHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [waitingForInput, setWaitingForInput] = useState(false)
  const [programInput, setProgramInput] = useState<string[]>([])

  // Analysis states
  const [analysisType, setAnalysisType] = useState<"output" | "debug" | "optimize" | "analyze">("output")
  const [analysisResult, setAnalysisResult] = useState("")

  // Notification states
  const [showChangeNotification, setShowChangeNotification] = useState(false)
  const [changeNotificationType] = useState<"success" | "error" | "warning" | "info">(
    "success",
  )
  const [changeNotificationMessage] = useState("")

  // Resizer states
  const [isResizing, setIsResizing] = useState(false)
  const [resizeType, setResizeType] = useState<"horizontal" | "vertical" | "playground" | null>(null)
  const [editorWidth, setEditorWidth] = useState(50)
  const [consoleHeight, setConsoleHeight] = useState(250)
  const [playgroundHeight, setPlaygroundHeight] = useState(700)

  // Refs
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const consoleRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const playgroundRef = useRef<HTMLDivElement>(null)
  const resizeStartPosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const resizeStartDimensions = useRef<{
    width: number
    height: number
    playgroundHeight: number
  }>({ width: 50, height: 250, playgroundHeight: 700 })

  // Initialize client-side
  useEffect(() => {
    setIsClient(true)
    if (!GEMINI_API_KEY) {
      addConsoleMessage(
        "warning",
        "Warning: Gemini API key not found. Please add NEXT_PUBLIC_GEMINI_API_KEY to your environment variables.",
      )
    } else {
      addConsoleMessage("info", "AI Code Playground ready! Type your code and use AI tools for analysis.")
    }

    if (isMobileDevice) {
      setLayout("editor")
      setConsoleHeight(200)
      setPlaygroundHeight(650)
    }
  }, [isMobileDevice])

  // Handle notification auto-hide
  useEffect(() => {
    if (showChangeNotification) {
      const timer = setTimeout(() => setShowChangeNotification(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [showChangeNotification])

  // Scroll console to bottom when new messages arrive
  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight
    }
  }, [consoleOutput])

  // Console helper functions
  const addConsoleMessage = (type: "input" | "output" | "error" | "info" | "success" | "warning", content: string) => {
    const id = Date.now().toString()
    setConsoleOutput((prev) => [...prev, { id, type, content, timestamp: new Date() }])
  }

  const clearConsole = () => {
    setConsoleOutput([])
    addConsoleMessage("info", "Console cleared")
  }

  const handleInputSubmit = () => {
    if (!currentInput.trim()) return

    addConsoleMessage("input", currentInput)
    setInputHistory((prev) => [...prev, currentInput])
    setHistoryIndex(-1)

    if (waitingForInput) {
      setProgramInput((prev) => [...prev, currentInput])
      setWaitingForInput(false)
      addConsoleMessage("info", "Input provided to program")
    } else {
      addConsoleMessage("info", `Command executed: ${currentInput}`)
    }

    setCurrentInput("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleInputSubmit()
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (inputHistory.length > 0) {
        const newIndex = historyIndex === -1 ? inputHistory.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setCurrentInput(inputHistory[newIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1
        if (newIndex >= inputHistory.length) {
          setHistoryIndex(-1)
          setCurrentInput("")
        } else {
          setHistoryIndex(newIndex)
          setCurrentInput(inputHistory[newIndex])
        }
      }
    }
  }

  // Editor helper functions
  const getEditorLanguage = () => {
    switch (activeTab) {
      case "python":
        return "python"
      case "c":
        return "c"
      case "java":
        return "java"
      default:
        return "python"
    }
  }

  const getEditorValue = () => {
    switch (activeTab) {
      case "python":
        return pythonCode
      case "c":
        return cCode
      case "java":
        return javaCode
      default:
        return pythonCode
    }
  }

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor
    if (isMobileDevice) {
      editor.updateOptions({
        fontSize: 14,
        minimap: { enabled: false },
        lineNumbers: "off",
        scrollBeyondLastLine: false,
      })
    }
  }

  const handleEditorChange = (value: string | undefined) => {
    if (value === undefined) return

    switch (activeTab) {
      case "python":
        setPythonCode(value)
        break
      case "c":
        setCCode(value)
        break
      case "java":
        setJavaCode(value)
        break
    }

    if (autoRun) {
      runCode()
    }
  }

  // Resizer handlers
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing || !playgroundRef.current) return
      e.preventDefault()

      if (resizeType === "horizontal") {
        const rect = playgroundRef.current.getBoundingClientRect()
        const deltaX = e.clientX - resizeStartPosition.current.x
        const containerWidth = rect.width
        const deltaPercent = (deltaX / containerWidth) * 100
        const newWidth = resizeStartDimensions.current.width + deltaPercent
        setEditorWidth(Math.max(35, Math.min(70, newWidth)))
      } else if (resizeType === "vertical") {
        const deltaY = resizeStartPosition.current.y - e.clientY
        const newHeight = resizeStartDimensions.current.height + deltaY
        setConsoleHeight(Math.max(150, Math.min(500, newHeight)))
      } else if (resizeType === "playground") {
        const deltaY = e.clientY - resizeStartPosition.current.y
        const newHeight = resizeStartDimensions.current.playgroundHeight + deltaY
        setPlaygroundHeight(Math.max(600, newHeight))
      }
    },
    [isResizing, resizeType],
  )

  const handleMouseUp = useCallback(() => {
    setIsResizing(false)
    setResizeType(null)
    document.body.style.cursor = ""
    document.body.style.userSelect = ""
    document.body.style.pointerEvents = ""
  }, [])

  const startResize = (type: "horizontal" | "vertical" | "playground", e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setResizeType(type)
    setIsResizing(true)
    resizeStartPosition.current = { x: e.clientX, y: e.clientY }
    resizeStartDimensions.current = {
      width: editorWidth,
      height: consoleHeight,
      playgroundHeight: playgroundHeight,
    }
    document.body.style.cursor = type === "horizontal" ? "col-resize" : "row-resize"
    document.body.style.userSelect = "none"
    document.body.style.pointerEvents = "none"
  }

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove, { passive: false })
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isResizing, handleMouseMove, handleMouseUp])

  // API call function
  const callGeminiAPI = async (prompt: string, outputMode: string) => {
    if (!GEMINI_API_KEY) {
      addConsoleMessage("error", "Error: Gemini API key is missing.")
      return null
    }
    setIsLoading(true)
    addConsoleMessage("info", `🤖 AI ${outputMode} analysis started...`)

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
          }),
        },
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || `API request failed with status ${response.status}`)
      }
      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error("Unexpected response format from Gemini API")
      }

      const fullResponse = data.candidates[0].content.parts[0].text
      let processedResponse = ""

      if (outputMode === "run") {
        const outputSection = extractSection(fullResponse, "EXPECTED OUTPUT")
        processedResponse = outputSection || "No output was generated."
        if (programInput.length > 0) {
          const inputSection = extractSection(fullResponse, "INPUT HANDLING")
          if (inputSection) {
            processedResponse = `=== INPUT ===\n${programInput.join("\n")}\n\n=== OUTPUT ===\n${processedResponse}`
          }
        }
        addConsoleMessage("success", "✅ Code execution completed")
      } else if (outputMode === "debug") {
        const debuggingReport = extractSection(fullResponse, "DEBUGGING REPORT")
        const fixedCode = extractSection(fullResponse, "FIXED CODE")
        addConsoleMessage("success", "🐛 Debug analysis completed")
        return { analysis: debuggingReport, fixedCode: fixedCode }
      } else if (outputMode === "optimize") {
        const optimizedCode = extractSection(fullResponse, "OPTIMIZED CODE")
        addConsoleMessage("success", "⚡ Code optimization completed")
        return optimizedCode || "No optimized code was generated."
      } else if (outputMode === "analyze") {
        processedResponse = fullResponse
        addConsoleMessage("success", "📊 Full analysis completed")
      }

      return processedResponse || fullResponse
    } catch (error) {
      let errorMessage = "An unknown error occurred"
      if (error instanceof Error) {
        errorMessage = error.message
        if (errorMessage.includes("API key not valid")) {
          errorMessage = "Invalid Gemini API key. Please check your API key."
        }
      }
      addConsoleMessage("error", `❌ Error: ${errorMessage}`)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const extractSection = (text: string, sectionName: string) => {
    const regex = new RegExp(`===\\s*${sectionName}\\s*===\\s*([\\s\\S]*?)(?:===\\s*|$)`, "i")
    const match = text.match(regex)

    if (sectionName.includes("CODE")) {
      const codeBlockRegex = /```[\w]*\n([\s\S]*?)```/g
      const codeMatches = text.matchAll(codeBlockRegex)
      for (const codeMatch of codeMatches) {
        return codeMatch[1]
      }
    }

    return match ? match[1].trim() : null
  }

  // Code execution functions
  const detectInputRequirement = (code: string, language: string) => {
    if (language === "python") {
      return code.includes("input(") || code.includes("raw_input(")
    } else if (language === "c") {
      return code.includes("scanf") || code.includes("gets") || code.includes("fgets")
    } else if (language === "java") {
      return code.includes("Scanner") || code.includes("readLine") || code.includes("System.in")
    }
    return false
  }

  const runCode = async () => {
    setLayout("split")
    setAnalysisType("output")

    const code = getEditorValue()
    const language = getEditorLanguage()
    const requiresInput = detectInputRequirement(code, language)

    if (requiresInput && programInput.length === 0) {
      setAnalysisResult(
        formatAIResponse(
          `
        === INPUT REQUIRED ===
        This code appears to require user input. Please provide input using the console below:
        
        **How to provide input:**
        - Type your input values in the console
        - Press Enter to submit each input
        - Run the code again after providing input
        
        **Input Methods Detected:**
        ${
          language === "python"
            ? "• input() function calls"
            : language === "c"
              ? "• scanf() or gets() function calls"
              : "• Scanner or System.in usage"
        }
      `,
          "output",
        ),
      )

      setWaitingForInput(true)
      addConsoleMessage("warning", "⚠️ This program requires input. Please type your input below and press Enter.")
      return
    }

    const prompt = `You are a ${language} code analyzer and executor. Please:
1. Check if this code is syntactically correct
2. If correct, run this code ${programInput.length > 0 ? `with the following input: "${programInput.join("\\n")}"` : "without any input"}
3. Show the expected output with proper formatting
4. If incorrect, explain the errors and how to fix them
5. Provide a corrected version if there are errors

Code:
\`\`\`${language}
${code}
\`\`\`

Format your response like this:
=== CODE ANALYSIS ===
[Brief assessment of code correctness and quality]

=== EXPECTED OUTPUT ===
[Actual program output or error messages if incorrect]

=== INPUT HANDLING ===
[If the code requires input, explain how the input was processed]

=== EXECUTION DETAILS ===
[Step-by-step execution flow and any important notes]

=== SUGGESTED IMPROVEMENTS ===
[If errors exist or improvements possible, provide specific suggestions]`

    const result = await callGeminiAPI(prompt, "run")
    if (result) {
      setAnalysisResult(formatAIResponse(result, "output"))
    }
  }

  const debugCode = async () => {
    setLayout("split")
    setAnalysisType("debug")

    const code = getEditorValue()
    const language = getEditorLanguage()

    const prompt = `Debug the following ${language} code with comprehensive analysis:
1. Identify ALL potential issues (syntax, runtime, logical, performance)
2. Explain each issue in detail with line references
3. Provide completely fixed and improved code
4. Suggest best practices and coding standards
${programInput.length > 0 ? `5. Consider how the code handles this input: "${programInput.join("\\n")}"` : ""}

Code:
\`\`\`${language}
${code}
\`\`\`

Format your response like this:
=== DEBUGGING REPORT ===
[Comprehensive analysis of all issues found]

=== ISSUE BREAKDOWN ===
**Syntax Errors:** [List any syntax issues]
**Runtime Errors:** [List potential runtime problems]
**Logic Errors:** [List logical mistakes]
**Performance Issues:** [List inefficiencies]

=== FIXED CODE ===
\`\`\`${language}
[Completely corrected and improved code]
\`\`\`

=== EXPLANATION OF FIXES ===
[Detailed explanation of each fix applied]

=== BEST PRACTICES ===
[Modern coding standards and recommendations for ${language}]

=== SECURITY CONSIDERATIONS ===
[Any security improvements or vulnerabilities addressed]`

    const result = await callGeminiAPI(prompt, "debug")
    if (result) {
      const formattedResult = formatAIResponse(
        `=== DEBUGGING REPORT ===\n${result.analysis}\n\n=== FIXED CODE ===\n\`\`\`${getEditorLanguage()}\n${result.fixedCode}\n\`\`\``,
        "debug",
      )
      setAnalysisResult(formattedResult)
    }
  }

  const optimizeCode = async () => {
    setLayout("split")
    setAnalysisType("optimize")

    const code = getEditorValue()
    const language = getEditorLanguage()

    const prompt = `Optimize the following ${language} code for maximum performance, readability, and maintainability:

Code:
\`\`\`${language}
${code}
\`\`\`

Format your response like this:
=== OPTIMIZATION ANALYSIS ===
[Detailed analysis of current code performance and areas for improvement]

=== PERFORMANCE IMPROVEMENTS ===
**Time Complexity:** [Analysis and improvements]
**Space Complexity:** [Memory usage optimizations]
**Algorithm Efficiency:** [Better algorithms or data structures]

=== OPTIMIZED CODE ===
\`\`\`${language}
[Highly optimized version of the code]
\`\`\`

=== OPTIMIZATION TECHNIQUES APPLIED ===
[Specific techniques used to improve the code]

=== PERFORMANCE GAINS ===
[Expected performance improvements with metrics]

=== READABILITY ENHANCEMENTS ===
[How the code was made more readable and maintainable]

=== MODERN ${language.toUpperCase()} FEATURES ===
[Latest language features and best practices utilized]`

    const result = await callGeminiAPI(prompt, "optimize")
    if (result) {
      const formattedResult = formatAIResponse(
        `=== OPTIMIZATION ANALYSIS ===\nCode has been thoroughly optimized for performance and readability.\n\n=== OPTIMIZED CODE ===\n\`\`\`${getEditorLanguage()}\n${result}\n\`\`\``,
        "optimize",
      )
      setAnalysisResult(formattedResult)
    }
  }

  const fullAnalysis = async () => {
    setLayout("split")
    setAnalysisType("analyze")

    const code = getEditorValue()
    const language = getEditorLanguage()

    const prompt = `Perform a comprehensive analysis of the following ${language} code:

Code:
\`\`\`${language}
${code}
\`\`\`

Format your response like this:
=== CODE QUALITY ASSESSMENT ===
[Overall code quality score and assessment]

=== ARCHITECTURE ANALYSIS ===
[Code structure, design patterns, and architectural quality]

=== EXECUTION FLOW ===
[Step-by-step execution analysis with complexity notes]

=== EDGE CASES & ERROR HANDLING ===
[Potential edge cases and how well they're handled]

=== SECURITY ANALYSIS ===
[Security vulnerabilities and recommendations]

=== PERFORMANCE METRICS ===
[Time/space complexity and performance characteristics]

=== CODE MAINTAINABILITY ===
[How easy it is to maintain and extend this code]

=== BEST PRACTICES COMPLIANCE ===
[Adherence to ${language} coding standards and conventions]

=== RECOMMENDATIONS ===
[Specific recommendations for improvement]

=== RATING BREAKDOWN ===
**Functionality:** [/10]
**Performance:** [/10]
**Readability:** [/10]
**Maintainability:** [/10]
**Security:** [/10]
**Overall Score:** [/10]`

    const result = await callGeminiAPI(prompt, "analyze")
    if (result) {
      setAnalysisResult(formatAIResponse(result, "analyze"))
    }
  }

  if (!isClient) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading AI Code Playground...</p>
        </div>
      </div>
    )
  }

  const mainContentHeight = showConsole ? `${playgroundHeight - 80 - consoleHeight}px` : `${playgroundHeight - 80}px`

  return (
    <div className="bg-gray-50 flex flex-col select-none">
      <style>{`
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background-color: #94a3b8; }
        * { scrollbar-width: thin; scrollbar-color: #cbd5e1 transparent; }
        
        .console-message { animation: slideIn 0.3s ease-out; }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>

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
              className="w-1 bg-gray-300 hover:bg-blue-500 cursor-col-resize transition-colors flex-shrink-0 active:bg-blue-600"
              onMouseDown={(e) => startResize("horizontal", e)}
            />
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

        {showConsole && (
          <div
            className="h-1 bg-gray-300 hover:bg-blue-500 cursor-row-resize transition-colors flex-shrink-0 active:bg-blue-600"
            onMouseDown={(e) => startResize("vertical", e)}
          />
        )}

        {showConsole && (
          <ConsolePanel
            consoleOutput={consoleOutput}
            currentInput={currentInput}
            setCurrentInput={setCurrentInput}
            waitingForInput={waitingForInput}
            handleInputSubmit={handleInputSubmit}
            handleKeyDown={handleKeyDown}
            clearConsole={clearConsole}
            consoleRef={consoleRef}
            inputRef={inputRef}
            height={consoleHeight}
          />
        )}
      </div>

      <div
        className="h-2 bg-gray-200 hover:bg-blue-400 cursor-row-resize transition-colors flex-shrink-0 active:bg-blue-500 border-t border-gray-300 flex items-center justify-center group"
        onMouseDown={(e) => startResize("playground", e)}
      >
        <div className="flex space-x-1 opacity-50 group-hover:opacity-75 transition-opacity">
          <div className="w-6 h-0.5 bg-gray-400 rounded"></div>
          <div className="w-6 h-0.5 bg-gray-400 rounded"></div>
          <div className="w-6 h-0.5 bg-gray-400 rounded"></div>
        </div>
      </div>

      {showChangeNotification && (
        <div
          className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg text-white flex items-center shadow-xl border-l-4 animate-slide-in ${
            changeNotificationType === "success"
              ? "bg-green-600 border-green-400"
              : changeNotificationType === "error"
                ? "bg-red-600 border-red-400"
                : changeNotificationType === "warning"
                  ? "bg-yellow-600 border-yellow-400"
                  : "bg-blue-600 border-blue-400"
          }`}
        >
          <div className="flex items-center space-x-3">
            {changeNotificationType === "success" && <Check size={20} />}
            {changeNotificationType === "error" && <AlertTriangle size={20} />}
            {changeNotificationType === "warning" && <AlertTriangle size={20} />}
            {changeNotificationType === "info" && <Terminal size={20} />}
            <div>
              <div className="font-medium">{changeNotificationMessage}</div>
              <div className="text-xs opacity-90">
                {changeNotificationType === "success"
                  ? "Operation completed successfully"
                  : changeNotificationType === "error"
                    ? "Please check and try again"
                    : changeNotificationType === "warning"
                      ? "Please review the warning"
                      : "Information updated"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
