import { NextResponse } from "next/server";

import { getCurrentUser, hasStaffPermission } from "@/lib/dal";
import { logError } from "@/lib/logging";
import { prisma } from "@/lib/prisma";
import { createDownloadUrl } from "@/lib/storage/s3";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ orderId: string; paymentId: string }> },
) {
  const { orderId, paymentId } = await params;
  const user = await getCurrentUser();
  if (!user || user.status !== "active" || !user.emailVerified)
    return new NextResponse(null, { status: 404 });
  const payment = await prisma.paymentRecord.findFirst({
    where: { id: paymentId, orderId, receiptKey: { not: null } },
    select: {
      receiptKey: true,
      order: {
        select: {
          buyerId: true,
          provider: { select: { userId: true } },
          request: { select: { sectorSlug: true } },
        },
      },
    },
  });
  if (!payment?.receiptKey) return new NextResponse(null, { status: 404 });
  const isParticipant =
    payment.order.buyerId === user.id || payment.order.provider.userId === user.id;
  const hasFinanceAccess = await hasStaffPermission(
    user,
    "FINANCE",
    payment.order.request.sectorSlug,
  );
  if (!isParticipant && !hasFinanceAccess) return new NextResponse(null, { status: 404 });
  try {
    const url = await createDownloadUrl(payment.receiptKey);
    if (!url) return new NextResponse(null, { status: 404 });
    return NextResponse.redirect(url, {
      status: 302,
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    logError("payment.receipt_signing_failed", error);
    return new NextResponse(null, { status: 503 });
  }
}
