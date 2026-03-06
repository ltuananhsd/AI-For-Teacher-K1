# Google AI Ecosystem Bootcamp 2026 — Frontend

Landing page and registration flow for the **Google AI Ecosystem Bootcamp 2026** training program by CES Global.

Built with **Next.js 16**, **React 19**, **Tailwind CSS v4**, and **Framer Motion**.

---

## Tech Stack

| Technology       | Version | Purpose                                        |
| ---------------- | ------- | ---------------------------------------------- |
| Next.js          | 16.1.6  | App Router, SSR/SSG, Image & Font optimization |
| React            | 19.2.3  | UI rendering                                   |
| TypeScript       | ^5      | Static type safety (strict mode)               |
| Tailwind CSS     | ^4      | Utility-first styling via PostCSS plugin       |
| Framer Motion    | ^12     | Scroll animations & page transitions           |
| Lucide React     | ^0.575  | Icon library                                   |
| Material Symbols | CDN     | Google icon font                               |

---

## Prerequisites

- **Node.js** >= 20
- **npm** (included with Node.js)

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

| Script          | Command      | Description               |
| --------------- | ------------ | ------------------------- |
| `npm run dev`   | `next dev`   | Start dev server with HMR |
| `npm run build` | `next build` | Production build          |
| `npm run start` | `next start` | Start production server   |
| `npm run lint`  | `eslint`     | Run ESLint checks         |

---

## Project Structure

```
├── public/
│   └── images/              # Static assets (logos, avatars, QR codes)
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── globals.css      # Tailwind config + custom theme
│   │   ├── layout.tsx       # Root layout (font, metadata, Header/Footer)
│   │   ├── page.tsx         # Landing page
│   │   ├── register/        # Step 1: Registration form
│   │   ├── payment/         # Step 2: QR payment
│   │   └── success/         # Step 3: Confirmation
│   └── components/
│       ├── layout/
│       │   ├── Header.tsx   # Fixed glassmorphism navbar
│       │   └── Footer.tsx   # Site footer
│       └── home/            # Landing page section components
│           ├── TubesBackground.tsx
│           ├── HeroSection.tsx
│           ├── ProblemSection.tsx
│           ├── SolutionSection.tsx
│           ├── RoadmapSection.tsx
│           ├── OutcomesSection.tsx
│           └── CallToAction.tsx
├── AGENTS.md                # AI Coding Agent guidelines
├── package.json
├── tsconfig.json
├── eslint.config.mjs
├── postcss.config.mjs
└── next.config.ts
```

---

## User Flow

```
Landing (/) → Register (/register) → Payment (/payment) → Success (/success)
```

| Page        | Description                                                                       |
| ----------- | --------------------------------------------------------------------------------- |
| `/`         | Marketing landing page with 10 sections (hero, roadmap, ecosystem map, CTA, etc.) |
| `/register` | Multi-step registration form with validation                                      |
| `/payment`  | QR code payment with countdown timer + auto-verification                          |
| `/success`  | Confirmation page with Zalo community group link                                  |

---

## Design System

The visual design uses a **dark theme** with Google brand colors:

| Token           | Hex       | Usage                    |
| --------------- | --------- | ------------------------ |
| `primary`       | `#4387f4` | Google Blue — CTA, links |
| `google-red`    | `#ea4335` | Accent, warnings         |
| `google-yellow` | `#fbbc05` | Highlights, badges       |
| `google-green`  | `#34a853` | Success states           |

Custom theme tokens are defined in `src/app/globals.css` using Tailwind v4's `@theme` directive.

### Key UI Patterns

- **Glassmorphism cards**: Semi-transparent backgrounds with `backdrop-blur`
- **3D Tubes Background**: WebGL effect via threejs-components CDN on hero section
- **Scroll reveal animations**: Framer Motion `whileInView` with stagger effects
- **Responsive grid**: Mobile-first, 1 → 2 → 3 column layouts

---

## Font

**Space Grotesk** — loaded via `next/font/google` with Vietnamese subset support.

Weights: 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)

---

## Deployment

### Vercel (Recommended)

```bash
# Build
npm run build

# The .next/ directory is the build output
# Vercel handles this automatically
```

1. Push to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Deploy — no environment variables required for the frontend

### Other Platforms

Any platform supporting Node.js can serve this app:

```bash
npm run build
npm run start    # Starts on port 3000
```

---

## Related

- **Backend**: Separate repository at [vuhai2002/backend-google-ai-bootcamp-2026](https://github.com/vuhai2002/backend-google-ai-bootcamp-2026) (Express + TypeScript + Supabase)
- **AI Agent Guidelines**: See [AGENTS.md](./AGENTS.md) for coding conventions and architectural rules

---

## License

© 2026 CES Global. All rights reserved. Andy
