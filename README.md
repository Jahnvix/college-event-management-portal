# CampusPulse

CampusPulse is a college event management portal for event discovery, registrations, announcements, and administration.

## Stack

- Next.js App Router, React, TypeScript, Tailwind CSS
- Prisma with MongoDB Atlas
- NextAuth credentials authentication
- Resend for transactional email

## Local Setup

1. Install Node.js 20 or newer.
2. Copy `.env.example` to `.env.local` and fill in the required values.
3. Run `npm install`.
4. Run `npm run db:push` to synchronize the Prisma schema with MongoDB.
5. Start the app with `npm run dev`.

## Quality Gates

```bash
npm run lint
npm run type-check
npm test
npm run build
```

## Environment Variables

`DATABASE_URL`, `AUTH_SECRET`, `NEXT_PUBLIC_APP_URL`, `RESEND_API_KEY`, `EMAIL_FROM`, and optional Cloudinary values are documented in `.env.example`. Never commit `.env.local`.

## Architecture

- `src/app`: routes and API handlers
- `src/features`: product modules and UI composition
- `src/components`: shared UI and layouts
- `src/server`: database, auth, email, and domain services
- `prisma/schema.prisma`: MongoDB data model

See `docs/architecture.md` and `docs/database.md` for the detailed boundaries and schema reference.

## Deployment

Deploy to Vercel with the same environment variables configured in Project Settings. Use MongoDB Atlas for the database and Resend for email delivery. The included `Dockerfile` and `docker-compose.yml` support container deployment.

## Screenshots

Add product screenshots here after deploying the dashboard and event pages.
