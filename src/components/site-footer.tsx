import { cacheLife } from "next/cache";

async function getCurrentYear() {
  "use cache";
  cacheLife("days");

  return new Date().getFullYear();
}

export async function SiteFooter() {
  const year = await getCurrentYear();

  return (
    <footer className="border-t bg-card py-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2 px-4 text-sm text-muted-foreground sm:flex-row">
        <span>© {year} EKsathe Bangladesh</span>
        <span>কৃষক • বাজার • শ্রম • সেবা</span>
      </div>
    </footer>
  );
}
