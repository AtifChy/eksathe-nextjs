import "server-only";

import { prisma } from "@/lib/prisma";

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
  providerId: string;
  providerNameBn: string;
  providerNameEn: string;
};

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
    providerId: row.provider.id,
    providerNameBn: row.provider.nameBn,
    providerNameEn: row.provider.nameEn,
  };
}

export async function getPublicListings(sectorSlug: string, kind?: PublicListing["kind"]) {
  try {
    const rows = await prisma.marketplaceListing.findMany({
      where: {
        sectorSlug,
        ...(kind ? { kind } : {}),
        isPublished: true,
        provider: {
          status: "APPROVED",
          capabilities: { some: { sectorSlug, kind, status: "APPROVED" } },
        },
      },
      select: publicSelect,
      orderBy: { createdAt: "desc" },
      take: 60,
    });
    return rows.map(toPublicListing);
  } catch (error) {
    console.error("Public listing query failed.", error);
    return [];
  }
}

export async function getPublicListing(id: string) {
  try {
    const row = await prisma.marketplaceListing.findFirst({
      where: {
        id,
        isPublished: true,
        provider: {
          status: "APPROVED",
          capabilities: { some: { status: "APPROVED" } },
        },
      },
      select: publicSelect,
    });
    return row ? toPublicListing(row) : null;
  } catch (error) {
    console.error("Public listing query failed.", error);
    return null;
  }
}
