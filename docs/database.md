# Phase 2 Database Design

## Overview

Phase 2 establishes the persistence layer for CampusPulse using Prisma with MongoDB. The schema is designed to support the later authentication, event management, student dashboard, admin workflow, notification, and analytics phases without forcing structural rewrites.

## Why MongoDB With Prisma

1. MongoDB fits the assignment requirements while handling flexible content such as event agendas, FAQs, notification metadata, and rich announcement payloads.
2. Prisma provides a strongly typed client for the Next.js application and enforces a central schema contract for every future API and feature module.
3. The data model is organized around ownership boundaries so dependent records cascade when deletion is strictly correct, while audit history is preserved with `SetNull` where traceability matters more than hard ownership.

## Core Models

- `User`: authentication identity, role, lifecycle state, and first-class ownership for sessions, accounts, registrations, bookmarks, notifications, events, and authored announcements.
- `Profile`: student-facing profile details and notification preferences in a one-to-one relation with `User`.
- `Event`: scheduling, venue, capacity, moderation, and discovery metadata for each campus event.
- `Registration`: event attendance lifecycle with approval, cancellation, waitlist, and QR-token support.
- `Announcement`: global or event-scoped communications with draft, scheduled, and published states.
- `Bookmark`: idempotent user-to-event bookmark relation.
- `Notification`: in-app and email-oriented delivery records for user-facing updates.
- `AuditLog`: append-only operational trail for sensitive actions across the platform.
- `Account`, `Session`, `VerificationToken`: Auth.js-compatible persistence models for Phase 3 authentication work.

## Referential Strategy

- Cascade delete is used for tightly owned records such as profiles, sessions, accounts, bookmarks, registrations, notifications, and organizer-owned events.
- `Announcement.event` uses `SetNull` so an announcement can survive even if an event is removed after publication.
- `AuditLog.actor` uses `SetNull` to preserve security history even if the originating user record is later deleted or anonymized.

## Index Strategy

- `User`: role/status filtering and creation timeline lookups.
- `Profile`: student discovery by department and year.
- `Event`: organizer access, discovery by category/status, and registration deadline filtering.
- `Registration`: unique user-event constraint plus event and user status lookups.
- `Announcement`: publication scheduling, author access, and event-level filtering.
- `Notification`: unread queries and chronological inbox access.
- `AuditLog`: actor, entity, and action investigation paths.

## Scripts

- `npm run db:generate`
- `npm run db:validate`
- `npm run db:push`
- `npm run db:studio`

`db:push` is intentionally the sync mechanism for this phase because MongoDB with Prisma does not use SQL-style migrations.
