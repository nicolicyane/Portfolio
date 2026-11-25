import { createServer, type ServerResponse } from "node:http";
import { readFile } from "node:fs/promises";
import { renderToStaticMarkup } from "react-dom/server";
import { profile, projects } from "./content.js";
import { Document, NotFound } from "./layout.js";
import { Home, About } from "./pages.js";
import { Work, Case } from "./work.js";
import { Contact } from "./contact.js";
import { submitInquiry } from "./delivery.js";
import type { InquiryFeedback } from "./inquiry.js";

const staticTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".webp", "image/webp"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".woff2", "font/woff2"],
  [".pdf", "application/pdf"],
]);
const routes = {
  "/": [
    Home,
    profile.role,
    "Nicole Licyane is a Brazilian designer and creative developer working across digital products, websites and creative technology.",
  ],
  "/work": [
    Work,
    "Work",
    "Browse Nicole Licyane’s project directory by discipline or contribution.",
  ],
  "/about": [
    About,
    "About",
    "Meet Nicole Licyane, a Brazilian designer, developer and digital agency co-founder.",
  ],
  "/contact": [
    Contact,
    "Start a project",
    "Share your project idea with Nicole Licyane.",
  ],
} as const;

function send(
  res: ServerResponse,
  status: number,
  type: string,
  body: string | Buffer,
) {
  res.writeHead(status, { "Content-Type": type });
  res.end(body);
}

export function renderPage(path: string, feedback?: InquiryFeedback) {
  const route = Object.hasOwn(routes, path)
    ? routes[path as keyof typeof routes]
    : undefined;
  const project = projects.find((p) => path === `/work/${p.slug}`);
  const [View, title, description] = route ?? [
    NotFound,
    project?.name || "Page missing",
    project?.summary || "This page could not be found.",
  ];
  const document = (
    <Document
      path={path}
      title={`${title} — Nicole Licyane`}
      description={description}
      image={
        project?.image
          ? new URL(project.image.src, profile.origin).href
          : undefined
      }
    >
      {project ? <Case project={project} /> : <View feedback={feedback} />}
    </Document>
  );
  return {
    status: feedback?.status ?? (route || project ? 200 : 404),
    html: "<!doctype html>" + renderToStaticMarkup(document),
  };
}

function page(res: ServerResponse, path: string, feedback?: InquiryFeedback) {
  const { status, html } = renderPage(path, feedback);
  send(res, status, "text/html; charset=utf-8", html);
}

const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
export const server = createServer(
  { requestTimeout: 15_000, headersTimeout: 10_000 },
  async (req, res) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' https:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'",
    );
    try {
      const path =
        new URL(req.url || "/", profile.origin).pathname.replace(/\/+$/, "") ||
        "/";
      if (req.method === "POST" && path === "/api/contact") {
        const result = await submitInquiry(req, new URL(profile.origin).origin);
        res.setHeader("Cache-Control", "no-store");
        if (result.status === 429) res.setHeader("Retry-After", "600");
        if (req.headers.accept?.includes("application/json")) {
          send(
            res,
            result.status,
            "application/json; charset=utf-8",
            JSON.stringify({ message: result.message, errors: result.errors }),
          );
        } else {
          page(res, "/contact", result);
        }
        return;
      }
      if (req.method !== "GET" && req.method !== "HEAD") {
        res.setHeader("Allow", path === "/api/contact" ? "POST" : "GET, HEAD");
        send(res, 405, "text/plain", "Method not allowed");
        return;
      }
      if (path === "/sitemap.xml") {
        const paths = [
          ...Object.keys(routes),
          ...projects.map((project) => `/work/${project.slug}`),
        ];
        send(
          res,
          200,
          "application/xml; charset=utf-8",
          `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((p) => `<url><loc>${escapeXml(new URL(p, profile.origin).href)}</loc></url>`).join("")}</urlset>`,
        );
        return;
      }
      if (path === "/robots.txt") {
        send(
          res,
          200,
          "text/plain; charset=utf-8",
          `User-agent: *\nAllow: /\nSitemap: ${new URL("/sitemap.xml", profile.origin).href}\n`,
        );
        return;
      }
      const ext = path.slice(path.lastIndexOf("."));
      const type = staticTypes.get(ext);
      if (type && /^\/(?:[\w-]+\/)*[\w.-]+$/.test(path)) {
        const asset = await readFile(
          new URL(`../public${path}`, import.meta.url),
        ).catch(() => null);
        if (asset) {
          res.setHeader(
            "Cache-Control",
            ext === ".css" || ext === ".js"
              ? "no-cache"
              : "public, max-age=3600",
          );
          send(res, 200, type, asset);
          return;
        }
      }
      page(res, path);
    } catch (error) {
      console.error(error instanceof Error ? error.name : "Request error");
      if (!res.headersSent)
        send(res, 500, "text/plain; charset=utf-8", "Something went wrong.");
      else res.end();
    }
  },
);
