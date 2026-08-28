import { apiFetch } from '@/lib/api/client';

export type WalletTransactionType =
  | 'DEPOSIT' | 'WITHDRAWAL' | 'WITHDRAWAL_LOCK' | 'WITHDRAWAL_RELEASE' | 'WITHDRAWAL_PAYOUT'
  | 'GAME_ENTRY_LOCK' | 'GAME_ENTRY_RELEASE' | 'GAME_ENTRY_SPEND' | 'GAME_WIN' | 'GAME_FEE'
  | 'REFUND' | 'ADMIN_ADJUSTMENT';

export interface AdminWallet {
  id: string;
  currency: string;
  availableBalance: string;
  lockedBalance: string;
  createdAt: string;
  updatedAt: string;
  user: { id: string; fullName: string; phoneNumber: string; status: 'ACTIVE' | 'BLOCKED' };
}

export interface AdminWalletTransaction {
  id: string;
  walletId: string;
  currency: string;
  type: WalletTransactionType;
  amountMinor: string;
  availableDelta: string;
  lockedDelta: string;
  availableBalanceBefore: string;
  availableBalanceAfter: string;
  lockedBalanceBefore: string;
  lockedBalanceAfter: string;
  referenceType: string | null;
  referenceId: string | null;
  idempotencyKey: string;
  metadata: unknown;
  createdAt: string;
  user: { id: string; fullName: string; phoneNumber: string };
}

export function getAdminWallet(userId: string) {
  return apiFetch<AdminWallet>(`/admin/wallet/users/${userId}`);
}

export function listAdminWalletTransactions(params: { type?: WalletTransactionType; userId?: string; limit?: number } = {}) {
  const search = new URLSearchParams();
  if (params.type) search.set('type', params.type);
  if (params.userId) search.set('userId', params.userId);
  search.set('limit', String(params.limit ?? 100));
  return apiFetch<AdminWalletTransaction[]>(`/admin/wallet/transactions?${search.toString()}`);
}
