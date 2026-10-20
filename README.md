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
> Authority.

## Features

- **Step-by-step eligibility check** (`/eligibility` → `/result`) based on the
  Section 12 criteria — categories such as women, children, SC/ST members,
  persons with disabilities, industrial workmen, persons in custody,
  disaster/violence victims, and the income test under Section 12(h) (the income
  limit is set by each State Government, so the app asks a yes/no question
  instead of applying one national figure)
- **Pan-India geography** — all 36 states/UTs, 735 districts and 6,857 taluks
  (sub-districts) from the Local Government Directory (LGD), Ministry of
  Panchayati Raj (see `src/data/india.ts`)
- **Document checklist + printable application** (`/documents`) — what to carry,
  and a one-page pre-filled application to print or save as PDF and submit at
  the DLSA
- **Office finder** (`/office`) — your district's DLSA (District & Sessions Court
  premises) with directions; detailed office records for Sagar district (DLSA
  Sagar and the TLSCs at Khurai, Bina, Banda, Deori, Rahatgarh)
- **Bilingual UI** — English and Hindi (हिंदी), with Noto Sans/Serif Devanagari fonts
- **Voice support** — text-to-speech read-aloud and a voice assistant for
  low-literacy users
- **Dark/light theme**, accessible shadcn/ui components, Tailwind CSS 4

## Tech stack

- [TanStack Start](https://tanstack.com/start) (SSR) + TanStack Router (file-based routing) + React 19
- Vite 8, TypeScript, Tailwind CSS 4
- Nitro with the `cloudflare-module` preset for production deploys (Cloudflare Workers)
- GitHub Pages static deployment (prerendered) for the live site

## Author

**Vishwajeet Sah** — Para Legal Volunteer, DLSA Sagar; B.A. LL.B. (Hons) student,
Dr. Harisingh Gour Vishwavidyalaya, Sagar.
