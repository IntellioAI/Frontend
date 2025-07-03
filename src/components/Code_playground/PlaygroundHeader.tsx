import { Layout, Code, Monitor } from 'lucide-react';

interface PlaygroundHeaderProps {
  theme: string;
  setTheme: (theme: string) => void;
  autoRun: boolean;
  setAutoRun: (autoRun: boolean) => void;
  layout: string;
  setLayout: (layout: string) => void;
}

export default function PlaygroundHeader({
  theme,
  setTheme,
  autoRun,
  setAutoRun,
  layout,
  setLayout
}: PlaygroundHeaderProps) {
  return (
    <div className="bg-gray-100 px-4 py-3 flex justify-between items-center border-b">
      <div className="flex items-center space-x-4">
        <h2 className="text-lg font-semibold text-gray-800">Code Playground</h2>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="bg-white text-sm border rounded px-2 py-1"
        >
          <option value="vs-dark">Dark</option>
          <option value="light">Light</option>
        </select>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="autoRun"
            checked={autoRun}
            onChange={() => setAutoRun(!autoRun)}
            className="mr-1"
          />
          <label htmlFor="autoRun" className="text-sm text-gray-700">Auto-run</label>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <button 
          onClick={() => setLayout('split')}
          className={`p-1 rounded ${layout === 'split' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:bg-gray-200'}`}
          title="Split View"
        >
          <Layout size={18} />
        </button>
        <button 
          onClick={() => setLayout('editor')}
          className={`p-1 rounded ${layout === 'editor' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:bg-gray-200'}`}
          title="Editor Only"
        >
          <Code size={18} />
        </button>
        <button 
          onClick={() => setLayout('preview')}
          className={`p-1 rounded ${layout === 'preview' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:bg-gray-200'}`}
          title="Preview Only"
        >
          <Monitor size={18} />
        </button>
      </div>
    </div>
  );
}