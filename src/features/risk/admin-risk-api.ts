import { apiFetch } from '@/lib/api/client';
export type RiskStatus='OPEN'|'REVIEWED'|'DISMISSED';
export interface RiskFlag {
  id:string; userId:string|null; matchId:string|null; type:string; severity:string; status:RiskStatus; reason:string; evidence:unknown;
  fingerprint:string; reviewedBy:string|null; reviewedAt:string|null; createdAt:string; updatedAt:string;
  user:{id:string;fullName:string;phoneNumber:string}|null;
  match:{id:string;status:string;createdAt:string;finishedAt:string|null}|null;
}
export const listRiskFlags=(status:RiskStatus|'ALL'='OPEN',limit=100)=>apiFetch<RiskFlag[]>(`/admin/risk-flags?status=${status}&limit=${limit}`);
export const updateRiskFlag=(id:string,status:'REVIEWED'|'DISMISSED')=>apiFetch<RiskFlag>(`/admin/risk-flags/${id}`,{method:'PATCH',body:JSON.stringify({status})});
