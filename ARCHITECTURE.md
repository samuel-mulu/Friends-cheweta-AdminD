# Friends Game Hub Admin Architecture — A0-A17

## Client

- Next.js App Router + React 19 + TypeScript
- Tailwind CSS and small shadcn-compatible primitives
- TanStack Query for server state
- React Hook Form/Zod where forms need structured validation
- Socket.IO client only for the A15 lightweight operations feed

## State ownership

- NestJS/PostgreSQL: durable users, money, matches, settlements, notifications, risk, audit, reports.
- NestJS/Redis: active runtime and realtime fan-out.
- TanStack Query: admin REST cache and invalidation.
- Local React state: filters, dialogs, forms and transient realtime feed.

## Security

The browser is not an authorization boundary. Every admin REST endpoint and operations-room subscription is checked by NestJS using authenticated `ADMIN` role state. Financial invariants are enforced only by backend services.

## Realtime

A15 joins `admin:operations` through the existing `/game` namespace. The server publishes lightweight copies of authoritative match events. The admin page also polls durable live-match state, so socket loss does not become operational truth loss.

## Analytics

A16 uses bounded 1-90 day PostgreSQL aggregation. No warehouse is introduced until usage proves the need.
