import { apiFetch } from '@/lib/api/client';
export interface AuditLog { id:string; actorUserId:string|null; action:string; entityType:string; entityId:string|null; metadata:unknown; requestId:string|null; createdAt:string; actor:{id:string;fullName:string;phoneNumber:string}|null }
export const listAuditLogs=(action?:string,limit=100)=>{const q=new URLSearchParams({limit:String(limit)});if(action)q.set('action',action);return apiFetch<AuditLog[]>(`/admin/audit?${q}`)};
