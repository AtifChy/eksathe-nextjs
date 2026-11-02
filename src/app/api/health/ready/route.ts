import { prisma } from "@/lib/prisma";
import { logError } from "@/lib/logging";

export const instant = false;

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return Response.json({ status: "ready" }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    logError("health.readiness_failed", error);
    return Response.json({ status: "not_ready" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
