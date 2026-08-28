# A14-A17 Implemented

## A14 — Notifications

- Cross-player notification operations view using `GET /api/admin/notifications`.
- Targeted admin-to-player operational message using `POST /api/admin/notifications/users/:userId`.
- Targeted only in V1; no mass broadcast button.
- Notification send is audit logged as `NOTIFICATION_SENT`.
- Existing player notification inbox remains the delivery source of truth.

## A15 — Realtime Operations

- Admin connects to the existing `/game` Socket.IO namespace using the current admin JWT.
- `admin:join_operations` requires an authenticated `ADMIN` role and joins `admin:operations`.
- Authoritative Ludo runtime executions emit a lightweight `admin:match_event` copy to the operations room.
- Realtime feed is supplemental: the page also refreshes durable match data every 15 seconds.
- The admin does not join every match room or run a second Ludo state engine.

## A16 — Reports & Analytics

- `GET /api/admin/reports?days=7|30|90` aggregates bounded PostgreSQL data.
- Summary: new players, matches, completion/cancellation, pot, platform fees, payout, approved deposits/withdrawals, risk flags.
- Daily operational series and top game modes.
- No warehouse, Kafka, ETL pipeline, or analytics microservice in V1.

## A17 — QA, Security & Production

- Next.js security headers: no sniffing, frame denial, strict referrer policy, restricted browser permissions.
- `poweredByHeader` disabled.
- Global error and not-found boundaries.
- System & production page polls backend `/health` and shows API/PostgreSQL/Redis status.
- Production env example added.
- `npm run check` runs typecheck + production build.
- Release checklist documented separately.

## Deliberate limits

- Admin tokens still follow the existing B0-B20 auth contract. The browser stores the current admin session in `sessionStorage`; moving refresh tokens to HttpOnly cookies requires an auth contract change and is a future hardening option.
- No mass notification blast.
- No realtime streaming of every token state to every admin session.
- No analytics warehouse.
