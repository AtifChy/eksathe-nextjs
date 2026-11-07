import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { Suspense, type ReactNode } from "react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeaderFallback, SiteHeaderServer } from "@/components/site-header-server";
import { ThemeProvider } from "@/components/theme-provider";
import { getPageMetadata } from "@/i18n/metadata";

import "./globals.css";
import "@fontsource/hind-siliguri/300.css";
import "@fontsource/hind-siliguri/400.css";
import "@fontsource/hind-siliguri/500.css";
import "@fontsource/hind-siliguri/600.css";
import "@fontsource/hind-siliguri/700.css";

export async function generateMetadata(): Promise<Metadata> {
  return {
    ...(await getPageMetadata("home")),
    icons: { apple: "/brand/eksathe-logo.png" },
  };
}

export const instant = false;

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  return (
    <html lang={locale} suppressHydrationWarning className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider>
            <Suspense fallback={<SiteHeaderFallback />}>
              <SiteHeaderServer />
            </Suspense>
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
