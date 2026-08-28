export type UserRole = 'PLAYER' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'BLOCKED';

export interface AdminUser {
  id: string;
  fullName: string;
  phoneNumber: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AdminUser;
}

export interface DashboardSummary {
  users: { totalPlayers: number; activePlayers: number; blockedPlayers: number };
  matches: { live: number; finished: number };
  payments: { pendingDeposits: number; pendingWithdrawals: number };
  risk: { openFlags: number };
  settlements: { totalPotMinor: string; totalPlatformFeeMinor: string; totalPayoutMinor: string };
}

export interface ApiErrorBody { code?: string; message?: string; details?: unknown; }
