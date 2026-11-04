import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/prisma/client";
import { agricultureServiceRegistry } from "../src/lib/agriculture/service-registry";
import { sectors } from "../src/lib/sectors";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  for (const sector of sectors) {
    await prisma.sector.upsert({
      where: { slug: sector.slug },
      update: {
        position: sector.id,
        titleBn: sector.labelBn,
        titleEn: sector.labelEn,
        icon: sector.icon,
        status: sector.status === "live" ? "LIVE" : "COMING_SOON",
      },
      create: {
        slug: sector.slug,
        position: sector.id,
        titleBn: sector.labelBn,
        titleEn: sector.labelEn,
        icon: sector.icon,
        status: sector.status === "live" ? "LIVE" : "COMING_SOON",
      },
    });
  }

  for (const service of agricultureServiceRegistry) {
    const serviceData = {
      slug: service.slug,
      titleBn: service.titleBn,
      titleEn: service.titleEn,
      category: service.category,
      descriptionBn: service.descriptionBn,
      descriptionEn: service.descriptionEn,
      icon: service.icon,
      formVersion: service.formVersion,
    };
    await prisma.serviceDefinition.upsert({
      where: { slug: service.slug },
      update: serviceData,
      create: serviceData,
    });
  }

  console.log(
    `Seeded ${sectors.length} sectors and ${agricultureServiceRegistry.length} service definitions.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
