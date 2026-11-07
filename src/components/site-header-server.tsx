import { Suspense } from "react";

import { SiteHeader, SiteHeaderUserMenu } from "@/components/site-header";
import { getCurrentUser, getStaffAccess } from "@/lib/dal";
import { prisma } from "@/lib/prisma";

export function SiteHeaderUserFallback() {
  return (
    <div className="flex shrink-0 items-center gap-1">
      <div className="h-9 w-24 animate-pulse rounded-lg bg-white/10" />
    </div>
  );
}

export function SiteHeaderFallback() {
  return <SiteHeader userSlot={<SiteHeaderUserFallback />} />;
}

export async function SiteHeaderUserServer() {
  const user = await getCurrentUser();
  const activeUser = user?.status === "active" ? user : null;
  let canProvider = false;
  let staffAccess = null;

  if (activeUser) {
    const [provider, access] = await Promise.all([
      prisma.providerProfile
        .findUnique({ where: { userId: activeUser.id }, select: { id: true } })
        .then(Boolean),
      getStaffAccess(activeUser),
    ]);
    canProvider = provider;
    staffAccess = access;
  }

  const extraSectors = (staffAccess as unknown as Record<string, string[] | undefined>) ?? {};
  const userManagement = extraSectors.userManagementSectors ?? [];
  const panelManagement = extraSectors.panelManagementSectors ?? [];
  const report = extraSectors.reportSectors ?? [];

  const canAdmin = staffAccess
    ? staffAccess.isSuperAdmin ||
      staffAccess.operationSectors.length > 0 ||
      staffAccess.financeSectors.length > 0 ||
      userManagement.length > 0 ||
      panelManagement.length > 0 ||
      report.length > 0
    : false;

  const staffSectors = staffAccess
    ? [
        ...staffAccess.operationSectors,
        ...staffAccess.financeSectors,
        ...userManagement,
        ...panelManagement,
        ...report,
      ]
    : [];

  const isAgroAdmin =
    Boolean(staffAccess) &&
    !staffAccess?.isSuperAdmin &&
    staffSectors.length > 0 &&
    staffSectors.every((slug) => slug === "agriculture-labor");

  return (
    <SiteHeaderUserMenu
      userName={activeUser?.name}
      signedIn={Boolean(activeUser)}
      canProvider={canProvider}
      canAdmin={canAdmin}
      isAgroAdmin={isAgroAdmin}
    />
  );
}

export function SiteHeaderServer() {
  return (
    <SiteHeader
      userSlot={
        <Suspense fallback={<SiteHeaderUserFallback />}>
          <SiteHeaderUserServer />
        </Suspense>
      }
    />
  );
}
