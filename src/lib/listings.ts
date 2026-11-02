import "server-only";

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
  provider: {
    select: {
      id: true,
      nameBn: true,
      nameEn: true,
    },
  },
} as const;

function toPublicListing(row: {
  id: string;
  sectorSlug: string;
  kind: PublicListing["kind"];
  titleBn: string;
  titleEn: string;
  descriptionBn: string;
  descriptionEn: string;
  category: string;
  district: string;
  unit: string;
  unitPrice: { toString(): string };
  stock: { toString(): string };
  availableFrom: Date | null;
  imageKey: string | null;
  provider: { id: string; nameBn: string; nameEn: string };
}): PublicListing {
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
  };
}

export async function getPublicListings(sectorSlug: string, kind?: PublicListing["kind"]): Promise<PublicListingsResult> {
  try {
    const rows = await prisma.marketplaceListing.findMany({
      where: {
        sectorSlug,
        ...(kind ? { kind } : {}),
        isPublished: true,
        stock: { gt: 0 },
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
    return {
      items: rows.filter((row) => row.provider.capabilities.some((capability) => capability.kind === row.kind)).map(toPublicListing),
      unavailable: false,
    };
  } catch (error) {
    logError("listing.public_query_failed", error);
    return { items: [], unavailable: true };
  }
}

export async function getPublicListing(id: string): Promise<PublicListingResult> {
  try {
    const row = await prisma.marketplaceListing.findFirst({
      where: {
        id,
        isPublished: true,
        stock: { gt: 0 },
        moderationStatus: "APPROVED",
        provider: {
          status: "APPROVED",
          user: { status: "active" },
          capabilities: { some: { status: "APPROVED" } },
        },
      },
      select: {
        ...publicSelect,
        provider: {
          select: {
            ...publicSelect.provider.select,
            capabilities: { where: { status: "APPROVED" }, select: { sectorSlug: true, kind: true } },
          },
        },
      },
    });
    if (!row || !row.provider.capabilities.some((capability) => capability.sectorSlug === row.sectorSlug && capability.kind === row.kind)) {
      return { listing: null, unavailable: false };
    }
    return { listing: toPublicListing(row), unavailable: false };
  } catch (error) {
    logError("listing.public_query_failed", error);
    return { listing: null, unavailable: true };
  }
}

export async function getPublicProviderProfile(sectorSlug: string, providerId: string): Promise<PublicProviderResult> {
  try {
    const profile = await prisma.providerProfile.findFirst({
      where: {
        id: providerId,
        status: "APPROVED",
        user: { status: "active" },
        capabilities: { some: { sectorSlug, status: "APPROVED" } },
      },
      select: {
        id: true,
        nameBn: true,
        nameEn: true,
        bioBn: true,
        bioEn: true,
        district: true,
        upazila: true,
        capabilities: { where: { sectorSlug, status: "APPROVED" }, select: { kind: true } },
        listings: {
          where: { sectorSlug, isPublished: true, moderationStatus: "APPROVED", stock: { gt: 0 } },
          orderBy: { createdAt: "desc" },
          take: 60,
          select: {
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
          },
        },
        reviews: {
          orderBy: { createdAt: "desc" },
          take: 20,
          select: { rating: true, comment: true, createdAt: true },
        },
      },
    });
    if (!profile) return { provider: null, unavailable: false };
    const listings = profile.listings.filter((listing) => profile.capabilities.some((capability) => capability.kind === listing.kind)).map((listing) => ({
      ...listing,
      unitPrice: listing.unitPrice.toString(),
      stock: listing.stock.toString(),
      availableFrom: listing.availableFrom?.toISOString() ?? null,
      hasImage: Boolean(listing.imageKey),
      providerId: profile.id,
      providerNameBn: profile.nameBn,
      providerNameEn: profile.nameEn,
    }));
    const ratingSum = profile.reviews.reduce((sum, review) => sum + review.rating, 0);
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
        averageRating: profile.reviews.length ? ratingSum / profile.reviews.length : null,
        reviewCount: profile.reviews.length,
        listings,
        reviews: profile.reviews.map((review) => ({ rating: review.rating, comment: review.comment, createdAt: review.createdAt.toISOString() })),
      },
      unavailable: false,
    };
  } catch (error) {
    logError("provider.public_query_failed", error);
    return { provider: null, unavailable: true };
  }
}
