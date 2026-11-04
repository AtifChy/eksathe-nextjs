import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function getPageMetadata(
  page:
    | "home"
    | "dashboard"
    | "agriculture"
    | "agricultureMarket"
    | "agricultureUpdates"
    | "agriculturePrices"
    | "construction"
    | "constructionMarket",
  canonical?: string,
): Promise<Metadata> {
  const t = await getTranslations("metadata");
  const prefix = `${page}.`;

  return {
    title: t(`${prefix}title` as never),
    description: t(`${prefix}description` as never),
    ...(canonical ? { alternates: { canonical } } : {}),
  };
}
