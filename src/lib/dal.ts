import "server-only";
import { cacheLife } from "next/cache";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sectors } from "@/lib/sectors";

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  phone: string;
  role: string;
  status: string;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  "use cache: private";
  cacheLife({ stale: 0, revalidate: 30, expire: 60 });

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return null;

  return prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      phone: true,
      role: true,
      status: true,
    },
  });
}

export async function requireUser(returnTo = "/account", verified = true) {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(returnTo)}`);
  if (user.status !== "active") notFound();
  if (verified && !user.emailVerified) redirect(`/verify?next=${encodeURIComponent(returnTo)}`);
  return user;
}

export async function hasStaffPermission(
  user: CurrentUser,
  permission: "OPERATIONS" | "FINANCE",
  sectorSlug?: string,
) {
  if (user.role === "super_admin") return true;

  const scopeKey = sectorSlug ?? "global";
  const grant = await prisma.staffGrant.findFirst({
    where: {
      userId: user.id,
      permission,
      scopeKey: { in: [scopeKey, "global"] },
    },
    select: { id: true },
  });
  return Boolean(grant);
}

export async function hasAnyStaffPermission(user: CurrentUser) {
  if (user.role === "super_admin") return true;
  const grant = await prisma.staffGrant.findFirst({
    where: { userId: user.id },
    select: { id: true },
  });
  return Boolean(grant);
}

export type StaffAccess = {
  isSuperAdmin: boolean;
  operationSectors: string[];
  financeSectors: string[];
  canManageStaff: boolean;
};

export async function getStaffAccess(user: CurrentUser): Promise<StaffAccess> {
  const isSuperAdmin = user.role === "super_admin";
  const liveSectorSlugs = sectors
    .filter((sector) => sector.status === "live")
    .map((sector) => sector.slug);
  if (isSuperAdmin) {
    return {
      isSuperAdmin,
      operationSectors: liveSectorSlugs,
      financeSectors: liveSectorSlugs,
      canManageStaff: true,
    };
  }

  const grants = await prisma.staffGrant.findMany({
    where: { userId: user.id },
    select: { scopeKey: true, sectorSlug: true, permission: true },
  });
  const scopesFor = (permission: "OPERATIONS" | "FINANCE") => {
    const matching = grants.filter((grant) => grant.permission === permission);
    if (matching.some((grant) => grant.scopeKey === "global")) return liveSectorSlugs;
    return matching
      .map((grant) => grant.sectorSlug)
      .filter((slug): slug is string => Boolean(slug));
  };

  return {
    isSuperAdmin,
    operationSectors: scopesFor("OPERATIONS"),
    financeSectors: scopesFor("FINANCE"),
    canManageStaff: false,
  };
}

export async function requireAdmin() {
  const user = await requireUser("/admin");
  const access = await getStaffAccess(user);
  if (
    !access.isSuperAdmin &&
    access.operationSectors.length === 0 &&
    access.financeSectors.length === 0
  )
    notFound();
  return { user, access };
}

export async function requireSuperAdmin() {
  const user = await requireUser("/admin");
  if (user.role !== "super_admin") notFound();
  return user;
}

export async function requireStaff(permission: "OPERATIONS" | "FINANCE", sectorSlug?: string) {
  const user = await requireUser("/admin");
  if (!(await hasStaffPermission(user, permission, sectorSlug))) notFound();
  return user;
}

export function safeNextPath(value: unknown, fallback: string) {
  if (typeof value !== "string") return fallback;
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return fallback;
  return value;
}
