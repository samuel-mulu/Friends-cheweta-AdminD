import { Badge } from '@/components/ui/badge';
export function MatchStatusBadge({status}:{status:string}){const v=status==='FINISHED'?'success':status==='CANCELLED'?'danger':status==='PLAYING'?'info':status==='FINISHING'?'warning':'neutral';return <Badge variant={v as any}>{status}</Badge>}
