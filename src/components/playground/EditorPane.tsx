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
  layout: 'split' | 'editor' | 'preview';
  handleEditorDidMount: (editor: editor.IStandaloneCodeEditor) => void;
  handleEditorChange: (value: string | undefined) => void;
}

const EditorPane: React.FC<EditorPaneProps> = ({
  activeTab,
  setActiveTab,
  htmlCode,
  cssCode,
  jsCode,
  runCode,
  layout,
  handleEditorDidMount,
  handleEditorChange
}) => {
  const tabs = [
    { id: 'html' as const, label: 'HTML' },
    { id: 'css' as const, label: 'CSS' },
    { id: 'js' as const, label: 'JS' }
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

  return (
    <div className={`${layout === 'split' ? 'w-1/2' : 'w-full'} flex flex-col bg-white border-r border-gray-200`}>
      {/* Editor tabs */}
      <div className="flex items-center border-b border-gray-200 bg-gray-50">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id 
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-white' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        <div className="ml-auto px-4">
          <button
            onClick={runCode}
            className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Run
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1">
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
            renderLineHighlight: 'none',
            scrollbar: {
              vertical: 'hidden',
              horizontal: 'hidden'
            },
            overviewRulerLanes: 0,
            hideCursorInOverviewRuler: true,
            overviewRulerBorder: false
          }}
        />
      </div>
    </div>
  );
};

export default EditorPane;