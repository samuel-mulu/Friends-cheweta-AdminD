import { adminSession } from '@/lib/auth/session';
import { CLIENT_API_BASE } from '@/lib/config/client-config';
import type { ApiErrorBody } from '@/types/api';

let refreshPromise: Promise<boolean> | null = null;

export class ApiError extends Error {
  constructor(public status: number, public code: string, message: string, public details?: unknown) { super(message); }
}

async function refreshSession(): Promise<boolean> {
  if (refreshPromise) return refreshPromise;
  refreshPromise = (async () => {
    const refreshToken = adminSession.getRefreshToken();
    if (!refreshToken) return false;
    const response = await fetch(`${CLIENT_API_BASE}/auth/refresh`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ refreshToken }),
    });
    if (!response.ok) { adminSession.clear(); return false; }
    const data = await response.json() as { accessToken: string; refreshToken: string };
    adminSession.updateTokens(data.accessToken, data.refreshToken);
    return true;
  })().finally(() => { refreshPromise = null; });
  return refreshPromise;
}

export async function apiFetch<T>(path: string, init: RequestInit = {}, allowRetry = true): Promise<T> {
  const token = adminSession.getAccessToken();
  const headers = new Headers(init.headers);
  if (!headers.has('Content-Type') && init.body) headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const response = await fetch(`${CLIENT_API_BASE}${path}`, { ...init, headers, cache: 'no-store' });
  if (response.status === 401 && allowRetry && await refreshSession()) return apiFetch<T>(path, init, false);
  if (!response.ok) {
    let body: ApiErrorBody = {};
    try { body = await response.json(); } catch {}
    if (response.status === 401) adminSession.clear();
    throw new ApiError(response.status, body.code ?? 'REQUEST_FAILED', body.message ?? 'Request failed.', body.details);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
