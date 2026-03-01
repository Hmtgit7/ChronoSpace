# ChronoSpace

> A production-ready, full-stack blog platform — write privately, publish publicly, engage socially.

[![Live](https://img.shields.io/badge/Live-chrono--space--zeta.vercel.app-success)](https://chrono-space-zeta.vercel.app)
[![API](https://img.shields.io/badge/API-chronospace--ymqn.onrender.com-blue)](https://chronospace-ymqn.onrender.com/api/health)
[![GitHub](https://img.shields.io/badge/GitHub-hmtgit7%2Fchronospace-181717?logo=github)](https://github.com/hmtgit7/chronospace)

---

## Live Demo

| Service  | URL                                             |
| -------- | ----------------------------------------------- |
| Frontend | https://chrono-space-zeta.vercel.app            |
| API      | https://chronospace-ymqn.onrender.com           |
| Health   | https://chronospace-ymqn.onrender.com/api/health |
| GitHub   | https://github.com/hmtgit7/chronospace          |

---

## What Is ChronoSpace?

ChronoSpace is a secure, full-stack blog platform where users can:

- ✍️ **Write** blogs in a Markdown editor with live preview
- 🔒 **Manage** drafts privately from a personal dashboard
- 🌐 **Publish** to a public feed visible to everyone
- ❤️ **Like** and 💬 **comment** on other writers' posts
- 🌓 Switch between **dark and light** themes
- 📱 Use the platform on **any device** — fully responsive

---

## Monorepo Structure

```
chronospace/
├── chronospace-api/     # NestJS backend (TypeScript, Prisma, PostgreSQL, Redis)
│   └── README.md        # Backend setup, API reference, architecture
│
└── chronospace-web/     # Next.js 15 frontend (TypeScript, Tailwind, Framer Motion)
    └── README.md        # Frontend setup, routes, component design
```

---

## Tech Stack

### Backend (`chronospace-api`)

| Layer          | Technology                     |
| -------------- | ------------------------------ |
| Framework      | NestJS 11                      |
| Language       | TypeScript 5 (strict mode)     |
| Database       | PostgreSQL 16                  |
| ORM            | Prisma 7 with PrismaPg adapter |
| Authentication | JWT + Passport + bcrypt        |
| Job Queue      | BullMQ + Redis                 |
| Rate Limiting  | `@nestjs/throttler`            |
| Logging        | Pino + pino-pretty (dev)       |
| Health Checks  | `@nestjs/terminus`             |
| Deployment     | Render                         |

### Frontend (`chronospace-web`)

| Layer      | Technology                                  |
| ---------- | ------------------------------------------- |
| Framework  | Next.js 15 (App Router)                     |
| Language   | TypeScript 5 (strict mode)                  |
| Styling    | Tailwind CSS v4 + shadcn/ui                 |
| Animation  | Framer Motion                               |
| State      | Zustand (auth) + React Query (server state) |
| Forms      | React Hook Form + Zod                       |
| HTTP       | Axios                                       |
| Theme      | next-themes (dark / light)                  |
| Deployment | Vercel                                      |

---

## Quick Start

### Prerequisites

- Node.js ≥ 18
- pnpm ≥ 8
- PostgreSQL ≥ 14
- Redis ≥ 6.2

### 1 — Clone the repository

```bash
git clone https://github.com/hmtgit7/chronospace
cd chronospace
```

### 2 — Start the backend

```bash
cd chronospace-api
pnpm install
cp .env.example .env          # fill in DATABASE_URL, JWT_SECRET, REDIS_*
pnpm prisma migrate dev
pnpm start:dev                # → http://localhost:3001
```

### 3 — Start the frontend

```bash
cd ../chronospace-web
pnpm install
cp .env.example .env.local    # set NEXT_PUBLIC_API_URL=http://localhost:3001/api
pnpm dev                      # → http://localhost:3000
```

Both servers must run simultaneously. See each sub-package README for full details.

---

## Feature Matrix

| Feature                       | Status | Notes                                     |
| ----------------------------- | ------ | ----------------------------------------- |
| User registration             | ✅     | Email + username + bcrypt password        |
| JWT authentication            | ✅     | 7-day expiry, stateless                   |
| Protected dashboard routes    | ✅     | Middleware + client-side guard            |
| Create / edit / delete blogs  | ✅     | Owner-only, slug auto-generated           |
| Draft / publish toggle        | ✅     | `isPublished` flag, visible in editor     |
| Public feed (paginated)       | ✅     | N+1-free, sorted by newest first          |
| Public blog page by slug      | ✅     | 404 on unpublished or missing             |
| Like system                   | ✅     | One-per-user enforced at DB level         |
| Comment system                | ✅     | Auth required, sorted newest first        |
| Optimistic UI for likes       | ✅     | Instant toggle with rollback on error     |
| Async blog summary generation | ✅     | BullMQ + Redis, non-blocking              |
| API rate limiting             | ✅     | 429 responses via `@nestjs/throttler`     |
| Structured logging            | ✅     | Pino with redacted auth headers           |
| Dark / light theme            | ✅     | Persisted, no flash on reload             |
| Responsive design             | ✅     | Mobile-first, tested at all breakpoints   |
| Global error handling         | ✅     | Consistent error shape, no stack leaks    |
| Health check endpoints        | ✅     | DB + memory + disk via `@nestjs/terminus` |
| Refresh tokens                | ❌     | Planned improvement                       |
| Image uploads                 | ❌     | Planned improvement                       |
| Full-text search              | ❌     | Planned improvement                       |

---

## Architecture Overview

```
Browser (Next.js)
      │
      │  HTTPS
      ▼
Vercel Edge (middleware — JWT cookie check)
      │
      ▼
Next.js App Router
  ├── Public pages  (/, /feed, /blog/:slug)   — no auth
  └── Dashboard     (/dashboard/*)            — JWT required
      │
      │  REST API (Axios + Bearer token)
      ▼
NestJS API (Render)
  ├── ThrottlerGuard    — rate limiting on every request
  ├── ValidationPipe    — DTO validation, whitelist: true
  ├── GlobalExceptionFilter — consistent error responses
  ├── JwtAuthGuard      — passport-jwt on protected routes
  │
  ├── AuthModule        — register, login, /me
  ├── BlogsModule       — CRUD + likes + comments
  ├── PublicModule      — feed + blog by slug
  ├── JobsModule        — BullMQ summary processor
  └── HealthModule      — terminus health checks
      │
      ├── PostgreSQL (Neon / Supabase)
      │     └── Prisma ORM with PrismaPg adapter
      │
      └── Redis (Upstash)
            └── BullMQ job queue
```

---

## Deployment

### Backend → Render

1. Connect GitHub repo to Render
2. Set **Root Directory** to `chronospace-api`
3. **Build command:** `pnpm install && pnpm build`
4. **Start command:** `pnpm start:prod`
5. Add all environment variables from `.env.example`

### Frontend → Vercel

1. Import GitHub repo into Vercel
2. Set **Root Directory** to `chronospace-web`
3. Add environment variable: `NEXT_PUBLIC_API_URL=https://chronospace-ymqn.onrender.com/api`
4. Deploy — Vercel auto-detects Next.js

### Database → Neon / Supabase / Railway

Any PostgreSQL provider works. Set the connection string as `DATABASE_URL` in the backend env vars.

### Redis → Upstash

Free tier covers development and low-traffic production. Set `REDIS_HOST`, `REDIS_PORT`, and `REDIS_PASSWORD` from the Upstash dashboard.

---

## Repository

**GitHub:** https://github.com/hmtgit7/chronospace

Commit history follows conventional commits format. Each phase of development (auth, blogs CRUD, public feed, async jobs, frontend foundation, dashboard, public pages) is committed separately for clear audit trail.
