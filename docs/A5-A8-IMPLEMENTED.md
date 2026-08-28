# Admin A5-A8 implemented

## A5 — Wallet & Transactions
- Read-only cross-player ledger table.
- Search by player, phone, transaction/reference ID.
- Transaction-type filter.
- Available/locked balance after each ledger entry plus deltas.
- Player detail shows available and locked balances when the support endpoint is present.
- No admin balance-edit action exists.

## A6 — Deposits
- PENDING / APPROVED / REJECTED filters.
- Player, amount, channel, transaction reference and review state.
- Explicit approval confirmation.
- Rejection reason required before reject.
- Backend remains responsible for idempotency, wallet credit, notification and audit.

## A7 — Withdrawals
- PENDING / APPROVED / REJECTED filters.
- Player, amount, channel and destination visibility.
- Explicit approval/rejection confirmation.
- UI does not calculate wallet release/consumption locally.

## A8 — Games & Ludo Modes
- Admin game catalog including disabled games via the minimal support endpoint.
- All Ludo modes including disabled modes.
- Create new Ludo 1v1 mode.
- Edit name, stake, fee and turn duration.
- Enable/disable mode.
- Rules version and player count are deliberately not freely editable after creation.

## Backend contract note
The original B0-B20 backend did not expose admin wallet-ledger reads or disabled game/mode lists. The companion `friends-game-backend-b0-b20-admin-support.zip` adds only these read endpoints; gameplay and financial mutation behavior are unchanged.
