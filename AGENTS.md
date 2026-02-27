# AGENTS.md — Frontend AI Coding Guidelines

> **Definitive guide for AI Coding Agents working on this frontend codebase.**
> Every code generation, refactoring, or review task MUST follow these rules.

---

## 1. Project Identity

| Key            | Value                                              |
| -------------- | -------------------------------------------------- |
| Product        | Google AI Ecosystem Bootcamp 2026 — Landing & Registration |
| Framework      | Next.js 16 (App Router) + React 19 + TypeScript    |
| Styling        | Tailwind CSS v4 + custom theme (`globals.css`)     |
| Animation      | Framer Motion v12                                  |
| Icons          | Lucide React + Google Material Symbols (CDN)       |
| Font           | Space Grotesk (via `next/font/google`)             |
| Language       | Vietnamese (UI text) — Code & comments in English  |
| Node           | >= 20                                              |
| Package Manager| npm                                                |

---

## 2. Tech Stack — Strict Versions

| Library            | Version   | Purpose                              |
| ------------------ | --------- | ------------------------------------ |
| next               | 16.1.6    | App Router, SSR/SSG, Image/Font opt  |
| react / react-dom  | 19.2.3    | UI rendering                         |
| framer-motion      | ^12       | Page transitions & scroll animations |
| lucide-react       | ^0.575    | Icon library                         |
| tailwindcss        | ^4        | Utility-first CSS (PostCSS plugin)   |
| typescript         | ^5        | Static type safety                   |

**DO NOT** add new dependencies without explicit approval. Especially avoid:
- CSS-in-JS libraries (styled-components, emotion)
- State management libraries (Redux, Zustand) — use React state/context
- Additional animation libraries — use Framer Motion exclusively
- UI component libraries (shadcn, MUI, Chakra) — all components are custom

---

## 3. Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── globals.css         # Tailwind imports + custom theme (@theme)
│   ├── layout.tsx          # Root layout (font, metadata, Header/Footer)
│   ├── page.tsx            # Landing page (main monolith — see note below)
│   ├── register/
│   │   └── page.tsx        # Registration form (Step 1)
│   ├── payment/
│   │   └── page.tsx        # QR payment page (Step 2)
│   └── success/
│       └── page.tsx        # Success confirmation (Step 3)
├── components/
│   ├── layout/
│   │   ├── Header.tsx      # Fixed glassmorphism navbar
│   │   └── Footer.tsx      # Site footer
│   └── home/               # Extracted landing page sections (refactored)
│       ├── TubesBackground.tsx
│       ├── HeroSection.tsx
│       ├── ProblemSection.tsx
│       ├── SolutionSection.tsx
│       ├── RoadmapSection.tsx
│       ├── OutcomesSection.tsx
│       └── CallToAction.tsx
public/
└── images/                 # Static assets (logos, avatars, backgrounds)
```

### Important Architecture Note

The main `src/app/page.tsx` is currently a **monolithic ~1370-line file** containing all landing page sections inline (Hero, Overview, Comparison Table, Target Audience, Methodology, Ecosystem Map, Roadmap, Course Modules Accordion, Instructor, CTA).

The `src/components/home/` folder contains **extracted component versions** of some sections. When refactoring or adding features:
- **Prefer** working with the extracted components in `components/home/`
- When modifying `page.tsx`, consider extracting sections into dedicated components
- Each section should be a standalone `"use client"` component with its own data & animations

---

## 4. Naming Conventions

| Entity              | Convention        | Example                        |
| ------------------- | ----------------- | ------------------------------ |
| Component file      | PascalCase.tsx    | `HeroSection.tsx`              |
| Component function  | PascalCase        | `export default function HeroSection()` |
| Page file           | `page.tsx`        | `app/register/page.tsx`        |
| Layout file         | `layout.tsx`      | `app/layout.tsx`               |
| CSS file            | camelCase.css     | `globals.css`                  |
| Utility function    | camelCase         | `getColorClasses()`            |
| Constant            | camelCase/UPPER   | `courseModules`, `fadeInUp`     |
| Props interface     | PascalCase + Props| `TubesBackgroundProps`         |
| CSS custom property | kebab-case        | `--color-primary`              |

---

## 5. Component Guidelines

### 5.1 File Structure Pattern

```tsx
"use client"; // Required for components using hooks, motion, browser APIs

import React from 'react';
import { motion } from 'framer-motion';
// ... other imports

// --- Types/Interfaces ---
interface SectionProps { ... }

// --- Constants/Data ---
const sectionData = [ ... ];

// --- Animation Variants ---
const fadeInUp: Variants = { ... };

