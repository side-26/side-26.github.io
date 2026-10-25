# Mahdi Rashidi Portfolio

A responsive, accessible personal portfolio for Mahdi Rashidi, built as a static Next.js application and published with GitHub Pages.

## Technology stack

- Next.js 16 (App Router) and React 19
- TypeScript, Tailwind CSS, and Framer Motion
- pnpm 11 and Node.js 22
- GitHub Actions and GitHub Pages for static hosting

## Local development

Requirements: Node.js 22 and pnpm 11 (the exact pnpm version is pinned in `package.json`).

```bash
git clone https://github.com/side-26/chief2001.github.io.git
cd chief2001.github.io
pnpm install --frozen-lockfile
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Copy `.env.example` to `.env.local` when setting values locally. `NEXT_PUBLIC_SITE_URL` controls the canonical URL, sitemap, and social metadata. Do not expose SMTP credentials or API keys in `NEXT_PUBLIC_*` variables.

## Production build

```bash
pnpm lint
pnpm test
pnpm build
```

`pnpm build` runs Next.js static export and writes the deployable site to `out/`. The exported routes use trailing slashes, so GitHub Pages serves `/contact/` as `out/contact/index.html`.

## GitHub Pages deployment

The workflow at `.github/workflows/deploy.yml` runs on pushes to `main` and can also be started manually from the Actions tab. It installs the locked pnpm dependencies, runs the verified webpack production build into `out/`, uploads it as a Pages artifact, and deploys it with GitHub’s Pages deployment action.

In the GitHub repository:

1. Open **Settings → Pages**.
2. Set **Source** to **GitHub Actions**.
3. Push or merge this configuration into `main`, or run **Deploy GitHub Pages** manually.
4. Optionally set the `CONTACT_API_BASE_URL` Actions variable to the public base URL of the separately hosted contact API. For example, `https://api.example.com` makes the form call `https://api.example.com/contact/message`.

Because this repository is named `chief2001.github.io`, it is a user site rather than a project site. It is deployed from the domain root, with no `basePath` or `assetPrefix`. The expected production URL is:

```text
https://side-26.github.io/
```

## Contact delivery and static-hosting limits

The contact route is intentionally enabled only in local development for now. Production builds remove its navigation and sitemap entry, and render `/contact` as a no-index Not Found page.

GitHub Pages hosts only static files. The former Next.js `POST /api/contact/message` SMTP handler has therefore been retained as server-only source in `src/server/contact-message/handler.ts`; it is not included in the static export. To enable submissions in production, deploy that handler behind a server-capable platform (for example, a small Next.js/Node service, Cloudflare Worker, or serverless function), configure SMTP secrets there, allow `https://side-26.github.io` via CORS, and set the `CONTACT_API_BASE_URL` Actions variable. The endpoint must preserve the existing `POST /contact/message` JSON contract.

Without that variable, the contact form stays visible and validates inputs locally, but reports that delivery is not configured rather than attempting a broken request. GitHub Pages also cannot provide server-side rendering, Server Actions, request-aware API routes, secret environment variables, or on-demand Next.js image optimization. Images are exported as unoptimized static files; they retain explicit dimensions to avoid layout shift.

## Optional custom domain

Add the custom domain in **Settings → Pages**, then configure its DNS records with your domain provider as GitHub instructs. Set `NEXT_PUBLIC_SITE_URL` in the workflow (or update its build environment) to the final `https://your-domain.example` value before deploying so canonical URLs, sitemap entries, and Open Graph metadata use the custom domain. GitHub Pages will create or honor the required `CNAME` file.
