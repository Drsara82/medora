# Medora

Medora is a React healthcare-booking interface prototype built around doctor discovery and a complete appointment workflow. It is set in Riyadh and demonstrates searchable relational data, deterministic availability, multi-step booking, accessible dialogs, rescheduling, cancellation, local persistence, and responsive application UX.

Medora is **not** a real medical service. It does not provide diagnosis, treatment, emergency support, clinic communication, telemedicine, payment processing, or production authentication.

## Stack

- React, Vite, and JavaScript, with the data/logic layer in TypeScript (dependency versions are pinned in `package.json`, not `latest`) — see "TypeScript" below for exact scope
- React Router, with every non-critical route code-split via `React.lazy`
- Plain CSS with centralized design tokens
- Lucide React icons
- Browser `localStorage` for explicitly local demo state, including the user's dark/light theme and language choice
- Light/dark theme via CSS custom properties (`[data-theme="dark"]` on `<html>`), toggled from the header and defaulting to the OS preference
- Bilingual (English/Arabic) site chrome with RTL layout support — see "Bilingual and RTL support" below for exact scope
- ESLint (flat config) for linting, Vitest + Testing Library for unit/component tests, Playwright for end-to-end tests
- GitHub Actions CI (`.github/workflows/ci.yml`) uses Node 22 and runs formatting, the complete production quality gate, and Playwright end-to-end tests on every push/PR; Dependabot (`.github/dependabot.yml`) opens weekly dependency-update PRs

## Run locally

```bash
npm install
npm run dev
```

Quality checks:

```bash
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit over the TypeScript data/logic layer
npm run test       # Vitest unit + component tests (src/**/*.test.{js,jsx})
npm run test:e2e   # Playwright end-to-end tests (tests/e2e) — builds + serves first
npm run qa         # Data-integrity checks (scripts/qa.mjs)
npm run format:check
```

`npm run build` runs `qa`, `lint`, `typecheck`, and `test` before building, so a broken check fails the build. CI runs that complete gate on Node 22, then installs Chromium and executes the Playwright end-to-end suite.

```bash
npm run build
npm run preview
```

## Project structure

```text
src/
  data.ts              Doctors, specialties, clinics, navigation, notifications (typed)
  data.test.js         Unit tests for data lookup/enrichment helpers
  utils.ts             Safe storage, date formatting, deterministic availability (typed)
  booking.ts           Typed booking-domain validation + appointment ID generation
  utils.test.js        Unit tests for storage, dates, and availability rules
  doctors.ts           Enriched doctor list + derived filter options (typed, shared by pages)
  main.jsx             App entry point: <ErrorBoundary><ThemeProvider><LanguageProvider>...
  test-setup.js        Vitest setup: jest-dom + vitest-axe matchers, DOM cleanup per test
  i18n/
    translations.js    en/ar dictionary for the site chrome (see "Bilingual and RTL support")
  store/
    StoreContext.jsx   Saved doctors, appointments, notifications, profile, draft booking
    ThemeContext.jsx   Light/dark theme, persisted, OS-preference default
    LanguageContext.jsx  en/ar language + t() translator, persisted, sets dir/lang on <html>
  components/          Reusable UI: Header, Layout (route table + lazy-loaded pages),
                       PageLoading (Suspense fallback), ScrollToTop, ErrorBoundary, DoctorCard,
                       Calendar, TimeSlots, Modal (+ Reschedule/Cancel variants),
                       PatientDetails, BookingSummary, BookingStepper, FilterSelect,
                       Empty, PageMeta — plus *.test.jsx component tests and
                       accessibility.test.jsx (axe checks on Header/DoctorCard/FilterSelect)
  pages/               One file per route: Home, Doctors, DoctorProfile, Booking,
                       Review, Confirmation, Appointments, Saved, Directory,
                       Notifications, Account, Auth, About, Contact, Faq, NotFound
                       — plus page tests, including Review.confirm.test.jsx (a
                       regression test for a real navigation bug found via E2E testing)
  styles.css           Design tokens, page styles, responsive breakpoints, RTL logical
                       properties, light/dark theme tokens
scripts/
  qa.mjs                Relationship, uniqueness, and value checks across src/** (test files excluded)
  generate-sitemap.mjs  Generates public/sitemap.xml from data.ts, run as part of the build
tests/e2e/
  booking.spec.js       Playwright: full search → book → confirm journey, console-error
                       check, and a dark-mode/RTL toggle check
.github/
  workflows/ci.yml      Lint, format check, tests, QA, typecheck, and build on every push/PR
  dependabot.yml         Weekly dependency-update PRs (npm + GitHub Actions)
eslint.config.js        Flat ESLint config
vitest.config.js        Vitest (jsdom) config, wired to test-setup.js
playwright.config.js    Playwright config (builds + serves the app before running tests)
tsconfig.json           TypeScript config for the typed data/logic layer (see "TypeScript")
```

