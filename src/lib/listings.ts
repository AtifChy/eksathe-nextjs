import "server-only";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { logError } from "@/lib/logging";

export type PublicListing = {
  id: string;
  sectorSlug: string;
  kind: "PRODUCE" | "WORKER" | "MACHINERY" | "CONSTRUCTION_MATERIAL" | "CONSTRUCTION_SERVICE";
  titleBn: string;
  titleEn: string;
  descriptionBn: string;
  descriptionEn: string;
  category: string;
  district: string;
  unit: string;
  unitPrice: string;
  stock: string;
  availableFrom: string | null;
  hasImage: boolean;
  providerId: string;
  providerNameBn: string;
  providerNameEn: string;
  averageRating: number | null;
  reviewCount: number;
  reviews?: Array<{ rating: number; comment: string; createdAt: string }>;
};
export type PublicListingsResult = { items: PublicListing[]; unavailable: boolean };
export type PublicListingResult = { listing: PublicListing | null; unavailable: boolean };
export type PublicProvider = {
  id: string;
  sectorSlug: string;
  nameBn: string;
  nameEn: string;
  bioBn: string;
  bioEn: string;
  district: string;
  upazila: string | null;
  hasProfileImage: boolean;
  hasCoverImage: boolean;
  averageRating: number | null;
  reviewCount: number;
  listings: PublicListing[];
  reviews: Array<{ rating: number; comment: string; createdAt: string }>;
};
export type PublicProviderResult = { provider: PublicProvider | null; unavailable: boolean };

const publicSelect = {
  id: true,
  sectorSlug: true,
  kind: true,
  titleBn: true,
  titleEn: true,
  descriptionBn: true,
  descriptionEn: true,
  category: true,
  district: true,
  unit: true,
  unitPrice: true,
  stock: true,
  availableFrom: true,
  imageKey: true,
  provider: { select: { id: true, nameBn: true, nameEn: true } },
} as const;

type PublicListingRow = Prisma.MarketplaceListingGetPayload<{ select: typeof publicSelect }>;

const productKinds = ["PRODUCE", "CONSTRUCTION_MATERIAL"] as const;
const scheduledKinds = ["WORKER", "MACHINERY", "CONSTRUCTION_SERVICE"] as const;
const publicAvailabilityWhere = (kind?: PublicListing["kind"]): Prisma.MarketplaceListingWhereInput => kind
  ? productKinds.includes(kind as (typeof productKinds)[number]) ? { stock: { gt: 0 } } : {}
  : { OR: [{ kind: { in: [...productKinds] }, stock: { gt: 0 } }, { kind: { in: [...scheduledKinds] } }] };

function toPublicListing(row: PublicListingRow): PublicListing {
  return {
    id: row.id,
    sectorSlug: row.sectorSlug,
    kind: row.kind,
    titleBn: row.titleBn,
    titleEn: row.titleEn,
    descriptionBn: row.descriptionBn,
    descriptionEn: row.descriptionEn,
    category: row.category,
    district: row.district,
    unit: row.unit,
    unitPrice: row.unitPrice.toString(),
    stock: row.stock.toString(),
    availableFrom: row.availableFrom?.toISOString() ?? null,
    hasImage: Boolean(row.imageKey),
    providerId: row.provider.id,
    providerNameBn: row.provider.nameBn,
    providerNameEn: row.provider.nameEn,
    averageRating: null,
    reviewCount: 0,
  };
}

async function listingRatings(listingIds: string[]) {
  if (!listingIds.length) return new Map<string, { averageRating: number | null; reviewCount: number }>();
  const reviews = await prisma.review.findMany({
    where: { order: { listingId: { in: listingIds }, status: "COMPLETED" } },
    select: { rating: true, order: { select: { listingId: true } } },
  });
  const totals = new Map<string, { sum: number; count: number }>();
  for (const review of reviews) {
    const current = totals.get(review.order.listingId) ?? { sum: 0, count: 0 };
    current.sum += review.rating;
    current.count += 1;
    totals.set(review.order.listingId, current);
  }
  return new Map(Array.from(totals, ([id, value]) => [id, { averageRating: value.sum / value.count, reviewCount: value.count }]));
}

function withListingRatings(rows: PublicListingRow[], ratings: Map<string, { averageRating: number | null; reviewCount: number }>) {
  return rows.map((row) => ({ ...toPublicListing(row), ...(ratings.get(row.id) ?? { averageRating: null, reviewCount: 0 }) }));
}

