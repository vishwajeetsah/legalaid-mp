# AGENTS.md

LegalAid MP — Section 12 (Legal Services Authorities Act, 1987) awareness site.
TanStack Start (SSR) + React 19 + Tailwind CSS 4 + shadcn/ui. Bilingual (en/hi).

## Commands

- `bun install` / `bun run dev` — install deps, start dev server on :8080
- `bun run build` — production build via Nitro (`cloudflare-module` preset)
- `bun run lint` / `bun run format` — eslint / prettier

## Conventions

- File-based routing in `src/routes/` (see `src/routes/README.md`). App shell is
  `src/routes/__root.tsx` — keep `<Outlet />`, `<HeadContent />`, `<Scripts />`.
- `@/` maps to `src/`. SSR entry is `src/server.ts` (wired via `vite.config.ts`
  `tanstackStart.server.entry: "server"`); Start instance config lives in `src/start.ts`.
- Eligibility criteria logic lives in `src/lib/eligibility.ts`; office/district data
  in `src/data/legalAid.ts`. Keep every user-facing string bilingual (`Bilingual`
  type, `src/lib/i18n.tsx`).
- `public/` is served as-is (favicon.svg, robots.txt).

## Notes

- This is a public legal-awareness tool, not legal advice. The result page must
  keep the disclaimer that final eligibility is decided by the Legal Services Authority.
- Production deploys target Cloudflare Workers (Nitro preset in `vite.config.ts`).
