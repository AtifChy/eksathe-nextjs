"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "cn";

import { useLanguage } from "@/components/language-provider";

export function DashboardTabs() {
  const { t } = useLanguage();
  const pathname = usePathname();

  const tabs = [
    { label: t.dashboard.tabDashboard, href: "/dashboard" },
    { label: t.dashboard.tabAdmin,     href: "/dashboard/admin" },
  ];

  return (
    <div className="flex gap-2 border-b pb-0 mb-6">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href || (tab.href !== "/dashboard" && pathname.startsWith(tab.href));
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "relative -mb-px inline-flex items-center rounded-t-lg px-5 py-2.5 text-sm font-semibold transition-colors",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-card text-muted-foreground border border-b-card hover:bg-muted hover:text-foreground",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
