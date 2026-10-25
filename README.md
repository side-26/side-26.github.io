# Mahdi Rashidi Portfolio

A personal portfolio for **Mahdi Rashidi**, a full-stack developer. The site presents selected experience, technical strengths, delivery approach, and a contact path for prospective collaborators and employers.

It is intentionally a focused product rather than a generic template: the content, case-study style career timeline, motion, visual language, and contact flow are designed to communicate how Mahdi approaches dependable web-product delivery.

**Live site:** [side-26.github.io](https://side-26.github.io/)

## What the site includes

- Responsive landing page for mobile, tablet, and desktop
- Career timeline with responsibilities, outcomes, and technology stacks
- Capability, process, and technical-stack sections
- Local-font loading, Open Graph image generation, sitemap, manifest, and robots metadata
- Purposeful motion with reduced-motion support
- Accessible contact form with client-side validation and clear error states
- Static deployment to GitHub Pages through GitHub Actions

## Technology

- **Framework:** Next.js 16, App Router, React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4, semantic design tokens, glass-surface UI language
- **Forms:** React Hook Form and Yup
- **Motion:** Framer Motion
- **Icons:** Lucide and Simple Icons
- **Tooling:** pnpm 11, ESLint, Prettier, Node.js 22
- **Hosting:** GitHub Pages and GitHub Actions

## Architecture

The project stays deliberately lightweight while keeping clear ownership boundaries:

```text
src/
├── app/                    # Routes, layout, metadata, static route handlers
├── components/
│   ├── base/               # Reusable UI primitives (Card, Button, fields, Badge)
│   ├── contact/            # Contact form composition and feedback UI
│   ├── global/             # App-wide providers
│   └── landing/            # Portfolio-specific sections and motion
├── entities/               # Domain types, schemas, and services
├── lib/                    # Shared utilities, site configuration, API transport
├── server/                 # Server-only code excluded from the static export
└── assets/                 # Local fonts
```

The homepage composes portfolio-specific sections from reusable base components. It is intentionally kept in one route while the portfolio remains small; larger independently maintained sections can be extracted later without changing the shared primitives.

## Local development

### Requirements

- Node.js 22
- pnpm 11 (pinned in `package.json`)

### Start the app

```bash
git clone https://github.com/side-26/chief2001.github.io.git
cd chief2001.github.io
pnpm install --frozen-lockfile
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Copy `.env.example` to `.env.local` if you need local configuration. Never commit real credentials or expose secrets through `NEXT_PUBLIC_*` variables.

## Useful commands

| Command                   | Purpose                                      |
| ------------------------- | -------------------------------------------- |
| `pnpm dev`                | Start the local development server           |
| `pnpm lint`               | Run ESLint                                   |
| `pnpm format:check`       | Check formatting with Prettier               |
| `pnpm format`             | Format the repository with Prettier          |
| `pnpm build -- --webpack` | Create the verified static production export |

The production export is written to `out/`. It uses trailing-slash routes, so the contact page is exported as `out/contact/index.html`.

## Configuration

| Variable                           | Purpose                                                       |
| ---------------------------------- | ------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`             | Canonical site URL used for SEO, sitemap, and social metadata |
| `NEXT_PUBLIC_CONTACT_API_BASE_URL` | Public base URL for the separately hosted contact API         |
| `SMTP_USER`, `SMTP_APP_PASSWORD`   | Server-only SMTP credentials for the external contact service |
| `CONTACT_RECIPIENT_EMAIL`          | Server-only destination address for contact submissions       |

## Contact delivery

GitHub Pages only serves static files, so it cannot run the original SMTP `POST /api/contact/message` endpoint. The delivery handler is preserved in `src/server/contact-message/handler.ts` for deployment to a server-capable backend such as a Node service, serverless function, or Cloudflare Worker.

To enable production contact submissions:

1. Deploy an API that implements `POST /contact/message` and preserves the existing JSON contract.
2. Configure SMTP credentials only on that backend.
3. Allow the portfolio origin with CORS.
4. Set `CONTACT_API_BASE_URL` as a GitHub Actions repository variable.

Without the variable, the form remains available and validates input locally, then explains that delivery is not configured instead of sending a broken request.

<<<<<<< HEAD
## Deployment
=======
The contact route is intentionally enabled only in local development for now. Production builds remove its navigation and sitemap entry, and render `/contact` as a no-index Not Found page.

GitHub Pages hosts only static files. The former Next.js `POST /api/contact/message` SMTP handler has therefore been retained as server-only source in `src/server/contact-message/handler.ts`; it is not included in the static export. To enable submissions in production, deploy that handler behind a server-capable platform (for example, a small Next.js/Node service, Cloudflare Worker, or serverless function), configure SMTP secrets there, allow `https://side-26.github.io` via CORS, and set the `CONTACT_API_BASE_URL` Actions variable. The endpoint must preserve the existing `POST /contact/message` JSON contract.
>>>>>>> develope

GitHub Actions builds and deploys the static site using [deploy.yml](.github/workflows/deploy.yml). The workflow runs on pushes to `master` and can be triggered manually.

Before the first deployment:

1. Go to **Repository Settings → Pages**.
2. Select **GitHub Actions** as the Pages source.
3. Push to `master` or run **Deploy GitHub Pages** from the Actions tab.

This is a GitHub Pages **user site** (`chief2001.github.io`), so it is served from the domain root without a `basePath` or `assetPrefix`.

## Optional custom domain

Set the custom domain in **Repository Settings → Pages**, then configure the required DNS records with your provider. Update `NEXT_PUBLIC_SITE_URL` in the deployment environment to the final `https://your-domain.example` URL so canonical URLs, sitemap entries, and social metadata remain correct.

## Static-hosting limitations

GitHub Pages does not provide server-side rendering, Server Actions, request-aware API routes, secret runtime environment variables, or Next.js on-demand image optimization. This project uses static export and unoptimized local images to remain compatible with that hosting model.
