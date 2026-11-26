'use client';
import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '@/components/layout/page-header';
import { NotificationTable } from '@/components/notifications/notification-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ErrorState } from '@/components/feedback/error-state';
import { Skeleton } from '@/components/ui/skeleton';
import { listPlayers } from '@/features/players/players-api';
import { listAdminNotifications, sendAdminNotification } from '@/features/notifications/admin-notifications-api';

export default function NotificationsPage(){
  const qc=useQueryClient();
  const [playerId,setPlayerId]=useState(''); const [title,setTitle]=useState(''); const [message,setMessage]=useState(''); const [type,setType]=useState('ADMIN_MESSAGE');
  const notifications=useQuery({queryKey:['admin','notifications'],queryFn:()=>listAdminNotifications(100)});
  const players=useQuery({queryKey:['admin','players'],queryFn:listPlayers});
  const selected=useMemo(()=>players.data?.find(p=>p.id===playerId),[players.data,playerId]);
  const send=useMutation({mutationFn:()=>sendAdminNotification(playerId,{title,message,type}),onSuccess:async()=>{setTitle('');setMessage('');await Promise.all([qc.invalidateQueries({queryKey:['admin','notifications']}),qc.invalidateQueries({queryKey:['admin','audit']})]);}});
  const canSend=Boolean(playerId&&title.trim()&&message.trim()&&!send.isPending);
  return <><PageHeader eyebrow='Player communication' title='Notifications' description='Review player alerts and send targeted operational messages.' />
  <div className='grid gap-5 xl:grid-cols-[360px_1fr]'><Card><CardHeader><div className='font-semibold'>Send to one player</div><p className='mt-1 text-sm text-muted-foreground'>Targeted messages reduce accidental mass communication.</p></CardHeader><CardContent className='space-y-4'><label className='block text-sm font-medium'>Player<select className='mt-2 h-10 w-full rounded-lg border bg-background px-3 text-sm' value={playerId} onChange={e=>setPlayerId(e.target.value)}><option value=''>Select player</option>{players.data?.filter(p=>p.role==='PLAYER').map(p=><option key={p.id} value={p.id}>{p.fullName} · {p.phoneNumber}</option>)}</select></label><label className='block text-sm font-medium'>Type<Input className='mt-2' value={type} onChange={e=>setType(e.target.value)} /></label><label className='block text-sm font-medium'>Title<Input className='mt-2' maxLength={120} value={title} onChange={e=>setTitle(e.target.value)} placeholder='Account or game update' /></label><label className='block text-sm font-medium'>Message<textarea className='mt-2 min-h-28 w-full resize-y rounded-lg border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring' maxLength={1000} value={message} onChange={e=>setMessage(e.target.value)} placeholder='Write a concise operational message.'/></label>{selected&&<div className='rounded-lg bg-muted p-3 text-xs text-muted-foreground'>Sending to <span className='font-semibold text-foreground'>{selected.fullName}</span>.</div>}<Button className='w-full' disabled={!canSend} onClick={()=>send.mutate()}>{send.isPending?'Sending…':'Send notification'}</Button>{send.isError&&<p className='text-sm text-destructive'>{send.error instanceof Error?send.error.message:'Could not send notification.'}</p>}</CardContent></Card>
  <div>{notifications.isLoading?<Skeleton className='h-[520px]'/>:notifications.isError||!notifications.data?<ErrorState message='Could not load notifications.' onRetry={()=>void notifications.refetch()}/>:<NotificationTable items={notifications.data}/>}</div></div></>;
}
