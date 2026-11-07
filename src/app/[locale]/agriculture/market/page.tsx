import { Suspense } from "react";

import { AgricultureMarketPage } from "@/components/agriculture/agriculture-market-page";
import { GridPageSkeleton } from "@/components/skeletons/page-skeletons";
import { getPageMetadata } from "@/i18n/metadata";

export function generateMetadata() {
  return getPageMetadata("agricultureMarket", "/agriculture/market");
}

export default function MarketPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense fallback={<GridPageSkeleton />}>
      <AgricultureMarketPage routeBase="/agriculture" searchParams={searchParams} />
    </Suspense>
  );
}
