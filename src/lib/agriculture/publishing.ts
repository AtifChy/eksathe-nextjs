import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { z } from "zod";

import { Prisma } from "@/generated/prisma/client";
import { AGRICULTURE_MARKET_PRICE_FRESHNESS_DAYS } from "@/lib/agriculture/publishing-constants";
import type { AgriculturePublishingWorkspaceData } from "@/lib/agriculture/publishing-types";
import { cacheTags } from "@/lib/cache-tags";
import { hasStaffPermission, type CurrentUser } from "@/lib/dal";
import { logError } from "@/lib/logging";
import { prisma } from "@/lib/prisma";

const required = (max: number) => z.string().trim().min(1).max(max);
const status = z.enum(["DRAFT", "PUBLISHED"]);
export const priceSchema = z.object({
  id: z.string().max(64).optional(),
  productBn: required(120),
  productEn: required(120),
  market: required(120),
  district: required(80),
  unit: required(30),
  price: z
    .string()
    .regex(/^(?:0|[1-9]\d{0,9})(?:\.\d{1,2})?$/)
    .refine((value) => Number(value) > 0),
  observedAt: z.iso.date(),
  source: required(500),
  status,
  sourceRequestId: z
    .string()
    .regex(/^[1-9]\d{0,9}$/)
    .refine((value) => Number(value) <= 2_147_483_647)
    .optional(),
});
export const updateSchema = z
  .object({
    id: z.string().max(64).optional(),
    kind: z.enum(["NEWS", "ADVICE", "WEATHER_ALERT"]),
    titleBn: required(200),
    titleEn: required(200),
    bodyBn: required(10000),
    bodyEn: required(10000),
    source: required(500),
    status,
    publishedAt: z.iso.date(),
    expiresAt: z.iso.date().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.kind === "WEATHER_ALERT" && !data.expiresAt)
      ctx.addIssue({
        code: "custom",
        path: ["expiresAt"],
        message: "Weather alerts require an expiry.",
      });
    if (data.expiresAt && data.expiresAt < data.publishedAt)
      ctx.addIssue({
        code: "custom",
        path: ["expiresAt"],
        message: "Expiry must follow publication.",
      });
  });
export const supportSchema = z.object({
  phone: z
    .string()
    .trim()
    .max(30)
    .refine((v) => !v || /^[+0-9 ()-]{7,30}$/.test(v)),
  email: z
    .string()
    .trim()
    .max(254)
    .pipe(z.union([z.email(), z.literal("")])),
  messageBn: z.string().trim().max(1000),
  messageEn: z.string().trim().max(1000),
});

export async function saveAgriculturePublication(
  actor: CurrentUser,
  type: string,
  values: Record<string, string>,
) {
  if (!(await hasStaffPermission(actor, "OPERATIONS", "agriculture-labor")))
    throw new Error("Permission denied");
  const optionalValues = Object.fromEntries(
    Object.entries(values).filter(
      ([key, value]) => value || !["id", "sourceRequestId", "expiresAt"].includes(key),
    ),
  );
  if (type === "support") {
    if (actor.role !== "super_admin") throw new Error("Permission denied");
    const data = supportSchema.parse(values);
    return prisma.$transaction(async (tx) => {
      await tx.platformSetting.upsert({
        where: { key: "agriculture-support" },
        create: { key: "agriculture-support", value: data },
        update: { value: data },
      });
      await tx.activityLog.create({
        data: {
          userId: actor.id,
          action: "agriculture.support_updated",
          entityType: "setting",
          entityId: "agriculture-support",
        },
      });
    });
  }
  if (type === "price") {
    const parsed = priceSchema.parse(optionalValues);
    const { id, sourceRequestId, observedAt, price, ...rest } = parsed;
    if (sourceRequestId) {
      const request = await prisma.serviceRequest.findFirst({
        where: {
          id: Number(sourceRequestId),
          serviceDefinition: { sectorSlug: "agriculture-labor", slug: "daily-market-price" },
        },
        select: { id: true },
      });
      if (!request) throw new Error("Source request not found");
    }
    const data = {
      ...rest,
      price: new Prisma.Decimal(price),
      observedAt: new Date(`${observedAt}T00:00:00Z`),
      sourceRequestId: sourceRequestId ? Number(sourceRequestId) : null,
    };
    return prisma.$transaction(async (tx) => {
      const record = id
        ? await tx.agricultureMarketPrice.update({ where: { id }, data })
        : await tx.agricultureMarketPrice.create({ data });
      await tx.activityLog.create({
        data: {
          userId: actor.id,
          action: "agriculture.price_saved",
          entityType: "market_price",
          entityId: record.id,
        },
      });
    });
  }
  if (type !== "update") throw new Error("Unknown publication type");
  const parsed = updateSchema.parse(optionalValues);
  const { id, publishedAt, expiresAt, ...rest } = parsed;
  const data = {
    ...rest,
    publishedAt: new Date(`${publishedAt}T00:00:00Z`),
    expiresAt: expiresAt ? new Date(`${expiresAt}T23:59:59.999Z`) : null,
  };
  return prisma.$transaction(async (tx) => {
    const record = id
      ? await tx.agricultureUpdate.update({ where: { id }, data })
      : await tx.agricultureUpdate.create({ data });
    await tx.activityLog.create({
      data: {
        userId: actor.id,
        action: "agriculture.update_saved",
        entityType: "agriculture_update",
        entityId: record.id,
      },
    });
  });
}

