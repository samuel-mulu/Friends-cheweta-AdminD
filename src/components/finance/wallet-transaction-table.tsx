'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/feedback/empty-state';
import { formatDateTime } from '@/lib/formatters/date';
import { formatMinor } from '@/lib/formatters/money';
import type { AdminWalletTransaction } from '@/features/finance/admin-finance-api';
import { TransactionTypeBadge } from './transaction-type-badge';

export function WalletTransactionTable({items}:{items:AdminWalletTransaction[]}) {
  const [search,setSearch]=useState('');
  const filtered=useMemo(()=>{const q=search.trim().toLowerCase(); if(!q)return items; return items.filter(x=>[x.user.fullName,x.user.phoneNumber,x.referenceType??'',x.referenceId??'',x.id].some(v=>v.toLowerCase().includes(q)));},[items,search]);
  return <div className='rounded-xl border bg-card'>
    <div className='flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between'><div><h2 className='font-semibold'>Ledger transactions</h2><p className='mt-1 text-sm text-muted-foreground'>Read-only financial history. Balance changes remain backend-controlled.</p></div><div className='relative w-full sm:w-80'><Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground'/><Input value={search} onChange={e=>setSearch(e.target.value)} placeholder='Player, phone, reference…' className='pl-9'/></div></div>
    {filtered.length===0?<EmptyState title='No transactions found' description='Try another filter or search.'/ >:<div className='overflow-x-auto'><table className='w-full min-w-[1050px] text-sm'><thead><tr className='border-b bg-muted/35 text-left text-xs uppercase tracking-wide text-muted-foreground'><th className='px-4 py-3'>Player</th><th className='px-4 py-3'>Type</th><th className='px-4 py-3 text-right'>Amount</th><th className='px-4 py-3 text-right'>Available</th><th className='px-4 py-3 text-right'>Locked</th><th className='px-4 py-3'>Reference</th><th className='px-4 py-3'>Time</th></tr></thead><tbody>{filtered.map(t=><tr key={t.id} className='border-b last:border-0 hover:bg-muted/25'><td className='px-4 py-3'><Link href={`/players/${t.user.id}`} className='font-medium hover:text-primary'>{t.user.fullName}</Link><div className='mt-0.5 text-xs text-muted-foreground'>{t.user.phoneNumber}</div></td><td className='px-4 py-3'><TransactionTypeBadge type={t.type}/></td><td className='px-4 py-3 text-right font-semibold tabular-nums'>{formatMinor(t.amountMinor,t.currency)}</td><td className='px-4 py-3 text-right tabular-nums'><div>{formatMinor(t.availableBalanceAfter,t.currency)}</div><div className='text-xs text-muted-foreground'>{signed(t.availableDelta)}</div></td><td className='px-4 py-3 text-right tabular-nums'><div>{formatMinor(t.lockedBalanceAfter,t.currency)}</div><div className='text-xs text-muted-foreground'>{signed(t.lockedDelta)}</div></td><td className='px-4 py-3'><div className='text-xs font-medium'>{t.referenceType??'—'}</div><div className='max-w-48 truncate font-mono text-[11px] text-muted-foreground'>{t.referenceId??'—'}</div></td><td className='px-4 py-3 text-xs text-muted-foreground'>{formatDateTime(t.createdAt)}</td></tr>)}</tbody></table></div>}
  </div>;
}
function signed(value:string){const n=BigInt(value); return `${n>BigInt(0)?'+':''}${(Number(n)/100).toFixed(2)}`}
