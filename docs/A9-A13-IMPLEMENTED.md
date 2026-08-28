# A9-A13 Implemented

## A9 — Matches

- `/matches` operational table
- status filter for CREATED / READY / PLAYING / FINISHING / FINISHED / CANCELLED
- participants, mode, stake, winner, settlement visibility
- `/matches/[id]` detail page
- entry/escrow status and settlement summary

## A10 — Match Replay

- `/matches/[id]/replay`
- reads durable `MatchEvent` history from the B17 backend
- sequence, event type, version, timestamp, and expandable payload
- checkpoint version shown for recovery/debug context
- intentionally not a second visual Ludo engine

## A11 — Settlements

- `/settlements`
- read-only exactly-once settlement view
- match/mode, winner, pot, platform fee, payout, settled timestamp
- no "pay again" or manual settlement mutation action

## A12 — Risk & Anti-Cheat

- `/risk`
- OPEN / REVIEWED / DISMISSED / ALL filters
- player, type, severity, reason, match, timestamp
- Review and Dismiss actions use the existing audited backend endpoint
- risk flags remain investigation signals; the UI does not auto-ban players or change money

## A13 — Audit Logs

- `/audit`
- read-only administrative action history
- admin actor, action, entity, entity ID, request ID, timestamp, metadata
- optional exact-action filter

## Architecture boundary

The admin remains an operations client. It never reads PostgreSQL/Redis directly and never calculates gameplay, wallet, or settlement truth locally.
