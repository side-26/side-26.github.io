import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const SITE_URL = "https://side-26.github.io";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date("2026-10-25"),
      changeFrequency: "monthly",
      priority: 1,
      images: [
        `${SITE_URL}/images/mahdi-rashidi.webp`,
      ],
    },
  ];
}
