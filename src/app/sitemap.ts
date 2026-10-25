import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: siteConfig.url.href,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
      images: [new URL("/images/mahdi-rashidi.webp", siteConfig.url).href],
    },
    {
      url: new URL("/contact", siteConfig.url).href,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
