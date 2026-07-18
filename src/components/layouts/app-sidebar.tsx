"use client";

import Link from "next/link";
import type { Route } from "next";
import { CalendarDays, LayoutDashboard, Settings, UserRound, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigationItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/events", icon: CalendarDays, label: "Events" },
  { href: "/profile", icon: UserRound, label: "Profile" },
  { href: "/settings", icon: Settings, label: "Settings" },
] as const;

type AppSidebarProps = {
  isOpen?: boolean;
  onClose?: () => void;
  pathname?: string;
};

export function AppSidebar({ isOpen = false, onClose, pathname }: AppSidebarProps) {
  return (
    <aside
      aria-label="Application navigation"
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-border bg-background p-5 transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <div className="mb-8 flex items-center justify-between">
        <span className="font-display text-xl font-bold">CampusPulse</span>
        <Button aria-label="Close navigation" className="lg:hidden" size="icon" variant="ghost" onClick={onClose}>
          <X className="size-5" />
        </Button>
      </div>
      <nav className="space-y-1">
        {navigationItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted hover:bg-secondary hover:text-foreground",
              )}
              href={href as Route}
              key={href}
              {...(onClose ? { onClick: onClose } : {})}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