async function queryAgriculturePublicInfo() {
  "use cache";
  cacheLife("minutes");
  cacheTag(cacheTags.agriculturePublic);

  const now = new Date();
  const freshSince = new Date(now);
  freshSince.setUTCDate(freshSince.getUTCDate() - AGRICULTURE_MARKET_PRICE_FRESHNESS_DAYS);
  const [prices, updates, sector, setting] = await Promise.all([
    prisma.agricultureMarketPrice.findMany({
      where: { status: "PUBLISHED", observedAt: { gte: freshSince, lte: now } },
      orderBy: { observedAt: "desc" },
    }),
    prisma.agricultureUpdate.findMany({
      where: {
        status: "PUBLISHED",
        publishedAt: { lte: now },
        OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
        NOT: { kind: "WEATHER_ALERT", expiresAt: null },
      },
      orderBy: { publishedAt: "desc" },
    }),
    prisma.sector.findUnique({
      where: { slug: "agriculture-labor" },
      select: { commissionRate: true },
    }),
    prisma.platformSetting.findUnique({
      where: { key: "agriculture-support" },
      select: { value: true },
    }),
  ]);
  const support = supportSchema.safeParse(setting?.value);
  return {
    unavailable: false,
    prices: prices.map((p) => ({
      id: p.id,
      productBn: p.productBn,
      productEn: p.productEn,
      market: p.market,
      district: p.district,
      unit: p.unit,
      price: p.price.toString(),
      observedAt: p.observedAt.toISOString(),
      source: p.source,
    })),
    updates: updates.map((u) => ({
      id: u.id,
      kind: u.kind,
      titleBn: u.titleBn,
      titleEn: u.titleEn,
      bodyBn: u.bodyBn,
      bodyEn: u.bodyEn,
      source: u.source,
      publishedAt: u.publishedAt.toISOString(),
      expiresAt: u.expiresAt?.toISOString() ?? null,
    })),
    commissionRate: sector?.commissionRate.toString() ?? null,
    support: support.success ? support.data : null,
  };
}

export async function getAgriculturePublicInfo() {
  try {
    return await queryAgriculturePublicInfo();
  } catch (error) {
    logError("agriculture.public_information_failed", error);
    return { unavailable: true, prices: [], updates: [], commissionRate: null, support: null };
  }
}

export type AgriculturePublicInfo = Awaited<ReturnType<typeof getAgriculturePublicInfo>>;

export async function getAgriculturePublishingWorkspace(
  actor: CurrentUser,
): Promise<AgriculturePublishingWorkspaceData> {
  if (!(await hasStaffPermission(actor, "OPERATIONS", "agriculture-labor")))
    throw new Error("Permission denied");
  const [prices, updates, requests, support] = await Promise.all([
    prisma.agricultureMarketPrice.findMany({ orderBy: { observedAt: "desc" } }),
    prisma.agricultureUpdate.findMany({ orderBy: { publishedAt: "desc" } }),
    prisma.serviceRequest.findMany({
      where: {
        serviceDefinition: { sectorSlug: "agriculture-labor", slug: "daily-market-price" },
        publishedMarketPrice: null,
        status: { notIn: ["REJECTED", "CANCELLED"] },
      },
      select: { id: true, referenceCode: true, district: true, answers: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.platformSetting.findUnique({ where: { key: "agriculture-support" } }),
  ]);
  return {
    prices: prices.map((p) => ({
      id: p.id,
      productBn: p.productBn,
      productEn: p.productEn,
      market: p.market,
      district: p.district,
      unit: p.unit,
      price: p.price.toString(),
      observedAt: p.observedAt.toISOString().slice(0, 10),
      source: p.source,
      status: p.status,
      sourceRequestId: p.sourceRequestId?.toString() ?? "",
    })),
    updates: updates.map((u) => ({
      id: u.id,
      kind: u.kind,
      titleBn: u.titleBn,
      titleEn: u.titleEn,
      bodyBn: u.bodyBn,
      bodyEn: u.bodyEn,
      source: u.source,
      status: u.status,
      publishedAt: u.publishedAt.toISOString().slice(0, 10),
      expiresAt: u.expiresAt?.toISOString().slice(0, 10) ?? "",
    })),
    requests: requests.map((request) => ({
      id: request.id,
      referenceCode: request.referenceCode,
      district: request.district,
      answers: request.answers,
    })),
    support: supportSchema.safeParse(support?.value).data ?? null,
  };
}
