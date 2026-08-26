import React, { createContext, useCallback, useContext, useState } from "react";
import { AppSidebar } from "@/src/components/layout/AppSidebar";

type AppSidebarContextValue = {
  isSidebarOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
};

const AppSidebarContext = createContext<AppSidebarContextValue | null>(null);

// Mounted once at the app root (not inside AppHeader) so its full-screen
// overlay actually covers the whole screen. AppHeader is registered as the
// Tabs navigator's `header`, which React Navigation renders inside its own
// header-sized container — a sidebar mounted there can only ever cover that
// container, not the screen content below it.
export function AppSidebarProvider({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openSidebar = useCallback(() => setIsSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);

  return (
    <AppSidebarContext.Provider value={{ isSidebarOpen, openSidebar, closeSidebar }}>
      {children}
      <AppSidebar visible={isSidebarOpen} onClose={closeSidebar} />
    </AppSidebarContext.Provider>
  );
}

export function useAppSidebar() {
  const context = useContext(AppSidebarContext);
  if (!context) throw new Error("useAppSidebar must be used within AppSidebarProvider");
  return context;
}
