import { getLocale } from "next-intl/server";
import Link from "next/link";

import { markCommerceNotificationReadAction } from "@/app/actions/commerce";
import { requireUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";

export default async function CommerceNotificationsPage() {
  const [user, locale] = await Promise.all([
    requireUser("/dashboard/ecommerce-b2b/notifications"),
    getLocale(),
  ]);
  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  const bn = locale === "bn";
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
      <header className="flex items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">{bn ? "বিজ্ঞপ্তি" : "Notifications"}</h1>
        <Link className="text-primary text-sm" href="/dashboard/ecommerce-b2b">
          {bn ? "বাজারে ফিরুন" : "Marketplace"}
        </Link>
      </header>
      <ul className="mt-5 divide-y rounded-xl border">
        {notifications.map((notice) => (
          <li
            key={notice.id}
            className={`bg-card flex flex-wrap items-center justify-between gap-3 p-4 ${notice.readAt ? "opacity-70" : ""}`}
          >
            <div>
              <p className="font-semibold">
                {(bn ? notice.titleBn : notice.titleEn) ?? notice.title}
              </p>
              <p className="mt-1 text-sm">
                {(bn ? notice.messageBn : notice.messageEn) ?? notice.message}
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                {notice.createdAt.toLocaleString(bn ? "bn-BD" : "en-BD")}
              </p>
            </div>
            <div className="flex gap-2">
              {!notice.readAt && (
                <form action={markCommerceNotificationReadAction}>
                  <input type="hidden" name="notificationId" value={notice.id} />
                  <button className="rounded-md border px-3 py-2 text-sm">
                    {bn ? "পঠিত" : "Mark read"}
                  </button>
                </form>
              )}
              {notice.href && (
                <Link className="rounded-md border px-3 py-2 text-sm" href={notice.href}>
                  {bn ? "দেখুন" : "Open"}
                </Link>
              )}
            </div>
          </li>
        ))}
        {!notifications.length && (
          <li className="text-muted-foreground p-8 text-center">
            {bn ? "এখনো কোনো বিজ্ঞপ্তি নেই।" : "No notifications yet."}
          </li>
        )}
      </ul>
    </main>
  );
}
