import { SiteHeader } from "@/components/site-header";
import { getCurrentUser, hasStaffPermission } from "@/lib/dal";
import { prisma } from "@/lib/prisma";

export async function SiteHeaderServer() {
  const user = await getCurrentUser();
  const activeUser = user?.status === "active" ? user : null;
  const [canProvider, canAdmin] = activeUser
    ? await Promise.all([
        prisma.providerProfile.findUnique({ where: { userId: activeUser.id }, select: { id: true } }).then(Boolean),
        Promise.all([
          hasStaffPermission(activeUser, "OPERATIONS"),
          hasStaffPermission(activeUser, "FINANCE"),
        ]).then(([operations, finance]) => operations || finance),
      ])
    : [false, false];

  return (
    <SiteHeader
      userName={activeUser?.name}
      signedIn={Boolean(activeUser)}
      canProvider={canProvider}
      canAdmin={canAdmin}
    />
  );
}
