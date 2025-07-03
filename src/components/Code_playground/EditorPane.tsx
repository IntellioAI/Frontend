import React from 'react';
import Editor from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { Bug, Zap, Terminal, Play } from 'lucide-react';

interface EditorPaneProps {
  activeTab: 'python' | 'c' | 'java';
  setActiveTab: (tab: string) => void;
  pythonCode: string;
  cCode: string;
  javaCode: string;
  runCode: () => void;
  debugCode: () => void;
  optimizeCode: () => void;
  fullAnalysis: () => void;
  autoRun: boolean;
  isLoading: boolean;
  layout: 'split' | 'editor' | 'preview';
  handleEditorDidMount: (editor: editor.IStandaloneCodeEditor) => void;
  handleEditorChange: (value: string | undefined) => void;
  width: string;
}

const EditorPane: React.FC<EditorPaneProps> = ({
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
  width
}) => {
  // Define programming language tabs with enhanced colors
  const programmingTabs = [
    { 
      id: 'python' as const, 
      label: 'Python',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09-.33.22zM21.1 6.11l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08-.33.23z"/>
        </svg>
      ),
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-500'
    },
    { 
      id: 'c' as const, 
      label: 'C',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16.5986 9.1299c-.2679-.8368-.7055-1.5972-1.2876-2.2335-.582-.6362-1.2876-1.1316-2.0734-1.4563-.7858-.3247-1.6368-.4888-2.502-.4816-1.3892 0-2.7054.4816-3.7266 1.3601-.5821.4888-1.0697 1.0841-1.4395 1.7636-.3698.6795-.5821 1.4197-.6193 2.1933-.0372.7736.0929 1.5472.3855 2.267.2926.7199.7181 1.3757 1.2548 1.9233.5366.5476 1.1704.9827 1.8644 1.2876.6939.3049 1.4395.4609 2.1933.4609.7538 0 1.4995-.1561 2.1933-.4609s1.3278-.7401 1.8644-1.2876c.5367-.5476.9622-1.2034 1.2548-1.9233.2926-.7198.4227-1.4934.3855-2.267-.0372-.7736-.2495-1.5138-.6193-2.1933zm-4.8632 5.4043c-.6795 0-1.3353-.2698-1.8243-.7513-.4891-.4816-.7638-1.1316-.7638-1.8111s.2747-1.3295.7638-1.8111c.489-.4815 1.1448-.7513 1.8243-.7513s1.3353.2698 1.8243.7513c.489.4816.7638 1.1316.7638 1.8111s-.2747 1.3295-.7638 1.8111c-.489.4815-1.1448.7513-1.8243.7513z"/>
        </svg>
      ),
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-600'
    },
    { 
      id: 'java' as const, 
      label: 'Java',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8.851 18.56s-.917.534.653.714c1.902.218 2.874.187 4.969-.211 0 0 .552.346 1.321.646-4.699 2.013-10.633-.118-6.943-1.149M8.276 15.933s-1.028.761.542.924c2.032.209 3.636.227 6.413-.308 0 0 .384.389.987.602-5.679 1.661-12.007.13-7.942-1.218M13.116 11.475c1.158 1.333-.304 2.533-.304 2.533s2.939-1.518 1.589-3.418c-1.261-1.772-2.228-2.652 3.007-5.688 0-.001-8.216 2.051-4.292 6.573M19.33 20.504s.679.559-.747.991c-2.712.822-11.288 1.069-13.669.033-.856-.373.75-.89 1.254-.998.527-.114.828-.093.828-.093-.953-.671-6.156 1.317-2.643 1.887 9.58 1.553 17.462-.7 14.977-1.82M9.292 13.21s-4.362 1.036-1.544 1.412c1.189.159 3.561.123 5.77-.062 1.806-.152 3.618-.477 3.618-.477s-.637.272-1.098.587c-4.429 1.165-12.986.623-10.522-.568 2.082-1.006 3.776-.892 3.776-.892M17.116 17.584c4.503-2.34 2.421-4.589.968-4.285-.355.074-.515.138-.515.138s.132-.207.385-.297c2.875-1.011 5.086 2.981-.928 4.562 0-.001.07-.062.09-.118M14.401 0s2.494 2.494-2.365 6.331c-3.656 2.888-.837 4.537-.013 6.428-2.152-1.940-3.732-3.649-2.676-5.241 1.543-2.329 5.822-3.464 5.054-7.518"/>
        </svg>
      ),
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-600'
    }
  ];

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

  const getLineCount = () => {
    const currentCode = getEditorValue();
    return currentCode.split('\n').length;
  };

  return (
    <div 
      className="flex flex-col bg-white border-r border-gray-200 shadow-sm"
      style={{ width }}
    >
      {/* Editor tabs - Enhanced design */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50">
        <div className="flex">
          {programmingTabs.map((tab) => (
            <button
              key={tab.id}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 relative ${
                activeTab === tab.id 
                  ? `${tab.color} ${tab.borderColor} bg-white shadow-sm` 
                  : 'text-gray-500 hover:text-gray-700 border-transparent hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <div className={activeTab === tab.id ? tab.color : 'text-gray-400'}>
                {tab.icon}
              </div>
              <span className="font-medium">{tab.label}</span>
              {activeTab === tab.id && (
                <div className={`text-xs ${tab.color} bg-gray-100 px-2 py-0.5 rounded font-medium`}>
                  {getLineCount()} lines
                </div>
              )}
            </button>
          ))}
        </div>
        
        <div className="flex items-center space-x-3 px-4">
          {/* Live indicator */}
          <div className={`flex items-center space-x-1.5 text-xs transition-colors duration-200 ${
            autoRun 
              ? 'text-green-600' 
              : 'text-gray-400'
          }`}>
            <div className={`w-2 h-2 rounded-full transition-colors duration-200 ${
              autoRun 
                ? 'bg-green-500 animate-pulse' 
                : 'bg-gray-300'
            }`}></div>
            <span className="font-medium">Live</span>
          </div>
          
          <div className="w-px h-4 bg-gray-300"></div>
          
          {/* Run button */}
          <button
            onClick={runCode}
            disabled={isLoading}
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors shadow-sm ${
              autoRun 
                ? 'bg-gray-100 text-gray-500 cursor-default'
                : 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Play className="w-4 h-4" />
            <span>{isLoading ? 'Running...' : 'Run'}</span>
          </button>
        </div>
      </div>

      {/* AI Tools Bar - Only visible in editor layout */}
      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="text-xs font-medium text-gray-600">AI Tools:</div>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={debugCode}
              disabled={isLoading}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                isLoading 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-yellow-500 text-white hover:bg-yellow-600 active:bg-yellow-700'
              }`}
            >
              <Bug className="w-4 h-4" />
              <span>Debug</span>
            </button>
            <button 
              onClick={optimizeCode}
              disabled={isLoading}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                isLoading 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>Optimize</span>
            </button>
            <button 
              onClick={fullAnalysis}
              disabled={isLoading}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                isLoading 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>Analyze</span>
            </button>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 relative">
        <Editor
          height="100%"
          language={getEditorLanguage()}
          value={getEditorValue()}
          theme="vs"
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", "Courier New", monospace',
            padding: { top: 16, bottom: 16 },
            lineHeight: 1.6,
            renderLineHighlight: 'gutter',
            scrollbar: {
              vertical: 'auto',
              horizontal: 'auto',
              useShadows: false,
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8
            },
            overviewRulerLanes: 0,
            hideCursorInOverviewRuler: true,
            overviewRulerBorder: false,
            bracketPairColorization: {
              enabled: true
            },
            suggest: {
              showKeywords: true,
              showSnippets: true
            },
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            renderWhitespace: 'boundary'
          }}
        />
        
        {/* Enhanced status bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gray-50 border-t border-gray-200 px-4 py-2 text-xs text-gray-600 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-1">
              <span className="font-medium">Language:</span>
              <span className={programmingTabs.find(tab => tab.id === activeTab)?.color || 'text-gray-600'}>
                {getEditorLanguage().toUpperCase()}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="font-medium">Lines:</span>
              <span className="text-gray-700">{getLineCount()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="font-medium">Characters:</span>
              <span className="text-gray-700">{getEditorValue().length}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <span className="text-gray-500">Encoding:</span>
              <span className="text-gray-700">UTF-8</span>
            </div>
            <div className={`flex items-center space-x-1 ${
              autoRun ? 'text-green-600' : 'text-gray-500'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${
                autoRun ? 'bg-green-500' : 'bg-gray-400'
              }`}></div>
              <span className="text-xs font-medium">
                {autoRun ? 'Auto-run enabled' : 'Manual run'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPane;