import "server-only";

import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

export async function requireStaff(
  permission: "OPERATIONS" | "FINANCE",
  sectorSlug?: string,
) {
  const user = await requireUser("/admin");
  if (!(await hasStaffPermission(user, permission, sectorSlug))) notFound();
  return user;
}

export function safeNextPath(value: unknown, fallback: string) {
  if (typeof value !== "string") return fallback;
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return fallback;
  return value;
}
