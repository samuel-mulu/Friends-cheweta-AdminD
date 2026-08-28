'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '@/components/layout/page-header';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/feedback/error-state';
import { AuditTable } from '@/components/audit/audit-table';
import { listAuditLogs } from '@/features/audit/admin-audit-api';
export default function AuditPage(){const [input,setInput]=useState('');const [action,setAction]=useState('');const q=useQuery({queryKey:['admin','audit',action],queryFn:()=>listAuditLogs(action||undefined,100)});return <><PageHeader eyebrow='Governance' title='Audit logs' description='Read-only history of sensitive administrative actions.' actions={<form onSubmit={e=>{e.preventDefault();setAction(input.trim())}} className='flex gap-2'><Input value={input} onChange={e=>setInput(e.target.value)} placeholder='Filter exact action…' className='w-56'/><button className='h-10 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground'>Filter</button></form>}/>{q.isLoading?<Skeleton className='h-[520px]'/>:q.isError||!q.data?<ErrorState message='Could not load audit logs.' onRetry={()=>void q.refetch()}/>:<AuditTable items={q.data}/>}</>}
