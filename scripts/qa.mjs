import { clinics, doctors, specialties } from "../src/data.ts";
import { baseSlots } from "../src/utils.ts";
import fs from "node:fs";

const errors = [];
const unique = (items, key, label) => {
  const values = items.map((item) => item[key]);
  if (new Set(values).size !== values.length) errors.push(`Duplicate ${label}`);
};
unique(doctors, "id", "doctor IDs");
unique(doctors, "slug", "doctor slugs");
unique(specialties, "id", "specialty IDs");
unique(specialties, "slug", "specialty slugs");
unique(clinics, "id", "clinic IDs");
unique(clinics, "slug", "clinic slugs");
unique(doctors, "image", "doctor images");
for (const item of [...doctors, ...clinics]) {
  if (
    !item.image ||
    !fs.existsSync(new URL(`../public${item.image}`, import.meta.url))
  )
    errors.push(`Missing image for ${item.id}`);
}
if (
  !fs.existsSync(
    new URL("../public/images/hero/medora-hero.webp", import.meta.url),
  )
)
  errors.push("Missing Home hero image");
if (new Set(baseSlots).size !== baseSlots.length)
  errors.push("Duplicate availability time slots");
if (!baseSlots.every((slot) => /^\d{2}:\d{2} (AM|PM)$/.test(slot)))
  errors.push("Malformed availability time slot");
const specialtyIds = new Set(specialties.map((item) => item.id));
const clinicIds = new Set(clinics.map((item) => item.id));
for (const doctor of doctors) {
  if (!specialtyIds.has(doctor.specialtyId))
    errors.push(`Invalid specialty on ${doctor.id}`);
  if (!clinicIds.has(doctor.clinicId))
    errors.push(`Invalid clinic on ${doctor.id}`);
  if (
    !doctor.consultationTypes.every((type) =>
      ["In-clinic", "Video"].includes(type),
    )
  )
    errors.push(`Invalid consultation type on ${doctor.id}`);
  if (!Number.isFinite(doctor.fee) || doctor.fee <= 0)
    errors.push(`Invalid fee on ${doctor.id}`);
}
function collectSourceFiles(dirUrl) {
  const dirPath = new URL(dirUrl);
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    const entryUrl = new URL(`${entry.name}${entry.isDirectory() ? "/" : ""}`, dirUrl);
    if (entry.isDirectory()) {
      files = files.concat(collectSourceFiles(entryUrl));
    } else if (/\.(jsx?|css)$/.test(entry.name) && !/\.test\.jsx?$/.test(entry.name)) {
      files.push(entryUrl);
    }
  }
  return files;
}
const sourceFiles = collectSourceFiles(new URL("../src/", import.meta.url));
const jsx = sourceFiles
  .filter((url) => /\.jsx?$/.test(url.pathname))
  .map((url) => fs.readFileSync(url, "utf8"))
  .join("\n");
const css = sourceFiles
  .filter((url) => url.pathname.endsWith(".css"))
  .map((url) => fs.readFileSync(url, "utf8"))
  .join("\n");
const buttonsWithoutType = [...jsx.matchAll(/<button\b([^>]*)>/g)].filter(
  (match) => !match[1].includes("type="),
);
if (buttonsWithoutType.length)
  errors.push("Button elements without an explicit type");
if (/TODO|FIXME|href=["']#["']|Math\.random/.test(jsx))
  errors.push("Forbidden placeholder or random implementation found");
const definedVariables = new Set(
  [...css.matchAll(/(--[\w-]+)\s*:/g)].map((match) => match[1]),
);
const usedVariables = [...css.matchAll(/var\((--[\w-]+)/g)].map(
  (match) => match[1],
);
if (usedVariables.some((variable) => !definedVariables.has(variable)))
  errors.push("Undefined CSS variable");
const routePaths = [...jsx.matchAll(/<Route\s+path="([^"]+)"/g)].map(
  (match) => match[1],
);
if (new Set(routePaths).size !== routePaths.length)
  errors.push("Duplicate route path");
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
process.stdout.write(
  `QA passed: ${doctors.length} doctors, ${specialties.length} specialties, ${clinics.length} clinics.\n`,
);
