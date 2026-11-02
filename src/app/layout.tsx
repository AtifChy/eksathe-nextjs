import { Suspense } from "react";
import type { ReactNode } from "react";
import type { Metadata } from "next";

import { LanguageProvider } from "@/components/language-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeaderServer } from "@/components/site-header-server";
import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";
import "@fontsource/hind-siliguri/300.css";
import "@fontsource/hind-siliguri/400.css";
import "@fontsource/hind-siliguri/500.css";
import "@fontsource/hind-siliguri/600.css";
import "@fontsource/hind-siliguri/700.css";

export const metadata: Metadata = {
  title: "EKsathe Bangladesh | One account for everyday services",
  description:
    "Find services, farm produce, agricultural workers, machinery, construction providers, and materials on one platform.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="bn"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider initialLocale="bn">
            <Suspense fallback={<div className="h-16 border-b bg-card" aria-hidden="true" />}>
              <SiteHeaderServer />
            </Suspense>
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
