"use server";

import { cookies } from "next/headers";

import { isLocale, localeCookieName } from "@/i18n/locales";

export async function setLocaleAction(value: unknown): Promise<{ ok: boolean }> {
  if (!isLocale(value)) return { ok: false };

  (await cookies()).set(localeCookieName, value, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return { ok: true };
}
