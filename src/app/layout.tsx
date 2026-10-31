import type { Metadata } from "next";
import { Geist_Mono, Hind_Siliguri } from "next/font/google";

import { LanguageProvider } from "@/components/language-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
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
  title: "Agriculture, Market & Labor | EKsathe Bangladesh",
  description:
    "Manage agricultural produce, market prices, farm labor, transport, and service requests on a unified platform.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
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
          <LanguageProvider initialLocale="en">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
