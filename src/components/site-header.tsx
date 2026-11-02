"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronDownIcon, LayoutDashboardIcon, LogOutIcon, UserRoundIcon } from "lucide-react";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLanguage } from "@/components/language-provider";
import { authClient } from "@/lib/auth-client";

type SiteHeaderProps = {
  userName?: string;
  signedIn: boolean;
  canProvider: boolean;
  canAdmin: boolean;
};

export function SiteHeader({ userName, signedIn, canProvider, canAdmin }: SiteHeaderProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  async function signOut() {
    await authClient.signOut();
    setMenuOpen(false);
    router.replace("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-[#0b5036] text-white shadow-sm">
      <div className="mx-auto flex min-h-16 w-full max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 flex-col font-bold leading-tight" aria-label={t.common.brandName}>
          <span className="text-sm sm:text-base">{t.common.brandName}</span>
          <span className="hidden text-[0.65rem] font-normal text-white/70 sm:block">{t.common.brandSlogan}</span>
        </Link>

        <nav className="flex min-w-0 items-center gap-1 overflow-x-auto sm:gap-2" aria-label={t.header.services}>
          <Link href="/dashboard" className="shrink-0 rounded-lg px-2.5 py-2 text-xs font-semibold text-white/90 hover:bg-white/10 sm:text-sm">
            <span className="hidden sm:inline">{t.header.dashboard}</span>
            <span className="sm:hidden" aria-label={t.header.dashboard}>13</span>
          </Link>
          <Link href="/dashboard/agriculture-labor" className="shrink-0 rounded-lg px-2.5 py-2 text-xs font-semibold text-white/90 hover:bg-white/10 sm:text-sm">
            {t.home.agriculture}
          </Link>
          <Link href="/dashboard/construction" className="shrink-0 rounded-lg px-2.5 py-2 text-xs font-semibold text-white/90 hover:bg-white/10 sm:text-sm">
            {t.home.construction}
          </Link>

          <LanguageToggle />
          <ThemeToggle />

          {signedIn ? (
            <div className="relative shrink-0">
              <button
                type="button"
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                onClick={() => setMenuOpen((open) => !open)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 px-2.5 py-2 text-xs font-semibold hover:bg-white/10 sm:text-sm"
              >
                <UserRoundIcon aria-hidden="true" />
                <span className="hidden max-w-32 truncate md:inline">{userName ?? t.auth.signIn}</span>
                <ChevronDownIcon aria-hidden="true" />
              </button>
              {menuOpen && (
                <div role="menu" className="absolute right-0 top-full mt-2 flex min-w-48 flex-col gap-1 rounded-xl border border-border bg-card p-2 text-foreground shadow-lg">
                  <Link role="menuitem" href="/account" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm hover:bg-muted">{t.dashboard.profile}</Link>
                  {canProvider && <Link role="menuitem" href="/provider" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm hover:bg-muted">{t.nav.provider}</Link>}
                  {canAdmin && <Link role="menuitem" href="/admin" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm hover:bg-muted">{t.nav.admin}</Link>}
                  <button role="menuitem" type="button" onClick={signOut} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-muted">
                    <LogOutIcon aria-hidden="true" />{t.nav.signOut}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex shrink-0 items-center gap-1">
              <Link href="/login" className="rounded-lg px-2.5 py-2 text-xs font-semibold hover:bg-white/10 sm:text-sm">{t.header.login}</Link>
              <Link href="/register" className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-2 text-xs font-semibold text-[#0b5036] hover:bg-white/90 sm:text-sm">
                <LayoutDashboardIcon aria-hidden="true" />{t.header.register}
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
