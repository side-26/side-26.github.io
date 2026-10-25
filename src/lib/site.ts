const localUrl = "http://localhost:3000";

export const isContactRouteEnabled = process.env.NODE_ENV === "development";

function resolveSiteUrl() {
  const configuredUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL ??
    localUrl;

  const normalizedUrl = configuredUrl.startsWith("http")
    ? configuredUrl
    : `https://${configuredUrl}`;

  return new URL(normalizedUrl);
}

export const siteConfig = {
  name: "Mahdi Rashidi",
  title: "Mahdi Rashidi — Full-Stack Developer",
  description:
    "Mahdi Rashidi designs and builds dependable full-stack products, from clear architecture and accessible interfaces to maintainable systems and confident releases.",
  shortDescription:
    "Full-stack product development with clear scope, visible progress, and dependable delivery.",
  url: resolveSiteUrl(),
  contactEmail: "mahdirashidi462@gmail.com",
  githubUrl: "https://github.com/side-26",
  repositoryUrl: "https://github.com/side-26/portfolio-front-app",
} as const;
