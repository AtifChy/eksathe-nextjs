import { ConstructionMarketPage } from "@/components/construction/construction-market-page";
import { getPageMetadata } from "@/i18n/metadata";

export function generateMetadata() {
  return getPageMetadata("constructionMarket", "/construction/market");
}
export const instant = false;

export default function MarketPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <ConstructionMarketPage routeBase="/construction" searchParams={searchParams} />;
}
