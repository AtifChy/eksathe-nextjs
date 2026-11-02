import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createDownloadUrl } from "@/lib/storage/s3";
import { logError } from "@/lib/logging";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = await prisma.marketplaceListing.findFirst({
    where: {
      id,
      isPublished: true,
      archivedAt: null,
      moderationStatus: "APPROVED",
      OR: [
        { kind: { in: ["PRODUCE", "CONSTRUCTION_MATERIAL"] }, stock: { gt: 0 } },
        { kind: { in: ["WORKER", "MACHINERY", "CONSTRUCTION_SERVICE"] } },
      ],
      provider: {
        status: "APPROVED",
        user: { status: "active" },
      },
    },
    select: { id: true, sectorSlug: true, kind: true, imageKey: true, provider: { select: { capabilities: { where: { status: "APPROVED" }, select: { sectorSlug: true, kind: true } } } } },
  });
  if (!listing?.imageKey || !listing.provider.capabilities.some((capability) => capability.sectorSlug === listing.sectorSlug && capability.kind === listing.kind)) {
    return new NextResponse(null, { status: 404 });
  }
  try {
    const url = await createDownloadUrl(listing.imageKey);
    if (!url) return new NextResponse(null, { status: 404 });
    return NextResponse.redirect(url, { status: 302, headers: { "Cache-Control": "public, max-age=30" } });
  } catch (error) {
    logError("listing.image_signing_failed", error);
    return new NextResponse(null, { status: 503 });
  }
}
