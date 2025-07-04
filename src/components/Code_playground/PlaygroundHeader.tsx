"use client";

import { Layout, Terminal, Code } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PlaygroundHeaderProps {
  autoRun: boolean;
  setAutoRun: (value: boolean) => void;
  layout: "split" | "editor";
  setLayout: (value: "split" | "editor") => void;
  showConsole: boolean;
  setShowConsole: (value: boolean) => void;
}

export default function PlaygroundHeader({
  layout,
  setLayout,
  showConsole,
  setShowConsole,
}: PlaygroundHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between text-black">
      <div className="flex items-center space-x-4">
        <h2 className="text-lg font-semibold text-gray-900">
          AI Code Playground
        </h2>
      </div>

      <div className="flex items-center space-x-2">
        <div className="flex border border-gray-200 rounded-md">
          <Button
            variant={layout === "editor" ? "default" : "ghost"}
            size="sm"
            onClick={() => setLayout("editor")}
            className="rounded-r-none border-r"
          >
            <Code size={14} />
          </Button>
          <Button
            variant={layout === "split" ? "default" : "ghost"}
            size="sm"
            onClick={() => setLayout("split")}
            className="rounded-none border-r"
          >
            <Layout size={14} />
          </Button>
        </div>

        <Button
          variant={showConsole ? "default" : "outline"}
          size="sm"
          onClick={() => setShowConsole(!showConsole)}
          className="flex items-center space-x-1"
        >
          <Terminal size={14} />
          <span>Console</span>
        </Button>
      </div>
    </div>
  );
}
