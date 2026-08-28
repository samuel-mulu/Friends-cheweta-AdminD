import { apiFetch } from '@/lib/api/client';

export interface AdminGame {
  id: string; code: string; name: string; description: string | null; enabled: boolean; createdAt: string; updatedAt: string;
  _count: { modes: number; matches: number };
}
export interface AdminGameMode {
  id: string; gameId: string; code: string; name: string; playerCount: number; stakeAmountMinor: string;
  platformFeeBps: number; turnDurationSeconds: number; rulesVersion: string; enabled: boolean; createdAt: string; updatedAt: string;
}
export interface CreateGameModeInput {
  gameCode: string; code: string; name: string; playerCount: number; stakeAmountMinor: string; platformFeeBps: number;
  turnDurationSeconds: number; rulesVersion: string; enabled?: boolean;
}
export type UpdateGameModeInput = Partial<Pick<CreateGameModeInput, 'name'|'stakeAmountMinor'|'platformFeeBps'|'turnDurationSeconds'|'enabled'>>;

export const listAdminGames = () => apiFetch<AdminGame[]>('/admin/games');
export const listAdminGameModes = (code: string) => apiFetch<AdminGameMode[]>(`/admin/games/${code}/modes`);
export const createGameMode = (input: CreateGameModeInput) => apiFetch<AdminGameMode>('/admin/games/modes', { method: 'POST', body: JSON.stringify(input) });
export const updateGameMode = (id: string, input: UpdateGameModeInput) => apiFetch<AdminGameMode>(`/admin/games/modes/${id}`, { method: 'PATCH', body: JSON.stringify(input) });
