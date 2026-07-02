import type { MetadataRoute } from "next";

const BASE = "https://lunervia.xyz";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-07-03");
  return [
    { url: `${BASE}/`, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE}/modules`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    {
      url: `${BASE}/modules/service-builder`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    { url: `${BASE}/work`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/why`, lastModified, changeFrequency: "yearly", priority: 0.5 },
  ];
}
