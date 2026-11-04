import "server-only";

import { prisma } from "@/lib/prisma";
import { logError } from "@/lib/logging";

export async function getConstructionCommissionRate(): Promise<string | null> {
  try {
    const sector = await prisma.sector.findUnique({ where: { slug: "construction" }, select: { commissionRate: true } });
    return sector?.commissionRate.toString() ?? null;
  } catch (error) {
    logError("construction.commission_rate_query_failed", error);
    return null;
  }
}
