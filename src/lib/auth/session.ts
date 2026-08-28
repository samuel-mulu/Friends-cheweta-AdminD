import type { AdminUser, AuthResponse } from '@/types/api';

const ACCESS = 'friends_admin_access';
const REFRESH = 'friends_admin_refresh';
const USER = 'friends_admin_user';

export const adminSession = {
  getAccessToken: () => typeof window === 'undefined' ? null : sessionStorage.getItem(ACCESS),
  getRefreshToken: () => typeof window === 'undefined' ? null : sessionStorage.getItem(REFRESH),
  getUser: (): AdminUser | null => {
    if (typeof window === 'undefined') return null;
    const raw = sessionStorage.getItem(USER);
    try { return raw ? JSON.parse(raw) as AdminUser : null; } catch { return null; }
  },
  save: (session: AuthResponse) => {
    sessionStorage.setItem(ACCESS, session.accessToken);
    sessionStorage.setItem(REFRESH, session.refreshToken);
    sessionStorage.setItem(USER, JSON.stringify(session.user));
  },
  updateTokens: (accessToken: string, refreshToken: string) => {
    sessionStorage.setItem(ACCESS, accessToken);
    sessionStorage.setItem(REFRESH, refreshToken);
  },
  clear: () => {
    sessionStorage.removeItem(ACCESS);
    sessionStorage.removeItem(REFRESH);
    sessionStorage.removeItem(USER);
  },
};
