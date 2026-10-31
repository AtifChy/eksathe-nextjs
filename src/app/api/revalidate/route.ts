import { revalidatePath, revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const tag = request.nextUrl.searchParams.get("tag") || "panels";
  revalidateTag(tag, { expire: 0 });
  revalidatePath("/", "page");

  return NextResponse.json({
    revalidated: true,
    tag,
    now: new Date().toISOString(),
  });
}
