# ChronoSpace API

> Production-ready blog platform backend — NestJS · Prisma · PostgreSQL · Redis

[![NestJS](https://img.shields.io/badge/NestJS-11-red)](https://nestjs.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748)](https://prisma.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791)](https://postgresql.org)

---

## Live URLs

| Service  | URL                                               |
| -------- | ------------------------------------------------- |
| API      | `https://chronospace-api.onrender.com`            |
| Frontend | `https://chronospace.vercel.app`                  |
| Health   | `https://chronospace-api.onrender.com/api/health` |

---

## Table of Contents

- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Architecture](#architecture)
- [Database Design](#database-design)
- [Security](#security)
- [Async Jobs](#async-jobs)
- [Tradeoffs](#tradeoffs)
- [What I Would Improve](#what-i-would-improve)
- [Scaling to 1M Users](#scaling-to-1m-users)

---

## Setup Instructions

### Prerequisites

- Node.js ≥ 18
- pnpm ≥ 8
- PostgreSQL ≥ 14
- Redis ≥ 6.2 (or Upstash for production)

### Local Development

```bash
# 1. Clone and install
git clone https://github.com/your-username/chronospace
cd chronospace/chronospace-api
pnpm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your DATABASE_URL, JWT_SECRET, REDIS_HOST

# 3. Run database migrations
pnpm prisma migrate dev

# 4. Start development server
pnpm start:dev
```

Server starts on `http://localhost:3001`

### Production Build

```bash
pnpm build       # runs prisma generate && nest build
pnpm start:prod  # runs node dist/main
```

---

## Environment Variables

| Variable         | Required | Default                 | Description                  |
| ---------------- | -------- | ----------------------- | ---------------------------- |
| `DATABASE_URL`   | ✅       | —                       | PostgreSQL connection string |
| `JWT_SECRET`     | ✅       | —                       | Secret key for JWT signing   |
| `JWT_EXPIRES_IN` | ❌       | `7d`                    | JWT token expiration         |
| `PORT`           | ❌       | `3001`                  | HTTP server port             |
| `NODE_ENV`       | ❌       | `development`           | Runtime environment          |
| `FRONTEND_URL`   | ❌       | `http://localhost:3000` | CORS origin                  |
| `REDIS_HOST`     | ❌       | `localhost`             | Redis host for BullMQ        |
| `REDIS_PORT`     | ❌       | `6379`                  | Redis port                   |
| `REDIS_PASSWORD` | ❌       | —                       | Redis auth password          |

---

## API Reference

### Authentication

| Method | Endpoint             | Auth | Description              |
| ------ | -------------------- | ---- | ------------------------ |
| POST   | `/api/auth/register` | ❌   | Register new user        |
| POST   | `/api/auth/login`    | ❌   | Login and receive JWT    |
| GET    | `/api/auth/me`       | ✅   | Get current user profile |

### Blog Management (Private Dashboard)

| Method | Endpoint         | Auth | Description                  |
| ------ | ---------------- | ---- | ---------------------------- |
| POST   | `/api/blogs`     | ✅   | Create blog                  |
| GET    | `/api/blogs`     | ✅   | List all my blogs            |
| GET    | `/api/blogs/:id` | ✅   | Get single blog (owner only) |
| PATCH  | `/api/blogs/:id` | ✅   | Update blog (owner only)     |
| DELETE | `/api/blogs/:id` | ✅   | Delete blog (owner only)     |

### Likes & Comments

| Method | Endpoint                  | Auth | Description           |
| ------ | ------------------------- | ---- | --------------------- |
| POST   | `/api/blogs/:id/like`     | ✅   | Like a blog           |
| DELETE | `/api/blogs/:id/like`     | ✅   | Unlike a blog         |
| POST   | `/api/blogs/:id/comments` | ✅   | Add comment to blog   |
| GET    | `/api/blogs/:id/comments` | ✅   | Get comments for blog |

### Public Routes

| Method | Endpoint                  | Auth | Description                       |
| ------ | ------------------------- | ---- | --------------------------------- |
| GET    | `/api/public/feed`        | ❌   | Paginated public feed             |
| GET    | `/api/public/blogs/:slug` | ❌   | Get single published blog by slug |

#### Feed Query Parameters

| Param   | Type   | Default | Description               |
| ------- | ------ | ------- | ------------------------- |
| `page`  | number | `1`     | Page number               |
| `limit` | number | `10`    | Results per page (max 50) |

### Health

| Method | Endpoint           | Auth | Description                          |
| ------ | ------------------ | ---- | ------------------------------------ |
| GET    | `/api/health`      | ❌   | Full health check (DB, memory, disk) |
| GET    | `/api/health/ping` | ❌   | Lightweight liveness probe           |

---

## Architecture

```
src/
├── main.ts                    # Bootstrap: ValidationPipe, GlobalFilter, CORS
├── app.module.ts              # Root module: ThrottlerGuard, BullMQ, Pino
│
├── common/
│   ├── constants/
│   │   └── queue.constants.ts # Queue & job name constants
│   ├── decorators/
│   │   └── current-user.decorator.ts
│   ├── filters/
│   │   └── http-exception.filter.ts  # Global error shape
│   └── utils/
│       └── slug.util.ts       # Slug generation + collision handling
│
├── prisma/
│   ├── prisma.module.ts       # @Global() — injected everywhere
│   └── prisma.service.ts      # PrismaClient with PrismaPg adapter
│
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts     # POST /register, POST /login, GET /me
│   ├── auth.service.ts        # bcrypt hash, JWT sign, user validation
│   ├── dto/                   # RegisterDto, LoginDto
│   ├── guards/
│   │   └── jwt-auth.guard.ts
│   ├── strategies/
│   │   └── jwt.strategy.ts    # Passport JWT, validates user from DB
│   └── types/
│       └── jwt-payload.type.ts
│
├── blogs/
│   ├── blogs.module.ts
│   ├── blogs.controller.ts    # Full CRUD + likes + comments
│   ├── blogs.service.ts       # Business logic + queue enqueue
│   └── dto/
│       ├── create-blog.dto.ts
│       ├── update-blog.dto.ts
│       └── create-comment.dto.ts
│
├── public/
│   ├── public.module.ts
│   ├── public.controller.ts   # GET /feed, GET /blogs/:slug
│   ├── public.service.ts      # N+1-free feed with _count aggregation
│   └── dto/
│       └── feed-query.dto.ts
│
├── jobs/
│   ├── jobs.module.ts
│   ├── processors/
│   │   └── blog.processor.ts  # BullMQ worker: generates blog summary
│   └── types/
│       └── blog-job.types.ts
│
└── health/
    ├── health.module.ts
    └── health.controller.ts   # GET /health, GET /health/ping
```

### Key Architectural Decisions

**Global PrismaModule** — decorated with `@Global()` so `PrismaService` is available in every module without re-importing, following the NestJS singleton pattern.

**Ownership in Service Layer** — Blog ownership checks (`userId === blog.userId`) live in `BlogsService`, not in a separate guard. This keeps authorization co-located with business logic and makes the intent explicit.

**N+1 Elimination** — The public feed uses Prisma's `_count` select to return `likeCount` and `commentCount` in a single SQL query with a `GROUP BY`. No secondary queries per blog.

**Parallel Read Queries** — Feed pagination uses `Promise.all([findMany, count])` to fetch the blog list and total count concurrently, cutting response time roughly in half vs sequential queries.

**Async Summary Generation** — Publishing a blog enqueues a BullMQ job with a 1 second delay and `jobId: summary-{blogId}` for automatic deduplication. The HTTP response returns immediately; the worker processes summary generation out-of-band.

**Slug Collision Strategy** — Slugs are generated from the blog title. On collision, a base-36 timestamp suffix is appended (`my-title-1x2y3z`), keeping URLs human-readable without blocking the write.

---

## Database Design

```
User ──< Blog ──< Like
              └──< Comment
```

| Table     | Key Constraints                        | Key Indexes                          |
| --------- | -------------------------------------- | ------------------------------------ |
| `User`    | `email UNIQUE`, `username UNIQUE`      | —                                    |
| `Blog`    | `slug UNIQUE`, FK `userId → User`      | `userId`, `isPublished`, `createdAt` |
| `Like`    | UNIQUE `(userId, blogId)`, FK both     | `blogId`                             |
| `Comment` | FK `blogId → Blog`, FK `userId → User` | `blogId`, `createdAt`                |

The `@@unique([userId, blogId])` constraint on `Like` enforces one-like-per-user at the **database level** — not just application logic — making duplicate likes impossible even under concurrent requests.

---

## Security

| Concern                      | Implementation                                              |
| ---------------------------- | ----------------------------------------------------------- |
| Password storage             | bcrypt with 12 salt rounds                                  |
| Authentication               | JWT Bearer tokens via `@nestjs/passport`                    |
| Token validation             | Every request hits DB to confirm user still exists          |
| Input validation             | `class-validator` + `ValidationPipe` with `whitelist: true` |
| Unauthorized edit prevention | Ownership check in service before every mutation            |
| Duplicate like prevention    | DB-level `UNIQUE(userId, blogId)` constraint                |
| Sensitive data exposure      | `passwordHash` never included in any response `select`      |
| User enumeration             | Login always returns generic `"Invalid credentials"`        |
| Rate limiting                | `@nestjs/throttler` — 429 on violation, applied globally    |
| CORS                         | Restricted to `FRONTEND_URL` environment variable           |

---

## Async Jobs

When a blog is published (either on creation with `isPublished: true`, or when `PATCH` sets `isPublished: true`), a `generate-summary` job is enqueued in Redis via BullMQ:

```
HTTP Request
    │
    ▼
BlogsService.create() / update()
    │
    ├─── blog saved to DB ──────────────────► 201/200 response (immediate)
    │
    └─── blogQueue.add('generate-summary') ─► Redis
                                                  │
                                            BullMQ Worker
                                                  │
                                        Strip markdown → 300 char excerpt
                                                  │
                                        prisma.blog.update({ summary })
                                                  │
                                        Pino: "Job completed in Xms"
```

**Job configuration:**

- `attempts: 3` with exponential backoff (2s, 4s, 8s)
- `jobId: summary-{blogId}` — prevents duplicate jobs for same blog
- `delay: 1000ms` — lets the DB write fully settle before reading
- Last 50 completed + 100 failed jobs retained for debugging

---

## Tradeoffs

| Decision                                           | Tradeoff                                                                                    |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| JWT stateless, no refresh tokens                   | Simpler auth flow; tokens cannot be revoked before expiry                                   |
| Offset-based pagination                            | Simple to implement; becomes slower beyond ~10k rows — cursor pagination preferred at scale |
| Slug from title with timestamp suffix on collision | Human-readable URLs; suffix is slightly ugly but avoids 409 errors                          |
| Comments not paginated                             | Acceptable for MVP; unbounded at scale                                                      |
| No soft deletes                                    | Simpler queries and schema; deleted data is unrecoverable                                   |
| Summary generated from content via regex           | No AI/NLP dependency; lower quality than semantic summarization                             |

---

## What I Would Improve

- **Refresh token rotation** — store refresh tokens in Redis with revocation support
- **Cursor-based pagination** — replace offset pagination with `cursor` + `take` for consistent performance at scale
- **Full-text search** — PostgreSQL `tsvector` + `tsquery` for blog discovery, or Meilisearch for typo-tolerant search
- **AI-powered summaries** — replace regex summary with OpenAI/Gemini API call in the BullMQ processor
- **Swagger/OpenAPI docs** — auto-generated from decorators via `@nestjs/swagger`
- **Email verification** — confirm email on register before allowing publish
- **Role-based access** — admin role to moderate/remove any blog
- **Soft deletes** — `deletedAt` timestamp for content recovery and audit trail
- **Comment pagination** — cursor-based to handle high-volume posts
- **WebSocket notifications** — real-time like/comment updates via `@nestjs/websockets`

---

## Scaling to 1M Users

| Layer                  | Bottleneck                       | Strategy                                                                            |
| ---------------------- | -------------------------------- | ----------------------------------------------------------------------------------- |
| **Database reads**     | Feed queries under load          | Read replicas for all `SELECT`; write only to primary                               |
| **Connection pool**    | Too many DB connections          | PgBouncer in transaction mode; Prisma Accelerate for serverless                     |
| **Feed caching**       | Repeated identical feed queries  | Redis cache `GET /public/feed` with 60s TTL; invalidate on new publish              |
| **Horizontal scaling** | Single server CPU limit          | Stateless NestJS (JWT = no sticky sessions); scale behind load balancer             |
| **Job queue**          | Summary jobs piling up           | Multiple BullMQ worker replicas consuming from same Redis queue                     |
| **Rate limiting**      | App-layer throttling too late    | Move to edge (Cloudflare WAF / API Gateway) before traffic hits app                 |
| **Search**             | PostgreSQL LIKE queries at scale | Dedicated search service (Meilisearch / Elasticsearch)                              |
| **Media/assets**       | Binary uploads in DB             | S3-compatible object storage (Cloudflare R2) with CDN in front                      |
| **Observability**      | Blind to production issues       | Pino → Loki → Grafana for logs; Prometheus + Grafana for metrics; Sentry for errors |
| **Database schema**    | Hot rows on popular blogs        | Denormalize `likeCount` as cached column, updated via DB trigger or job             |
