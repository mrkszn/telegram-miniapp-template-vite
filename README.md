# telegram-miniapp-template-vite

Reusable **Vite + React + TypeScript** skeleton for Telegram Mini Apps.
Clone via GitHub «Use this template» → set env → replace `src/routes/example/`
with your domain pages → deploy to Vercel.

## Tech stack

| Layer       | Choice                                                                                              |
| ----------- | --------------------------------------------------------------------------------------------------- |
| Build       | Vite 5 + TypeScript strict (`noUncheckedIndexedAccess`)                                             |
| UI          | React 19                                                                                            |
| Router      | `react-router-dom` v7 (data router)                                                                 |
| Styling     | Tailwind CSS 3 + shadcn/ui-style primitives (button, input, badge, card, dialog, sheet, tabs, menu) |
| Charts      | Tremor (`<LineChartCard/>`, `<BarChartCard/>`) — lazy chunk                                         |
| Icons       | lucide-react (24 px grid, stroke 1.75)                                                              |
| Fonts       | Geist Variable + Geist Mono Variable + Instrument Serif (italic)                                    |
| Telegram    | Thin typed wrapper over `window.Telegram.WebApp`                                                    |
| HTTP        | axios + Zustand session store                                                                       |
| Test        | Vitest + @testing-library/react + Playwright                                                        |
| Package mgr | pnpm                                                                                                |
| Host        | Vercel (static SPA)                                                                                 |

## Why Vite, not Next.js

Telegram Mini App is a pure-client SPA inside a WebView. `initData` and JWT
are client-only — SSR is impossible. The critical-path bundle here ships in
under 200 KB (charts split into a separate ~840 KB chunk only loaded by
chart pages). Next.js' baseline is ~500 KB+ before user code.

## Quick start

```bash
# 1. clone via GitHub Use-this-template
gh repo create my-app --template mrkszn/telegram-miniapp-template-vite --public
cd my-app

# 2. install
pnpm install
pnpm approve-builds --all   # one-time, accepts esbuild post-install

# 3. configure backend
cp .env.example .env.local
# edit VITE_API_BASE_URL + VITE_AUTH_ENDPOINT

# 4. dev
pnpm dev                    # http://localhost:5173

# 5. ship
pnpm build                  # static dist/
```

### Replace the example route

The included `src/routes/example/dashboard.tsx` is a generic 4-up KPI grid +
1 line chart, wired through `AppShell` and the auth flow. It exists to prove
the shell renders end-to-end — delete or rename it when you wire up your
own domain pages.

### Deploy on Vercel

1. Push to GitHub.
2. Vercel → New Project → import the repo → framework preset **Vite**.
3. Set `VITE_API_BASE_URL` and `VITE_AUTH_ENDPOINT` in Project Settings → Environment.
4. Deploy. Preview deploys land per PR; `main` is production.
5. BotFather → your bot → Configure Mini App → URL = your Vercel domain.

`vercel.json` already sets:

- SPA fallback `rewrites: /(.*) → /index.html`
- `Content-Security-Policy: frame-ancestors https://web.telegram.org https://*.telegram.org`
- One-year immutable cache on `/assets/*`

## Architecture map

```
src/
  main.tsx                      ← font imports + ThemeProvider mount
  App.tsx                       ← createBrowserRouter([root, example])
  routes/
    root.tsx                    ← bootstrap → loader → redirect to /example/dashboard
    example/dashboard.tsx       ← reference paint (generic mock data)
  components/
    layout/{AppShell,Header,BottomNav,BackButton,ThemeProvider}.tsx
    ui/                         ← shadcn-style primitives backed by Radix
    kpi/KPICard.tsx
    charts/{LineChartCard,BarChartCard,palette}.ts
    chat/{ChatWidget,Message}.tsx
  lib/
    telegram/{sdk,theme,auth}.ts
    state/session-store.ts      ← Zustand: token, user, isReady, error
    api/{client,types}.ts       ← axios + JWT interceptor + ApiError
    hooks/{useAuth,useApi}.ts
  styles/
    tokens.css                  ← Voice + InsightFlow CSS variables
    globals.css                 ← Tailwind layers + .serif-num helper
tests/
  unit/                         ← Vitest (theme, auth, api client, KPICard, ChatWidget)
  e2e/bootstrap.spec.ts         ← Playwright smoke (mock Telegram + auth)
design/                         ← read-only design system input
vercel.json                     ← SPA rewrites + Telegram CSP
```

### Telegram theme bridge

`applyTelegramTheme()` writes both raw `--tg-theme-*` CSS variables AND the
core design tokens (`--bg`, `--surface`, `--ink`, `--primary`, …). That means
existing Tailwind utility classes like `bg-bg` or `text-ink` follow Telegram
chrome automatically — no per-screen branching.

### Auth flow

```
ThemeProvider → useAuth()
              → bootstrapAuth({ apiBaseUrl, authEndpoint })
                  POST {apiBaseUrl}{authEndpoint}  body: { init_data }
                  → { token, user } stored in Zustand
              → root route redirects to /example/dashboard
              → axios attaches Authorization: Bearer <token> via interceptor
              → 401 response clears the store and redirects to /
```

## Scripts

| Script             | What                                                                                                     |
| ------------------ | -------------------------------------------------------------------------------------------------------- |
| `pnpm dev`         | Vite dev server on :5173                                                                                 |
| `pnpm build`       | `tsc -b` + `vite build` → `dist/`                                                                        |
| `pnpm preview`     | Serve the built bundle locally                                                                           |
| `pnpm typecheck`   | `tsc -b --noEmit`                                                                                        |
| `pnpm lint`        | ESLint (flat config)                                                                                     |
| `pnpm format`      | Prettier write                                                                                           |
| `pnpm test`        | Vitest (jsdom)                                                                                           |
| `pnpm test:watch`  | Vitest watch                                                                                             |
| `pnpm test:e2e`    | Playwright smoke (auto-starts `pnpm dev`). First run: `pnpm exec playwright install chromium`. |

## Design system

`design/` is checked in and read-only at runtime. It carries the Voice base
plus the active **InsightFlow** iteration: violet primary `#7c3aed` + cyan
accent `#06b6d4` + Instrument Serif italic headings. Tokens are extracted into
`src/styles/tokens.css` and the Tailwind config; see `design/SKILL.md` for the
hard rules (Lucide icons only, no shadows, 14 px card radius, max 1 emoji
per screen, sentence case + formal «Вы» in Russian).

## License

MIT.
