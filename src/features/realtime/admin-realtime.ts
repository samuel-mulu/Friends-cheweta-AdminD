'use client';

import { useEffect, useState } from 'react';
import { useAdminSocket } from './admin-realtime-provider';

export interface AdminMatchEvent {
  protocolVersion: number;
  eventId: string;
  serverTime: string;
  matchId: string;
  version: number;
  data: { type?: string; playerId?: string; [key: string]: unknown };
}

export function useAdminRealtime(maxEvents = 100) {
  const { socket, status } = useAdminSocket();
  const [events, setEvents] = useState<AdminMatchEvent[]>([]);

  useEffect(() => {
    if (!socket) return;
    const append = (event: AdminMatchEvent) =>
      setEvents((current) => [event, ...current.filter((item) => item.eventId !== event.eventId)].slice(0, maxEvents));
    socket.on('admin:match_event', append);
    return () => { socket.off('admin:match_event', append); };
  }, [socket, maxEvents]);

  return { status, events, clear: () => setEvents([]) };
}
