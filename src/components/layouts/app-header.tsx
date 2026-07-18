"use client";

import Link from "next/link";
import type { Route } from "next";
import { Menu } from "lucide-react";

import { ThemeToggle } from "@/components/ui/theme-toggle";
import { siteConfig } from "@/config/site";
import { ROUTES } from "@/constants/routes";

import { Button } from "../ui/button";

type AppHeaderProps = {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
};

export function AppHeader({ onMenuClick, showMenuButton = false }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 px-5 py-3 backdrop-blur-xl sm:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {showMenuButton ? (
            <Button aria-label="Open navigation" size="icon" variant="ghost" onClick={onMenuClick}>
              <Menu className="size-5" />
            </Button>
          ) : null}
          <Link className="font-display text-xl font-bold tracking-tight" href={ROUTES.home}>
            {siteConfig.name}
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild className="hidden sm:inline-flex" size="sm">
            <Link href={ROUTES.login as Route}>Sign in</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
