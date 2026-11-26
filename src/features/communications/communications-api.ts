import { apiFetch } from '@/lib/api/client';

export const broadcastModes = {
  DISMISSIBLE: 'Dismissible',
  PERSISTENT: 'Persistent',
  FORCED: 'Forced',
} as const;
export type BroadcastMode = keyof typeof broadcastModes;

export const feedbackCategories = {
  FEEDBACK: 'Feedback',
  COMPLAINT: 'Complaint',
  ADVICE: 'Advice',
  OTHER: 'Other',
} as const;
export type FeedbackCategory = keyof typeof feedbackCategories;

export const feedbackStatuses = { OPEN: 'Open', REPLIED: 'Replied', CLOSED: 'Closed' } as const;
export type FeedbackStatus = keyof typeof feedbackStatuses;

export type Broadcast = {
  id: string;
  title: string;
  body: string;
  category: BroadcastMode;
  forcedLive: boolean;
  revision: number;
  createdAt: string;
  updatedAt: string;
  createdBy: { fullName: string } | null;
};

export type Feedback = {
  id: string;
  category: FeedbackCategory;
  status: FeedbackStatus;
  message: string | null;
  adminReply: string | null;
  createdAt: string;
  repliedAt: string | null;
  playerSeenAt: string | null;
  user: { id: string; fullName: string; phoneNumber: string };
  repliedBy: { fullName: string } | null;
};

export const broadcastsKey = ['admin', 'broadcasts'] as const;
export const feedbackKey = ['admin', 'feedback'] as const;
export const feedbackCountKey = [...feedbackKey, 'open-count'] as const;
const broadcasts = '/admin/broadcasts';
const feedback = '/admin/support/messages';

type Page<T> = { items: T[]; hasMore: boolean };

export function listBroadcasts(page: number) {
  return apiFetch<Page<Broadcast> & { active: Broadcast | null }>(`${broadcasts}?page=${page}`);
}

export function publishBroadcast(input: { title: string; body: string; category: BroadcastMode; expectedLiveId?: string | null }) {
  return apiFetch<Broadcast>(broadcasts, { method: 'POST', body: JSON.stringify(input) });
}

export function setForcedBroadcast(id: string, live: boolean, expectedLiveId?: string | null) {
  return apiFetch<Broadcast>(`${broadcasts}/${id}/forced-live`, { method: 'PATCH', body: JSON.stringify({ live, expectedLiveId }) });
}

export const remindBroadcast = (id: string) => apiFetch<Broadcast>(`${broadcasts}/${id}/remind`, { method: 'POST' });
export const deleteBroadcast = (id: string) => apiFetch<{ success: boolean }>(`${broadcasts}/${id}`, { method: 'DELETE' });

export function listFeedback(page: number, status: FeedbackStatus | '', category: FeedbackCategory | '') {
  const params = new URLSearchParams({ page: String(page) });
  if (status) params.set('status', status);
  if (category) params.set('category', category);
  return apiFetch<Page<Feedback>>(`${feedback}?${params}`);
}

export const getFeedback = (id: string) => apiFetch<Feedback>(`${feedback}/${id}`);
export const openFeedbackCount = () => apiFetch<{ count: number }>(`${feedback}/open-count`);

export function updateFeedback(id: string, input: { status?: FeedbackStatus; adminReply?: string }) {
  return apiFetch<Feedback>(`${feedback}/${id}`, { method: 'PATCH', body: JSON.stringify(input) });
}

export function sendPlayerFeedback(userId: string, adminReply: string) {
  return apiFetch<Feedback>(feedback, { method: 'POST', body: JSON.stringify({ userId, adminReply }) });
}
