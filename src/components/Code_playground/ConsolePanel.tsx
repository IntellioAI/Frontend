// ConsolePanel.tsx
import React from "react"
import { Send, Terminal, Trash2, Circle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ConsoleMessage {
  id: string
  type: "input" | "output" | "error" | "info" | "success" | "warning"
  content: string
  timestamp: Date
}

interface ConsolePanelProps {
  consoleOutput: ConsoleMessage[]
  currentInput: string
  setCurrentInput: (value: string) => void
  waitingForInput: boolean
  handleInputSubmit: () => void
  handleKeyDown: (e: React.KeyboardEvent) => void
  clearConsole: () => void
  consoleRef: React.RefObject<HTMLDivElement>
  inputRef: React.RefObject<HTMLInputElement>
  height: number
}

const ConsolePanel: React.FC<ConsolePanelProps> = ({
  consoleOutput,
  currentInput,
  setCurrentInput,
  waitingForInput,
  handleInputSubmit,
  handleKeyDown,
  clearConsole,
  consoleRef,
  inputRef,
  height,
}) => {
  const getMessageIcon = (type: string) => {
    switch (type) {
      case "input":
        return <span className="text-blue-500">›</span>
      case "output":
        return <span className="text-gray-500">‹</span>
      case "error":
        return <span className="text-red-500">✕</span>
      case "warning":
        return <span className="text-yellow-500">⚠</span>
      case "success":
        return <span className="text-green-500">✓</span>
      case "info":
        return <span className="text-blue-500">ℹ</span>
      default:
        return <span className="text-gray-500">›</span>
    }
  }

  const getMessageColor = (type: string) => {
    switch (type) {
      case "input":
        return "text-blue-600"
      case "output":
        return "text-gray-700"
      case "error":
        return "text-red-600"
      case "warning":
        return "text-yellow-600"
      case "success":
        return "text-green-600"
      case "info":
        return "text-blue-600"
      default:
        return "text-gray-700"
    }
  }

  return (
    <div
      className="bg-white border-t border-gray-200 flex flex-col"
      style={{ height: `${height}px` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Circle 
                size={8} 
                className={`${waitingForInput ? 'text-orange-500 animate-pulse' : 'text-green-500'} fill-current`} 
              />
              <Terminal size={14} className="text-gray-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">Console</span>
          </div>
          {consoleOutput.length > 0 && (
            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {consoleOutput.length}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {waitingForInput && (
            <div className="flex items-center space-x-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
              <Circle size={6} className="animate-pulse fill-current" />
              <span>Waiting for input</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearConsole}
            className="h-7 px-2 text-gray-500 hover:text-gray-700"
          >
            <Trash2 size={12} />
          </Button>
        </div>
      </div>

      {/* Console Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div
          ref={consoleRef}
          className="flex-1 overflow-y-auto p-4 bg-gray-50 font-mono text-sm"
        >
          {consoleOutput.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Terminal size={32} className="mb-2 opacity-50" />
              <p className="text-sm">Console output will appear here</p>
              <p className="text-xs mt-1">Run your code to see results</p>
            </div>
          ) : (
            <div className="space-y-1">
              {consoleOutput.map((msg) => (
                <div
                  key={msg.id}
                  className="flex items-start space-x-3 py-1 hover:bg-white/50 rounded px-2 -mx-2"
                >
                  <span className="text-xs text-gray-400 min-w-[4rem] mt-0.5">
                    {msg.timestamp.toLocaleTimeString("en-US", {
                      hour12: false,
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </span>
                  <span className="mt-0.5 min-w-[1rem] flex justify-center">
                    {getMessageIcon(msg.type)}
                  </span>
                  <span className={`flex-1 break-words whitespace-pre-wrap ${getMessageColor(msg.type)}`}>
                    {msg.content}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Console Input */}
        <div className="border-t border-gray-200 bg-white p-3">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-gray-500 min-w-0">
              <Terminal size={14} />
              <span className="text-xs font-medium hidden sm:block">
                {waitingForInput ? "Input" : "Console"}
              </span>
            </div>
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={waitingForInput ? "Enter input..." : "Type command..."}
                className="w-full bg-gray-50 text-gray-900 border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono placeholder-gray-400"
              />
            </div>
            <Button
              onClick={handleInputSubmit}
              disabled={!currentInput.trim()}
              size="sm"
              className="h-9 px-3"
            >
              <Send size={14} />
              <span className="ml-1 hidden sm:inline">Send</span>
            </Button>
          </div>

          {/* Hints */}
          <div className="mt-2 text-xs text-gray-400">
            <div className="flex items-center space-x-4">
              <span>↑↓ History</span>
              <span>Enter to submit</span>
              {waitingForInput && (
                <span className="text-orange-500">Program waiting for input</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConsolePanel