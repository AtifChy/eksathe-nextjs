import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

import bnMessages from "../messages/bn.json";
import enMessages from "../messages/en.json";
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
        titleBn: bnMessages.sectors[sector.slug],
        titleEn: enMessages.sectors[sector.slug],
        icon: sector.icon,
        status: sector.status === "live" ? "LIVE" : "COMING_SOON",
      },
      create: {
        slug: sector.slug,
        position: sector.id,
        titleBn: bnMessages.sectors[sector.slug],
        titleEn: enMessages.sectors[sector.slug],
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

  const commerceCategories = [
    { slug: "food-grocery", titleBn: "খাদ্য ও মুদি", titleEn: "Food & grocery" },
    { slug: "agriculture-supplies", titleBn: "কৃষি উপকরণ", titleEn: "Agriculture supplies" },
    { slug: "apparel", titleBn: "পোশাক", titleEn: "Apparel" },
    { slug: "home-household", titleBn: "গৃহস্থালি", titleEn: "Home & household" },
    { slug: "construction-materials", titleBn: "নির্মাণসামগ্রী", titleEn: "Construction materials" },
  ];
  for (const category of commerceCategories) {
    await prisma.commerceCategory.upsert({
      where: { slug: category.slug },
      update: { titleBn: category.titleBn, titleEn: category.titleEn },
      create: category,
    });
  }

  console.log(
    `Seeded ${sectors.length} sectors, ${agricultureServiceRegistry.length} service definitions and ${commerceCategories.length} commerce categories.`,
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
