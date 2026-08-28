import { Badge } from '@/components/ui/badge';
import type { WalletTransactionType } from '@/features/finance/admin-finance-api';
const credit = new Set<WalletTransactionType>(['DEPOSIT','WITHDRAWAL_RELEASE','GAME_ENTRY_RELEASE','GAME_WIN','REFUND']);
const danger = new Set<WalletTransactionType>(['WITHDRAWAL_PAYOUT','GAME_ENTRY_SPEND','GAME_FEE']);
export function TransactionTypeBadge({type}:{type:WalletTransactionType}) {
  return <Badge variant={credit.has(type)?'success':danger.has(type)?'danger':'neutral'}>{type.replaceAll('_',' ')}</Badge>;
}