// --- Component ---
export default function SectionName({ prop }: SectionProps) {
  // hooks
  // handlers
  // render
  return ( ... );
}
```

### 5.2 Rules

1. **Server vs Client**: Default to Server Components. Add `"use client"` ONLY when using:
   - React hooks (`useState`, `useEffect`, `useRef`)
   - Framer Motion (`motion.*`, `AnimatePresence`)
   - Browser APIs (`window`, `document`, `canvas`)
   - Event handlers (`onClick`, `onChange`)

2. **No prop drilling** beyond 2 levels. Use React Context or composition.

3. **Images**: Always use `next/image` for local assets. Use `<img>` only for external/dynamic URLs (e.g., QR codes from APIs).

4. **Links**: Always use `next/link` for internal navigation. Use `<a>` with `target="_blank" rel="noopener noreferrer"` for external links.

5. **TypeScript**: Use explicit types. Avoid `any` — if unavoidable (e.g., CDN libraries), add a comment explaining why.

---

## 6. Styling Rules

### 6.1 Tailwind CSS v4

This project uses **Tailwind v4 with the PostCSS plugin** (`@tailwindcss/postcss`). The configuration is defined in `globals.css` using the `@theme` directive — there is **no `tailwind.config.ts` file**.

```css
@import "tailwindcss";

@theme {
  --color-primary: #4387f4;
  --color-background-dark: #101722;
  --color-google-red: #ea4335;
  --color-google-yellow: #fbbc05;
  --color-google-green: #34a853;
  --font-display: var(--font-space-grotesk), "Space Grotesk", sans-serif;
}
```

### 6.2 Design System

| Token              | Value      | Usage                          |
| ------------------ | ---------- | ------------------------------ |
| `primary`          | `#4387f4`  | Google Blue — CTA, links, focus |
| `google-red`       | `#ea4335`  | Accent, warnings               |
| `google-yellow`    | `#fbbc05`  | Highlights, badges              |
| `google-green`     | `#34a853`  | Success states                  |
| `background-dark`  | `#101722`  | Card backgrounds                |
| Base BG            | `#0A101E` / `#020617` | Page background         |

### 6.3 Styling Patterns

- **Glassmorphism**: `bg-white/[0.03] backdrop-blur-xl border border-white/10`
- **Glass card utility**: `.glass-card` (defined in globals.css)
- **Glow effect**: `.google-glow` → `box-shadow: 0 0 20px rgba(67,135,244,0.15)`
- **Glow border**: `.glow-border` → animated gradient border pseudo-element
- **Card base**: `bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl`
- **Dark theme**: The site is **dark-only** (`<html class="dark">`). Do NOT add light mode styles.

### 6.4 DO NOT

- Use inline `style={}` unless absolutely necessary (e.g., `touchAction`)
- Create new CSS files — put custom utilities in `globals.css` under `@layer utilities`
- Use `!important`
- Use arbitrary color values repeatedly — add to `@theme` instead

---

## 7. Animation Guidelines

All animations use **Framer Motion**. Follow these patterns:

