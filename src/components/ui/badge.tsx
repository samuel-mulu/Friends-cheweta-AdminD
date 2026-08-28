import { cn } from '@/lib/utils';
export function Badge({ children, variant = 'neutral', className }: { children: React.ReactNode; variant?: 'neutral'|'success'|'danger'|'warning'|'info'; className?: string }) {
  const map = { neutral:'bg-muted text-muted-foreground', success:'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300', danger:'bg-red-500/10 text-red-700 dark:text-red-300', warning:'bg-amber-500/12 text-amber-700 dark:text-amber-300', info:'bg-blue-500/10 text-blue-700 dark:text-blue-300' };
  return <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold', map[variant], className)}>{children}</span>;
}
