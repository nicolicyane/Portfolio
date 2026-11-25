import type { ReactNode } from "react";
import { profile } from "./content.js";

const links = [
  ["Work", "/work"],
  ["About", "/about"],
];
export const Intro = ({
  label,
  children,
  description,
}: {
  label: string;
  children: ReactNode;
  description?: string;
}) => (
  <section className="page-intro shell">
    <p className="meta kicker">{label}</p>
    <h1>{children}</h1>
    {description && <p className="lede">{description}</p>}
  </section>
);
export const Action = ({
  href,
  children,
  secondary = false,
}: {
  href: string;
  children: ReactNode;
  secondary?: boolean;
}) => (
  <a className={secondary ? "action action-secondary" : "action"} href={href}>
    {children}
    <span aria-hidden="true">↗</span>
  </a>
);
function LocalTime() {
  return (
    <time data-clock data-time-zone={profile.timeZone}>
      {new Intl.DateTimeFormat("en-GB", {
        timeZone: profile.timeZone,
        hour: "2-digit",
        minute: "2-digit",
      }).format()}
    </time>
  );
}

function Header({ path }: { path: string }) {
  return (
    <header className="portfolio-header" id="top">
      <div className="shell header-inner">
        <a
          className="brand"
          href="/"
          aria-current={path === "/" ? "page" : undefined}
        >
          {profile.name}
        </a>
        <span className="header-availability">
          <i aria-hidden="true" />
          Available worldwide
        </span>
        <span className="header-time">
          Brazil <LocalTime />
        </span>
        <button
          className="header-menu-toggle"
          type="button"
          aria-label="Open menu"
          aria-haspopup="dialog"
          aria-controls="portfolio-menu"
          aria-expanded="false"
          data-menu-open
          hidden
        >
          <i aria-hidden="true" />
          <i aria-hidden="true" />
          <i aria-hidden="true" />
        </button>
        <dialog
          className="portfolio-menu"
          id="portfolio-menu"
          aria-label="Site menu"
          data-site-menu
        >
          <button
            className="header-menu-toggle menu-close"
            type="button"
            aria-label="Close menu"
            data-menu-dismiss
            autoFocus
          >
            <i aria-hidden="true" />
            <i aria-hidden="true" />
            <i aria-hidden="true" />
          </button>
          <div className="menu-visual" data-menu-dismiss aria-hidden="true">
            <div className="menu-specialties">
              <span>
                Product Design — Web Design — Creative Development —&nbsp;
              </span>
              <span>
                Product Design — Web Design — Creative Development —&nbsp;
              </span>
            </div>
            <img
              src={profile.portrait || "/portrait.webp"}
              width={758}
              height={820}
              alt=""
              decoding="async"
            />
          </div>
          <div className="menu-panel">
            <nav aria-label="Primary">
              <p>Menu</p>
              {[
                ["Home", "/"],
                ["About", "/about"],
                ["Projects", "/work"],
                ["Contact", "/contact"],
              ].map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  aria-current={path === href ? "page" : undefined}
                >
                  {label}
                </a>
              ))}
            </nav>
            <div className="menu-contact">
              <p>Let’s talk</p>
              {profile.email && (
                <a href={"mailto:" + profile.email}>{profile.email}</a>
              )}
              <p>Socials</p>
              <div className="menu-socials">
                {[
                  [profile.linkedIn, "LinkedIn"],
                  [profile.instagram, "Instagram"],
                  [profile.github, "GitHub"],
                ].map(
                  ([href, label]) =>
                    href && (
                      <a href={href} key={label}>
                        {label}
                      </a>
                    ),
                )}
              </div>
            </div>
            <span className="header-availability">
              <i aria-hidden="true" />
              Available worldwide
            </span>
          </div>
        </dialog>
      </div>
    </header>
  );
}

function Footer({ path }: { path: string }) {
  const compact = path === "/contact" || path === "/work";
  const socials = [
    [profile.email && "mailto:" + profile.email, "Email"],
    [profile.linkedIn, "LinkedIn"],
    [profile.instagram, "Instagram"],
    [profile.github, "GitHub"],
    [profile.resume, "Download résumé"],
  ];
  return (
    <footer
      className={compact ? "site-footer site-footer-compact" : "site-footer"}
    >
      <div className="shell">
        {!compact && (
          <a href="/contact" className="footer-title">
            Let’s talk
            <span className="talk-icon" aria-hidden="true">
              <svg className="talk-icon-arrow" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14m-7-7 7 7-7 7" />
              </svg>
              <svg className="talk-icon-phone" viewBox="0 0 24 24" fill="none">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.35 1.9.69 2.8a2 2 0 0 1-.45 2.11L8.08 9.92a16 16 0 0 0 6 6l1.29-1.27a2 2 0 0 1 2.11-.45c.9.34 1.84.57 2.8.69A2 2 0 0 1 22 16.92Z" />
              </svg>
            </span>
          </a>
        )}
        <div className="footer-columns">
          <div>
            <strong>{profile.name}</strong>
            <p>{profile.role}</p>
            <p>
              Brazil <LocalTime />
            </p>
          </div>
          <nav aria-label="Footer">
            <p>Menu</p>
            <a href="/">Home</a>
            {links.map(([label, href]) => (
              <a key={href} href={href}>
                {label}
              </a>
            ))}
            <a href="/contact">Contact</a>
          </nav>
          <div className="footer-socials">
            <p>Socials</p>
            {socials.map(
              ([href, label]) =>
                href && (
                  <a
                    key={label}
                    href={href}
                    download={label === "Download résumé" || undefined}
                  >
                    {label}
                  </a>
                ),
            )}
            <span>{profile.handle}</span>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getUTCFullYear()} Nicole Licyane</span>
          <a href="#top">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}

export function Document({
  children,
  path,
  title,
  description,
  image,
}: {
  children: ReactNode;
  path: string;
  title: string;
  description: string;
  image?: string;
}) {
  const canonical = new URL(path, profile.origin).href;
  const ogImage = image || new URL("/social.png", profile.origin).href;
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="/star.svg?v=2" type="image/svg+xml" />
        <link rel="stylesheet" href="/styles.css?v=27" />
        <script type="module" src="/interactions.js?v=13" />
        {path === "/" && (
          <>
            <script defer src="/vendor/matter-0.20.0.min.js" />
            <script type="module" src="/skills.js?v=1" />
          </>
        )}
      </head>
      <body>
        <a href="#main" className="skip">
          Skip to content
        </a>
        <Header path={path} />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer path={path} />
        <div className="custom-cursor" data-custom-cursor aria-hidden="true" />
      </body>
    </html>
  );
}

export function NotFound() {
  return (
    <>
      <Intro label="404">
        Page <em>missing.</em>
      </Intro>
      <div className="shell not-found">
        <Action href="/">Back to home</Action>
      </div>
    </>
  );
}
