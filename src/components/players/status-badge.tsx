import { Badge } from '@/components/ui/badge'; import type { UserStatus } from '@/types/api';
export function UserStatusBadge({status}:{status:UserStatus}){return <Badge variant={status==='ACTIVE'?'success':'danger'}>{status==='ACTIVE'?'Active':'Blocked'}</Badge>}
