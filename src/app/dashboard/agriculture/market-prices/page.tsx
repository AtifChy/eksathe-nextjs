import { connection } from "next/server";

import { AgriculturePublicInformationPage } from "@/components/agriculture/agriculture-public-information-page";
import { getPageMetadata } from "@/i18n/metadata";
import { getAgriculturePublicInfo } from "@/lib/agriculture/publishing";

export function generateMetadata() {
  return getPageMetadata("agriculturePrices", "/agriculture/market-prices");
}
export const instant = false;

export default async function DashboardAgricultureMarketPricesPage() {
  await connection();
  const info = await getAgriculturePublicInfo();
  return (
    <AgriculturePublicInformationPage
      info={info}
      routeBase="/dashboard/agriculture"
      section="prices"
    />
  );
}
