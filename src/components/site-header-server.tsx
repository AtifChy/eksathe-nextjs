import { BrandLogo } from "@/components/brand-logo";
import { SiteHeader } from "@/components/site-header";
import { getCurrentUser, hasAnyStaffPermission } from "@/lib/dal";
import { prisma } from "@/lib/prisma";

export function SiteHeaderFallback() {
  return (
    <header className="border-border/70 sticky top-0 z-40 border-b bg-[#0b5036] text-white shadow-sm">
      <div className="mx-auto flex min-h-16 w-full max-w-360 items-center px-4 sm:px-6">
        <span className="flex min-w-0 items-center gap-3 leading-tight font-bold">
          <BrandLogo />
        </span>
      </div>
    </header>
  );
}

export async function SiteHeaderServer() {
  const user = await getCurrentUser();
  const activeUser = user?.status === "active" ? user : null;
  const [canProvider, canAdmin] = activeUser
    ? await Promise.all([
        prisma.providerProfile
          .findUnique({ where: { userId: activeUser.id }, select: { id: true } })
          .then(Boolean),
        hasAnyStaffPermission(activeUser),
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
