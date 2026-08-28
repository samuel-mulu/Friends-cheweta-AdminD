# Admin QA, Security & Production Gate

Before production:

1. `npm ci`
2. `npm run typecheck`
3. `npm run build`
4. Verify backend B0-B20 + admin-support A17 builds/tests.
5. Verify `GET /api/health` reports API, PostgreSQL and Redis healthy.
6. Use HTTPS for admin, REST API and Socket.IO.
7. Restrict backend CORS to the real admin/player origins.
8. Use strong JWT secrets and production environment variables.
9. Verify only ACTIVE ADMIN accounts can access admin APIs and `admin:join_operations`.
10. Verify blocked/non-admin users receive 401/403 and cannot join the operations room.
11. Test deposit/withdraw approval confirmations and idempotent backend behavior.
12. Test notification send and audit entry.
13. Test realtime operations reconnect; durable polling must still show live matches if Socket.IO is unavailable.
14. Test reports for 7, 30 and 90 days.
15. Verify database backups and rollback procedure.
16. Verify Nginx/Vercel proxy supports WebSocket upgrades for `/game`.
17. Verify production logs do not expose JWTs, passwords or refresh tokens.
18. Use a dedicated admin domain and restrict indexing where appropriate.

Do not treat the admin UI as a security boundary. The NestJS backend remains responsible for authentication, role checks, financial invariants and audit.
