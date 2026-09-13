import fs from "node:fs";
import { doctors, specialties, clinics } from "../src/data.ts";

const SITE_URL = "https://medora.example";

const staticRoutes = [
  "/",
  "/doctors",
  "/specialties",
  "/clinics",
  "/about",
  "/faq",
  "/contact",
];

const routes = [
  ...staticRoutes,
  ...doctors.map((d) => `/doctor/${d.slug}`),
  ...specialties.map((s) => `/specialty/${s.slug}`),
  ...clinics.map((c) => `/clinic/${c.slug}`),
];

const today = new Date().toISOString().slice(0, 10);

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (path) => `  <url>
    <loc>${SITE_URL}${path}</loc>
    <lastmod>${today}</lastmod>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

fs.writeFileSync(new URL("../public/sitemap.xml", import.meta.url), xml);
console.log(`sitemap.xml generated with ${routes.length} URLs`);
