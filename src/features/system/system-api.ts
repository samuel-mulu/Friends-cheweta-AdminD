import { apiFetch } from '@/lib/api/client';
export interface HealthResponse { status:string; database?:string; redis?:string }
export const getSystemHealth=()=>apiFetch<HealthResponse>('/health');
