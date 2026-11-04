import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/prisma/client";

const email = process.env.ADMIN_BOOTSTRAP_EMAIL?.trim().toLowerCase();
if (!email)
  throw new Error("Set ADMIN_BOOTSTRAP_EMAIL to a verified account before bootstrapping.");

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

try {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, emailVerified: true, status: true, role: true },
  });

  if (!user || !user.emailVerified || user.status !== "active") {
    throw new Error("The bootstrap account must exist, have verified its email, and be active.");
  }
  if (user.role === "super_admin") {
    console.log("This account already has super admin access.");
  } else {
    await prisma.$transaction([
      prisma.user.update({ where: { id: user.id }, data: { role: "super_admin" } }),
      prisma.activityLog.create({
        data: {
          userId: user.id,
          action: "bootstrap_super_admin",
          entityType: "user",
          entityId: user.id,
        },
      }),
    ]);
    console.log("Super admin access granted.");
  }
} finally {
  await prisma.$disconnect();
}
