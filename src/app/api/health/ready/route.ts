import { prisma } from "@/lib/prisma";

export const instant = false;

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return Response.json({ status: "ready" }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Readiness check failed.", error instanceof Error ? error.name : "Unknown error");
    return Response.json({ status: "not_ready" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
