<div align="center">

  <img src="public/icon.svg" alt="Readlyn Logo" width="80" height="80" />

# Readlyn

**AI-powered infographic generator — describe any topic, get a stunning visual in seconds**

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://readlyn.vercel.app)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Readlyn-181717?style=for-the-badge&logo=github)](https://github.com/MuhammadTanveerAbbas/Readlyn)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![Vercel AI SDK](https://img.shields.io/badge/Vercel_AI_SDK-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://sdk.vercel.ai)
[![Upstash](https://img.shields.io/badge/Upstash-00C9A7?style=for-the-badge&logo=upstash&logoColor=white)](https://upstash.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev)

</div>

---

<div align="center">
  <img src="public/Readlyn.png" alt="Readlyn" width="100%" />
</div>

---

## Overview

Readlyn turns plain text prompts into professional infographics using Groq AI (Llama 3.3 70B). Instead of spending hours in Canva or Figma, you describe your topic, pick a layout style and theme, and the AI generates a fully structured, pixel-perfect infographic on a Fabric.js canvas ready to export as PNG or JSON. Built for content creators, marketers, and developers who need visual content fast.

---

## ✨ Features

- 🤖 **AI Infographic Generation** Describe any topic and Groq AI (Llama 3.3 70B) generates a complete, data-rich infographic with real facts and statistics
- 🎨 **9 Layout Archetypes** Steps, Stats, Timeline, Compare, List, Pyramid, Funnel, Cycle, or Auto each with mathematically pre-computed element positions
- 🖌️ **5 Color Themes** Violet, Ocean, Ember, Forest, and Slate palettes applied consistently across every generated element
- 📐 **3 Canvas Sizes** A4 Portrait (800×1100), Square (1080×1080), and Wide (1920×600) for any use case
- 🖱️ **Interactive Canvas Editor** Drag, resize, rotate, and edit any element directly on the Fabric.js canvas with select and hand tool modes
- 🔢 **Layers Panel** Full layer management with visibility toggle, lock/unlock, and per-layer deletion
- ⚙️ **Properties Panel** Edit transform (X, Y, W, H, rotation, opacity), fill/stroke colors, border radius, and typography per selected element
- ↩️ **Undo / Redo** Full canvas history with keyboard shortcuts (Cmd+Z / Cmd+Shift+Z)
- 📤 **Export PNG & JSON** Download as high-res PNG or save the raw JSON schema for later
- 🔒 **Auth with Supabase** Email/password sign up, login, forgot password, and protected routes via Next.js proxy
- ⚡ **Streaming Generation** Elements stream to the canvas in real time as the AI generates them
- 🔍 **Zoom Controls** Zoom in/out, fit-to-screen, mouse wheel zoom toward cursor, and pan with hand tool or Space+drag
- 🖼️ **Parallax Studio** Standalone layer-based parallax scene builder with 6 presets, scroll/tilt effects, image upload, and clean HTML/CSS/JS code export

---

## 🎨 Design System

Readlyn uses a hand-crafted dark design language think Resend meets Framer. The entire UI is driven by CSS custom properties defined in `globals.css`:

- **Background scale** `--bg-base` (#080808), `--bg-panel` (#0f0f0f), `--bg-elevated` (#161616). No pure black.
- **Accent (`--accent`: #F5C518)** Used sparingly: primary CTAs, active states, icon containers, and inline accent text only.
- **Semantic tokens** `--text-primary`, `--text-secondary`, `--text-body`, `--text-muted-val`, `--text-dim` for typography; `--destructive`, `--success`, `--purple`, `--blue`, `--orange` for status/accent colors.
- **Typography** Mixed-case headings with tight tracking (`-0.02em` to `-0.03em`). All-caps reserved for labels and badges only.
- **Noise texture** Subtle SVG fractal noise overlay on all pages for depth.
- **Scroll animations** `useReveal()` hook triggers `animate-fade-up` at 15% viewport entry on every section.
- **Micro-interactions** `hover:scale-[1.02] active:scale-[0.98]` on buttons, border brightens + top accent line on cards, yellow focus ring on inputs, chevron rotation on FAQ accordion.
- **Auth pages** Card with deep shadow, labeled inputs, yellow glow submit button, `animate-fade-up` on mount.
- **Canvas editor** Panels at `--bg-panel`, borders at `--border-default`, active tool uses `--accent`, generate button with glow.

---

## 🛠 Tech Stack

| Category             | Technology                                             |
| -------------------- | ------------------------------------------------------ |
| Framework            | Next.js 16 + React 19 + TypeScript                     |
| Styling              | Tailwind CSS v4 + Radix UI                             |
| Canvas               | Fabric.js v6                                           |
| Parallax             | Pure CSS transforms (no extra dependencies)            |
| AI                   | Groq (`llama-3.3-70b-versatile`) via Vercel AI SDK     |
| Rate Limiting        | Upstash Redis (with in-memory fallback for development)|
| Auth & Database      | Supabase (Auth + SSR)                                  |
| Input Sanitization   | isomorphic-dompurify                                   |
| Testing              | Vitest                                                 |
| Fonts                | Space Grotesk + IBM Plex Mono                          |
| Deployment           | Vercel                                                 |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Supabase account
- Groq API key (free at [console.groq.com](https://console.groq.com/keys))

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/MuhammadTanveerAbbas/Readlyn.git
cd Readlyn

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp .env.example .env.local
# Fill in your values (see Environment Variables section below)

# 4. Run the development server
pnpm dev

# 5. Open in browser
http://localhost:3000
```

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory (or copy `.env.example`):

```env
# Required
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
GROQ_API_KEY=your-groq-api-key

# Optional (rate limiting)  https://console.upstash.com/redis
# Without these, rate limiting falls back to an in-memory store.
UPSTASH_REDIS_REST_URL=https://your-upstash-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-upstash-token
```

Get your keys:

- **Supabase:** [https://supabase.com](https://supabase.com) → Project Settings → API
- **Groq:** [https://console.groq.com/keys](https://console.groq.com/keys) → Create API Key (free tier available)
- **Upstash Redis:** [https://console.upstash.com/redis](https://console.upstash.com/redis) → Create a database → Copy REST URL and Token

> `GROQ_API_KEY` is server-side only (no `NEXT_PUBLIC_` prefix). The `NEXT_PUBLIC_` Supabase vars are safe to expose to the browser.

### Testing

```bash
pnpm test        # Run tests
pnpm test:watch  # Watch mode
```

Tests use **Vitest** with path alias resolution (`@/` → `./`). Test files live in `tests/`.

---

## 🛡 Security

- **CSRF Protection** All state-changing API routes (`/api/generate`, `/api/account/delete`, `/api/export-multi`, `/api/keep-alive`) validate the `Origin` header matches the deployed host.
- **Rate Limiting** The `/api/generate` route enforces a daily generation quota (10/day per user by default, configurable in `config/plans.ts`). Uses Upstash Redis in production; falls back to an in-memory `Map` when Upstash env vars are absent.
- **Input Sanitization** Prompt text is stripped of HTML tags and control characters before being sent to the AI. Generated output is sanitized via `isomorphic-dompurify` to prevent XSS.
- **Route Params** All dynamic route segments (`[id]`) are validated as UUIDs via `parseRouteId()`.

---

## ⚙️ Configuration

Usage limits are defined in `config/plans.ts`. The default Free plan allows:
- 5 projects
- 10 AI generations per day
- 50 exports

To adjust limits, edit the `PLANS` object in `config/plans.ts`.

---

### Supabase Setup

After creating your Supabase project, run the schema in `supabase/schema.sql` via the Supabase SQL editor to create the required tables (`projects`, `templates`, `generation_history`) and enable Row Level Security.

---

## 📁 Project Structure

```
readlyn/
├── app/
│   ├── (auth)/              # Login, signup, forgot-password pages
│   ├── (protected)/         # Dashboard + app editor (auth-gated)
│   ├── api/generate/        # AI generation (Vercel AI SDK + CSRF + rate limit + sanitize)
│   ├── globals.css          # Design tokens (CSS custom properties), noise texture, animations
│   └── layout.tsx
├── components/
│   ├── app/                 # Editor UI: Canvas, Toolbar, Layers, Properties, Prompt
│   ├── auth/                # AuthCard with refined dark card design
│   ├── landing/             # Landing page sections (all "use client" with useReveal)
│   ├── parallax/            # Parallax Studio: Preview, ConfigPanel, ImagePicker, ExportModal
│   └── ui/                  # Shared UI primitives
├── hooks/
│   ├── use-canvas-history.ts
│   ├── use-canvas-selection.ts
│   ├── use-reveal.ts        # IntersectionObserver scroll animation hook
│   └── use-mobile.ts
├── lib/
│   ├── archetypeLayouts.ts  # Pre-computed pixel positions for all layout archetypes
│   ├── contentAwareness.ts  # AI content analysis helpers
│   ├── csrf.ts              # Origin + Host CSRF validation for API routes
│   ├── defaultInfographic.ts
│   ├── env.ts               # Environment variable validation
│   ├── exportMultiFormat.ts # PNG / ZIP export logic
│   ├── params.ts            # UUID route param validator
│   ├── rate-limit.ts        # Upstash Redis rate limiter (with in-memory fallback)
│   ├── renderElements.ts    # Fabric.js object factory + canvas renderer
│   ├── sanitize.ts          # Prompt + output sanitization (isomorphic-dompurify)
│   ├── parallax-types.ts    # Parallax Studio types, defaults, constants
│   ├── presets.ts           # 6 parallax scene presets
│   ├── code-generator.ts    # HTML/CSS/JS export for parallax scenes
│   ├── parallax-upload.ts   # Supabase Storage upload for parallax images
│   └── supabase/            # Client, server, middleware helpers
├── types/
│   └── infographic.ts       # Zod schemas + TypeScript types for all element types
├── supabase/
│   └── schema.sql           # Database schema  run this in Supabase SQL editor
├── proxy.ts                 # Auth middleware (route protection)
├── .env.example
└── package.json
```

---

## 📦 Available Scripts

| Command      | Description                |
| ------------ | -------------------------- |
| `pnpm dev`   | Start development server   |
| `pnpm start` | Start production server  |
| `pnpm lint`  | Run ESLint               |
| `pnpm test`  | Run Vitest               |

---

## 🌐 Deployment

This project is deployed on **Vercel**.

### Deploy Your Own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/MuhammadTanveerAbbas/Readlyn)

1. Click the button above
2. Connect your GitHub account
3. Add the following environment variables in the Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GROQ_API_KEY`
   - `UPSTASH_REDIS_REST_URL` (optional — rate limiting)
   - `UPSTASH_REDIS_REST_TOKEN` (optional — rate limiting)
4. Deploy

> The `/api/generate` route uses streaming and has a 60-second max duration this works on Vercel's Hobby plan.

---

## 🗺 Roadmap

- [x] AI infographic generation with Groq (Llama 3.3 70B)
- [x] 9 layout archetypes with pre-computed positions
- [x] Interactive Fabric.js canvas editor
- [x] Layers panel with visibility and lock controls
- [x] Properties panel for transform, color, and typography
- [x] PNG and JSON export
- [x] Supabase authentication
- [x] Streaming partial generation
- [x] Generation history per project
- [x] Multi-format export (PNG, ZIP)
- [x] Parallax Studio layer-based scene builder (scroll/tilt effects)
- [x] CSRF protection on all API routes
- [x] Rate limiting via Upstash Redis (with dev fallback)
- [x] Input sanitization (strip HTML, control chars, DOMPurify)
- [x] UUID validation on all dynamic route params
- [x] CSS custom property design system (no hardcoded hex colors)
- [ ] Real-time team collaboration
- [ ] Custom font upload
- [ ] Figma import
- [ ] More canvas sizes (Instagram Story, Twitter/X banner)
- [ ] Image element support

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 Built by The MVP Guy

<div align="center">

**Muhammad Tanveer Abbas**
SaaS Developer | Building production-ready MVPs in 14 to 21 days

[![Portfolio](https://img.shields.io/badge/Portfolio-themvpguy.vercel.app-black?style=for-the-badge)](https://themvpguy.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-MuhammadTanveerAbbas-181717?style=for-the-badge&logo=github)](https://github.com/MuhammadTanveerAbbas)
[![Twitter](https://img.shields.io/badge/Twitter-@themvpguy-1DA1F2?style=for-the-badge&logo=twitter)](https://x.com/themvpguy)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/muhammadtanveerabbas)

**Repository:** [https://github.com/MuhammadTanveerAbbas/Readlyn](https://github.com/MuhammadTanveerAbbas/Readlyn)

_If this project helped you, please consider giving it a ⭐_

</div>
