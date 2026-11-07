import { notFound } from "next/navigation";

import { ConstructionServiceDetail } from "@/components/construction/construction-service-detail";
import { getConstructionService } from "@/lib/construction/service-registry";
import { getConstructionMarketListings } from "@/lib/listings";

export async function ConstructionServicePage({
  slug,
  routeBase,
}: {
  slug: string;
  routeBase: string;
}) {
  const service = getConstructionService(slug);
  if (!service) notFound();
  const result = await getConstructionMarketListings({
    kind: service.kind,
    searchTerms: [...service.searchTerms],
  });
  return <ConstructionServiceDetail service={service} routeBase={routeBase} result={result} />;
}
