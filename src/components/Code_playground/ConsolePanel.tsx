"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { ChevronUp, ChevronDown, Terminal, Trash2, Send, Maximize2, Minimize2 } from "lucide-react"

interface ConsoleMessage {
  id: string
  type: "input" | "output" | "error" | "info" | "success" | "warning"
  content: string
  timestamp: Date
}

interface EnhancedConsoleProps {
  consoleOutput: ConsoleMessage[]
  currentInput: string
  setCurrentInput: (value: string) => void
  waitingForInput: boolean
  handleInputSubmit: () => void
  handleKeyDown: (e: React.KeyboardEvent) => void
  clearConsole: () => void
  consoleRef: React.RefObject<HTMLDivElement>
  inputRef: React.RefObject<HTMLInputElement>
  initialHeight?: number
  minHeight?: number
  maxHeight?: number
}

const EnhancedConsole: React.FC<EnhancedConsoleProps> = ({
  consoleOutput,
  currentInput,
  setCurrentInput,
  waitingForInput,
  handleInputSubmit,
  handleKeyDown,
  clearConsole,
  consoleRef,
  inputRef,
  initialHeight = 300,
  minHeight = 200,
  maxHeight = 600,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [height, setHeight] = useState(initialHeight)
  const [isResizing, setIsResizing] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const resizeRef = useRef<HTMLDivElement>(null)
  const startY = useRef(0)
  const startHeight = useRef(0)

  const getMessageIcon = (type: ConsoleMessage["type"]) => {
    const icons = {
      input: "❯",
      output: "•",
      error: "✕",
      warning: "⚠",
      success: "✓",
      info: "ℹ",
    }
    return icons[type] || icons.output
  }

  const getMessageStyle = (type: ConsoleMessage["type"]) => {
    const styles = {
      input: "text-blue-600",
      output: "text-gray-700",
      error: "text-red-600",
      warning: "text-amber-600",
      success: "text-green-600",
      info: "text-blue-600",
    }
    return styles[type] || styles.output
  }

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return
      const deltaY = startY.current - e.clientY
      const newHeight = Math.min(Math.max(startHeight.current + deltaY, minHeight), maxHeight)
      setHeight(newHeight)
    },
    [isResizing, minHeight, maxHeight],
  )

  const handleMouseUp = useCallback(() => {
    setIsResizing(false)
    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", handleMouseUp)
  }, [handleMouseMove])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      setIsResizing(true)
      startY.current = e.clientY
      startHeight.current = height
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    },
    [handleMouseMove, handleMouseUp, height],
  )

  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  const toggleConsole = () => {
    setIsOpen(!isOpen)
  }

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized)
  }

  const currentHeight = isMaximized ? maxHeight : height

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl">
      {/* Resize Handle */}
      {isOpen && (
        <div
          ref={resizeRef}
          className={`h-1 bg-gray-100 hover:bg-gray-200 cursor-row-resize transition-colors ${
            isResizing ? "bg-blue-200" : ""
          }`}
          onMouseDown={handleMouseDown}
        >
          <div className="h-full w-full flex items-center justify-center">
            <div className="w-8 h-0.5 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      )}

      {/* Console Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleConsole}
            className="flex items-center space-x-2 hover:bg-gray-100 rounded px-2 py-1 transition-colors"
          >
            <div className="w-6 h-6 bg-black rounded-md flex items-center justify-center">
              <Terminal className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-900">Console</span>
            {isOpen ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            )}
          </button>

          {isOpen && consoleOutput.length > 0 && (
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-500">
                {consoleOutput.length} log{consoleOutput.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        {isOpen && (
          <div className="flex items-center space-x-2">
            {waitingForInput && (
              <div className="flex items-center space-x-2 px-2 py-1 bg-amber-100 border border-amber-200 rounded text-amber-700">
                <div className="w-1 h-1 bg-amber-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium">Waiting for input</span>
              </div>
            )}

            <button
              onClick={toggleMaximize}
              className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded border border-gray-200 transition-colors"
              title={isMaximized ? "Restore" : "Maximize"}
            >
              {isMaximized ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
            </button>

            {consoleOutput.length > 0 && (
              <button
                onClick={clearConsole}
                className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded border border-gray-200 transition-colors"
                title="Clear console"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Console Content */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{ height: isOpen ? `${currentHeight}px` : "0px" }}
      >
        <div className="h-full flex flex-col">
          {/* Messages Area */}
          <div
            ref={consoleRef}
            className="flex-1 overflow-y-auto bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
          >
            {consoleOutput.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4 border border-gray-200">
                  <Terminal className="w-6 h-6 text-gray-400" />
                </div>
                <h4 className="text-base font-medium text-gray-900 mb-2">Console</h4>
                <p className="text-sm text-gray-500 text-center max-w-sm mb-4">
                  Output from your code execution will appear here. Start by running some code to see the results.
                </p>
                <div className="text-xs text-gray-400 font-mono bg-white rounded px-3 py-1 border">
                  Ready for execution
                </div>
              </div>
            ) : (
              <div className="p-3 space-y-1">
                {consoleOutput.map((msg) => (
                  <div
                    key={msg.id}
                    className="flex items-start space-x-3 py-1.5 px-2 rounded hover:bg-white/50 transition-colors group"
                  >
                    <div className="flex items-center space-x-2 text-xs text-gray-400 min-w-0 shrink-0">
                      <span className="font-mono text-xs tabular-nums">
                        {msg.timestamp.toLocaleTimeString("en-US", {
                          hour12: false,
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </span>
                    </div>

                    <div className="flex items-start space-x-2 min-w-0 flex-1">
                      <span className={`text-sm font-mono ${getMessageStyle(msg.type)} mt-0.5 shrink-0`}>
                        {getMessageIcon(msg.type)}
                      </span>
                      <div
                        className={`text-sm font-mono leading-relaxed break-words ${getMessageStyle(msg.type)} min-w-0`}
                      >
                        <pre className="whitespace-pre-wrap font-mono">{msg.content}</pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 bg-white p-3">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 text-gray-500 shrink-0">
                <span className="text-sm font-mono text-gray-400">❯</span>
              </div>

              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={waitingForInput ? "Enter input for program..." : "Type command or code..."}
                  className="w-full bg-transparent text-gray-900 text-sm font-mono focus:outline-none placeholder-gray-400"
                  autoComplete="off"
                  spellCheck="false"
                />
              </div>

              <button
                onClick={handleInputSubmit}
                disabled={!currentInput.trim()}
                className="flex items-center space-x-1 px-3 py-1.5 bg-black text-white text-sm rounded hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                <Send className="w-3 h-3" />
                <span>Send</span>
              </button>
            </div>

            {/* Hints */}
            <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <kbd className="px-1.5 py-0.5 bg-gray-100 rounded font-mono text-xs border border-gray-200">↑↓</kbd>
                  <span>History</span>
                </div>
                <div className="flex items-center space-x-1">
                  <kbd className="px-1.5 py-0.5 bg-gray-100 rounded font-mono text-xs border border-gray-200">⏎</kbd>
                  <span>Execute</span>
                </div>
                <div className="flex items-center space-x-1">
                  <kbd className="px-1.5 py-0.5 bg-gray-100 rounded font-mono text-xs border border-gray-200">Ctrl</kbd>
                  <span>+</span>
                  <kbd className="px-1.5 py-0.5 bg-gray-100 rounded font-mono text-xs border border-gray-200">C</kbd>
                  <span>Clear</span>
                </div>
              </div>
              {waitingForInput && (
                <div className="flex items-center space-x-1 text-amber-600">
                  <div className="w-1 h-1 bg-amber-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">Input required</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnhancedConsole
