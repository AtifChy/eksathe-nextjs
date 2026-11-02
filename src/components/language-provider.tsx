"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import { useRouter } from "next/navigation";

import {
  dictionaries,
  type Dictionary,
  type Locale,
} from "@/dictionaries";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: Dictionary;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const COOKIE_NAME = "NEXT_LOCALE";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=31536000; SameSite=Lax`;
}

let memoryLocale: Locale = "bn";
const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function notify() {
  for (const listener of listeners) {
    listener();
  }
}

function getSnapshot(): Locale {
  const saved = getCookie(COOKIE_NAME);
  if (saved === "en" || saved === "bn") {
    memoryLocale = saved;
    return saved;
  }
  return memoryLocale;
}

interface LanguageProviderProps {
  children: React.ReactNode;
  initialLocale?: Locale;
}

export function LanguageProvider({
  children,
  initialLocale = "bn",
}: LanguageProviderProps) {
  const router = useRouter();
  const locale = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => initialLocale,
  );

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback(
    (newLocale: Locale) => {
      memoryLocale = newLocale;
      setCookie(COOKIE_NAME, newLocale);
      if (typeof document !== "undefined") {
        document.documentElement.lang = newLocale;
      }
      notify();
      router.refresh();
    },
    [router],
  );

  const toggleLocale = useCallback(() => {
    const nextLocale: Locale = locale === "en" ? "bn" : "en";
    setLocale(nextLocale);
  }, [locale, setLocale]);

  const t = useMemo(() => dictionaries[locale] ?? dictionaries.en, [locale]);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      toggleLocale,
      t,
    }),
    [locale, setLocale, toggleLocale, t],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
