import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { cn } from "cn";

import { CommissionCalculator } from "@/components/landing/commission-calculator";
import { EmergencyButton } from "@/components/landing/emergency-button";
import { PanelDirectory } from "@/components/landing/panel-directory";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getActivePanels } from "@/lib/panels";

const steps = [
  {
    number: "১",
    title: "অনুরোধ জমা",
    description: "সেবা, এলাকা, ফোন ও প্রয়োজনীয় তথ্য দিন।",
  },
  {
    number: "২",
    title: "যাচাই ও সংযোগ",
    description: "অপারেশন টিম তথ্য যাচাই করে উপযুক্ত সেবাদাতার সঙ্গে সংযোগ করবে।",
  },
  {
    number: "৩",
    title: "কাজ সম্পন্ন",
    description: "সেবা গ্রহণকারী ও সেবাদাতা কাজের অবস্থা নিশ্চিত করবেন।",
  },
  {
    number: "৪",
    title: "হিসাব ও কমিশন",
    description: "অনুমোদিত লেনদেনের ভিত্তিতে কমিশন ও সেবাদাতার পাওনা হিসাব হবে।",
  },
];

const policies = [
  "কৃষি ঋণ, বীমা বা সরকারি সুবিধা অনুমোদনের নিশ্চয়তা দেওয়া হয় না।",
  "কোনো চিকিৎসা, আইনগত বা সরকারি সিদ্ধান্তের বিকল্প হিসেবে প্ল্যাটফর্ম ব্যবহার করা যাবে না।",
  "বাজারদর প্রকাশের আগে এলাকা, তারিখ, একক ও উৎস যাচাই করতে হবে।",
  "ভুয়া তালিকা, প্রতারণা, ওজন/মানের ভুল তথ্য বা অননুমোদিত ফি নিষিদ্ধ।",
  "ব্যক্তিগত তথ্য শুধু সেবা পরিচালনার প্রয়োজন অনুযায়ী ব্যবহার করতে হবে।",
];

export default async function Home() {
  const panels = await getActivePanels();

  return (
    <>
      <section className="hero-surface">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 py-16 lg:grid-cols-[1.4fr_1fr] lg:py-24">
          <div>
            <Badge variant="secondary" className="mb-4">
              🌱 কৃষি • বাজার • শ্রম
            </Badge>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              কৃষক থেকে ক্রেতা—
              <br />
              <span className="text-primary">সবাই একসাথে</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
              কৃষিপণ্য, বাজারদর, কৃষিশ্রমিক, পরিবহন ও কৃষি-সেবার অনুরোধ একটি প্ল্যাটফর্মে পরিচালনা করুন।
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="#panels" className={cn(buttonVariants({ size: "lg" }))}>
                সেবা খুঁজুন
                <ArrowRightIcon />
              </Link>
              <Link href="#how" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
                কীভাবে কাজ করে
              </Link>
              <EmergencyButton />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              জরুরি 100 বাটনটি এখন তথ্য-বার্তা দেখায়; এটি স্বয়ংক্রিয়ভাবে কল করে না।
            </p>
          </div>

          <div className="rounded-3xl border bg-card p-8 shadow-xl">
            <div className="text-4xl" aria-hidden>
              🌾
            </div>
            <div className="mt-2 text-5xl font-extrabold">{panels.length}</div>
            <p className="text-muted-foreground">সেবা ক্যাটাগরি</p>
            <div className="my-5 h-px bg-border" />
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-muted-foreground">সার্ভিস রিকোয়েস্ট</span>
              <strong>২৪/৭ জমা</strong>
            </div>
            <div className="mt-2 flex justify-between gap-4 text-sm">
              <span className="text-muted-foreground">কমিশন ক্যালকুলেটর</span>
              <strong>১০%</strong>
            </div>
          </div>
        </div>
      </section>

      <section id="panels" className="mx-auto w-full max-w-7xl px-4 py-14">
        <div className="mb-6">
          <p className="text-sm font-bold tracking-wide text-primary">সেবা ডিরেক্টরি</p>
          <h2 className="text-3xl font-extrabold tracking-tight">কৃষি, বাজার ও শ্রম প্যানেল</h2>
          <p className="mt-1 text-muted-foreground">কার্ডে ক্লিক করে বিস্তারিত দেখুন অথবা অনুরোধ জমা দিন।</p>
        </div>

        <PanelDirectory panels={panels} />
      </section>

      <section id="how" className="alt-surface py-14">
        <div className="mx-auto w-full max-w-7xl px-4">
          <p className="text-sm font-bold tracking-wide text-primary">সহজ কার্যপ্রবাহ</p>
          <h2 className="text-3xl font-extrabold tracking-tight">কীভাবে কাজ করে</h2>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {steps.map((step) => (
              <div key={step.number} className="rounded-2xl border bg-card p-6 shadow-sm">
                <span className="flex size-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {step.number}
                </span>
                <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="commission"
        className="mx-auto grid w-full max-w-7xl items-center gap-8 px-4 py-14 lg:grid-cols-2"
      >
        <div>
          <p className="text-sm font-bold tracking-wide text-primary">স্বচ্ছ হিসাব</p>
          <h2 className="text-3xl font-extrabold tracking-tight">১০% কমিশন ক্যালকুলেটর</h2>
          <p className="mt-2 text-muted-foreground">
            নিচের হিসাবটি উদাহরণমাত্র। চূড়ান্ত কমিশন নীতিমালা ও অনুমোদিত লেনদেন অনুযায়ী নির্ধারিত হবে।
          </p>
        </div>

        <CommissionCalculator />
      </section>

      <section className="alt-surface py-14">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="text-sm font-bold tracking-wide text-primary">বাজার আপডেট</p>
            <h2 className="text-3xl font-extrabold tracking-tight">নিউজ ও বাজার ফিড</h2>

            <div className="mt-6 rounded-2xl border bg-card p-6 shadow-sm">
              <Badge variant="secondary">নমুনা ফিড</Badge>
              <h3 className="mt-3 text-lg font-semibold">স্থানীয় বাজারদর যাচাই করে প্রকাশ করুন</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                লাইভ বাজারদর বা সংবাদ এখানে স্বয়ংক্রিয়ভাবে যুক্ত নয়। অ্যাডমিন যাচাই ও প্রকাশের মডিউল সংযুক্ত করতে হবে।
              </p>
            </div>

            <div className="mt-4 rounded-2xl border bg-card p-6 shadow-sm">
              <Badge variant="outline">সতর্কতা</Badge>
              <h3 className="mt-3 text-lg font-semibold">কৃষি পণ্য কেনাবেচার আগে যাচাই করুন</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                পণ্যের মান, ওজন, মূল্য, পরিবহন ও পেমেন্ট শর্ত লিখিতভাবে নিশ্চিত করুন।
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm font-bold tracking-wide text-primary">নীতি ও নিরাপত্তা</p>
            <h2 className="text-3xl font-extrabold tracking-tight">ব্যবহার নীতিমালা</h2>

            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              {policies.map((policy) => (
                <li key={policy} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{policy}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
