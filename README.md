# Friends Game Hub Admin — A0 to A17

Operational Next.js admin portal for the Friends Game Hub B0-B20 backend.

Implemented end-to-end:

- A0 Foundation & design system
- A1 Admin authentication/session
- A2 Admin shell/navigation
- A3 Executive dashboard
- A4 Players
- A5 Wallet & ledger transactions
- A6 Deposits
- A7 Withdrawals
- A8 Games & Ludo modes
- A9 Matches
- A10 Match replay
- A11 Settlements
- A12 Risk & anti-cheat
- A13 Audit logs
- A14 Notifications
- A15 Realtime operations
- A16 Reports & analytics
- A17 QA, security & production gate

## Run

```bash
cp .env.example .env.local
npm install
npm run typecheck
npm run build
npm run dev
```

Development environment:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=Friends Game Hub
```

Use the accompanying `friends-game-backend-b0-b20-admin-support-a17` backend package for the complete A0-A17 contract.

## Architecture boundary

The admin talks only to NestJS REST/Socket.IO. It never connects directly to PostgreSQL or Redis. Financial changes continue through the existing idempotent backend workflows. Realtime operations are supplemental to durable backend reads.
