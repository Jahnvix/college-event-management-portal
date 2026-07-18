"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

import { AppHeader } from "./app-header";
import { AppSidebar } from "./app-sidebar";

type DashboardShellProps = Readonly<{
  children: React.ReactNode;
}>;

export function DashboardShell({ children }: DashboardShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[18rem_1fr]">
      {isSidebarOpen ? (
        <button
          aria-label="Close navigation overlay"
          className="fixed inset-0 z-30 bg-foreground/20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          type="button"
        />
      ) : null}
      <AppSidebar isOpen={isSidebarOpen} pathname={pathname} onClose={() => setIsSidebarOpen(false)} />
      <div className="min-w-0">
        <AppHeader showMenuButton onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="mx-auto w-full max-w-7xl p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
