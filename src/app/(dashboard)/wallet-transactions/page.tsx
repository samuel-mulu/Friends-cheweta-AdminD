'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '@/components/layout/page-header';
import { WalletTransactionTable } from '@/components/finance/wallet-transaction-table';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/feedback/error-state';
import { listAdminWalletTransactions, type WalletTransactionType } from '@/features/finance/admin-finance-api';

const types: WalletTransactionType[]=['DEPOSIT','WITHDRAWAL','WITHDRAWAL_LOCK','WITHDRAWAL_RELEASE','WITHDRAWAL_PAYOUT','GAME_ENTRY_LOCK','GAME_ENTRY_RELEASE','GAME_ENTRY_SPEND','GAME_WIN','GAME_FEE','REFUND','ADMIN_ADJUSTMENT'];
export default function WalletTransactionsPage(){
 const [type,setType]=useState<WalletTransactionType|''>('');
 const q=useQuery({queryKey:['admin','wallet-transactions',type],queryFn:()=>listAdminWalletTransactions({type:type||undefined,limit:100})});
 return <><PageHeader eyebrow='Finance' title='Wallet & transactions' description='Read-only ledger visibility across player wallets. Financial mutations remain inside backend workflows.' actions={<select className='h-10 rounded-lg border bg-background px-3 text-sm' value={type} onChange={e=>setType(e.target.value as WalletTransactionType|'')}><option value=''>All transaction types</option>{types.map(x=><option key={x} value={x}>{x.replaceAll('_',' ')}</option>)}</select>}/>{q.isLoading?<Skeleton className='h-[520px]'/>:q.isError||!q.data?<ErrorState message='Could not load wallet transactions. Ensure the minimal A5 backend admin-support endpoints are installed.' onRetry={()=>void q.refetch()}/>:<WalletTransactionTable items={q.data}/>}</>;
}
