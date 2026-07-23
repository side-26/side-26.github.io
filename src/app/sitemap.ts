import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.url.href,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
      images: [new URL("/images/mahdi-rashidi.webp", siteConfig.url).href],
    },
  ];
}
