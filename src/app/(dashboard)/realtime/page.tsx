'use client';
import { useQuery } from '@tanstack/react-query';
import { Activity, Wifi, WifiOff } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RealtimeFeed } from '@/components/realtime/realtime-feed';
import { useAdminRealtime } from '@/features/realtime/admin-realtime';
import { listAdminMatches } from '@/features/matches/admin-matches-api';

export default function RealtimePage(){const live=useQuery({queryKey:['admin','matches','live-ops'],queryFn:()=>listAdminMatches(undefined,100),refetchInterval:15000});const rt=useAdminRealtime();const liveMatches=(live.data??[]).filter(m=>['READY','PLAYING','FINISHING'].includes(m.status));return <><PageHeader eyebrow='Live operations' title='Realtime operations' description='Lightweight authoritative match-event feed plus periodic durable live-match reconciliation. This is an operations view, not a second game client.' actions={<Button variant='outline' onClick={rt.clear}>Clear feed</Button>}/><div className='mb-5 grid gap-4 sm:grid-cols-3'><Card><CardContent className='flex items-center gap-3 pt-5'>{rt.status==='CONNECTED'?<Wifi className='h-5 w-5 text-primary'/>:<WifiOff className='h-5 w-5 text-muted-foreground'/>}<div><div className='text-xs uppercase tracking-wide text-muted-foreground'>Socket</div><div className='font-semibold'>{rt.status}</div></div></CardContent></Card><Card><CardContent className='flex items-center gap-3 pt-5'><Activity className='h-5 w-5 text-primary'/><div><div className='text-xs uppercase tracking-wide text-muted-foreground'>Live matches</div><div className='font-semibold'>{liveMatches.length}</div></div></CardContent></Card><Card><CardContent className='pt-5'><div className='text-xs uppercase tracking-wide text-muted-foreground'>Feed events</div><div className='mt-1 text-lg font-semibold'>{rt.events.length}</div></CardContent></Card></div><RealtimeFeed events={rt.events}/></>}
