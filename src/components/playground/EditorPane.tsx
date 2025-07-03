import React from 'react';
import Editor from '@monaco-editor/react';
import type { editor } from 'monaco-editor';

interface EditorPaneProps {
  activeTab: 'html' | 'css' | 'js';
  setActiveTab: (tab: 'html' | 'css' | 'js') => void;
  htmlCode: string;
  cssCode: string;
  jsCode: string;
  runCode: () => void;
  autoRun: boolean;
  layout: 'split' | 'editor' | 'preview';
  handleEditorDidMount: (editor: editor.IStandaloneCodeEditor) => void;
  handleEditorChange: (value: string | undefined) => void;
  width: string;
}

const EditorPane: React.FC<EditorPaneProps> = ({
  activeTab,
  setActiveTab,
  htmlCode,
  cssCode,
  jsCode,
  runCode,
  autoRun,
  handleEditorDidMount,
  handleEditorChange,
  width
}) => {
  const tabs = [
    { 
      id: 'html' as const, 
      label: 'HTML',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      color: 'text-orange-600'
    },
    { 
      id: 'css' as const, 
      label: 'CSS',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
        </svg>
      ),
      color: 'text-blue-600'
    },
    { 
      id: 'js' as const, 
      label: 'JS',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
      color: 'text-yellow-600'
    }
  ];

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

  const getLineCount = () => {
    const currentCode = getEditorValue();
    return currentCode.split('\n').length;
  };

  return (
    <div 
      className="flex flex-col bg-white border-r border-gray-200 shadow-sm"
      style={{ width }}
    >
      {/* Editor tabs */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 ${
                activeTab === tab.id 
                  ? 'text-blue-600 border-blue-600 bg-white shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700 border-transparent hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <div className={activeTab === tab.id ? tab.color : 'text-gray-400'}>
                {tab.icon}
              </div>
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <div className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                  {getLineCount()} lines
                </div>
              )}
            </button>
          ))}
        </div>
        
        <div className="flex items-center space-x-2 px-4">
          <div className={`flex items-center space-x-1.5 text-xs transition-colors duration-200 ${
            autoRun 
              ? 'text-green-600' 
              : 'text-gray-400'
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
              autoRun 
                ? 'bg-green-500' 
                : 'bg-gray-300'
            }`}></div>
            <span className="font-medium">Live</span>
          </div>
          
          <div className="w-px h-4 bg-gray-300"></div>
          
          {!autoRun && (
            <button
              onClick={runCode}
              className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h1m4 0h1M9 6h6a2 2 0 012 2v8a2 2 0 01-2 2H9a2 2 0 01-2-2V8a2 2 0 012-2z" />
              </svg>
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
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
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
            }
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
    </div>
  );
};

export default EditorPane;