import { createContext, useContext } from "react";

export const SidebarContext = createContext<{
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}>({
  isCollapsed: true,
  setIsCollapsed: () => {},
});

export const useSidebar = () => useContext(SidebarContext);
