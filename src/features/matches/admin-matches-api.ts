import { apiFetch } from '@/lib/api/client';

export type MatchStatus = 'CREATED'|'READY'|'PLAYING'|'FINISHING'|'FINISHED'|'CANCELLED';

export interface MatchUser { id: string; fullName: string; phoneNumber?: string }
export interface MatchParticipant {
  id?: string;
  userId: string;
  seat: number;
  resultPosition: number | null;
  joinedAt?: string;
  finishedAt?: string | null;
  user: MatchUser;
}
export interface MatchEntry { id: string; userId: string; amountMinor: string; status: string; lockedAt: string; refundedAt?: string|null; settledAt?: string|null }
export interface MatchSettlement {
  id: string;
  matchId: string;
  winnerUserId: string;
  potAmountMinor: string;
  platformFeeMinor: string;
  payoutAmountMinor: string;
  winnerOrder: unknown;
  settledAt: string;
}
export interface AdminMatch {
  id: string;
  status: MatchStatus;
  rulesVersion: string;
  stakeAmountMinor: string;
  platformFeeBps: number;
  entrySecuredAt?: string|null;
  cancelledAt?: string|null;
  cancellationReason?: string|null;
  winnerOrder?: unknown;
  resultVersion?: number|null;
  createdAt: string;
  startedAt?: string|null;
  finishedAt?: string|null;
  updatedAt: string;
  game: { code: string; name: string };
  gameMode: { code: string; name: string };
  participants: MatchParticipant[];
  entries?: MatchEntry[];
  settlement: MatchSettlement | null;
}
export interface MatchEvent { id: string; matchId: string; sequence: number; version: number; commandId?: string|null; type: string; payload: unknown; createdAt: string }
export interface ReplayResponse { match: AdminMatch; events: MatchEvent[]; checkpoint: { version: number; state: unknown; updatedAt: string } | null }
export interface AdminSettlement extends MatchSettlement {
  match: {
    id: string; status: MatchStatus; stakeAmountMinor: string; platformFeeBps: number; createdAt: string; startedAt?: string|null; finishedAt?: string|null;
    game: { code: string; name: string };
    gameMode: { code: string; name: string };
    participants: MatchParticipant[];
  };
  winner: MatchUser | null;
}

export function listAdminMatches(status?: MatchStatus, limit=100) {
  const q = new URLSearchParams({ limit: String(limit) });
  if (status) q.set('status', status);
  return apiFetch<AdminMatch[]>(`/admin/matches?${q}`);
}
export const getAdminMatch = (id: string) => apiFetch<AdminMatch>(`/admin/matches/${id}`);
export const getAdminReplay = (id: string) => apiFetch<ReplayResponse>(`/admin/matches/${id}/replay`);
export function listAdminSettlements(limit=100) { return apiFetch<AdminSettlement[]>(`/admin/settlements?limit=${limit}`); }
