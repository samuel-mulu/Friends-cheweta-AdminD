import { Badge } from '@/components/ui/badge';
import type { PaymentStatus } from '@/features/payments/admin-payments-api';
export function PaymentStatusBadge({status}:{status:PaymentStatus}) { return <Badge variant={status==='APPROVED'?'success':status==='REJECTED'?'danger':'warning'}>{status}</Badge>; }
