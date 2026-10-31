"use client";

import Link from "next/link";
import { BellIcon, NewspaperIcon, PhoneCallIcon, UserIcon } from "lucide-react";

import { useLanguage } from "@/components/language-provider";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

interface DashboardHeaderProps {
  userName?: string;
  userRole?: string;
}

export function DashboardHeader({ userName, userRole }: DashboardHeaderProps) {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur-sm shadow-sm">
      <div className="mx-auto flex h-14 w-full max-w-screen-2xl items-center justify-between gap-3 px-4">
        {/* Brand */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 font-bold tracking-tight text-primary"
        >
          <span className="text-lg">BD</span>
          <span className="hidden text-sm font-semibold sm:block">
            {t.common.brandName}
          </span>
        </Link>

        {/* Action buttons */}
        <nav className="flex items-center gap-1.5 overflow-x-auto">
          <button
            type="button"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "shrink-0 gap-1.5",
            )}
          >
            <NewspaperIcon className="size-3.5" />
            <span className="hidden sm:inline">{t.dashboard.newsFeed}</span>
          </button>

          <button
            type="button"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "shrink-0 gap-1.5",
            )}
          >
            <BellIcon className="size-3.5" />
            <span className="hidden sm:inline">{t.dashboard.notifications}</span>
          </button>

          <button
            type="button"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "shrink-0 gap-1.5",
            )}
          >
            <UserIcon className="size-3.5" />
            <span className="hidden sm:inline">{t.dashboard.profile}</span>
          </button>

          <button
            type="button"
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors",
              "bg-destructive text-white hover:bg-destructive/90",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
          >
            <PhoneCallIcon className="size-3.5" />
            <span>{t.dashboard.emergencyCall}</span>
          </button>

          {/* Role badge */}
          <div className="hidden items-center gap-1 rounded-lg border border-input bg-muted/50 px-2.5 py-1 text-xs font-medium sm:flex">
            <span>{userName ?? (userRole === "admin" ? t.dashboard.adminRole : t.dashboard.guestRole)}</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              className="text-muted-foreground"
            >
              <path
                d="M3 4.5L6 7.5L9 4.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <LanguageToggle variant="muted" />
          <ThemeToggle variant="muted" />
        </nav>
      </div>
    </header>
  );
}
