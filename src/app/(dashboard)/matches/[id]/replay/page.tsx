'use client';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '@/components/layout/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/feedback/error-state';
import { ReplayTimeline } from '@/components/matches/replay-timeline';
import { getAdminReplay } from '@/features/matches/admin-matches-api';
export default function ReplayPage(){const {id}=useParams<{id:string}>();const q=useQuery({queryKey:['admin','match-replay',id],queryFn:()=>getAdminReplay(id),enabled:!!id});return <><PageHeader eyebrow='Disputes & replay' title='Match replay' description='Durable event timeline from the authoritative backend. This is intentionally operational, not a decorative board replay.'/>{q.isLoading?<Skeleton className='h-[620px]'/>:q.isError||!q.data?<ErrorState message='Could not load match replay.' onRetry={()=>void q.refetch()}/>:<><div className='mb-4 rounded-xl border bg-card px-4 py-3 text-sm'><span className='font-medium'>{q.data.match.game.name}</span><span className='text-muted-foreground'> · {q.data.events.length} events · latest checkpoint v{q.data.checkpoint?.version??'—'}</span></div><ReplayTimeline events={q.data.events}/></>}</>}
