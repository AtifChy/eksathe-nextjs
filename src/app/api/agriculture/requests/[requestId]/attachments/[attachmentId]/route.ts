import { NextResponse } from "next/server";

import { getCurrentUser, hasStaffPermission } from "@/lib/dal";
import { logError } from "@/lib/logging";
import { prisma } from "@/lib/prisma";
import { createDownloadUrl } from "@/lib/storage/s3";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ requestId: string; attachmentId: string }> },
) {
  const user = await getCurrentUser();
  if (!user || user.status !== "active" || !user.emailVerified)
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  const { requestId: requestIdRaw, attachmentId } = await params;
  if (!/^\d+$/.test(requestIdRaw) || attachmentId.length > 64)
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  const requestId = Number(requestIdRaw);
  if (!Number.isSafeInteger(requestId))
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  try {
    const attachment = await prisma.serviceRequestAttachment.findFirst({
      where: {
        id: attachmentId,
        requestId,
        request: { serviceDefinition: { sectorSlug: "agriculture-labor" } },
      },
      select: { storageKey: true, request: { select: { userId: true } } },
    });
    if (!attachment) return NextResponse.json({ error: "Not found." }, { status: 404 });
    const isOwner = attachment.request.userId === user.id;
    const isAgricultureStaff = await hasStaffPermission(user, "OPERATIONS", "agriculture-labor");
    if (!isOwner && !isAgricultureStaff)
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    const url = await createDownloadUrl(attachment.storageKey);
    if (!url)
      return NextResponse.json({ error: "File storage is not configured." }, { status: 503 });
    return NextResponse.redirect(url, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    logError("agriculture.request_attachment_read_failed", error);
    return NextResponse.json({ error: "Could not retrieve the attachment." }, { status: 503 });
  }
}
