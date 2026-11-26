'use client';

import Link from 'next/link';
import { EmptyState } from '@/components/feedback/empty-state';
import { formatDateTime } from '@/lib/formatters/date';
import { formatMinor } from '@/lib/formatters/money';
import { modeLabels, providerLabels, type AdminDeposit } from '@/features/payments/admin-payments-api';
import { PaymentReviewDialog } from './payment-review-dialog';
import { PaymentStatusBadge } from './payment-status-badge';

export function DepositTable({ items, onApprove, onReject }: {
  items: AdminDeposit[];
  onApprove: (id: string, value: string) => Promise<unknown>;
  onReject: (id: string, reason: string) => Promise<unknown>;
}) {
  if (!items.length) return <EmptyState title='No deposits' description='No deposits match this status filter.' />;
  return (
    <div className='overflow-x-auto rounded-xl border bg-card'>
      <table className='w-full min-w-[880px] text-sm'>
        <thead className='border-b bg-muted/35 text-left text-xs uppercase tracking-wide text-muted-foreground'>
          <tr>
            {['Player', 'Amount', 'Provider', 'Reference', 'Status', 'Submitted', 'Action'].map((header) => (
              <th key={header} scope='col' className='px-4 py-3 last:text-right'>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className='border-b last:border-0'>
              <td className='px-4 py-3'>
                <Link href={`/players/${item.user.id}`} className='font-medium hover:text-primary'>{item.user.fullName}</Link>
                <div className='text-xs text-muted-foreground'>{item.user.phoneNumber}</div>
              </td>
              <td className='px-4 py-3 font-semibold tabular-nums'>{formatMinor(item.amountMinor)}</td>
              <td className='px-4 py-3'>
                {providerLabels[item.channel]}
                {item.approvalMode && <div className='text-xs text-muted-foreground'>{modeLabels[item.approvalMode]}</div>}
              </td>
              <td className='max-w-48 break-all px-4 py-3 font-mono text-xs'>{item.transactionReference}</td>
              <td className='px-4 py-3'>
                <PaymentStatusBadge status={item.status} />
                {item.rejectionReason && <div className='mt-1 max-w-48 text-xs text-muted-foreground'>{item.rejectionReason}</div>}
                {item.verificationStatus && item.status !== 'APPROVED' && (
                  <div className='mt-1 text-xs text-muted-foreground'>{(item.lastVerificationCode ?? item.verificationStatus).toLowerCase().replaceAll('_', ' ')}</div>
                )}
              </td>
              <td className='px-4 py-3 text-xs text-muted-foreground'>{formatDateTime(item.createdAt)}</td>
              <td className='px-4 py-3 text-right'>
                {item.status === 'PENDING' && !item.verificationStatus ? (
                  <PaymentReviewDialog
                    kind='deposit'
                    amountLabel={formatMinor(item.amountMinor)}
                    player={item.user.fullName}
                    onApprove={(value) => onApprove(item.id, value)}
                    onReject={(reason) => onReject(item.id, reason)}
                  />
                ) : <span className='text-xs text-muted-foreground'>{item.status === 'PENDING' ? 'Verification in progress' : 'Reviewed'}</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
