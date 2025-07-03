"use client";

import * as React from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Users,
  Wrench,
  UserCircle,
  BookOpen,
  Settings,
  HelpCircle,
  BarChart3,
  Bell,
  Code,
  Globe,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    title: "Dashboard",
    to: "/",
    icon: Home,
  },
  {
    title: "Code Playground",
    to: "/playground",
    icon: Code,
  },
  {
    title: "Web Playground",
    to: "/web-playground",
    icon: Globe,
  },
  {
    title: "Faculty Dashboard",
    to: "/faculty",
    icon: Users,
  },
  {
    title: "Crafts Tools",
    to: "/products",
    icon: Wrench,
  },
  {
    title: "AI Digital Clone",
    to: "/clone",
    icon: UserCircle,
  },
  {
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
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <div
      className={cn(
        "fixed left-4 top-6 bottom-6 z-40 flex flex-col bg-[#0A0A0A] border border-white/30 ring-1 ring-white/30 rounded-3xl shadow-[0_2px_15px_rgba(255,255,255,0.05)] transition-all duration-300 overflow-hidden",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
      style={{ isolation: "isolate" }}
    >
      {/* Header with Logo */}
      {isCollapsed ? (
        <div className="flex items-center justify-center p-4 border-b border-white/10">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">IA</span>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <span className="text-white font-bold text-lg ">Intellio AI</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="group flex items-center justify-center px-3 py-2.5 transition-all duration-200 h-auto w-auto hover:bg-[#0A0A0A]"
          >
            <div className="flex flex-col space-y-0.5">
              <div className="w-3 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full transition-all duration-200 group-hover:from-white group-hover:to-white"></div>
              <div className="w-2 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full transition-all duration-200 group-hover:from-white group-hover:to-white"></div>
            </div>
          </Button>
        </div>
      )}

      {/* Expand Button for Collapsed State */}
      {isCollapsed && (
        <div className="px-3 pb-2 mt-2 flex-shrink-0">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="group flex items-center justify-center px-3 py-2.5 transition-all duration-300 w-full"
          >
            <div className="flex flex-col space-y-0.5">
              <div className="w-2 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full transition-all duration-200 group-hover:from-white group-hover:to-white"></div>
              <div className="w-3 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full transition-all duration-200 group-hover:from-white group-hover:to-white"></div>
            </div>
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 will-change-transform [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-white/30 [&::-webkit-scrollbar-corner]:bg-transparent -mt-4">
        <nav className="space-y-1 px-3">
          {navigationItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center space-x-3 px-3 py-2.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors group relative",
                isCollapsed && "justify-center"
              )}
              title={isCollapsed ? item.title : undefined}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && (
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{item.title}</span>
                </div>
              )}
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-white/10 p-3">
        <nav className="space-y-1">
          {bottomItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center space-x-3 px-3 py-2.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors",
                isCollapsed && "justify-center"
              )}
              title={isCollapsed ? item.title : undefined}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="text-sm font-medium">{item.title}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* User Profile Section */}
        {!isCollapsed ? (
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center space-x-3 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-medium text-sm">U</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">User</p>
                <p className="text-white/60 text-xs truncate">User@gmail.com</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">U</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}