import type { Metadata } from "next";
import { connection } from "next/server";

import { ConstructionHome } from "@/components/construction/construction-home";
import { getConstructionCommissionRate } from "@/lib/construction/public-data";
import { getPublicListings } from "@/lib/listings";

export const metadata: Metadata = {
  title: "Construction | EKsathe Bangladesh",
  description:
    "Find approved construction professionals and materials, compare project quotes, and track work across Bangladesh.",
  alternates: { canonical: "/construction" },
};
export const instant = false;

export default async function ConstructionPage() {
  await connection();
  const [result, commissionRate] = await Promise.all([
    getPublicListings("construction"),
    getConstructionCommissionRate(),
  ]);
  return (
    <ConstructionHome
      routeBase="/construction"
      showDashboardBackLink={false}
      listings={result.items}
      unavailable={result.unavailable}
      commissionRate={commissionRate}
    />
  );
}
