import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

export default function CategoryHubPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <div className="mx-auto w-full max-w-screen-2xl px-4 py-6">
      <Link
        href="/dashboard"
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "mb-6 gap-1.5")}
      >
        <ArrowLeftIcon className="size-4" />
        Back to Dashboard
      </Link>
      <div className="rounded-2xl border bg-card p-10 text-center">
        <p className="text-2xl font-bold">🚧</p>
        <p className="mt-3 text-muted-foreground text-sm">
          This category hub is under construction.
        </p>
      </div>
    </div>
  );
}
