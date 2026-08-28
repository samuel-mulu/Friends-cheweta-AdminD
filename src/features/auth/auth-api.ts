import { apiFetch } from '@/lib/api/client';
import type { AdminUser, AuthResponse } from '@/types/api';
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';
export async function loginAdmin(phoneNumber: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/login`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ phoneNumber, password, deviceName:'Friends Admin Web' }) });
  const data = await response.json();
  if (!response.ok) throw new Error(data?.message ?? 'Login failed.');
  return data as AuthResponse;
}
export const getMe = () => apiFetch<AdminUser>('/users/me');
export async function logoutAdmin(refreshToken: string | null) { if (!refreshToken) return; try { await fetch(`${API_URL}/auth/logout`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ refreshToken }) }); } catch {} }
