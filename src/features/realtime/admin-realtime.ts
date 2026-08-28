'use client';
import { useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import { adminSession } from '@/lib/auth/session';
import { getRuntimeClientConfig } from '@/lib/config/client-config';

export type AdminRealtimeStatus='DISCONNECTED'|'CONNECTING'|'CONNECTED'|'ERROR';
export interface AdminMatchEvent { protocolVersion:number; eventId:string; serverTime:string; matchId:string; version:number; data:{type?:string;playerId?:string;[key:string]:unknown} }

export function useAdminRealtime(maxEvents=100){
  const [status,setStatus]=useState<AdminRealtimeStatus>('DISCONNECTED');
  const [events,setEvents]=useState<AdminMatchEvent[]>([]);
  const socketRef=useRef<Socket|null>(null);
  useEffect(()=>{
    const token=adminSession.getAccessToken(); if(!token) return;
    let cancelled=false;
    setStatus('CONNECTING');
    void getRuntimeClientConfig().then(({ socketUrl })=>{
      if(cancelled) return;
      const socket=io(`${socketUrl}/game`,{transports:['websocket'],auth:{token},reconnection:true,reconnectionDelay:1000,reconnectionDelayMax:5000});
      socketRef.current=socket;
      socket.on('connect',()=>{setStatus('CONNECTED');socket.emit('admin:join_operations',{},(ack:{ok?:boolean})=>{if(!ack?.ok)setStatus('ERROR');});});
      socket.on('disconnect',()=>setStatus('DISCONNECTED'));
      socket.on('connect_error',()=>setStatus('ERROR'));
      socket.on('session:error',()=>setStatus('ERROR'));
      socket.on('admin:match_event',(event:AdminMatchEvent)=>setEvents(current=>[event,...current.filter(item=>item.eventId!==event.eventId)].slice(0,maxEvents)));
    }).catch(()=>{ if(!cancelled) setStatus('ERROR'); });
    return ()=>{cancelled=true;socketRef.current?.removeAllListeners();socketRef.current?.disconnect();socketRef.current=null;};
  },[maxEvents]);
  return {status,events,clear:()=>setEvents([])};
}
