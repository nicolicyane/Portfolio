import { z } from "zod";

export const inquiryServices = [
  "Product Design",
  "UI/UX Design",
  "Web Design",
  "Framer Development",
  "Creative Development",
  "Branding",
  "Something else",
] as const;
export const budgets = [
  "Under $1,000",
  "$1,000–$3,000",
  "$3,000–$5,000",
  "$5,000–$10,000",
  "$10,000+",
  "Not sure yet",
] as const;
export const timelines = [
  "As soon as possible",
  "Within a month",
  "Within 1–3 months",
  "Flexible",
] as const;
export const sources = [
  "LinkedIn",
  "Instagram",
  "Referral",
  "Search engine",
  "Other",
] as const;

export const inquirySchema = z.strictObject({
  name: z.string().trim().min(2, "Enter your full name.").max(100),
  email: z.email("Enter a valid email address.").max(254),
  company: z.string().trim().max(120),
  website: z
    .union([
      z.literal(""),
      z
        .url({ protocol: /^https?$/ })
        .refine(
          (value) => /^https?:\/\//i.test(value),
          "Enter a website address starting with https:// or http://.",
        ),
    ])
    .refine((value) => value.length <= 400, "Enter a shorter website address."),
  services: z.array(z.enum(inquiryServices)).max(inquiryServices.length),
  budget: z.enum(budgets, { error: "Choose a budget range." }),
  timeline: z.enum(timelines).optional(),
  message: z
    .string()
    .trim()
    .min(
      20,
      "Tell me a little more about your project (at least 20 characters).",
    )
    .max(4000),
  source: z.enum(sources).optional(),
  nickname: z.literal(""),
});

export function readInquiry(form: URLSearchParams) {
  return Object.fromEntries(
    Object.keys(inquirySchema.shape).map((key) => {
      if (key === "services") return [key, form.getAll(key)];
      const value = form.get(key)?.trim();
      return [
        key,
        key === "timeline" || key === "source"
          ? value || undefined
          : (value ?? ""),
      ];
    }),
  );
}

export type InquiryFeedback = {
  status: number;
  message: string;
  errors?: Record<string, string>;
  values?: URLSearchParams;
};
