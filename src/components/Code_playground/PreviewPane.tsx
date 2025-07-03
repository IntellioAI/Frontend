import { RefreshCw } from 'lucide-react';
import { RefObject } from 'react';

interface PreviewPaneProps {
  iframeRef: RefObject<HTMLIFrameElement>;
  output: string;
  onRefresh: () => void;
}

export default function PreviewPane({ iframeRef, output, onRefresh }: PreviewPaneProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Preview header */}
      <div className="bg-gray-100 p-2 flex justify-between items-center">
        <span className="font-mono text-sm text-gray-700">Preview</span>
        <button 
          onClick={onRefresh}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-1 rounded text-sm"
          title="Refresh Preview"
        >
          <RefreshCw size={14} />
        </button>
      </div>
      
      {/* Preview iframe */}
      <div className="flex-grow bg-white border">
        <iframe 
          ref={iframeRef}
          className="w-full h-full"
          title="Code Preview"
          sandbox="allow-scripts"
        />
      </div>
      
      {/* Console output */}
      <div>
        <div className="bg-gray-800 text-white p-2">
          <span className="font-mono text-sm">Console</span>
        </div>
        <div className="h-32 p-2 overflow-auto bg-gray-900 text-gray-100 font-mono text-sm whitespace-pre-wrap">
          {output || '// Console output will appear here'}
        </div>
      </div>
    </div>
  );
}