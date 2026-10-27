# LegalAid India — Free Legal Aid Eligibility Check

A citizen-facing awareness website that explains **Section 12 of the Legal Services
Authorities Act, 1987** and helps people anywhere in India check whether they
*may* be eligible for free legal aid. The official NALSA application form is long
and impractical for the people who need legal aid most — many of them cannot fill
a lengthy form — so this tool asks only the minimum questions, in the simplest
order:

1. **Eligibility first** — three short questions (category, family income,
   dispute type). No location or paperwork is asked before eligibility is known.
2. **Then location + basic details** — state, district and taluk, plus the few
   details a District Legal Services Authority (DLSA) officer actually needs to
   register an application.
3. **One printable application (PDF)** — pre-filled with the applicant's answers,
   ready to submit at the nearest DLSA office, where the officer assigns legal aid.

> **Disclaimer:** This tool gives an indicative self-assessment only. Final
> determination of eligibility always rests with the competent Legal Services
> Authority. It provides legal information and awareness only — it is not legal
> advice, and it does not create any lawyer–client relationship.

## Features

- **Step-by-step eligibility check** (`/eligibility` → `/result`) based on the
  Section 12 criteria — categories such as women, children, SC/ST members,
  persons with disabilities, industrial workmen, persons in custody,
  disaster/violence victims, and the income test under Section 12(h) (the income
  limit is set by each State Government, so the app asks a yes/no question
  instead of applying one national figure)
- **Pan-India geography** — all 36 states/UTs, 735 districts and 6,857 taluks
  (sub-districts) from the Local Government Directory (LGD), Ministry of
  Panchayati Raj (see `src/data/india.ts`). Known gap: the dataset predates
  some recent district creations — for example, Madhya Pradesh lists 52 of
  its current 55 districts (Maihar, Mauganj and Pandhurna are not yet
  included)
- **Document checklist + printable application** (`/documents`) — what to carry,
  and a one-page pre-filled application to print or save as PDF and submit at
  the DLSA
- **Office finder** (`/office`) — your district's DLSA (District & Sessions Court
  premises) with directions; detailed office records for Sagar district (DLSA
  Sagar and the TLSCs at Khurai, Bina, Banda, Deori, Rahatgarh)
- **Know your rights guide** (`/guide`) — in plain language: who is entitled
  under Section 12 (all categories, including trafficking victims, persons with
  disability and disaster/atrocity victims), what free legal aid actually
  includes, what happens after you apply, and how to get legal help *before* an
  arrest (police notice / apprehended arrest)
- **Bilingual UI** — English and Hindi (हिंदी), with Noto Sans/Serif Devanagari fonts
- **Voice support** — text-to-speech read-aloud and a voice assistant for
  low-literacy users
- **Dark/light theme**, accessible shadcn/ui components, Tailwind CSS 4

## Tech stack

- [TanStack Start](https://tanstack.com/start) (SSR) + TanStack Router (file-based routing) + React 19
- Vite 8, TypeScript, Tailwind CSS 4
- Nitro with the `cloudflare-module` preset for production deploys (Cloudflare Workers)
- GitHub Pages static deployment (prerendered) for the live site

## Getting started (setup)

**Prerequisites:** [Bun](https://bun.sh) 1.x (used for install, dev and tests) or
Node.js 20+ with npm, and Git.

```bash
git clone https://github.com/vishwajeetsah/legalaid-mp.git
cd legalaid-mp
bun install          # or: npm install
bun run dev          # local dev server at http://localhost:8080
```

**Production builds:**

```bash
bun run build              # SSR build (Nitro, Cloudflare Workers preset)
GH_PAGES=true bun run build   # static prerendered build for GitHub Pages
bun run preview            # preview a production build locally
```

The GitHub Pages build is what powers the live site at
https://vishwajeetsah.github.io/legalaid-mp/ — it prerenders every route to
static HTML under the `/legalaid-mp/` base path.

## Environment variables

LegalAid India has **no backend, no database and no API keys** — nothing secret
is required to run it. The only environment variables are build-time flags:

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `GH_PAGES` | No | unset | Set to `true` to build the static GitHub Pages variant (base path `/legalaid-mp/`, Nitro skipped). Leave unset for the Cloudflare Workers SSR build. |
| `VITE_ROUTER_BASEPATH` | No | `/` | Router base path. Set automatically by `vite.config.ts` from `GH_PAGES`; override only for other subpath hosting. |
| `VITE_*` | No | — | Any `VITE_`-prefixed variables are exposed to the client via `import.meta.env` (see `vite.config.ts`). None are required by the app today. |

Applicant answers are never sent to a server: they are held only in the
browser's `sessionStorage` (key `legalaid-answers-v2`) and are cleared when the
tab session ends.

## Testing

Eligibility rules are covered by data-driven tests. Every case in
[`tests/sample-data/eligibility-cases.json`](tests/sample-data/eligibility-cases.json)
(sample inputs with the expected verdict and document list) is executed against
the real rules engine (`src/lib/eligibility.ts`) by
[`tests/eligibility.test.ts`](tests/eligibility.test.ts):

```bash
bun test    # or: bun run test
```

## Documentation

- **Technical design document (architecture, diagrams, data model):**
  [`docs/TECHNICAL_DESIGN.md`](docs/TECHNICAL_DESIGN.md)
- **Sample data & test cases:**
  [`tests/sample-data/eligibility-cases.json`](tests/sample-data/eligibility-cases.json)
- **Live application:** https://vishwajeetsah.github.io/legalaid-mp/

## License

MIT — see [LICENSE](LICENSE).

## Author

**Vishwajeet Sah** — Para Legal Volunteer, DLSA Sagar; B.A. LL.B. (Hons) student,
Dr. Harisingh Gour Vishwavidyalaya, Sagar.

---

*README last verified against the live application on 27 October 2026.*
