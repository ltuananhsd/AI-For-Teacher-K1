# AGENTS.md — Frontend AI Coding Guidelines

> **Definitive guide for AI Coding Agents working on this frontend codebase.**
> Every code generation, refactoring, or review task MUST follow these rules.

---

## 1. Project Identity

| Key            | Value                                              |
| -------------- | -------------------------------------------------- |
| Product        | Khai Mở Sức Mạnh AI - Khóa học ứng dụng AI cho Giáo viên |
| Framework      | Next.js 16 (App Router) + React 19 + TypeScript    |
| Styling        | Tailwind CSS v4                                    |
| Animation      | Framer Motion v12                                  |
| Icons          | Lucide React                                       |
| Font           | Space Grotesk (via `next/font/google`)             |
| Language       | Vietnamese (UI text) — Code & comments in English  |
| Design Vibe    | Retro Brutalism / Playful Education / Scrapbook    |
| Package Manager| npm                                                |
| Node           | >= 20                                              |

---

## 2. Tech Stack — Strict Versions

| Library            | Version   | Purpose                              |
| ------------------ | --------- | ------------------------------------ |
| next               | 16.1.6    | App Router, SSR/SSG                  |
| react / react-dom  | 19.2.3    | UI rendering                         |
| framer-motion      | ^12       | Page transitions & scroll animations |
| lucide-react       | ^0.575    | Icon library                         |
| tailwindcss        | ^4        | Utility-first CSS (PostCSS plugin)   |
| typescript         | ^5        | Static type safety                   |

**DO NOT** add new dependencies without explicit approval. Especially avoid:
- CSS-in-JS libraries (styled-components, emotion).
- UI component libraries (shadcn, MUI, Chakra) — all components are custom-built to match the Retro Brutalist style perfectly.

---

## 3. Project Structure

```text
src/
├── app/                    # Next.js App Router pages
│   ├── globals.css         # Tailwind imports
│   ├── layout.tsx          # Root layout (metadata, font definition)
│   ├── page.tsx            # Main Landing page (Monolithic - Retro Design)
│   ├── register/           # Registration flow (Step 1)
│   ├── payment/            # Payment gateway (Step 2)
│   └── success/            # Success confirmation (Step 3)
├── components/
│   ├── layout/             # Header, Footer, Chatbot
│   └── home/               # Extracted landing page sections (if any)
public/
└── images/                 # Static assets (logos, avatars)
```

### Important Architecture Note
The main `src/app/page.tsx` is built as a monolithic file containing the entire landing page. It heavily utilizes reusable local component patterns like `Tape`, `FunkyButton`, and `SectionHeading` to enforce the Brutalist aesthetic.

---

## 4. Styling Rules & Retro Brutalism Design System

This project uses a highly specific **Retro / Brutalist** design system. generic modern corporate styles, glassmorphism, or sleek dark modes must **NOT** be used.

### 4.1 Color Palette (Retro Theme)

The UI relies on these hardcoded core colors. DO NOT deviate from them for main components:

| Token    | Value     | Usage                            |
| -------- | --------- | -------------------------------- |
| `navy`   | `#2a3b8f` | Headings, strong contrast        |
| `pink`   | `#e94e77` | Primary CTA, Tape, Highlights    |
| `yellow` | `#ffcc00` | Badges, Highlights, Shadows      |
| `teal`   | `#45b596` | Accents, success states          |
| `orange` | `#ff7e67` | Accents, warnings                |
| `bg`     | `#fdfbf7` | Main cream/paper background      |
| `dark`   | `#1f2937` | Base text, borders, hard shadows |

*Note: The project defines these in a `theme` object or inline throughout `page.tsx`.*

### 4.2 UI Patterns (CRITICAL RULES)

- **Hard Borders**: Nearly all elements (buttons, cards, badges) must have thick borders: `border-4 border-gray-800`.
- **Hard Solid Shadows**: Box shadows must be solid blocks of color. 
  - *Example*: `shadow-[8px_8px_0px_#45b596]` or `shadow-[4px_4px_0px_#2a3b8f]`. 
  - *Do NOT* use blurry default Tailwind shadows like `shadow-md` or `shadow-lg`.
