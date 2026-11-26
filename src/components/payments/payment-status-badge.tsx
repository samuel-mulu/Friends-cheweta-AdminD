import { Badge } from '@/components/ui/badge';
import type { PaymentStatus } from '@/features/payments/admin-payments-api';

export function PaymentStatusBadge({ status, legacy }: { status: PaymentStatus; legacy?: boolean }) {
  const label = status === 'APPROVED' && legacy ? 'Legacy approval' : {
    PENDING: 'Pending', APPROVED: 'Approved', REJECTED: 'Rejected', PAID: 'Paid',
  }[status];
  return <Badge variant={status === 'APPROVED' || status === 'PAID' ? 'success' : status === 'REJECTED' ? 'danger' : 'warning'}>{label}</Badge>;
}
