"use client"
import Editor from "@monaco-editor/react"
import { editor } from "monaco-editor"

interface EditorPaneProps {
  activeTab: "python" | "c" | "java"
  setActiveTab: (tab: string) => void
  pythonCode: string
  cCode: string
  javaCode: string
  runCode: () => void
  debugCode: () => void
  optimizeCode: () => void
  fullAnalysis: () => void
  autoRun: boolean
  isLoading: boolean
  layout: "split" | "editor"
  handleEditorDidMount: (editor: editor.IStandaloneCodeEditor) => void
  handleEditorChange: (value: string | undefined) => void
  width: string
}

// Design 2: Pill-shaped buttons with subtle backgrounds
export default function EditorPane(props: EditorPaneProps) {
  const {
    activeTab,
    setActiveTab,
    pythonCode,
    cCode,
    javaCode,
    runCode,
    debugCode,
    optimizeCode,
    fullAnalysis,
    autoRun,
    isLoading,
    handleEditorDidMount,
    handleEditorChange,
    width,
  } = props

  const tabs = [
    {
      id: "python" as const,
      label: "Python",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
          />
        </svg>
      ),
      color: "text-blue-600",
    },
    {
      id: "c" as const,
      label: "C",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      ),
      color: "text-purple-600",
    },
    {
      id: "java" as const,
      label: "Java",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          />
        </svg>
      ),
      color: "text-orange-600",
    },
  ]

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

  const getLineCount = () => {
    const currentCode = getEditorValue()
    return currentCode.split("\n").length
  }

  return (
    <div className="flex flex-col bg-white border-r border-gray-200 shadow-sm" style={{ width }}>
      {/* Editor tabs */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 ${
                activeTab === tab.id
                  ? "text-blue-600 border-blue-600 bg-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700 border-transparent hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <div className={activeTab === tab.id ? tab.color : "text-gray-400"}>{tab.icon}</div>
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <div className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{getLineCount()} lines</div>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2 px-4">
          <div
            className={`flex items-center space-x-1.5 text-xs transition-colors duration-200 ${
              autoRun ? "text-green-600" : "text-gray-400"
            }`}
          >
            <div
              className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
                autoRun ? "bg-green-500" : "bg-gray-300"
              }`}
            ></div>
            <span className="font-medium">Live</span>
          </div>

          <div className="w-px h-4 bg-gray-300"></div>

          {!autoRun && (
            <button
              onClick={runCode}
              disabled={isLoading}
              className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h1m4 0h1M9 6h6a2 2 0 012 2v8a2 2 0 01-2 2H9a2 2 0 01-2-2V8a2 2 0 012-2z"
                  />
                </svg>
              )}
              <span>Run</span>
            </button>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 relative">
        <Editor
          height="100%"
          language={getEditorLanguage()}
          value={getEditorValue()}
          theme="light"
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: "on",
            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
            padding: { top: 16, bottom: 16 },
            lineHeight: 1.6,
            renderLineHighlight: "gutter",
            scrollbar: {
              vertical: "auto",
              horizontal: "auto",
              useShadows: false,
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            },
            overviewRulerLanes: 0,
            hideCursorInOverviewRuler: true,
            overviewRulerBorder: false,
            bracketPairColorization: {
              enabled: true,
            },
            suggest: {
              showKeywords: true,
              showSnippets: true,
            },
          }}
        />

        {/* Editor status bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gray-50 border-t border-gray-200 px-4 py-1 text-xs text-gray-500 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span>Language: {getEditorLanguage().toUpperCase()}</span>
            <span>Lines: {getLineCount()}</span>
            <span>Characters: {getEditorValue().length}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>UTF-8</span>
          </div>
        </div>
      </div>

      {/* Design 2: Pill-shaped buttons */}
      <div className="border-t border-gray-100 px-3 py-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={debugCode}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-red-100 text-gray-700 hover:text-red-700 rounded-full text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Debug</span>
          </button>

          <button
            onClick={optimizeCode}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-amber-100 text-gray-700 hover:text-amber-700 rounded-full text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Optimize</span>
          </button>

          <button
            onClick={fullAnalysis}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 rounded-full text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <span>Analyze</span>
          </button>
        </div>
      </div>
    </div>
  )
}
