import { apiFetch } from '@/lib/api/client'; import type { DashboardSummary } from '@/types/api';
export const getDashboardSummary=()=>apiFetch<DashboardSummary>('/admin/dashboard');
