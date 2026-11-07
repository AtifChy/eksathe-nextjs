import { SiteHeader } from "@/components/site-header";
import { getCurrentUser, getStaffAccess, type StaffAccess } from "@/lib/dal";
import { prisma } from "@/lib/prisma";

export async function SiteHeaderServer() {
  const user = await getCurrentUser();
  const activeUser = user?.status === "active" ? user : null;
  let canProvider = false;
  let staffAccess: StaffAccess | null = null;
  if (activeUser) {
    const [providerProfile, access] = await Promise.all([
      prisma.providerProfile.findUnique({
        where: { userId: activeUser.id },
        select: { id: true },
      }),
      getStaffAccess(activeUser),
    ]);
    canProvider = Boolean(providerProfile);
    staffAccess = access;
  }
  const canAdmin = staffAccess
    ? staffAccess.isSuperAdmin ||
      staffAccess.operationSectors.length > 0 ||
      staffAccess.financeSectors.length > 0 ||
      staffAccess.userManagementSectors.length > 0 ||
      staffAccess.panelManagementSectors.length > 0 ||
      staffAccess.reportSectors.length > 0
    : false;
  const staffSectors = staffAccess
    ? [
        ...staffAccess.operationSectors,
        ...staffAccess.financeSectors,
        ...staffAccess.userManagementSectors,
        ...staffAccess.panelManagementSectors,
        ...staffAccess.reportSectors,
      ]
    : [];
  const isAgroAdmin =
    Boolean(staffAccess) &&
    !staffAccess?.isSuperAdmin &&
    staffSectors.length > 0 &&
    staffSectors.every((slug) => slug === "agriculture-labor");

  return (
    <SiteHeader
      userName={activeUser?.name}
      signedIn={Boolean(activeUser)}
      canProvider={canProvider}
      canAdmin={canAdmin}
      isAgroAdmin={isAgroAdmin}
    />
  );
}