Each route lives in its own file under `src/pages/`, and shared UI pieces live under `src/components/`. `src/doctors.ts` holds the derived doctor list (enriched with specialty/clinic names) and the availability helper, so both `DoctorCard` and the `Doctors` filter page read from one source. `src/store/StoreContext.jsx` is the only place that touches `localStorage`, exposed through the `useStore()` hook. `scripts/qa.mjs` walks the whole `src/` tree (excluding test files) for its button/route/placeholder checks.

Every route except `/` and the 404 fallback is loaded via `React.lazy` in `components/Layout.jsx`, so the initial bundle only includes the Home page; `components/PageLoading.jsx` is the `<Suspense>` fallback shown while a route chunk loads. `components/ErrorBoundary.jsx` wraps the whole app in `main.jsx` so an unexpected render error shows a recovery screen (with a full-reload link) instead of a blank page.

## Main routes

- `/` — Home and doctor search entry
- `/doctors` — Combined search, filters, sorting, and pagination
- `/doctor/:slug` — Doctor profile
- `/specialties`, `/specialty/:slug` — Specialty directory and filtered doctors
- `/clinics`, `/clinic/:slug` — Clinic directory and filtered doctors
- `/book/:doctorId` — Schedule and patient-details steps
- `/booking/review`, `/booking/confirmation` — Review and local confirmation
- `/appointments` — Status tabs, reschedule, and cancel
- `/saved`, `/notifications`, `/account` — Local user workflow pages
- `/about`, `/contact`, `/faq` — Supporting product pages
- `/signin`, `/signup`, `/forgot-password` — Front-end-only authentication forms
- Any invalid URL — Custom Medora 404 page

The production output includes a standard SPA fallback rule for static hosts that support `_redirects`, so client-side routes can recover through `index.html`.

## Editable data and visuals

- Doctors, fees, languages, consultation types, and relationships: `src/data.ts`
- Specialties and clinics: `src/data.ts`
- Navigation and initial notifications: `src/data.ts`
- Availability rules and time slots: `src/utils.ts`
- Design tokens and responsive styles: `src/styles.css`
- Doctor portrait assets: `public/images/doctors/`
- Clinic visual assets: `public/images/clinics/`
- Home hero visual: `public/images/hero/`
- Images are optimized WebP assets with explicit dimensions and meaningful alt text. Replace a file while keeping its filename, or update the matching `image` path in `src/data.ts`. All people and locations shown are fictional and do not represent real doctors or clinics.

## Deploying a live demo

The project is deploy-ready as a static SPA. `public/_redirects` already routes any path to `index.html` so client-side routes survive a refresh or a direct link.

**Vercel**
1. Push the repo to GitHub.
2. Import it at vercel.com — framework preset "Vite" is auto-detected.
3. Deploy. No environment variables or backend are needed.

**Netlify**
1. Push the repo to GitHub.
2. "Add new site" → "Import an existing project" → pick the repo.
3. Build command `npm run build`, publish directory `dist`. `public/_redirects` is copied into `dist` automatically by Vite, so SPA routing works without extra config.

Either way the whole deploy is a few clicks; nothing in this repo blocks it.

## Performance

- Every route except `/` and the 404 page is code-split with `React.lazy` (see `components/Layout.jsx`), so the initial bundle only ships the Home page; other pages load on navigation.
- Images (`public/images/**`) are WebP with explicit `width`/`height` attributes to avoid layout shift, and non-critical images use `loading="lazy"`.
- This README doesn't quote a Lighthouse score — a number copied from a doc without being re-measured against the actual deployed build goes stale immediately and is worse than no number. Once deployed (see above), run Lighthouse yourself: Chrome DevTools → Lighthouse tab → "Analyze page load", or `npx unlighthouse --site <your-url>` from the command line.

## Booking architecture

The workflow moves from doctor/consultation type to date and time, patient contact details, review, and browser-only confirmation.

`getAvailability(doctorId, date, type)` is deterministic and shared by booking and rescheduling. Past dates and unavailable Fridays/Saturdays cannot be selected. Changing the consultation type or date revalidates the selected slot and clears it when incompatible. Direct access to review redirects safely when the draft is missing or invalid. Confirmation is guarded against repeated clicks, uses collision-resistant appointment IDs, and the store rejects duplicate upcoming appointments for the same doctor/date/time/type.

