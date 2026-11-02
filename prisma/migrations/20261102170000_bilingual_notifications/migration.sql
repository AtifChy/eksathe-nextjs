ALTER TABLE "notifications"
ADD COLUMN "title_bn" TEXT,
ADD COLUMN "title_en" TEXT,
ADD COLUMN "message_bn" TEXT,
ADD COLUMN "message_en" TEXT;

UPDATE "notifications"
SET
  "title_en" = "title",
  "message_en" = "message",
  "title_bn" = CASE "title"
    WHEN 'New service request' THEN 'নতুন সেবা অনুরোধ'
    WHEN 'New quote received' THEN 'নতুন দরপ্রস্তাব এসেছে'
    WHEN 'Quote accepted' THEN 'দরপ্রস্তাব গৃহীত হয়েছে'
    WHEN 'Work started' THEN 'কাজ শুরু হয়েছে'
    WHEN 'Work ready for review' THEN 'কাজ পর্যালোচনার জন্য প্রস্তুত'
    WHEN 'Order completed' THEN 'অর্ডার সম্পন্ন হয়েছে'
    WHEN 'Cancellation requested' THEN 'বাতিলের অনুরোধ এসেছে'
    WHEN 'Order cancelled' THEN 'অর্ডার বাতিল হয়েছে'
    WHEN 'Payment recorded' THEN 'পেমেন্ট নথিভুক্ত হয়েছে'
    WHEN 'Payment confirmation received' THEN 'পেমেন্ট নিশ্চিত হয়েছে'
    WHEN 'Provider capability approved' THEN 'সেবাদাতার আবেদন অনুমোদিত'
    WHEN 'Provider capability declined' THEN 'সেবাদাতার আবেদন প্রত্যাখ্যাত'
    WHEN 'Listing approved' THEN 'তালিকা অনুমোদিত'
    WHEN 'Listing declined' THEN 'তালিকা প্রত্যাখ্যাত'
    WHEN 'Commission receipt recorded' THEN 'কমিশন আদায় নথিভুক্ত হয়েছে'
    WHEN 'Refund recorded' THEN 'ফেরত নথিভুক্ত হয়েছে'
    WHEN 'Admin resolved the issue' THEN 'সমস্যার সিদ্ধান্ত নথিভুক্ত হয়েছে'
    WHEN 'Milestone ready for review' THEN 'প্রকল্পের ধাপ পর্যালোচনার জন্য প্রস্তুত'
    WHEN 'Milestone approved' THEN 'প্রকল্পের ধাপ অনুমোদিত'
    ELSE "title"
  END,
  "message_bn" = CASE "title"
    WHEN 'New service request' THEN 'একজন গ্রাহক আপনাকে নতুন সেবা অনুরোধ পাঠিয়েছেন।'
    WHEN 'New quote received' THEN 'একজন সেবাদাতা নতুন মূল্য ও সেবার শর্ত পাঠিয়েছেন।'
    WHEN 'Quote accepted' THEN 'গ্রাহক আপনার দরপ্রস্তাব গ্রহণ করেছেন। কাজ শুরু করতে পারেন।'
    WHEN 'Work started' THEN 'সেবাদাতা অর্ডারটি চলমান হিসেবে চিহ্নিত করেছেন।'
    WHEN 'Work ready for review' THEN 'সেবা বা পণ্য পৌঁছানো সম্পন্ন হলে নিশ্চিত করুন।'
    WHEN 'Order completed' THEN 'গ্রাহক কাজ সম্পন্ন হওয়া নিশ্চিত করেছেন। প্ল্যাটফর্ম কমিশন বকেয়া হয়েছে।'
    WHEN 'Cancellation requested' THEN 'অন্য পক্ষ অর্ডার বাতিলের অনুরোধ করেছেন। আপনার কর্মক্ষেত্রে দেখুন।'
    WHEN 'Order cancelled' THEN 'উভয় পক্ষের সম্মতিতে অর্ডার বাতিল হয়েছে।'
    WHEN 'Payment recorded' THEN 'অন্য পক্ষ একটি পেমেন্ট নথিভুক্ত করেছেন। নিশ্চিত করুন।'
    WHEN 'Payment confirmation received' THEN 'অন্য পক্ষ পেমেন্টের তথ্য নিশ্চিত করেছেন।'
    WHEN 'Provider capability approved' THEN 'আপনার সেবা কার্যক্রমের আবেদন অনুমোদিত হয়েছে।'
    WHEN 'Provider capability declined' THEN 'আপনার সেবা কার্যক্রমের আবেদন অনুমোদিত হয়নি।'
    WHEN 'Listing approved' THEN 'অপারেশনস দল আপনার তালিকা পর্যালোচনা করে অনুমোদন করেছে।'
    WHEN 'Listing declined' THEN 'অপারেশনস দল আপনার তালিকা পর্যালোচনা করেছে; এটি প্রকাশ করা হয়নি।'
    WHEN 'Commission receipt recorded' THEN 'প্ল্যাটফর্ম কমিশন পাওয়ার বিষয়টি নিশ্চিত করেছে।'
    WHEN 'Refund recorded' THEN 'অর্থ বিভাগ এই পেমেন্টের ফেরত নথিভুক্ত করেছে।'
    WHEN 'Admin resolved the issue' THEN 'একজন প্রশাসক অর্ডারের বিষয়ে সিদ্ধান্ত নথিভুক্ত করেছেন।'
    WHEN 'Milestone ready for review' THEN 'একজন সেবাদাতা প্রকল্পের একটি ধাপ অনুমোদনের জন্য পাঠিয়েছেন।'
    WHEN 'Milestone approved' THEN 'গ্রাহক প্রকল্পের একটি ধাপ অনুমোদন করেছেন।'
    ELSE "message"
  END;