- **Rotated Elements**: Elements should feel thrown onto a scrapbook. Apply slight rotations: `transform rotate-2`, `-rotate-3` on badges, buttons, cards.
- **FunkyButton Component**: Buttons have thick borders, uppercase text, bold solid shadows, and interactive press states (`active:translate-x-[6px] active:translate-y-[6px]` while the shadow shrinks to zero).
- **Tape Component**: Use the `Tape` (a mask tape-like rectangular div with `opacity-90`, `bg-[#e94e77]`, rotated) slapped onto corners or edges of white cards.
- **Text Shadows**: Headings use a thick offset color shadow combined with a dark stroke outline to pop against backgrounds.
  - *Example*: `textShadow: '4px 4px 0px #ffcc00, -1px -1px 0 #1f2937, 1px -1px 0 #1f2937, -1px 1px 0 #1f2937, 1px 1px 0 #1f2937'`
- **Background Texture**: The cream background uses a multiplier blend: `bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-multiply` to give subtle depth.

---

## 5. Animation Guidelines

All animations are powered by **Framer Motion**:
- **Playful Springs**: Use spring configs for reveals (`type: 'spring', bounce: 0.4`) to emphasize the bouncy, funky feel.
- **Stagger**: Container variants like `staggerChildren: 0.2` should wrap cards and lists.
- **Scroll Reveal**: Elements use `whileInView={{ opacity: 1, y: 0 }}` and must have `viewport={{ once: true, margin: "-100px" }}` so they don't jump every time scrolling up and down.
- **No Layout Shifts**: Animations only affect `opacity`, `translate`, `scale`, or `rotate`.

---

## 6. Landing Page Sections Outline

The page flow is structured as follows:

1. **Hero**: Abstract floating shapes (`#ffcc00` circles, `#e94e77` rotated squares) behind a massive typography lockup and `FunkyButton` CTA.
2. **Thực Trạng (Grid)**: Problem cards with slight random rotations and a piece of `Tape` on top.
3. **Giải Pháp (Google AI)**: Solution cards with thick colorful drop shadows.
4. **Đối Tượng & Triết Lý**: Info lists and an angled box titled "Học thực chiến ra sản phẩm".
5. **Chuyên Gia**: Circular avatar cutout with overlapping circles and floating icons.
6. **Lộ Trình 4 Buổi**: A vertical list of 4 giant colorful cards explaining the curriculum (Gemini -> NotebookLM -> AI Studio -> Deploy).
7. **Pricing/Ticket & CTA**: A massive yellow dashed-border "Ticket/Coupon" showing the early bird price (449k).
8. **Footer**: Simple thick-bordered footer with map/contact info.

---

## 7. Responsive Design

- **Mobile-first**: Always use base classes for mobile, extending with `md:` and `lg:`.
- **Prevent Overflow**: Rotated elements naturally expand bounds; ensure `overflow-x-hidden` on main containers.
- **Scale Elements Down**: Hard text shadows and thick borders (`border-4`) consume space; scale text properly (`text-4xl` mobile, `text-6xl+` desktop).

---

## 8. Anti-Patterns — NEVER Do These

| # | Anti-Pattern |
| - | ------------ |
| 1 | **Sleek/Corporate Design**: Using thin borders, subtle greys, or minimalist layouts. |
| 2 | **Glassmorphism**: Using transparent dark backgrounds with `backdrop-blur`. |
| 3 | **Soft Shadows**: Using Tailwind's default `shadow-lg` (blurry edges). |
| 4 | **Dark Mode**: Implementing a global `<html class="dark">` style without adapting to the bright Retro palette. (The current design runs on a cream background `bg-[#fdfbf7]`). |
| 5 | **Overloading dependencies**: Bringing in external animation libraries when Framer Motion is present. |
| 6 | Mixing Vietnamese and English text indiscriminately in UI copy. UI must be Vietnamese. |

---

## 9. QA Checklist for AI Agents editing this repo

- [ ] Does the new component have a thick border (`border-4 border-gray-800`)?
- [ ] Does it have a hard solid shadow instead of a blurry one?
- [ ] Are we using the Retro theme colors (`#2a3b8f`, `#e94e77`, `#ffcc00`)?
- [ ] Is `viewport={{ once: true }}` applied to scroll animations?
- [ ] Is there proper mobile responsiveness (`flex-col md:flex-row`)?
