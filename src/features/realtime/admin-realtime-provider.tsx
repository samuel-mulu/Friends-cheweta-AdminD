'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { io, type Socket } from 'socket.io-client';
import { getMe } from '@/features/auth/auth-api';
import { broadcastsKey, feedbackKey } from '@/features/communications/communications-api';
import { adminSession } from '@/lib/auth/session';
import { getRuntimeClientConfig } from '@/lib/config/client-config';

export type AdminRealtimeStatus = 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED' | 'ERROR';
const AdminSocket = createContext<{ socket: Socket | null; status: AdminRealtimeStatus }>({ socket: null, status: 'DISCONNECTED' });

export function AdminRealtimeProvider({ children }: { children: ReactNode }) {
  const query = useQueryClient();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [status, setStatus] = useState<AdminRealtimeStatus>('CONNECTING');

  useEffect(() => {
    let connection: Socket | undefined;
    let disposed = false;
    let attemptedRefresh = false;
    const refreshBroadcasts = () => void query.invalidateQueries({ queryKey: broadcastsKey });
    const refreshFeedback = () => void query.invalidateQueries({ queryKey: feedbackKey });
    const reconcile = () => { refreshBroadcasts(); refreshFeedback(); };

    void getRuntimeClientConfig().then(({ socketUrl }) => {
      if (disposed) return;
      const instance = io(`${socketUrl}/game`, {
        transports: ['websocket'],
        auth: (send) => send({ token: adminSession.getAccessToken() }),
        reconnection: true,
        autoConnect: false,
      });
      connection = instance;
      instance.on('connect', () => setStatus('CONNECTING'));
      instance.on('session:ready', () => {
        attemptedRefresh = false;
        instance.timeout(5000).emit('admin:join_operations', {}, (error: Error | null, response?: { ok: boolean }) => {
          if (disposed) return;
          setStatus(!error && response?.ok ? 'CONNECTED' : 'ERROR');
          if (!error && response?.ok) reconcile();
        });
      });
      instance.on('broadcast:changed', refreshBroadcasts);
      instance.on('feedback:changed', refreshFeedback);
      instance.on('disconnect', () => setStatus('DISCONNECTED'));
      instance.on('connect_error', () => setStatus('ERROR'));
      instance.on('session:error', () => {
        setStatus('ERROR');
        if (attemptedRefresh) return;
        attemptedRefresh = true;
        void getMe().then(() => { if (!disposed) instance.connect(); }).catch(() => undefined);
      });
      setSocket(instance);
      instance.connect();
    }).catch(() => { if (!disposed) setStatus('ERROR'); });

    return () => {
      disposed = true;
      connection?.removeAllListeners();
      connection?.disconnect();
    };
  }, [query]);

  return <AdminSocket.Provider value={{ socket, status }}>{children}</AdminSocket.Provider>;
}

export const useAdminSocket = () => useContext(AdminSocket);
