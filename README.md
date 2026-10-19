# LegalAid MP — Free Legal Aid Eligibility Check

A citizen-facing awareness website that explains **Section 12 of the Legal Services
Authorities Act, 1987** and helps people in Sagar district, Madhya Pradesh check
whether they *may* be eligible for free legal aid. Built as a Para Legal Volunteer
project with the District Legal Services Authority (DLSA), Sagar.

> **Disclaimer:** This tool gives an indicative self-assessment only. Final
> determination of eligibility always rests with the competent Legal Services
> Authority.

## Features

- **Step-by-step eligibility check** (`/eligibility` → `/result`) based on the
  Section 12 criteria — category (SC/ST, women, children, persons with
  disabilities, industrial workmen, disaster/caste-violence victims, undertrials,
  low-income, etc.)
- **Document checklist** (`/documents`) — what to carry when you apply
- **Office finder** (`/office`) — DLSA Sagar and Taluk Legal Services Committee
  contact details, addresses and hours
- **Bilingual UI** — English and Hindi (हिंदी), with Noto Sans/Serif Devanagari fonts
- **Voice support** — text-to-speech read-aloud and a voice assistant for
  low-literacy users
- **Dark/light theme**, accessible shadcn/ui components, Tailwind CSS 4

## Tech stack

- [TanStack Start](https://tanstack.com/start) (SSR) + TanStack Router (file-based routing) + React 19
- Vite 8, TypeScript, Tailwind CSS 4
- Nitro with the `cloudflare-module` preset for production deploys (Cloudflare Workers)

## Development

Requires Node.js 20+ (or [Bun](https://bun.sh)).

```sh
git clone <this-repository-url>
cd <repository-name>

# with bun (recommended — bun.lock is committed)
bun install
bun run dev

# or with npm
npm install
npm run dev
```

Dev server runs at `http://localhost:8080`.

## Scripts

| Script          | Purpose                                  |
| --------------- | ---------------------------------------- |
| `bun run dev`   | Start the dev server                     |
| `bun run build` | Production build (Nitro, Cloudflare target) |
| `bun run preview` | Preview the production build locally   |
| `bun run lint`  | ESLint                                   |
| `bun run format`| Prettier                                 |

## Project structure

```
src/
├── routes/          # File-based routes: index, eligibility, result, documents, office
├── components/      # SiteHeader, SiteFooter, PageShell, VoiceAssistant, SpeakButton, ui/*
├── data/legalAid.ts # Districts, tehsils, DLSA/TLSC office data, bilingual strings
├── lib/             # i18n, eligibility logic, answers store, speech, theme
├── server.ts        # Custom SSR server entry (error wrapper)
└── start.ts         # TanStack Start instance + error middleware
```

Routes follow TanStack file-based conventions — see `src/routes/README.md`.

## Author

**Vishwajeet Sah** — Para Legal Volunteer, District Legal Services Authority (DLSA), Sagar.
