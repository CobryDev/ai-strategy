import type { MetadataRoute } from "next";
import { parseContentIntoSections } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = parseContentIntoSections()
    .filter((section) => section.level !== "part")
    .reduce(
      (latest, section) =>
        section.blame.lastModified > latest ? section.blame.lastModified : latest,
      new Date(0),
    );

  return [
    {
      url: siteConfig.url,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
