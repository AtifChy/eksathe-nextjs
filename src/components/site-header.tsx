import Link from "next/link";
import { cn } from "cn";

import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  { href: "/#panels", label: "সেবাসমূহ" },
  { href: "/#how", label: "কীভাবে কাজ করে" },
  { href: "/#commission", label: "কমিশন ক্যালকুলেটর" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b5036] text-white shadow-sm">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
          <span aria-hidden>🌾</span>
          <span>EKsathe Bangladesh</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm text-white/85 transition-colors hover:bg-white/10 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "text-white hover:bg-white/10 hover:text-white",
            )}
          >
            লগইন
          </Link>
          <Link
            href="/register"
            className={cn(buttonVariants({ size: "sm" }), "bg-white text-[#0b5036] hover:bg-white/90")}
          >
            অ্যাকাউন্ট খুলুন
          </Link>
        </div>
      </div>
    </header>
  );
}
