'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '@/components/layout/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/feedback/error-state';
import { MatchTable } from '@/components/matches/match-table';
import { listAdminMatches, type MatchStatus } from '@/features/matches/admin-matches-api';
const statuses:MatchStatus[]=['CREATED','READY','PLAYING','FINISHING','FINISHED','CANCELLED'];
export default function MatchesPage(){const [status,setStatus]=useState<MatchStatus|''>('');const q=useQuery({queryKey:['admin','matches',status],queryFn:()=>listAdminMatches(status||undefined,100)});return <><PageHeader eyebrow='Game operations' title='Matches' description='Operational view of Ludo and Dama matches, participants, results, and settlement state.' actions={<select className='h-10 rounded-lg border bg-background px-3 text-sm' value={status} onChange={e=>setStatus(e.target.value as MatchStatus|'')}><option value=''>All statuses</option>{statuses.map(s=><option key={s} value={s}>{s}</option>)}</select>}/>{q.isLoading?<Skeleton className='h-[560px]'/>:q.isError||!q.data?<ErrorState message='Could not load matches.' onRetry={()=>void q.refetch()}/>:<MatchTable items={q.data}/>}</>}
