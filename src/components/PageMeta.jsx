import { useEffect } from "react";

function upsertMeta(selector, attribute, value) {
  let meta = document.querySelector(selector);
  if (!meta) {
    meta = document.createElement("meta");
    const [name, key] = attribute.split(":");
    meta.setAttribute(name, key);
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", value);
}

export function PageMeta({
  title,
  description = "Medora is a healthcare booking interface prototype for doctor discovery and appointment scheduling.",
}) {
  useEffect(() => {
    document.title = title;
    upsertMeta('meta[name="description"]', "name:description", description);
    upsertMeta('meta[property="og:title"]', "property:og:title", title);
    upsertMeta(
      'meta[property="og:description"]',
      "property:og:description",
      description,
    );
    const canonicalUrl = `${window.location.origin}${window.location.pathname}`;
    upsertMeta('meta[property="og:url"]', "property:og:url", canonicalUrl);
    upsertMeta('meta[name="twitter:title"]', "name:twitter:title", title);
    upsertMeta(
      'meta[name="twitter:description"]',
      "name:twitter:description",
      description,
    );

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;
  }, [title, description]);

  return null;
}
