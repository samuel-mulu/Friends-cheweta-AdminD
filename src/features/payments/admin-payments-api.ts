import { apiFetch } from '@/lib/api/client';

export type PaymentStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID';
export type DepositChannel = 'CBE' | 'TELEBIRR' | 'AWASH' | 'BOA';
export type PaymentChannel = DepositChannel | 'MANUAL' | 'OTHER';
export type DepositMode = 'MANUAL' | 'AUTOMATIC' | 'LOCAL' | 'LOCAL_WITH_FALLBACK';

export const providerLabels: Record<PaymentChannel, string> = {
  CBE: 'CBE', TELEBIRR: 'Telebirr', AWASH: 'Awash', BOA: 'Bank of Abyssinia', MANUAL: 'Manual', OTHER: 'Other',
};

export const modeLabels: Record<DepositMode, string> = {
  MANUAL: 'Manual',
  AUTOMATIC: 'Automatic',
  LOCAL: 'Local',
  LOCAL_WITH_FALLBACK: 'Local with automatic fallback',
};

interface PaymentUser { id: string; fullName: string; phoneNumber: string }

interface PaymentReview {
  id: string;
  userId: string;
  amountMinor: string;
  channel: PaymentChannel;
  status: PaymentStatus;
  note: string | null;
  reviewedByUserId: string | null;
  reviewedAt: string | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
  user: PaymentUser;
}

export interface AdminDeposit extends PaymentReview {
  transactionReference: string;
  approvalMode: DepositMode | null;
  verificationStatus: string | null;
  lastVerificationCode: string | null;
}

export interface AdminWithdrawal extends PaymentReview {
  destination: string;
  payoutTransactionUrl: string | null;
  paidAt: string | null;
}

export interface DepositConfigInput {
  enabled: boolean;
  approvalMode: DepositMode;
  fallbackThreshold?: number;
  fallbackWindowMinutes?: number;
  fallbackDurationMinutes?: number;
}

export interface DepositProviderConfig extends DepositConfigInput {
  channel: DepositChannel;
  effectiveMode: DepositMode;
  allowedModes: DepositMode[];
  settlementConfigured: boolean;
  fallbackUntil: string | null;
  fallbackReason: string | null;
}

export interface DepositConfig {
  hasApprovalPin: boolean;
  providers: DepositProviderConfig[];
}

export interface SmsBalance {
  enabled: boolean;
  balance: string | null;
  currency: string | null;
}

const base = '/admin/payments';

function query(status?: PaymentStatus, limit = 100) {
  const search = new URLSearchParams({ limit: String(limit) });
  if (status) search.set('status', status);
  return search.toString();
}

export const listDeposits = (status?: PaymentStatus) => apiFetch<AdminDeposit[]>(`${base}/deposits?${query(status)}`);
export const approveDeposit = (id: string, approvalPin: string) =>
  apiFetch<AdminDeposit>(`${base}/deposits/${id}/approve`, { method: 'PATCH', body: JSON.stringify({ approvalPin }) });
export const rejectDeposit = (id: string, reason: string) =>
  apiFetch<AdminDeposit>(`${base}/deposits/${id}/reject`, { method: 'PATCH', body: JSON.stringify({ reason }) });

export const listWithdrawals = (status?: PaymentStatus) => apiFetch<AdminWithdrawal[]>(`${base}/withdrawals?${query(status)}`);
export const approveWithdrawal = (id: string, payoutTransactionUrl: string) =>
  apiFetch<AdminWithdrawal>(`${base}/withdrawals/${id}/approve`, { method: 'PATCH', body: JSON.stringify({ payoutTransactionUrl }) });
export const rejectWithdrawal = (id: string, reason: string) =>
  apiFetch<AdminWithdrawal>(`${base}/withdrawals/${id}/reject`, { method: 'PATCH', body: JSON.stringify({ reason }) });

export const getDepositConfig = () => apiFetch<DepositConfig>(`${base}/deposit-config`);
export const updateDepositConfig = (channel: DepositChannel, input: DepositConfigInput) =>
  apiFetch<DepositConfig>(`${base}/deposit-config/${channel}`, { method: 'PATCH', body: JSON.stringify(input) });
export const resetTelebirrFallback = () =>
  apiFetch<DepositConfig>(`${base}/deposit-config/telebirr/reset-fallback`, { method: 'POST' });
export const changeDepositApprovalPin = (currentPin: string, newPin: string) =>
  apiFetch<{ success: boolean }>(`${base}/deposit-config/change-pin`, { method: 'POST', body: JSON.stringify({ currentPin, newPin }) });
export const getSmsBalance = () => apiFetch<SmsBalance>(`${base}/sms/balance`);
