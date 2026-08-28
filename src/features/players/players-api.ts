import { apiFetch } from '@/lib/api/client'; import type { AdminUser, UserStatus } from '@/types/api';
export const listPlayers=()=>apiFetch<AdminUser[]>('/admin/users');
export const getPlayer=(id:string)=>apiFetch<AdminUser>(`/admin/users/${id}`);
export const updatePlayerStatus=(id:string,status:UserStatus)=>apiFetch<AdminUser>(`/admin/users/${id}/status`,{method:'PATCH',body:JSON.stringify({status})});
