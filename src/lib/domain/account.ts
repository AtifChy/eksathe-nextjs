import "server-only";
import { prisma } from "@/lib/prisma";

export async function updateOwnProfile(actorId: string, name: string, phone: string) {
  await prisma.$transaction(async (tx) => {
    await tx.user.update({ where: { id: actorId }, data: { name, phone } });
    await tx.activityLog.create({
      data: {
        userId: actorId,
        action: "account.profile_updated",
        entityType: "user",
        entityId: actorId,
      },
    });
  });
}
