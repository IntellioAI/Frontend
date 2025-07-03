"use client";

import * as React from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  Menu,
  Users,
  Wrench,
  UserCircle,
  Code,
  Globe,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const productItems = [
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
    to: "/crafts",
    icon: Wrench,
  },
  {
    title: "AI Digital Clone",
    to: "/clone",
    icon: UserCircle,
  },
];

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isProductsOpen, setIsProductsOpen] = React.useState(false);
  
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-5xl px-2 lg:px-4">
      <nav className="bg-black/90 backdrop-blur-md border border-white/10 ring-1 ring-white/10 rounded-full px-2 py-0 lg:px-6 lg:py-3 shadow-[0_2px_15px_rgba(255,255,255,0.05)] mr-2 ml-2">
        <div className="flex items-center justify-between">
          {/* Clean Logo - Text Only */}
          <Link to="/" className="flex items-center">
            <span className="font-bold text-lg lg:text-xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Intellio AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Enhanced Products Dropdown */}
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-white/80 hover:text-white hover:bg-white/10 transition-colors rounded-xl px-4 py-2 text-base"
                >
                  Products
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-64 bg-black/90 backdrop-blur-md border border-gray-800/20 rounded-b-2xl rounded-t-none p-1 mt-1"
                align="center"
                sideOffset={4}
              >
                {productItems.map((item) => (
                  <DropdownMenuItem key={item.to} asChild>
                    <Link
                      to={item.to}
                      className="flex items-start space-x-3 px-3 py-3 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group"
                    >
                      <div className="mt-0.5">
                        <item.icon className="h-4 w-4 text-white/60 group-hover:text-white transition-colors" />
                      </div>
                      <div className="flex-1">
                        <div className="text-white text-sm font-medium">{item.title}</div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Clean Navigation Links */}
            <Link
              to="/about"
              className="text-white/80 hover:text-white transition-colors px-4 py-2 rounded-xl hover:bg-white/10 text-base"
            >
              About
            </Link>
            <Link
              to="/docs"
              className="text-white/80 hover:text-white transition-colors px-4 py-2 rounded-xl hover:bg-white/10 flex items-center space-x-1 text-base"
            >
              <span>Docs</span>
            </Link>
          </div>

          {/* Enhanced Get Started Button */}
          <div className="hidden lg:flex items-center">
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-200 rounded-xl px-6 py-2 font-medium shadow-lg hover:shadow-xl">
              Get Started
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-white hover:bg-white/10 rounded-xl h-8 w-8"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-black/90 backdrop-blur-md border-gray-800/20 text-white w-72"
            >
              <div className="mt-8 space-y-0">
                {/* Products Collapsible Section */}
                <div className="py-2 -mb-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-between text-white font-medium hover:bg-white/10 transition-colors rounded-xl px-3 py-2 text-base"
                    onClick={() => setIsProductsOpen(!isProductsOpen)}
                  >
                    Products
                    <ChevronDown 
                      className={`h-4 w-4 transition-transform font-medium duration-200 ${
                        isProductsOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </Button>
                  <div 
                    className={`mt-2 pl-3 overflow-hidden transition-all duration-200 ease-in-out ${
                      isProductsOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    {productItems.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className="flex items-start space-x-3 px-3 py-3 rounded-xl hover:bg-white/10 transition-colors text-base group"
                        onClick={() => setIsOpen(false)}
                      >
                        <div className="mt-0.5">
                          <item.icon className="h-4 w-4 text-white/60 group-hover:text-white transition-colors" />
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-medium">{item.title}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* About Link */}
                <div className="py-2">
                  <Link
                    to="/about"
                    className="block px-3 py-2 rounded-xl hover:bg-white/10 transition-colors text-white text-base"
                    onClick={() => setIsOpen(false)}
                  >
                    About
                  </Link>
                </div>

                {/* Docs Link */}
                <div className="py-2">
                  <Link
                    to="/docs"
                    className="flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors text-white text-base"
                    onClick={() => setIsOpen(false)}
                  >
                    <span>Docs</span>
                  </Link>
                </div>

                {/* Get Started Button */}
                <div className="pt-4 border-t border-gray-800/30">
                  <Button
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-200 rounded-xl py-3 font-medium shadow-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </div>
  );
}