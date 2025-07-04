"use client";
import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import {
  Home,
  Users,
  Wrench,
  BookOpen,
  Settings,
  HelpCircle,
  BarChart3,
  Bell,
  Code,
  Globe,
  Edit3,
  GripVertical,
  Check,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Import the sidebar context
import { useSidebar } from "../App"; // Adjust the import path as needed

const initialNavigationItems = [
  {
    id: "dashboard",
    title: "Dashboard",
    to: "/",
    icon: Home,
  },
  {
    id: "code-playground",
    title: "Code Playground",
    to: "/playground",
    icon: Code,
  },
  {
    id: "web-playground",
    title: "Web Playground",
    to: "/web-playground",
    icon: Globe,
  },
  {
    id: "faculty-dashboard",
    title: "Faculty Dashboard",
    to: "/faculty",
    icon: Users,
  },
  {
    id: "crafts-tools",
    title: "Crafts Tools",
    to: "/products",
    icon: Wrench,
  },
  {
    id: "pulse",
    title: "Pulse",
    to: "/pulse",
    icon: BarChart3,
  },
];

const bottomItems = [
  {
    title: "Notifications",
    to: "/notifications",
    icon: Bell,
  },
  {
    title: "Documentation",
    to: "/docs",
    icon: BookOpen,
  },
  {
    title: "Help & Support",
    to: "/help",
    icon: HelpCircle,
  },
  {
    title: "Settings",
    to: "/settings",
    icon: Settings,
  },
];

interface SidebarStandaloneProps {
  className?: string;
}

export function SidebarStandalone({ className }: SidebarStandaloneProps) {
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const [isEditMode, setIsEditMode] = useState(false);
  const [navigationItems, setNavigationItems] = useState(
    initialNavigationItems
  );
  const [draggedItem, setDraggedItem] = useState<DraggedItemState | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragCounter = useRef(0);

  interface NavigationItem {
    id: string;
    title: string;
    to: string;
    icon: React.FC<{ className?: string }>;
  }

  interface DraggedItemState {
    item: NavigationItem;
    index: number;
  }

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    item: NavigationItem,
    index: number
  ): void => {
    setDraggedItem({ item, index });
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", "");
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverIndex(null);
    dragCounter.current = 0;
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ): void => {
    e.preventDefault();
    dragCounter.current++;
    setDragOverIndex(index);
  };

  const handleDragLeave = (): void => {
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    targetIndex: number
  ): void => {
    e.preventDefault();
    dragCounter.current = 0;

    if (draggedItem && draggedItem.index !== targetIndex) {
      const newItems = [...navigationItems];
      const [removed] = newItems.splice(draggedItem.index, 1);
      newItems.splice(targetIndex, 0, removed);
      setNavigationItems(newItems);
    }

    setDraggedItem(null);
    setDragOverIndex(null);
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    if (isEditMode) {
      // Reset any drag states when exiting edit mode
      setDraggedItem(null);
      setDragOverIndex(null);
    }
  };

  const resetOrder = () => {
    setNavigationItems(initialNavigationItems);
    setIsEditMode(false);
  };

  return (
    <div
      className={cn(
        "fixed left-4 top-6 bottom-6 z-40 bg-[#0A0A0A] border border-white/30 ring-1 ring-white/30 rounded-3xl shadow-[0_2px_15px_rgba(255,255,255,0.05)] transition-all duration-300 ease-in-out overflow-hidden select-none",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
      style={{
        isolation: "isolate",
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 3rem)",
      }}
    >
      {/* Header with Logo */}
      <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-white/10 h-[73px]">
        {isCollapsed ? (
          /* Logo Button - Only visible when collapsed */
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="group w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-700 hover:scale-105 relative overflow-hidden select-none flex-shrink-0 hover:shadow-lg"
          >
            {/* Logo - visible by default */}
            <span className="text-white font-bold text-sm transition-all duration-300 group-hover:opacity-0 group-hover:scale-75 select-none">
              IA
            </span>

            {/* Expand icon - visible on hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 scale-125 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100">
              <div className="flex flex-col space-y-0.5">
                <div className="w-2 h-0.5 bg-white rounded-full transform transition-all duration-300"></div>
                <div className="w-3 h-0.5 bg-white rounded-full transform transition-all duration-300"></div>
              </div>
            </div>
          </button>
        ) : (
          /* Brand Text and Collapse Button - Only visible when expanded */
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center flex-1 transition-all duration-500 ease-in-out">
              <span
                onClick={() => window.location.reload()}
                className="cursor-pointer text-white font-bold text-lg select-none whitespace-nowrap"
              >
                Intellio AI
              </span>
            </div>

            {/* Collapse Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="group flex items-center justify-center w-8 h-8 transition-all duration-300 hover:bg-black rounded-lg"
            >
              <div className="flex flex-col space-y-0.5">
                <div className="w-3 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full transition-all duration-300 group-hover:from-white group-hover:to-white"></div>
                <div className="w-2 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full transition-all duration-300 group-hover:from-white group-hover:to-white"></div>
              </div>
            </Button>
          </div>
        )}
      </div>

      {/* Edit Mode Instructions */}
      {isEditMode && !isCollapsed && (
        <div className="px-4 py-2 bg-blue-500/10 border-b border-blue-500/20 transition-all duration-300 ease-in-out">
          <div className="flex items-center justify-between">
            <p className="text-blue-300 text-xs">Drag items to reorder</p>
            <button
              onClick={resetOrder}
              className="text-blue-300 hover:text-white text-xs underline transition-colors duration-200"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 py-4 relative overflow-hidden">
        <div
          className="h-full overflow-y-auto overflow-x-hidden px-3 transition-all duration-300"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#ffffff15 transparent",
          }}
        >
          <style>{`
            .sidebar-scroll::-webkit-scrollbar {
              width: 4px;
            }
            .sidebar-scroll::-webkit-scrollbar-track {
              background: transparent;
            }
            .sidebar-scroll::-webkit-scrollbar-thumb {
              background: linear-gradient(to bottom, #ffffff15, #ffffff08);
              border-radius: 2px;
              transition: all 0.3s ease;
            }
            .sidebar-scroll::-webkit-scrollbar-thumb:hover {
              background: linear-gradient(to bottom, #ffffff25, #ffffff18);
            }
          `}</style>

          <nav className="space-y-1 sidebar-scroll">
            {navigationItems.map((item, index) => (
              <div
                key={item.id}
                className={cn(
                  "transition-all duration-300 ease-in-out",
                  dragOverIndex === index &&
                    draggedItem &&
                    draggedItem.index !== index
                    ? "border-t-2 border-blue-400 pt-2"
                    : "",
                  draggedItem && draggedItem.index === index
                    ? "opacity-50 scale-95"
                    : "opacity-100 scale-100"
                )}
                draggable={isEditMode}
                onDragStart={(e) => handleDragStart(e, item, index)}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDragEnter={(e) => handleDragEnter(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
              >
                <Link
                  to={item.to}
                  className={cn(
                    "flex items-center rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 group relative transform hover:scale-[1.02]",
                    isCollapsed ? "justify-center px-3 py-2.5" : "px-3 py-2.5",
                    isEditMode && !isCollapsed
                      ? "cursor-move"
                      : "cursor-pointer"
                  )}
                  title={isCollapsed ? item.title : undefined}
                  onClick={(e) => {
                    if (isEditMode) {
                      e.preventDefault();
                    }
                  }}
                >
                  {isEditMode && !isCollapsed && (
                    <GripVertical className="h-4 w-4 text-white/40 mr-2 flex-shrink-0" />
                  )}
                  <item.icon className="h-5 w-5 flex-shrink-0 transition-all duration-300 group-hover:scale-110" />
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-300 ease-in-out",
                      isCollapsed
                        ? "w-0 opacity-0 ml-0"
                        : "w-auto opacity-100 ml-3"
                    )}
                  >
                    <span className="text-sm font-medium select-none whitespace-nowrap transition-all duration-300">
                      {item.title}
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex-shrink-0 border-t border-white/10 p-3">
        <nav className="space-y-1">
          {bottomItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 select-none transform hover:scale-[1.02]",
                isCollapsed ? "justify-center px-3 py-2.5" : "px-3 py-2.5"
              )}
              title={isCollapsed ? item.title : undefined}
            >
              <item.icon className="h-5 w-5 flex-shrink-0 transition-all duration-300 hover:scale-110" />
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out",
                  isCollapsed ? "w-0 opacity-0 ml-0" : "w-auto opacity-100 ml-3"
                )}
              >
                <span className="text-sm font-medium select-none whitespace-nowrap transition-all duration-300">
                  {item.title}
                </span>
              </div>
            </Link>
          ))}
        </nav>

        {/* Edit Button - Only visible when expanded */}
        {!isCollapsed && (
          <div className="mt-2 flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleEditMode}
              className={cn(
                "group flex items-center justify-center w-8 h-8 transition-all duration-300 hover:bg-black rounded-lg shadow-lg hover:shadow-xl",
                isEditMode
                  ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-400/30 hover:border-blue-400/50"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              )}
              title={isEditMode ? "Exit Edit Mode" : "Edit Layout"}
            >
              {isEditMode ? (
                <Check className="h-4 w-4 transition-all duration-300" />
              ) : (
                <Edit3 className="h-4 w-4 transition-all duration-300" />
              )}
            </Button>
          </div>
        )}

        {/* User Profile Section */}
        <div
          className={cn(
            "mt-4 pt-4 border-t border-white/10 transition-all duration-300",
            isCollapsed ? "h-auto" : "h-auto"
          )}
        >
          {!isCollapsed ? (
            <div className="flex items-center space-x-3 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-white/20">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 hover:scale-110">
                <span className="text-white font-medium text-sm">U</span>
              </div>
              <div className="flex-1 min-w-0 overflow-hidden">
                <div
                  className={cn(
                    "transition-all duration-300 ease-in-out",
                    isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                  )}
                >
                  <p className="text-white font-medium text-sm truncate select-none whitespace-nowrap">
                    User
                  </p>
                  <p className="text-white/60 text-xs truncate select-none whitespace-nowrap">
                    User@gmail.com
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                <span className="text-white font-medium text-sm">U</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}