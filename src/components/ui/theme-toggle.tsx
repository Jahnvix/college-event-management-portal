"use client";

import { MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";

import { useMounted } from "@/hooks/use-mounted";

import { Button } from "./button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <Button
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative overflow-hidden"
      size="icon"
      variant="outline"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <SunMedium
        className={`size-4 transition-all ${isDark ? "translate-y-8 opacity-0" : "translate-y-0 opacity-100"}`}
      />
      <MoonStar
        className={`absolute size-4 transition-all ${isDark ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"}`}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
