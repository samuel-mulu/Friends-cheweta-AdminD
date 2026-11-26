'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { WithdrawalTable } from '@/components/payments/withdrawal-table';
import { PageHeader } from '@/components/layout/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/feedback/error-state';
import {
  approveWithdrawal, listWithdrawals, rejectWithdrawal, type PaymentStatus,
} from '@/features/payments/admin-payments-api';

export default function WithdrawalsPage() {
  const [status, setStatus] = useState<PaymentStatus | ''>('PENDING');
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ['admin', 'withdrawals', status], queryFn: () => listWithdrawals(status || undefined) });

  async function review(operation: Promise<unknown>) {
    await operation;
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['admin', 'withdrawals'] }),
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] }),
      queryClient.invalidateQueries({ queryKey: ['admin', 'wallet-transactions'] }),
    ]);
  }

  return (
    <>
      <PageHeader eyebrow='Payments' title='Withdrawals' description='Review reserved withdrawals and record payout receipts.'
        actions={(
          <select aria-label='Filter by status' className='h-10 rounded-lg border bg-background px-3 text-sm'
            value={status} onChange={(event) => setStatus(event.target.value as PaymentStatus | '')}>
            <option value=''>All statuses</option>
            <option value='PENDING'>Pending</option>
            <option value='PAID'>Paid</option>
            <option value='APPROVED'>Legacy approvals</option>
            <option value='REJECTED'>Rejected</option>
          </select>
        )}
      />
      {query.isLoading && <Skeleton className='h-[520px]' />}
      {query.isError && <ErrorState message='Could not load withdrawals.' onRetry={() => void query.refetch()} />}
      {query.data && <WithdrawalTable
        items={query.data}
        onApprove={(id, value) => review(approveWithdrawal(id, value))}
        onReject={(id, reason) => review(rejectWithdrawal(id, reason))}
      />}
    </>
  );
}
