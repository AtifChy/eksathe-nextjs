import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/dal";
import { logError } from "@/lib/logging";
import { prisma } from "@/lib/prisma";
import { createDownloadUrl } from "@/lib/storage/s3";
import { getProjectWorkspace } from "@/lib/workspaces";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ projectId: string; documentId: string }> },
) {
  const { projectId, documentId } = await params;
  const user = await getCurrentUser();
  if (!user || user.status !== "active" || !user.emailVerified)
    return new NextResponse(null, { status: 404 });

  const project = await getProjectWorkspace(user.id, projectId);
  if (!project) return new NextResponse(null, { status: 404 });
  const document = await prisma.projectDocument.findFirst({
    where: { id: documentId, projectId },
    select: { filename: true, storageKey: true },
  });
  if (!document) return new NextResponse(null, { status: 404 });
  try {
    const url = await createDownloadUrl(document.storageKey);
    if (!url) return new NextResponse(null, { status: 404 });
    return NextResponse.redirect(url, {
      status: 302,
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    logError("project.document_signing_failed", error);
    return new NextResponse(null, { status: 503 });
  }
}
