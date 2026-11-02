import { Suspense } from "react";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Geist_Mono, Hind_Siliguri } from "next/font/google";

import { LanguageProvider } from "@/components/language-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeaderServer } from "@/components/site-header-server";
import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";

const hindSiliguri = Hind_Siliguri({
  variable: "--font-hind-siliguri",
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
      className={`${hindSiliguri.variable} ${geistMono.variable} h-full antialiased`}
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
