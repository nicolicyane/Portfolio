# Nicole Licyane — Creative Portfolio

An English-language portfolio for a Brazilian designer and creative developer. The site includes Home, a filterable Work directory with Gallery and Index views, individual project pages, About, and a project inquiry form.

## Run locally

Use Node.js 22 or newer.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Open <http://127.0.0.1:3000>. Restart the server after editing TypeScript or environment variables. Refresh the browser after editing CSS or JavaScript in `public/`.

```sh
npm run lint
npm run typecheck
npm run build
npm start
```

For production, point `SITE_URL` at the public HTTPS origin and run `npm start` with `NODE_ENV=production` on a Node host. Configure `HOST` and `PORT` to match the host. The inquiry endpoint requires a server runtime. Serve traffic over HTTPS through the host or reverse proxy.

### Vercel

This project uses a small Node.js server rather than Next.js. The included `vercel.json` selects Vercel’s **Other** framework preset, builds the server, serves `public/` as static assets, and routes page requests through a Node.js Function. Keep the Vercel Root Directory set to the repository root (the folder containing `package.json`), and set `SITE_URL` to the deployed HTTPS URL. Add `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, and `CONTACT_TO_EMAIL` in Vercel’s environment settings to enable contact form delivery. Vercel project settings that force the Next.js framework should be cleared or set to **Other**.

## Design and interaction

The current visual direction follows the free Asher Vale template by Asad Khaleel. It uses the existing local portfolio content in a light layout with a central portrait, an animated name, a compact menu, a pinned horizontal directory on Home and a two-column gallery on Work. The title loops continuously, pauses on keyboard focus and stays still with reduced motion. [Asher Vale template](https://www.framer.com/marketplace/templates/asher-vale/)

React renders complete HTML on the server, with browser JavaScript for the archive, local time and inquiry feedback. CSS handles layout and motion. The development environment could install the current React and TypeScript versions from its cache. The npm registry was unavailable and the cache had only Next.js 12, so the app uses a lightweight Node server. Zod validates the server-side schema.

## Update content

| File | Contents |
| --- | --- |
| [src/content.ts](src/content.ts) | Profile defaults, projects, categories, available case fields |
| [src/work.tsx](src/work.tsx) | Gallery, index, project pages and case modules |
| [src/layout.tsx](src/layout.tsx) | Site navigation, footer and metadata |
| [src/contact.tsx](src/contact.tsx) | Inquiry form and non-JavaScript feedback |
| [public/styles.css](public/styles.css) | Color, typography and spacing tokens, responsive layouts and motion |
| [.env.example](.env.example) | Configuration and server-only credentials |

Add a project to `projects` and give it a unique slug and at least one category. The project page, related links, filters, metadata and sitemap derive from that record. Use `modules` to arrange text, facts and images in the order the case needs. Optional `draft` fields cover context, contribution, process, technical approach, technologies, outcomes and year. Empty fields are omitted from the rendered case. Store approved assets in `public/projects/`, with useful alternative text and intrinsic dimensions.

The Home skills use Matter.js 0.20.0 for low-gravity drag and drop, including collisions between labels and the field edges. The MIT-licensed browser build is served locally from `public/vendor/` and loaded only on Home. With reduced motion, the skills stay in a static list.

Manrope is the site-wide font. The Latin and extended Latin WOFF2 files are served locally under the SIL Open Font License included in `public/fonts/`.

## Configure the inquiry form

1. Verify a sending domain in Resend and create an API key with sending access.
2. Set `RESEND_API_KEY`, `CONTACT_FROM_EMAIL` and `CONTACT_TO_EMAIL` in the host’s server environment or your ignored `.env.local` file. The sender must use the verified domain. Set a public display email independently with `PUBLIC_CONTACT_EMAIL`.
3. Set `SITE_URL` to the public origin in production so the server can check form submissions against it.
4. Submit a real test inquiry after configuration and verify the message in the Resend dashboard and destination inbox. [Resend send-email API](https://resend.com/docs/api-reference/emails/send-email)

The API returns success after Resend confirms acceptance with a message ID. With incomplete settings, it returns 503 and the form preserves the visitor’s input. The submission path validates whitespace, required choices, URLs, enum values and lengths. A honeypot, request size cap and a five-attempt limit per connection IP per ten minutes provide basic abuse protection. The limit is held in process memory. If a reverse proxy makes every request appear with the same IP or the application runs on multiple instances, configure per-client rate limiting at the proxy or hosting layer. Identical submissions use the same Resend idempotency key.

The public address and LinkedIn defaults come from Nicole’s existing portfolio. `PUBLIC_INSTAGRAM_URL`, `PUBLIC_GITHUB_URL`, `PUBLIC_RESUME_URL` and `PUBLIC_PORTRAIT_URL` are optional. A local résumé PDF can live under `public/`; set its public URL, for example `/resume.pdf`. [Existing portfolio](https://nicolelicyane.framer.website/)

## Media and content to provide

- A personal photo for About and the résumé PDF. About currently uses the illustration from Nicole’s existing About page. [Existing About page](https://nicolelicyane.framer.website/about-me)
- The confirmed Instagram and GitHub profile URLs for the footer, a preferred public email if different, and the final site origin.
- Approved cover art and more detailed case assets for Inscend AI, Veloz and MyGoo. A public URL for Inscend AI can be added when available.
- Confirmed dates, roles, technical and design decisions, and any approved results for the eight client and product cases. Access to the Figma portfolio would help add product-design artifacts. [Figma portfolio](https://www.figma.com/design/JxdN3gEdfuSY8u2PrK94DL/Portf%C3%B3lio-UI-UX)
- Resend credentials, verified sender and destination mailbox, configured server-side.

Project imagery uses compact local captures of [Joby](https://joby.tinywins.com/), [Ghostly Studio](https://ghostlystudio.framer.website/), [Orchid Beauty](https://orchidbeauty.framer.website/) and [Bilge İnşaat](https://www.bilgeinsaat.com/). The EC Data cover is a still from the prior portfolio. The Ghostly tools come from Nicole’s published [project write-up](https://contra.com/p/YFbZWcbR-a-framer-website-for-ghostly). Cases with no approved media use typographic covers.

## Verification

Lint, type checking and production compilation were completed. The HTTP handlers were exercised in-process for all routes, internal links, sitemap, assets and form responses. Provider acceptance and failure were tested with a test double. The browser rendered the generated pages at widths from 320 to 1920 pixels and exercised the Work filters and contact states. The environment denied opening a local listening socket and the Figma link returned 403. A live-server Lighthouse run and real email delivery remain unverified.
