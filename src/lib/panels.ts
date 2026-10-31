import { cacheLife, cacheTag } from "next/cache";

import { prisma } from "@/lib/prisma";

export async function getActivePanels() {
  "use cache";
  cacheLife("hours");
  cacheTag("panels");

  try {
    return await prisma.panel.findMany({
      where: { isActive: true },
      orderBy: { id: "asc" },
      select: {
        id: true,
        slug: true,
        titleBn: true,
        titleEn: true,
        category: true,
        descriptionBn: true,
        descriptionEn: true,
        icon: true,
      },
    });
  } catch (error) {
    console.error("Database query failed in getActivePanels:", error);
    return [];
  }
}

export type ActivePanel = Awaited<ReturnType<typeof getActivePanels>>[number];
