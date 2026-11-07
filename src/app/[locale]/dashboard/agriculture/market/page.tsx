import { AgricultureMarketPage } from "@/components/agriculture/agriculture-market-page";
import { getPageMetadata } from "@/i18n/metadata";

export function generateMetadata() {
  return getPageMetadata("agricultureMarket", "/agriculture/market");
}
export const instant = false;

export default async function DashboardAgricultureMarketPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <AgricultureMarketPage routeBase="/dashboard/agriculture" searchParams={searchParams} />;
}
