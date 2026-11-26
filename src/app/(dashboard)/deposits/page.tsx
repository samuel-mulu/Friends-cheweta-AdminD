'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DepositTable } from '@/components/payments/deposit-table';
import { PageHeader } from '@/components/layout/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/feedback/error-state';
import {
  approveDeposit, listDeposits, rejectDeposit, type PaymentStatus,
} from '@/features/payments/admin-payments-api';

export default function DepositsPage() {
  const [status, setStatus] = useState<PaymentStatus | ''>('PENDING');
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ['admin', 'deposits', status], queryFn: () => listDeposits(status || undefined) });

  async function review(operation: Promise<unknown>) {
    await operation;
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['admin', 'deposits'] }),
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] }),
      queryClient.invalidateQueries({ queryKey: ['admin', 'wallet-transactions'] }),
    ]);
  }

  return (
    <>
      <PageHeader eyebrow='Payments' title='Deposits' description='Review manual deposits and track provider verification.'
        actions={(
          <select aria-label='Filter by status' className='h-10 rounded-lg border bg-background px-3 text-sm'
            value={status} onChange={(event) => setStatus(event.target.value as PaymentStatus | '')}>
            <option value=''>All statuses</option>
            <option value='PENDING'>Pending</option>
            <option value='APPROVED'>Approved</option>
            <option value='REJECTED'>Rejected</option>
          </select>
        )}
      />
      {query.isLoading && <Skeleton className='h-[520px]' />}
      {query.isError && <ErrorState message='Could not load deposits.' onRetry={() => void query.refetch()} />}
      {query.data && <DepositTable
        items={query.data}
        onApprove={(id, value) => review(approveDeposit(id, value))}
        onReject={(id, reason) => review(rejectDeposit(id, reason))}
      />}
    </>
  );
}
