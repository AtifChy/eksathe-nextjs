"use client";

import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "lucide-react";
import { cn } from "cn";

import { Button } from "@/components/ui/button";

interface ThemeToggleProps {
  variant?: "header" | "muted";
}

export function ThemeToggle({ variant = "header" }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const isHeader = variant === "header";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      className={cn(
        isHeader
          ? "text-white hover:bg-white/10 hover:text-white"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      <SunIcon className="hidden dark:block" />
      <MoonIcon className="block dark:hidden" />
    </Button>
  );
}