Rescheduling keeps the original appointment untouched until confirmation and shows current versus proposed times. Closing the dialog preserves the appointment and restores focus. Cancellation requires explicit confirmation and is available only for upcoming appointments.

## Local state and privacy

Storage helpers handle corrupted JSON and fall back safely. Stored data is limited to saved doctor IDs, sample appointments, notification read state, and basic profile/contact preferences. Passwords are never stored. The project does not request diagnoses, prescriptions, insurance, government IDs, medical history, or payment information.

## Bilingual and RTL support

`store/LanguageContext.jsx` toggles between English and Arabic (button in the header), persists the choice, and sets `dir="rtl"`/`lang="ar"` on `<html>`. `src/i18n/translations.js` holds the dictionary. Every physical CSS direction (`left`/`right`, `margin-left`, `border-right`, `text-align: left`, etc.) was converted to a logical equivalent (`inset-inline-start`, `margin-inline-start`, `text-align: start`, ...) across the whole stylesheet, so the layout mirrors correctly under `dir="rtl"` without per-page CSS overrides.

**What's translated:** the site chrome — header (nav, Saved/Appointments links, theme/language toggles, notification count, menu button), footer, skip-link, the 404 page, the error-boundary recovery screen, the route-loading state, and the static copy on the Home and FAQ pages (headings, labels, stats captions, step descriptions).

**What's intentionally not translated yet:** the doctor/clinic/specialty data in `data.ts` (names, bios, descriptions), the FAQ question/answer text itself, and the remaining pages — Doctors search/filters, the booking flow, forms, and About. Extending translations to a page is mechanical (add keys to `translations.js`, call `t("key")` in that page) but touches every page individually, so it's left as incremental follow-up rather than bundled into this pass — the same kind of scoping call a team makes when rolling out i18n page-by-page rather than all at once.

## TypeScript

The data/logic layer — `src/data.ts`, `src/utils.ts`, `src/doctors.ts`, and `src/booking.ts` — is TypeScript with real interfaces (`Doctor`, `Clinic`, `Specialty`, `EnrichedDoctor`, ...). `tsconfig.json` uses `allowJs: true` / `checkJs: false` so the existing `.jsx` UI layer keeps working untouched during this incremental migration. `npm run typecheck` runs `tsc --noEmit`; it's wired into `npm run build` and CI.

`scripts/qa.mjs` and `scripts/generate-sitemap.mjs` import directly from the `.ts` files using Node's built-in TypeScript support (`node --experimental-strip-types`, available in Node ≥ 22.6 — see the `engines` field in `package.json`), so no extra build step is needed to run them.

**What's typed:** the four data/logic modules above — the single source of truth for doctors, clinics, specialties, storage, dates, and availability.

**What's not typed yet:** every `.jsx` component and page. `checkJs: false` means they're allowed to import the typed modules but aren't themselves type-checked, so a page could still pass a wrong shape to a typed function without `tsc` catching it. Converting a component is mechanical (rename to `.tsx`, add prop types) but, like the RTL rollout above, touches every file individually — left as incremental follow-up rather than a rushed, unverifiable one-shot rename of ~30 files.

## Responsive and accessible behavior

Layouts adapt across desktop, tablet, and mobile. Booking controls become single-column on smaller screens. The application includes visible focus, a skip link, labels, semantic buttons, live result counts, accessible selected states, Escape-to-close dialogs, focus containment, and focus restoration. `src/components/accessibility.test.jsx` runs automated `axe-core` checks (via `vitest-axe`) on the Header, DoctorCard, and FilterSelect components.

## Not yet done

- **Live deployed demo** — the code is deploy-ready (see "Deploying a live demo" above), but actually deploying it needs an account and a push from a machine with an internet connection.
- **Translating individual page content, and typing the `.jsx` layer** — see "Bilingual and RTL support" and "TypeScript" above for exactly what's covered and what isn't; both were deliberately scoped to a verified subset rather than a rushed full pass.
- **A documented Lighthouse score** — see "Performance" above for why a number isn't quoted here, and how to generate one after deploying.

## Front-end limitations

All doctors, clinics, reviews, availability, appointment confirmations, notifications, and account states are fictional. No server, healthcare provider, email, SMS, payment service, or authentication provider is connected. Clearing browser storage removes local demo state.

## Final visual polish

The final portfolio pass keeps Medora's existing clinical identity while improving visual consistency across the product. It adds a more refined surface/shadow system, stronger header and navigation states, premium hero and card depth, clearer booking hierarchy, enhanced doctor profile presentation, improved appointment/saved/empty states, a polished authentication surface, mobile refinements, and reduced-motion support. The pass is CSS-led and intentionally avoids decorative clutter or changes to the core interaction model.

