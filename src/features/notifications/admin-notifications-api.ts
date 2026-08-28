import { apiFetch } from '@/lib/api/client';

export interface AdminNotification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  data: unknown;
  readAt: string | null;
  createdAt: string;
  user: { id: string; fullName: string; phoneNumber: string; status: string };
}

export function listAdminNotifications(limit = 100, type?: string) {
  const query = new URLSearchParams({ limit: String(limit) });
  if (type) query.set('type', type);
  return apiFetch<AdminNotification[]>(`/admin/notifications?${query}`);
}

export function sendAdminNotification(userId: string, input: { title: string; message: string; type?: string }) {
  return apiFetch<AdminNotification>(`/admin/notifications/users/${userId}`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
