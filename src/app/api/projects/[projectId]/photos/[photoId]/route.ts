import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { createDownloadUrl } from "@/lib/storage/s3";
import { getProjectWorkspace } from "@/lib/workspaces";
import { logError } from "@/lib/logging";

export async function GET(_request: Request, { params }: { params: Promise<{ projectId: string; photoId: string }> }) {
  const { projectId, photoId } = await params;
  const user = await getCurrentUser();
  if (!user || user.status !== "active" || !user.emailVerified) return new NextResponse(null, { status: 404 });

  const project = await getProjectWorkspace(user.id, projectId);
  if (!project) return new NextResponse(null, { status: 404 });
  const photo = await prisma.projectPhoto.findFirst({ where: { id: photoId, projectId }, select: { storageKey: true } });
  if (!photo) return new NextResponse(null, { status: 404 });
  try {
    const url = await createDownloadUrl(photo.storageKey);
    if (!url) return new NextResponse(null, { status: 404 });
    return NextResponse.redirect(url, { status: 302, headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    logError("project.photo_signing_failed", error);
    return new NextResponse(null, { status: 503 });
  }
}
