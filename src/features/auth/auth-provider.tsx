'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminSession } from '@/lib/auth/session';
import { getMe, loginAdmin, logoutAdmin } from './auth-api';
import type { AdminUser } from '@/types/api';

type AuthContextValue = { user: AdminUser | null; loading: boolean; login: (phone:string,password:string)=>Promise<void>; logout:()=>Promise<void>; refreshUser:()=>Promise<void> };
const AuthContext = createContext<AuthContextValue | null>(null);
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user,setUser] = useState<AdminUser|null>(null); const [loading,setLoading] = useState(true); const router = useRouter();
  const refreshUser = useCallback(async () => { const me = await getMe(); if (me.role !== 'ADMIN') throw new Error('This account does not have admin access.'); setUser(me); }, []);
  useEffect(() => { (async()=>{ if (!adminSession.getAccessToken() && !adminSession.getRefreshToken()) { setLoading(false); return; } try { await refreshUser(); } catch { adminSession.clear(); setUser(null); } finally { setLoading(false); } })(); }, [refreshUser]);
  const login = useCallback(async(phone:string,password:string)=>{ const session = await loginAdmin(phone,password); if (session.user.role !== 'ADMIN') { adminSession.clear(); throw new Error('This account does not have admin access.'); } adminSession.save(session); setUser(session.user); },[]);
  const logout = useCallback(async()=>{ const token=adminSession.getRefreshToken(); await logoutAdmin(token); adminSession.clear(); setUser(null); router.replace('/login'); },[router]);
  const value=useMemo(()=>({user,loading,login,logout,refreshUser}),[user,loading,login,logout,refreshUser]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth(){ const value=useContext(AuthContext); if(!value) throw new Error('useAuth must be used inside AuthProvider'); return value; }
