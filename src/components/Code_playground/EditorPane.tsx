"use client"
import { Play, Bug, Zap, BarChart3, Loader2 } from "lucide-react"
import Editor from "@monaco-editor/react"
import * as monaco from "monaco-editor/esm/vs/editor/editor.api"
import { Button } from "@/components/ui/button"
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
  layout: "split" | "editor" | "preview"
  handleEditorDidMount: (editor: monaco.editor.IStandaloneCodeEditor) => void
  handleEditorChange: (value: string | undefined) => void
  width: string
}


export default function EditorPane({
  activeTab,
  setActiveTab,
  pythonCode,
  cCode,
  javaCode,
  runCode,
  debugCode,
  optimizeCode,
  fullAnalysis,
  isLoading,
  handleEditorDidMount,
  handleEditorChange,
  width,
}: EditorPaneProps) {
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

  return (
    <div className="flex flex-col bg-white" style={{ width }}>
      {/* Language Tabs */}
      <div className="flex border-b border-gray-200">
        {["python", "c", "java"].map((lang) => (
          <button
            key={lang}
            onClick={() => setActiveTab(lang)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === lang
                ? "border-blue-500 text-blue-600 bg-blue-50"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            {lang.charAt(0).toUpperCase() + lang.slice(1)}
          </button>
        ))}
      </div>

      {/* Editor */}
      <div className="flex-1 relative">
        <Editor
          height="100%"
          language={getEditorLanguage()}
          value={getEditorValue()}
          onMount={handleEditorDidMount}
          onChange={handleEditorChange}
          theme="vs-light"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            tabSize: 2,
            insertSpaces: true,
            wordWrap: "on",
            folding: true,
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 3,
            glyphMargin: false,
            contextmenu: true,
            selectOnLineNumbers: true,
            roundedSelection: false,
            readOnly: false,
            cursorStyle: "line",
            automaticLayout: true,
          }}
        />
      </div>

      {/* Action Buttons */}
      <div className="border-t border-gray-200 p-3 bg-gray-50 text-black">
        <div className="flex flex-wrap gap-2">
          <Button onClick={runCode} disabled={isLoading} size="sm" className="flex items-center space-x-1">
            {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
            <span>Run</span>
          </Button>

          <Button
            onClick={debugCode}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="flex items-center space-x-1 bg-transparent"
          >
            <Bug size={14} />
            <span>Debug</span>
          </Button>

          <Button
            onClick={optimizeCode}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="flex items-center space-x-1 bg-transparent"
          >
            <Zap size={14} />
            <span>Optimize</span>
          </Button>

          <Button
            onClick={fullAnalysis}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="flex items-center space-x-1 bg-transparent"
          >
            <BarChart3 size={14} />
            <span>Analyze</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
