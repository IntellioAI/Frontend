import { useRef } from 'react';
import { Play, Download, Copy } from 'lucide-react';
import Editor from '@monaco-editor/react';

interface EditorPaneProps {
  activeTab: string;
  code: string;
  language: string;
  theme: string;
  onCodeChange: (value: string | undefined) => void;
  onRun: () => void;
  onCopy: () => void;
  onDownload: () => void;
}

export default function EditorPane({
  activeTab,
  code,
  language,
  theme,
  onCodeChange,
  onRun,
  onCopy,
  onDownload
}: EditorPaneProps) {
  const editorRef = useRef(null);
  
  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Editor toolbar */}
      <div className="bg-gray-800 text-white p-2 flex justify-between items-center">
        <span className="font-mono text-sm">{activeTab.toUpperCase()} Editor</span>
        <div className="flex space-x-2">
          <button 
            onClick={onRun}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
          >
            <Play size={14} />
            <span>Run</span>
          </button>
          <button 
            onClick={onCopy}
            className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded text-sm"
            title="Copy Code"
          >
            <Copy size={14} />
          </button>
          <button 
            onClick={onDownload}
            className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded text-sm"
            title="Download File"
          >
            <Download size={14} />
          </button>
        </div>
      </div>
      
      {/* Code editor */}
      <div className="flex-grow">
        <Editor
          height="100%"
          width="100%"
          language={language}
          theme={theme}
          value={code}
          onChange={onCodeChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: 'on',
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
}