export async function getPublicListings(sectorSlug: string, kind?: PublicListing["kind"]): Promise<PublicListingsResult> {
  try {
    const rows = await prisma.marketplaceListing.findMany({
      where: {
        sectorSlug,
        ...(kind ? { kind } : {}),
        ...publicAvailabilityWhere(kind),
        isPublished: true,
        archivedAt: null,
        moderationStatus: "APPROVED",
        provider: {
          status: "APPROVED",
          user: { status: "active" },
          capabilities: { some: { sectorSlug, status: "APPROVED" } },
        },
      },
      select: {
        ...publicSelect,
        provider: {
          select: {
            ...publicSelect.provider.select,
            capabilities: { where: { sectorSlug, status: "APPROVED" }, select: { kind: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 60,
    });
    const validRows = rows.filter((row) => row.provider.capabilities.some((capability) => capability.kind === row.kind));
    const ratings = await listingRatings(validRows.map((row) => row.id));
    return { items: withListingRatings(validRows, ratings), unavailable: false };
  } catch (error) {
    logError("listing.public_query_failed", error);
    return { items: [], unavailable: true };
  }
}

const categoryWords = {
  grains: ["grain", "rice", "wheat", "ধান", "চাল", "গম"],
  vegetables: ["vegetable", "সবজি", "শাক"],
  fruits: ["fruit", "ফল"],
  dairy: ["dairy", "milk", "দুধ", "দুগ্ধ"],
  fish: ["fish", "মাছ"],
  spices: ["spice", "মসলা", "মশলা"],
} as const;
export type AgricultureProductCategory = keyof typeof categoryWords | "other";
export type AgricultureMarketFilters = { q?: string; category?: AgricultureProductCategory; district?: string; minPrice?: string; maxPrice?: string; sort?: "newest" | "price-asc" | "price-desc"; page?: number };
export type AgricultureMarketResult = PublicListingsResult & { total: number; page: number; totalPages: number; districts: string[] };

function categoryConditions(category: AgricultureProductCategory): Prisma.MarketplaceListingWhereInput[] {
  const words = categoryWords[category as keyof typeof categoryWords];
  return words.flatMap((word) => [
    { category: { contains: word, mode: "insensitive" as const } },
    { titleBn: { contains: word, mode: "insensitive" as const } },
    { titleEn: { contains: word, mode: "insensitive" as const } },
  ]);
}

export async function getAgricultureMarketListings(filters: AgricultureMarketFilters): Promise<AgricultureMarketResult> {
  const page = Math.max(1, Math.floor(filters.page ?? 1));
  const pageSize = 12;
  const base: Prisma.MarketplaceListingWhereInput = {
    sectorSlug: "agriculture-labor",
    kind: "PRODUCE",
    isPublished: true,
    archivedAt: null,
    moderationStatus: "APPROVED",
    stock: { gt: 0 },
    provider: {
      status: "APPROVED",
      user: { status: "active" },
      capabilities: { some: { sectorSlug: "agriculture-labor", kind: "PRODUCE", status: "APPROVED" } },
    },
  };
  const and: Prisma.MarketplaceListingWhereInput[] = [];
  const q = filters.q?.trim().slice(0, 100);
  if (q) and.push({ OR: [
    { titleBn: { contains: q, mode: "insensitive" } },
    { titleEn: { contains: q, mode: "insensitive" } },
    { descriptionBn: { contains: q, mode: "insensitive" } },
    { descriptionEn: { contains: q, mode: "insensitive" } },
    { category: { contains: q, mode: "insensitive" } },
    { district: { contains: q, mode: "insensitive" } },
    { provider: { nameBn: { contains: q, mode: "insensitive" } } },
    { provider: { nameEn: { contains: q, mode: "insensitive" } } },
  ] });
  if (filters.district) and.push({ district: filters.district.slice(0, 80) });
  if (filters.minPrice || filters.maxPrice) and.push({ unitPrice: { ...(filters.minPrice ? { gte: new Prisma.Decimal(filters.minPrice) } : {}), ...(filters.maxPrice ? { lte: new Prisma.Decimal(filters.maxPrice) } : {}) } });
  if (filters.category && filters.category !== "other") and.push({ OR: categoryConditions(filters.category) });
  if (filters.category === "other") and.push({ NOT: { OR: Object.keys(categoryWords).flatMap((category) => categoryConditions(category as keyof typeof categoryWords)) } });
  const where: Prisma.MarketplaceListingWhereInput = { ...base, ...(and.length ? { AND: and } : {}) };
  const orderBy = filters.sort === "price-asc" ? { unitPrice: "asc" as const } : filters.sort === "price-desc" ? { unitPrice: "desc" as const } : { createdAt: "desc" as const };
  try {
    const [rows, total, districtRows] = await Promise.all([
      prisma.marketplaceListing.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          ...publicSelect,
          provider: { select: { ...publicSelect.provider.select, capabilities: { where: { sectorSlug: "agriculture-labor", kind: "PRODUCE", status: "APPROVED" }, select: { id: true } } } },
        },
      }),
      prisma.marketplaceListing.count({ where }),
      prisma.marketplaceListing.findMany({ where: base, select: { district: true }, distinct: ["district"], orderBy: { district: "asc" } }),
    ]);
    const validRows = rows.filter((row) => row.provider.capabilities.length > 0);
    const ratings = await listingRatings(validRows.map((row) => row.id));
    return { items: withListingRatings(validRows, ratings), total, page, totalPages: Math.max(1, Math.ceil(total / pageSize)), districts: districtRows.map((row) => row.district), unavailable: false };
  } catch (error) {
    logError("listing.agriculture_market_failed", error);
    return { items: [], total: 0, page, totalPages: 1, districts: [], unavailable: true };
  }
}

export async function getPublicListing(id: string): Promise<PublicListingResult> {
  try {
    const row = await prisma.marketplaceListing.findFirst({
      where: {
        id,
        isPublished: true,
        archivedAt: null,
        ...publicAvailabilityWhere(),
        moderationStatus: "APPROVED",
        provider: { status: "APPROVED", user: { status: "active" }, capabilities: { some: { status: "APPROVED" } } },
      },
      select: {
        ...publicSelect,
        provider: { select: { ...publicSelect.provider.select, capabilities: { where: { status: "APPROVED" }, select: { sectorSlug: true, kind: true } } } },
      },
    });
    if (!row || !row.provider.capabilities.some((capability) => capability.sectorSlug === row.sectorSlug && capability.kind === row.kind)) {
      return { listing: null, unavailable: false };
    }
    const [ratings, reviews] = await Promise.all([
      listingRatings([row.id]),
      prisma.review.findMany({ where: { order: { listingId: row.id, status: "COMPLETED" } }, orderBy: { createdAt: "desc" }, take: 20, select: { rating: true, comment: true, createdAt: true } }),
    ]);
    return {
      listing: {
        ...toPublicListing(row),
        ...(ratings.get(row.id) ?? { averageRating: null, reviewCount: 0 }),
        reviews: reviews.map((review) => ({ rating: review.rating, comment: review.comment, createdAt: review.createdAt.toISOString() })),
      },
      unavailable: false,
    };
  } catch (error) {
    logError("listing.public_query_failed", error);
    return { listing: null, unavailable: true };
  }
}

export async function getPublicProviderProfile(sectorSlug: string, providerId: string): Promise<PublicProviderResult> {
  try {
    const profile = await prisma.providerProfile.findFirst({
      where: { id: providerId, status: "APPROVED", user: { status: "active" }, capabilities: { some: { sectorSlug, status: "APPROVED" } } },
      select: {
        id: true,
        nameBn: true,
        nameEn: true,
        bioBn: true,
        bioEn: true,
        district: true,
        upazila: true,
        profileImageKey: true,
        coverImageKey: true,
        capabilities: { where: { sectorSlug, status: "APPROVED" }, select: { kind: true } },
        listings: {
          where: { sectorSlug, isPublished: true, moderationStatus: "APPROVED", archivedAt: null, ...publicAvailabilityWhere() },
          orderBy: { createdAt: "desc" },
          take: 60,
          select: {
            id: true, sectorSlug: true, kind: true, titleBn: true, titleEn: true, descriptionBn: true, descriptionEn: true,
            category: true, district: true, unit: true, unitPrice: true, stock: true, availableFrom: true, imageKey: true,
          },
        },
        reviews: { orderBy: { createdAt: "desc" }, take: 20, select: { rating: true, comment: true, createdAt: true } },
      },
    });
    if (!profile) return { provider: null, unavailable: false };
    const listings: PublicListing[] = profile.listings.filter((listing) => profile.capabilities.some((capability) => capability.kind === listing.kind)).map((listing) => ({
      ...listing,
      unitPrice: listing.unitPrice.toString(),
      stock: listing.stock.toString(),
      availableFrom: listing.availableFrom?.toISOString() ?? null,
      hasImage: Boolean(listing.imageKey),
      providerId: profile.id,
      providerNameBn: profile.nameBn,
      providerNameEn: profile.nameEn,
      averageRating: null,
      reviewCount: 0,
    }));
    const [ratingAggregate, ratingMap] = await Promise.all([
      prisma.review.aggregate({ where: { providerId: profile.id }, _avg: { rating: true }, _count: { rating: true } }),
      listingRatings(listings.map((listing) => listing.id)),
    ]);
    return {
      provider: {
        id: profile.id,
        sectorSlug,
        nameBn: profile.nameBn,
        nameEn: profile.nameEn,
        bioBn: profile.bioBn,
        bioEn: profile.bioEn,
        district: profile.district,
        upazila: profile.upazila,
        hasProfileImage: Boolean(profile.profileImageKey),
        hasCoverImage: Boolean(profile.coverImageKey),
        averageRating: ratingAggregate._avg.rating,
        reviewCount: ratingAggregate._count.rating,
        listings: listings.map((listing) => ({ ...listing, ...(ratingMap.get(listing.id) ?? { averageRating: null, reviewCount: 0 }) })),
        reviews: profile.reviews.map((review) => ({ rating: review.rating, comment: review.comment, createdAt: review.createdAt.toISOString() })),
      },
      unavailable: false,
    };
  } catch (error) {
    logError("provider.public_query_failed", error);
    return { provider: null, unavailable: true };
  }
}
