import React, { useState } from "react"

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
  const [isExpanded, setIsExpanded] = useState(true)

  const getMessageConfig = (type: ConsoleMessage['type']) => {
    const configs = {
      input: {
        icon: '→',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        label: 'INPUT'
      },
      output: {
        icon: '←',
        color: 'text-gray-700',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        label: 'OUTPUT'
      },
      error: {
        icon: '✕',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        label: 'ERROR'
      },
      warning: {
        icon: '⚠',
        color: 'text-amber-600',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        label: 'WARNING'
      },
      success: {
        icon: '✓',
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200',
        label: 'SUCCESS'
      },
      info: {
        icon: 'ℹ',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        label: 'INFO'
      }
    }
    return configs[type] || configs.output
  }

  const hasContent = consoleOutput.length > 0

  return (
    <div
      className="bg-white border-t border-gray-200/80 flex flex-col"
      style={{ height: `${height}px` }}
    >
      {/* Vercel v0 Style Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50/80 border-b border-gray-200/50">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <div className="w-6 h-6 bg-gradient-to-br from-gray-700 to-gray-900 rounded-md flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-sm font-semibold">Console</span>
            <svg 
              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          {hasContent && (
            <div className="flex items-center space-x-2">
              <div className="w-1 h-1 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-500 font-medium">
                {consoleOutput.length} {consoleOutput.length === 1 ? 'message' : 'messages'}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {waitingForInput && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-amber-100 border border-amber-200 rounded-full">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-amber-700">Waiting for input</span>
            </div>
          )}
          
          {hasContent && (
            <button
              onClick={clearConsole}
              className="flex items-center space-x-1 px-3 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200 border border-gray-200"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Clear</span>
            </button>
          )}
          
          <div className="text-xs text-gray-400 px-2 py-1 bg-gray-100 rounded-full border border-gray-200">
            Live
          </div>
        </div>
      </div>

      {/* Console Content */}
      {isExpanded && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div
            ref={consoleRef}
            className="flex-1 overflow-y-auto bg-gray-50/30"
          >
            {consoleOutput.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-4 border border-gray-200/50">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Console Output</h4>
                <p className="text-sm text-gray-600 text-center max-w-sm mb-6">
                  Run your code to see execution results, error messages, and program output here.
                </p>
                <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
                  <div className="bg-white rounded-lg p-3 border border-gray-200/50 text-center">
                    <div className="text-lg mb-1">🔍</div>
                    <div className="text-xs text-gray-600">Detailed</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-gray-200/50 text-center">
                    <div className="text-lg mb-1">💬</div>
                    <div className="text-xs text-gray-600">Interactive</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-gray-200/50 text-center">
                    <div className="text-lg mb-1">📝</div>
                    <div className="text-xs text-gray-600">History</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {consoleOutput.map((msg) => {
                  const config = getMessageConfig(msg.type)
                  return (
                    <div
                      key={msg.id}
                      className={`group relative ${config.bgColor} ${config.borderColor} border rounded-xl p-4 transition-all duration-200 hover:shadow-sm`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex items-center space-x-2 min-w-0">
                          <div className={`w-6 h-6 ${config.color} font-mono text-sm flex items-center justify-center bg-white rounded-lg border ${config.borderColor}`}>
                            {config.icon}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className={`text-xs font-semibold ${config.color} uppercase tracking-wider`}>
                              {config.label}
                            </span>
                            <span className="text-xs text-gray-500">
                              {msg.timestamp.toLocaleTimeString("en-US", {
                                hour12: true,
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                        <div className={`flex-1 ${config.color} font-mono text-sm leading-relaxed whitespace-pre-wrap break-words`}>
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Enhanced Input Area */}
          <div className="border-t border-gray-200/50 bg-white p-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-gray-500">
                <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-md flex items-center justify-center">
                  <span className="text-white text-xs font-bold">$</span>
                </div>
                <span className="text-xs font-medium hidden sm:block">
                  {waitingForInput ? "Program Input" : "Console"}
                </span>
              </div>
              
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={waitingForInput ? "Enter program input..." : "Type a command or input..."}
                  className="w-full bg-gray-50 text-gray-900 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-mono placeholder-gray-400 transition-all duration-200"
                />
                {currentInput && (
                  <button
                    onClick={() => setCurrentInput('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              
              <button
                onClick={handleInputSubmit}
                disabled={!currentInput.trim()}
                className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>

            {/* Enhanced Hints */}
            <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border border-gray-200 font-mono text-xs">↑↓</kbd>
                  <span>History</span>
                </div>
                <div className="flex items-center space-x-1">
                  <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border border-gray-200 font-mono text-xs">Enter</kbd>
                  <span>Submit</span>
                </div>
                <div className="flex items-center space-x-1">
                  <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border border-gray-200 font-mono text-xs">Esc</kbd>
                  <span>Clear</span>
                </div>
              </div>
              {waitingForInput && (
                <div className="flex items-center space-x-1 text-amber-600">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">Program waiting for input</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ConsolePanel