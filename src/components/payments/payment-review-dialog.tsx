'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
export function PaymentReviewDialog({kind,amountLabel,player,onApprove,onReject,pending}:{kind:'deposit'|'withdrawal';amountLabel:string;player:string;onApprove:()=>void;onReject:(reason:string)=>void;pending:boolean}) {
 const [reason,setReason]=useState('');
 return <div className='flex gap-2'><Dialog><DialogTrigger asChild><Button size='sm'>Approve</Button></DialogTrigger><DialogContent><DialogTitle className='text-lg font-semibold'>Approve {kind}?</DialogTitle><DialogDescription className='mt-2 leading-6 text-muted-foreground'>{amountLabel} for {player}. This changes financial state on the backend.</DialogDescription><div className='mt-6 flex justify-end'><Button disabled={pending} onClick={onApprove}>{pending?'Saving…':'Confirm approval'}</Button></div></DialogContent></Dialog><Dialog><DialogTrigger asChild><Button size='sm' variant='outline'>Reject</Button></DialogTrigger><DialogContent><DialogTitle className='text-lg font-semibold'>Reject {kind}?</DialogTitle><DialogDescription className='mt-2 leading-6 text-muted-foreground'>Give a concise operational reason. The backend will audit the decision.</DialogDescription><Input className='mt-4' value={reason} onChange={e=>setReason(e.target.value)} placeholder='Reason'/><div className='mt-6 flex justify-end'><Button variant='destructive' disabled={pending||reason.trim().length<3} onClick={()=>onReject(reason.trim())}>{pending?'Saving…':'Confirm rejection'}</Button></div></DialogContent></Dialog></div>;
}