### 7.1 Scroll Reveal (most common)

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.6 }}
>
```

### 7.2 Reusable Variants

```tsx
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const cardVariant: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5 } }
};
```

### 7.3 Rules

- Always use `viewport={{ once: true }}` for scroll animations (don't re-trigger)
- Keep animation durations between 0.3s and 0.8s
- Use `AnimatePresence` for mount/unmount animations (e.g., accordion)
- Prefer `whileHover` and `whileTap` for micro-interactions
- No animations that cause layout shift (CLS)

---

## 8. Page Architecture

### 8.1 User Flow

```
Landing (/) → Register (/register) → Payment (/payment) → Success (/success)
```

### 8.2 Landing Page Sections (in order)

1. **Hero** — 3D Tubes background + headline + stats cards
2. **Overview** — Teaching philosophy + flow diagram (Idea→Content→App→Workflow→Agent→Business)
3. **Comparison Table** — "Normal AI training" vs "This bootcamp"
4. **Target Audience** — 6 persona cards (Leadership, Manager, Marketing, Ops, Tech, Startup)
5. **Methodology** — 4 pillars (Outcome-based, Learning by Doing, Real-world, Progressive)
6. **Ecosystem Map** — Google AI tools organized in 3-column grid (Models, Build, Creative)
7. **Roadmap Header** — Section title for course modules
8. **Course Modules** — 5-session accordion with expand/collapse (Framer AnimatePresence)
9. **Instructor & Requirements** — 2-column layout
10. **CTA Footer** — Contact info + email/phone links

### 8.3 Registration Flow

| Step | Page        | Progress | Description                    |
| ---- | ----------- | -------- | ------------------------------ |
| 1    | `/register` | 25%      | Personal info form             |
| 2    | `/payment`  | 66%      | QR code payment + countdown    |
| 3    | `/success`  | 100%     | Confirmation + Zalo group link |

---

## 9. 3D Background (TubesBackground)

The `TubesBackground` component loads a **WebGL tubes effect** from CDN:
```
https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js
```

### Rules

- Use `new Function('url', 'return import(url)')` for dynamic CDN import (avoids Turbopack SSR errors)
- Canvas must have `touchAction: 'none'` for mobile compatibility
- Children overlay uses `pointer-events-none` container with `pointer-events-auto` on interactive elements
- Always include a gradient overlay at the bottom for smooth section transitions
- Provide error fallback when CDN fails to load
- Click interaction randomizes tube colors via `tubesRef.current.tubes.setColors()`

---

## 10. Responsive Design

- **Mobile-first**: Write `base` styles, then `md:` and `lg:` breakpoints
- **Breakpoints**: `md` (768px), `lg` (1024px), `xl` (1280px)
- **Grid**: Use `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` pattern
- **Typography**: Scale with responsive classes (`text-3xl md:text-5xl lg:text-7xl`)
- **Spacing**: Use consistent Tailwind spacing scale (4, 6, 8, 12, 16, 20, 24)
- **Navigation**: Desktop nav links hidden on mobile (`hidden md:flex`)

---

## 11. SEO & Performance

1. **Metadata**: Defined in `layout.tsx` via `export const metadata: Metadata`
2. **Font optimization**: Using `next/font/google` with `Space_Grotesk`
3. **Image optimization**: Use `next/image` with `fill` + `object-contain/cover`
4. **Lazy loading**: Framer Motion `whileInView` with `viewport={{ once: true }}` acts as lazy reveal
5. **Bundle size**: Avoid importing entire icon sets — import individually from `lucide-react`
6. **External resources**: Material Symbols font loaded via `<link>` in `<head>`

---

## 12. Code Quality

### ESLint

The project uses **eslint-config-next** with:
- `core-web-vitals` preset
- `typescript` preset

Run: `npm run lint`

### TypeScript

- **Strict mode** is enabled
- Path alias: `@/*` → `./src/*`
- No implicit `any` — annotate all function parameters and return types

---

## 13. Anti-Patterns — NEVER Do These

| #  | Anti-Pattern                                     |
| -- | ------------------------------------------------ |
| 1  | Adding light mode / theme toggle                 |
| 2  | Using CSS-in-JS or CSS modules                   |
| 3  | Installing UI component libraries                |
| 4  | Creating API routes (backend is separate)         |
| 5  | Using `getServerSideProps` (App Router only)      |
| 6  | Hardcoding colors — use theme tokens              |
| 7  | Over-nesting components (max 3 levels deep)       |
| 8  | Removing the `"use client"` directive from animated components |
| 9  | Adding inline `<script>` tags                    |
| 10 | Using `dangerouslySetInnerHTML`                   |
| 11 | Mixing Vietnamese and English in code/comments    |
| 12 | Adding server-side data fetching in page components without need |

---

## 14. Git Conventions

### Branch Naming

```
feat/section-name       # New section or page
fix/bug-description     # Bug fixes
refactor/component-name # Code restructuring
style/visual-change     # Pure styling changes
docs/what-changed       # Documentation updates
```

### Commit Messages (Conventional Commits)

```
feat: add testimonials section to landing page
fix: mobile nav overflow on register page
style: adjust hero section spacing on tablet
refactor: extract ecosystem map to dedicated component
docs: update README with deployment instructions
```

---

## 15. Deployment

- **Platform**: Vercel (recommended for Next.js)
- **Build command**: `npm run build`
- **Output**: `.next/` (automatically handled by Vercel)
- **Environment variables**: None required for frontend (static site)
- **Note**: The `/server` directory is excluded from this repo via `.gitignore`

---

## 16. Checklist Before Every PR

- [ ] `npm run build` passes with 0 errors
- [ ] `npm run lint` passes with 0 warnings
- [ ] All new components have TypeScript types (no `any`)
- [ ] Responsive tested at 375px, 768px, 1024px, 1440px
- [ ] Animations use `viewport={{ once: true }}`
- [ ] No hardcoded colors — using theme tokens
- [ ] Images use `next/image` where possible
- [ ] Vietnamese text is correct (no typos/garbled text)
- [ ] No console.log/console.error left in production code
- [ ] Commit message follows Conventional Commits format
