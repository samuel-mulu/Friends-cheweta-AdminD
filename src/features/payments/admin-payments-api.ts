import { apiFetch } from '@/lib/api/client';

export type PaymentStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type PaymentChannel = 'CBE' | 'TELEBIRR' | 'MANUAL' | 'OTHER';
export interface PaymentUser { id: string; fullName: string; phoneNumber: string }
export interface AdminDeposit {
  id: string; userId: string; amountMinor: string; channel: PaymentChannel; transactionReference: string;
  status: PaymentStatus; note: string | null; reviewedByUserId: string | null; reviewedAt: string | null;
  rejectionReason: string | null; createdAt: string; updatedAt: string; user: PaymentUser;
}
export interface AdminWithdrawal {
  id: string; userId: string; amountMinor: string; channel: PaymentChannel; destination: string;
  status: PaymentStatus; note: string | null; reviewedByUserId: string | null; reviewedAt: string | null;
  rejectionReason: string | null; createdAt: string; updatedAt: string; user: PaymentUser;
}

function query(status?: PaymentStatus, limit = 100) {
  const search = new URLSearchParams({ limit: String(limit) });
  if (status) search.set('status', status);
  return search.toString();
}
export const listDeposits = (status?: PaymentStatus) => apiFetch<AdminDeposit[]>(`/admin/payments/deposits?${query(status)}`);
export const approveDeposit = (id: string) => apiFetch<AdminDeposit>(`/admin/payments/deposits/${id}/approve`, { method: 'PATCH' });
export const rejectDeposit = (id: string, reason: string) => apiFetch<AdminDeposit>(`/admin/payments/deposits/${id}/reject`, { method: 'PATCH', body: JSON.stringify({ reason }) });
export const listWithdrawals = (status?: PaymentStatus) => apiFetch<AdminWithdrawal[]>(`/admin/payments/withdrawals?${query(status)}`);
export const approveWithdrawal = (id: string) => apiFetch<AdminWithdrawal>(`/admin/payments/withdrawals/${id}/approve`, { method: 'PATCH' });
export const rejectWithdrawal = (id: string, reason: string) => apiFetch<AdminWithdrawal>(`/admin/payments/withdrawals/${id}/reject`, { method: 'PATCH', body: JSON.stringify({ reason }) });
