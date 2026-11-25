import type { IncomingMessage } from "node:http";
import { createHash } from "node:crypto";
import { inquirySchema, readInquiry, type InquiryFeedback } from "./inquiry.js";

const windowMs = 10 * 60 * 1000;
const limit = 5;
const buckets = new Map<string, { count: number; expires: number }>();

function rateLimit(req: IncomingMessage) {
  const key = req.socket.remoteAddress || "unknown";
  const now = Date.now();
  for (const [ip, bucket] of buckets)
    if (bucket.expires <= now) buckets.delete(ip);
  const bucket = buckets.get(key) ?? { count: 0, expires: now + windowMs };
  if (bucket.count >= limit || (buckets.size >= 10_000 && !buckets.has(key)))
    return false;
  bucket.count++;
  buckets.set(key, bucket);
  return true;
}

function matchesOrigin(origin: string, allowedOrigin: string) {
  if (origin === allowedOrigin) return true;
  const localHosts = ["localhost", "127.0.0.1", "[::1]"];
  try {
    const actual = new URL(origin);
    const expected = new URL(allowedOrigin);
    return (
      actual.origin === origin &&
      actual.protocol === "http:" &&
      actual.protocol === expected.protocol &&
      actual.port === expected.port &&
      localHosts.includes(expected.hostname) &&
      localHosts.includes(actual.hostname)
    );
  } catch {
    return false;
  }
}

export async function submitInquiry(
  req: IncomingMessage,
  allowedOrigin: string,
): Promise<InquiryFeedback> {
  if (req.headers.origin && !matchesOrigin(req.headers.origin, allowedOrigin)) {
    return { status: 403, message: "Open the contact page and try again." };
  }
  if (
    !req.headers["content-type"]?.startsWith(
      "application/x-www-form-urlencoded",
    )
  ) {
    return { status: 415, message: "This form format is unsupported." };
  }
  if (Number(req.headers["content-length"]) > 24_000) {
    return { status: 413, message: "The inquiry is too long." };
  }

  const chunks: Buffer[] = [];
  let size = 0;
  let oversized = false;
  // Drain the request after reaching the cap so the client can receive the 413 response.
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;
    oversized ||= size > 24_000;
    if (!oversized) chunks.push(buffer);
  }
  if (oversized) return { status: 413, message: "The inquiry is too long." };

  const values = new URLSearchParams(Buffer.concat(chunks).toString("utf8"));
  if (!rateLimit(req))
    return {
      status: 429,
      message: "Too many attempts. Please try again in ten minutes.",
      values,
    };
  if (values.getAll("nickname").some(Boolean)) {
    return {
      status: 422,
      message:
        "This inquiry couldn’t be submitted. Please refresh and try again.",
    };
  }
  const parsed = inquirySchema.safeParse(readInquiry(values));
  if (!parsed.success) {
    const errors = Object.fromEntries(
      parsed.error.issues.map((issue) => [
        String(issue.path[0]),
        issue.message,
      ]),
    );
    return {
      status: 422,
      message: "Please check the highlighted fields and try again.",
      errors,
      values,
    };
  }
  const { RESEND_API_KEY, CONTACT_FROM_EMAIL, CONTACT_TO_EMAIL } = process.env;
  if (!RESEND_API_KEY || !CONTACT_FROM_EMAIL || !CONTACT_TO_EMAIL) {
    return {
      status: 503,
      message:
        "Email delivery is unavailable right now. Your inquiry hasn’t been sent.",
      values,
    };
  }
  const {
    name,
    email,
    company,
    website,
    services,
    budget,
    timeline,
    message,
    source,
  } = parsed.data;
  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Budget: ${budget}`,
    ...(company ? [`Company: ${company}`] : []),
    ...(website ? [`Website: ${website}`] : []),
    ...(services.length ? [`Services: ${services.join(", ")}`] : []),
    ...(timeline ? [`Timeline: ${timeline}`] : []),
    ...(source ? [`Referral: ${source}`] : []),
    "",
    message,
  ].join("\n");
  const fingerprint = createHash("sha256").update(text).digest("hex");
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + RESEND_API_KEY,
        "Content-Type": "application/json",
        "Idempotency-Key": `portfolio/${fingerprint}`,
      },
      body: JSON.stringify({
        from: CONTACT_FROM_EMAIL,
        to: [CONTACT_TO_EMAIL],
        reply_to: email,
        subject: "New portfolio project inquiry",
        text,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (response.ok) {
      const result: { id?: string } = await response.json();
      if (result.id)
        return {
          status: 200,
          message: "Thanks for reaching out. Your inquiry was sent.",
        };
    }
    console.error("Resend did not confirm the inquiry", response.status);
  } catch {
    console.error("Resend request failed");
  }
  return {
    status: 502,
    message: "Email delivery couldn’t be confirmed. Please try again later.",
    values,
  };
}
