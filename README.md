# telegram-miniapp-template-vite

Reusable **Vite + React + TypeScript** skeleton for Telegram Mini Apps.
Clone via GitHub «Use this template» → set env → replace `src/routes/example/`
with your domain pages → deploy to Vercel.

> **Status:** scaffolding-in-progress (Phase 4B). Until the first 7 commits land,
> this repo only contains the `design/` system (Voice base + InsightFlow iteration).
> Follow `scripts/phase_4b_prompt.md` in the sibling repo
> [`telegram-waiter`](https://github.com/mrkszn/feedback--analyst) for the build plan.

## Tech stack (locked)

| Layer | Choice |
|---|---|
| Build | Vite 5 + TypeScript strict |
| UI | React 19 |
| Router | `react-router-dom` v7 |
| Styling | Tailwind CSS + shadcn/ui |
| Charts | Tremor (`<LineChart/>`, `<BarChart/>`) |
| Icons | lucide-react (24 px grid, stroke 1.75) |
| Fonts | `@fontsource-variable/geist` + `@fontsource-variable/geist-mono` + `@fontsource/instrument-serif` |
| Telegram | `@twa-dev/sdk` |
| HTTP | axios + Zustand auth store |
| Test | Vitest + Playwright |
| Package mgr | pnpm |
| Host | Vercel (static SPA) |

## Why Vite, not Next.js

Telegram Mini App is a pure-client SPA inside a WebView. `initData` and JWT
are client-only — SSR is impossible. Vite ships ~200 KB vs Next ~500 KB+
baseline, which matters for cold-load UX in the WebView. There is a parallel
Next.js template at [`telegram-miniapp-template`](https://github.com/mrkszn/telegram-miniapp-template)
kept for projects that genuinely need SSR (SEO landings, etc.) — this one is
the recommended starting point for admin Mini Apps.

## Design system

`design/` is checked in and read-only at runtime — implementer of Phase 4B
extracts CSS variables from `design/iterations/insightflow/theme.css` into
`src/styles/tokens.css` and Tailwind config. See `design/iterations/README.md`
for the active iteration (violet primary `#7c3aed` + cyan accent `#06b6d4` +
Instrument Serif italic headings). Hard rules in `design/SKILL.md`.

## What lives here vs. in an instance

✅ Template (this repo):
- AppShell (Header 44 px + BottomNav 56 px + Telegram theme bridge + safe-area)
- Telegram WebApp SDK wrapper (initData → auth endpoint → JWT → Zustand store)
- axios client with JWT interceptor + generic types
- Generic primitives: `KPICard`, `LineChartCard`, `BarChartCard`, `ChatWidget`, `Message`, `Sheet`, `Chip`, `Avatar`, `Header`, `BottomNav`
- ONE example route (`src/routes/example/dashboard.tsx`) proving the shell works
- `vercel.json` with SPA rewrites + Telegram `frame-ancestors` CSP

❌ Domain pages, domain API types, domain copy → live in the **instance** repo
(see the [`telegram-waiter-admin-miniapp`](https://github.com/mrkszn/telegram-waiter-admin-miniapp) example, Phase 4C).

## Quick start (once template is built)

```bash
# clone via GitHub Use-this-template
gh repo create my-app --template mrkszn/telegram-miniapp-template-vite --public
cd my-app
pnpm install
cp .env.example .env.local   # set VITE_API_BASE_URL + VITE_AUTH_ENDPOINT
pnpm dev                     # localhost:5173
```

For production:
1. Push to GitHub.
2. Vercel → New Project → import the repo → framework preset `Vite`.
3. Set `VITE_API_BASE_URL`, `VITE_AUTH_ENDPOINT`, `VITE_APP_ENV=production` in Vercel env.
4. Deploy. Vercel auto-deploys on every push to main, preview-deploys per PR.
5. BotFather → your bot → Configure Mini App → URL = your Vercel domain.

## License

MIT (added in Phase 4B).
