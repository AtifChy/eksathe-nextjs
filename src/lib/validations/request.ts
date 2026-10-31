import { z } from "zod";

export const requestSchema = z.object({
  panelId: z.coerce.number().int().positive("সঠিক সেবা নির্বাচন করুন।"),
  customerName: z
    .string()
    .trim()
    .min(2, "নাম সঠিকভাবে লিখুন।")
    .max(150, "নাম অনেক বড়।"),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+ ()-]{7,30}$/, "সঠিক মোবাইল নম্বর দিন।"),
  district: z
    .string()
    .trim()
    .min(1, "জেলা/এলাকা লিখুন।")
    .max(100, "জেলা/এলাকা অনেক বড়।"),
  budget: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? Number(value) : null))
    .refine(
      (value) => value === null || (Number.isFinite(value) && value >= 0),
      "বাজেট সঠিক নয়।",
    ),
  details: z
    .string()
    .trim()
    .min(10, "প্রয়োজনের বিস্তারিত অন্তত ১০ অক্ষরে লিখুন।")
    .max(5000, "বিস্তারিত অনেক বড়।"),
});

export type RequestInput = z.infer<typeof requestSchema>;
