import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { CategoryIcon } from "@/components/dashboard/category-icon";
import { dictionaries } from "@/dictionaries";
import { cn } from "cn";
import { prisma } from "@/lib/prisma";

export default async function CategoryHubPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Find category metadata from dictionary
  const category = dictionaries.bn.dashboard.categories.find(
    (c) => c.slug === slug,
  ) ?? dictionaries.en.dashboard.categories.find((c) => c.slug === slug);

  const titleBn = category?.labelBn ?? slug.replace(/-/g, " ");
  const titleEn = category?.labelEn ?? slug.replace(/-/g, " ");
  const catId = category?.id ?? 0;

  // If this is agriculture & labor (or any category with panels in DB), fetch panels
  let panels: Array<{
    id: number;
    titleBn: string;
    titleEn: string;
    descriptionBn: string;
    descriptionEn: string;
    category: string;
  }> = [];

  try {
    if (slug === "agriculture-labor") {
      panels = await prisma.panel.findMany({
        where: { isActive: true },
        take: 12,
        orderBy: { id: "asc" },
      });
    }
  } catch {
    panels = [];
  }

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 py-6 sm:py-8">
      <Link
        href="/dashboard"
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "mb-6 gap-1.5 rounded-lg border-border/80 bg-card",
        )}
      >
        <ArrowLeftIcon className="size-4" />
        ড্যাশবোর্ডে ফিরে যান / Back to Dashboard
      </Link>

      <div className="rounded-2xl border border-border/70 bg-card p-6 sm:p-8 shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          {catId > 0 && (
            <div className="rounded-2xl bg-muted/40 p-3">
              <CategoryIcon id={catId} className="size-16" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                বিভাগ #{catId}
              </span>
              <span className="text-xs text-muted-foreground">{slug}</span>
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {titleBn}
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">{titleEn}</p>
          </div>
        </div>
      </div>

      {panels.length > 0 ? (
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">
            কৃষি ও সংশ্লিষ্ট প্যানেলসমূহ ({panels.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {panels.map((p) => (
              <div
                key={p.id}
                className="rounded-2xl border border-border/70 bg-card p-5 shadow-xs hover:border-primary/40 transition-all"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                    {p.category}
                  </span>
                </div>
                <h3 className="font-semibold text-foreground text-base">
                  {p.titleBn}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {p.titleEn}
                </p>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                  {p.descriptionBn}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border/80 bg-card/60 p-12 text-center">
          <p className="text-3xl">🚀</p>
          <h3 className="mt-3 text-lg font-semibold text-foreground">
            {titleBn} হাব প্রস্তুত হচ্ছে
          </h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
            এই ক্যাটাগরির সার্ভিস প্যানেল এবং অপারেশনাল টুলস খুব শীঘ্রই সংযুক্ত করা হবে।
          </p>
        </div>
      )}
    </div>
  );
}
