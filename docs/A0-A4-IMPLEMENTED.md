# A0–A4 Implementation

## A0 — Foundation & design system

- Next.js App Router + React + TypeScript.
- Tailwind CSS with restrained neutral light/dark design tokens.
- Inter typography.
- shadcn-compatible `components.json` and focused UI primitives (`Button`, `Input`, `Card`, `Badge`, `Dialog`, `Skeleton`).
- TanStack Query owns backend server state.
- No Redux or global client store.
- Shared formatting and error/loading primitives.

## A1 — Authentication

The portal consumes the existing B20 backend contract:

- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /users/me`

An account must resolve to role `ADMIN`. The browser does not infer permissions from the route itself.

A single refresh promise prevents multiple simultaneous 401 responses from causing multiple refresh-token rotations.

## A2 — Shell

Desktop-first operations shell with:

- persistent sidebar,
- sticky top bar,
- theme toggle,
- mobile bottom navigation for currently implemented modules,
- future modules shown as non-clickable "Soon" items rather than fake pages.

## A3 — Dashboard

Consumes `GET /admin/dashboard` exactly as supplied by B20 and shows:

- total, active, blocked players,
- live and finished matches,
- pending deposits and withdrawals,
- open risk flags,
- total pot, payouts and platform fees.

No unsupported trend charts are invented because B20 currently returns totals, not time-series data.

## A4 — Players

Consumes:

- `GET /admin/users`
- `GET /admin/users/:id`
- `PATCH /admin/users/:id/status`

The current backend list/detail contract does not include wallet balance, games played, or last-activity fields, so A4 does not fabricate those columns. They can be added when the backend exposes them.

Status changes require a confirmation dialog. The backend remains the authority and records `USER_STATUS_CHANGED` in AuditLog.
