# ChronoSpace Web

> Production-ready blog platform frontend — Next.js 15 · TypeScript · Tailwind CSS · Framer Motion

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)](https://tailwindcss.com)
[![React](https://img.shields.io/badge/React-19-61dafb)](https://react.dev)

---

## Live URLs

| Service  | URL |
|----------|-----|
| Frontend | `https://chrono-space-zeta.vercel.app` |
| API      | `` |

---

## Table of Contents

- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Routes](#routes)
- [Architecture](#architecture)
- [Component Design](#component-design)
- [Auth Flow](#auth-flow)
- [State Management](#state-management)
- [API Layer](#api-layer)
- [Tradeoffs](#tradeoffs)
- [What I Would Improve](#what-i-would-improve)
- [Scaling to 1M Users](#scaling-to-1m-users)

---

## Setup Instructions

### Prerequisites

- Node.js ≥ 18
- pnpm ≥ 8
- ChronoSpace API running (see `chronospace-api/README.md`)

### Local Development

```bash
# 1. Navigate to frontend
cd chronospace/chronospace-web

# 2. Install dependencies
pnpm install

# 3. Configure environment
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL to your running backend

# 4. Start development server
pnpm dev
```

App starts on `http://localhost:3000`

### Production Build

```bash
pnpm build    # type-check + static analysis + bundle
pnpm start    # starts production server
```

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | ✅ | `http://localhost:3001/api` | Backend API base URL |

---

## Routes

| Route | Auth | Description |
|-------|------|-------------|
| `/` | ❌ | Landing page with hero + features |
| `/register` | ❌ | Create new account |
| `/login` | ❌ | Sign in with email + password |
| `/feed` | ❌ | Paginated public blog feed |
| `/blog/:slug` | ❌ | Public blog reader with comments |
| `/dashboard` | ✅ | Overview stats + recent blogs |
| `/dashboard/blogs` | ✅ | Manage all blogs with filter tabs |
| `/dashboard/new` | ✅ | Create blog with live preview |
| `/dashboard/edit/:id` | ✅ | Edit existing blog |

Route protection is handled at two levels:

- **Middleware** (`middleware.ts`) — reads `chronospace_token` cookie, redirects before page loads
- **Layout guard** (`dashboard/layout.tsx`) — client-side check after Zustand rehydration, shows spinner until confirmed

---

## Architecture

```
chronospace-web/
├── app/                          # Next.js App Router pages
│   ├── (auth)/                   # Route group — login, register
│   ├── (dashboard)/dashboard/    # Protected route group
│   ├── feed/                     # Public feed page
│   ├── blog/[slug]/              # Public blog reader
│   ├── layout.tsx                # Root layout — all providers
│   ├── page.tsx                  # Landing page
│   ├── not-found.tsx             # Custom 404
│   ├── error.tsx                 # Global error boundary page
│   └── loading.tsx               # Global loading UI
│
├── components/
│   ├── landing/                  # Hero, Features, CTA sections
│   ├── layout/                   # Navbar, Footer, ThemeToggle
│   ├── blog/                     # BlogCard, BlogEditor, BlogRow, BlogSkeleton
│   ├── feed/                     # Pagination
│   ├── social/                   # LikeButton, CommentForm, CommentList
│   └── common/                   # LoadingSpinner, EmptyState, ErrorBoundary, Toast
│
├── lib/
│   ├── api/                      # Axios client + typed API modules
│   ├── hooks/                    # React Query + mutation hooks
│   ├── store/                    # Zustand auth store with persistence
│   └── providers/                # QueryProvider, ThemeProvider
│
├── types/
│   └── index.ts                  # All shared TypeScript interfaces
│
└── middleware.ts                 # Edge route protection via cookie
```

### Key Architectural Decisions

**App Router Route Groups** — `(auth)` and `(dashboard)` are route groups that share layouts without appearing in the URL. The dashboard group has its own layout with sidebar, header, and auth guard — completely isolated from public pages.

**Zustand + Cookie Dual Write** — Auth token is written to both `localStorage` (via Zustand persist) and a cookie (via `document.cookie`). The cookie enables server-side middleware route protection. On page reload, `onRehydrateStorage` re-syncs the cookie from the persisted token.

**Hydration-Safe Auth Guard** — Zustand's `_hasHydrated` flag prevents the dashboard from redirecting to login on first render before the store has loaded from localStorage. A full-screen spinner shows during the ~50ms hydration window.

**React Query for Server State** — All API data lives in React Query. Zustand is used only for auth state. This separation keeps server cache (stale-while-revalidate, pagination, invalidation) separate from client-only state (who is logged in).

**Optimistic Likes** — Like mutations update the React Query cache immediately before the API call completes. On error, the optimistic update is rolled back. This gives instant UI feedback with no latency.

---

## Component Design

| Component | Location | Key Behaviour |
|-----------|----------|---------------|
| `BlogEditor` | `components/blog/` | Write/Preview tabs, word count, save draft vs publish |
| `BlogCard` | `components/blog/` | Animated feed card, hover accent line, author + meta |
| `BlogRow` | `components/blog/` | Dashboard list row, confirm-before-delete, status badge |
| `LikeButton` | `components/social/` | Optimistic toggle, burst particle animation on like |
| `CommentForm` | `components/social/` | Expand-on-focus, character counter, auth gate |
| `CommentList` | `components/social/` | Sorted newest-first, avatar initials, skeleton loading |
| `Pagination` | `components/feed/` | Ellipsis logic, keeps previous page visible while fetching |
| `Navbar` | `components/layout/` | Glassmorphism on scroll, hydration-safe auth buttons |
| `ThemeToggle` | `components/layout/` | Animated sun/moon swap, mounted guard for SSR |
| `Toast` | `components/common/` | 4 variants, slide-in from right, auto-dismiss at 4s |
| `ErrorBoundary` | `components/common/` | Class component, catches render errors, Try Again button |

---

## Auth Flow

```
Register / Login
      │
      ▼
authApi.register() / authApi.login()
      │
      ▼
useAuthStore.setAuth(user, token)
      │
      ├── localStorage.setItem('chronospace_token', token)
      ├── document.cookie = 'chronospace_token=...'  ← for middleware
      └── Zustand state: { user, token, isAuthenticated: true }
            │
            ▼
      router.push('/dashboard')
            │
            ▼
      middleware.ts reads cookie → allows /dashboard
            │
            ▼
      DashboardLayout checks _hasHydrated → renders content
```

### On Page Reload

```
Zustand persist reads localStorage
      │
      ▼
onRehydrateStorage → re-sets cookie + sets _hasHydrated: true
      │
      ▼
DashboardLayout spinner disappears → content renders
```

---

## State Management

| State | Tool | Location | Why |
|-------|------|----------|-----|
| Auth user + token | Zustand | `lib/store/auth.store.ts` | Persisted, synchronous, readable across tree |
| Blog list / feed | React Query | `lib/hooks/useBlogs.ts` | Cache, background refetch, stale-while-revalidate |
| Like counts | React Query | `lib/hooks/useLike.ts` | Optimistic updates with rollback on error |
| Comments | React Query | `lib/hooks/useComments.ts` | Auto-refetch, no manual polling needed |
| UI (menus, tabs) | useState | Component-local | No need to hoist ephemeral UI state |
| Theme | next-themes | ThemeProvider | CSS class toggle on `<html>`, no flash on reload |

---

## API Layer

All API calls go through a single Axios instance at `lib/api/client.ts`:

- **Request interceptor** — reads token from `localStorage`, injects `Authorization: Bearer <token>` header automatically
- **Response interceptor** — on `401`, clears auth state + cookie and redirects to `/login`
- **Typed modules** — `auth.ts`, `blogs.ts`, `public.ts` each export typed functions that return the data directly (`.then(r => r.data)`)

```
Component / Hook
      │
      ▼
React Query (useQuery / useMutation)
      │
      ▼
API Module (lib/api/blogs.ts)
      │
      ▼
Axios instance (lib/api/client.ts) ── token injected here
      │
      ▼
NestJS API (chronospace-api)
```

---

## Tradeoffs

| Decision | Tradeoff |
|----------|----------|
| Token in localStorage + cookie | Cookie enables SSR middleware guard; localStorage avoids cookie size limits |
| Client-side route guard (Zustand) | Requires spinner on hydration; eliminates flash-of-wrong-content after first load |
| Offset pagination on feed | Simple implementation; cursor pagination preferred for consistent UX at scale |
| `react-markdown` for blog rendering | Zero build step; no syntax highlighting — `rehype-highlight` would improve code blocks |
| No rich text editor (WYSIWYG) | Markdown is simpler and more portable; non-technical users may prefer a visual editor |
| No image upload support | Scope kept to text content; S3 + presigned URLs is the natural next step |
| Comments not paginated on public blog | Acceptable for MVP; unbounded at high comment volume |

---

## What I Would Improve

- **Rich text editor** — replace plain textarea with Tiptap or `@uiw/react-md-editor` for WYSIWYG markdown
- **Syntax highlighting** — add `rehype-highlight` or `rehype-pretty-code` for code blocks in blog content
- **Image uploads** — drag-and-drop cover images via S3-compatible storage with preview in editor
- **Infinite scroll** — replace pagination on feed with `useInfiniteQuery` + IntersectionObserver
- **Real-time comments** — WebSocket connection to see new comments without refresh
- **Optimistic comment posting** — add comment to UI before API response (same pattern as likes)
- **Blog search** — filter feed by title/author using a debounced search input
- **PWA support** — service worker + manifest for offline reading of cached blogs
- **E2E tests** — Playwright tests covering register → create blog → publish → public view flow
- **Storybook** — isolated component development and visual regression testing

---

## Scaling to 1M Users

| Layer | Bottleneck | Strategy |
|-------|-----------|----------|
| Feed rendering | Large DOM on slow devices | Virtualize feed with `@tanstack/virtual` — only render visible cards |
| Static generation | All pages client-rendered | Move public blog pages to `generateStaticParams` + ISR — serve from CDN edge |
| Bundle size | Large JS bundle on first load | Dynamic imports for framer-motion, react-markdown, editor components |
| Image optimization | Unoptimized cover images | Next.js `<Image>` with Cloudflare R2 + CDN; `sizes` prop for responsive loading |
| Auth at edge | Middleware runs on every request | Move JWT verification to Vercel Edge Middleware with lightweight Jose library (no Node.js) |
| Feed caching | Identical feed fetched by every visitor | SWR with stale-while-revalidate headers from API; shared cache across tabs |
| Analytics | No visibility into user behaviour | Vercel Analytics + Web Vitals monitoring; Sentry for client-side error tracking |
| Accessibility | Screen reader / keyboard navigation gaps | Full ARIA labels, focus trapping in modals, keyboard navigation for all interactive components |