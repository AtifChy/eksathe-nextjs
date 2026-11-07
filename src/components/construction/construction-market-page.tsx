import { ConstructionMarket } from "@/components/construction/construction-market";
import { getConstructionMarketListings, type ConstructionMarketFilters } from "@/lib/listings";

type SearchParams = Record<string, string | string[] | undefined>;
const kinds = new Set(["CONSTRUCTION_SERVICE", "CONSTRUCTION_MATERIAL"]);
const sorts = new Set(["newest", "price-asc", "price-desc"]);

function first(value: string | string[] | undefined) {
  return typeof value === "string" ? value : undefined;
}

function validPrice(value: string | undefined) {
  return value && /^(?:0|[1-9]\d{0,9})(?:\.\d{1,2})?$/.test(value) ? value : undefined;
}

export async function ConstructionMarketPage({
  routeBase,
  searchParams,
}: {
  routeBase: string;
  searchParams: Promise<SearchParams>;
}) {
  const query = await searchParams;
  const rawKind = first(query.type);
  const rawSort = first(query.sort);
  const rawPage = first(query.page);
  const filters: ConstructionMarketFilters = {
    ...(first(query.q)?.trim() ? { q: first(query.q)!.trim().slice(0, 100) } : {}),
    ...(rawKind && kinds.has(rawKind)
      ? { kind: rawKind as ConstructionMarketFilters["kind"] }
      : {}),
    ...(first(query.category)?.trim()
      ? { category: first(query.category)!.trim().slice(0, 80) }
      : {}),
    ...(first(query.district)?.trim()
      ? { district: first(query.district)!.trim().slice(0, 80) }
      : {}),
    ...(validPrice(first(query.minPrice)) ? { minPrice: validPrice(first(query.minPrice)) } : {}),
    ...(validPrice(first(query.maxPrice)) ? { maxPrice: validPrice(first(query.maxPrice)) } : {}),
    ...(rawSort && sorts.has(rawSort)
      ? { sort: rawSort as ConstructionMarketFilters["sort"] }
      : {}),
    ...(rawPage && /^\d{1,6}$/.test(rawPage) ? { page: Math.max(1, Number(rawPage)) } : {}),
  };
  const result = await getConstructionMarketListings(filters);
  return <ConstructionMarket routeBase={routeBase} filters={filters} result={result} />;
}
