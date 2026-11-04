import type { Metadata } from "next";
import { connection } from "next/server";

import { AgriculturePublicInformationPage } from "@/components/agriculture/agriculture-public-information-page";
import { getAgriculturePublicInfo } from "@/lib/agriculture/publishing";

export const metadata: Metadata = {
  title: "Agriculture market prices | EKsathe Bangladesh",
  alternates: { canonical: "/agriculture/market-prices" },
};
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
