# Enterprise Software Platform — Scaffold

This is a **structural scaffold**, not a finished application. It gives you a working
folder architecture, routing skeleton, Appwrite service layer, and a proposed database
schema so the real page-by-page build can start from a consistent foundation.

## What's actually implemented

- Vite + React 19 + TypeScript project config (`vite.config.ts`, `tsconfig.json`)
- Tailwind config wired to CSS variables for the light/dark palette from the brief
  (Xanthous `#F7B538` / Burgundy `#780116`)
- Full route table (`src/constants/routes.ts`, `src/routes/index.tsx`) covering every
  public and admin page named in the spec, each pointing at a stub component
- Appwrite client + generic typed repository pattern (`src/services/appwrite/`,
  `src/repositories/`) so CRUD for a new collection is a few lines, not a new file
  of boilerplate each time
- Auth context that reads the current Appwrite session and flags admin status by
  matching email/phone against `VITE_ADMIN_EMAILS` / `VITE_ADMIN_PHONES`, per the
  spec's rule (not a role field)
- `ProtectedRoute` implementing the "non-admin → alert + redirect home" behavior
  exactly as specified
- A proposed Appwrite schema (`appwrite/schema.json`) covering all 27 collections
  named in the brief, with the shared `slug` / `status` / `seo` fields

## What's intentionally NOT done yet

- Every page component is a placeholder stub (see `src/pages/public/*`,
  `src/pages/admin/*`) — no real content, no data fetching wired up
- No shadcn/ui or Radix components have been installed/generated — the config
  references them but nothing is scaffolded yet
- No Framer Motion / GSAP / Lenis / animation setup
- No actual CRUD UI for the admin dashboard
- The schema in `appwrite/schema.json` has **not been created in or validated
  against a live Appwrite project** — it's a hand-written proposal based on the
  brief. Review attribute sizes/types and apply it via `appwrite deploy collection`
  or the console before relying on it.

## Honesty notes on things I could not verify

- **Fonts:** the brief listed typeface names (Mergola, WERO, Winked, Ganey, Kago,
  Harka, GOBE, MoRHeFA, Kanesty, Hams Pro) I could not confirm as real, licensed,
  or Google-Fonts-available typefaces. I substituted **Sora** (display) and
  **Inter** (body) — both verified, real, freely licensed Google Fonts with a
  similar geometric/enterprise character — and flagged the swap in
  `src/styles/globals.css`. If you have a specific licensed font family in mind,
  tell me and I'll wire it in instead.
- **Package versions** in `package.json` are recent-as-of-my-knowledge but not
  live-verified against the npm registry at the moment you read this — run
  `npm install` and expect your lockfile to pick the actual latest compatible
  versions; don't treat the version numbers as exact.
- **Appwrite SDK method names** (`createEmailPasswordSession`, etc.) match the
  Appwrite Web SDK v16+ API as I understand it, but Appwrite's SDK does change
  between major versions — worth a quick check against the SDK version you
  actually install.

## Next steps (in order)

1. `npm install` inside this folder, verify it installs cleanly against the
   Appwrite/React/Tailwind versions actually available
2. Create the Appwrite project + apply `appwrite/schema.json` (adjust as needed)
3. Copy `.env.example` → `.env`, fill in real Appwrite project/database IDs and
   admin email/phone lists
4. Pick one page (Home is the natural start) and build it end-to-end: real copy,
   real Appwrite queries via the repository pattern, real layout — as a template
   for the rest
5. Build out `SiteHeader` / `SiteFooter` driven by the `navigation` and `footer`
   collections, referenced as TODOs in `src/layouts/PublicLayout.tsx`
6. Build the `AdminSidebar` / `AdminTopbar` and the first admin CRUD screen
   (Service Management is a good template — it's the simplest full CRUD case)

## Folder map

```
src/
  routes/         route table + ProtectedRoute
  layouts/        PublicLayout, AdminLayout
  pages/public/   18 public page stubs
  pages/admin/    15 admin page stubs
  components/     ui/ (shadcn primitives, empty), common/, sections/
  services/appwrite/  client, auth.service, repository (generic CRUD)
  repositories/   per-collection repository instances
  contexts/       AuthContext
  providers/      QueryProvider (TanStack Query)
  config/         env.ts (typed env access + admin check)
  constants/      routes.ts, collections.ts
  types/          entities.ts (BaseRecord, SeoMeta, per-entity types)
  schemas/        zod schemas (one example: quote.schema.ts)
  utils/          cn.ts
appwrite/
  schema.json     proposed collection/attribute definitions
```
