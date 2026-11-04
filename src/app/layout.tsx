import type { Metadata } from "next";
import { cookies } from "next/headers";
import type { ReactNode } from "react";

import { LanguageProvider } from "@/components/language-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeaderServer } from "@/components/site-header-server";
import { ThemeProvider } from "@/components/theme-provider";
import type { Locale } from "@/dictionaries";

import "./globals.css";
import "@fontsource/hind-siliguri/300.css";
import "@fontsource/hind-siliguri/400.css";
import "@fontsource/hind-siliguri/500.css";
import "@fontsource/hind-siliguri/600.css";
import "@fontsource/hind-siliguri/700.css";

export const metadata: Metadata = {
  icons: { apple: "/brand/eksathe-logo.png" },
  title: "EKsathe Bangladesh | One account for everyday services",
  description:
    "Find services, farm produce, agricultural workers, machinery, construction providers, and materials on one platform.",
};

export const instant = false;

export default async function RootLayout({ children }: { children: ReactNode }) {
  const savedLocale = (await cookies()).get("NEXT_LOCALE")?.value;
  const initialLocale: Locale = savedLocale === "en" || savedLocale === "bn" ? savedLocale : "bn";
  return (
    <html lang={initialLocale} suppressHydrationWarning className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider initialLocale={initialLocale}>
            <SiteHeaderServer />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
