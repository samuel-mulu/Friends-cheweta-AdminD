import * as React from 'react';
import { cn } from '@/lib/utils';
export const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(({ className, ...props }, ref) => (
  <input ref={ref} className={cn('flex h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/30 focus:border-primary disabled:opacity-50', className)} {...props} />
));
Input.displayName = 'Input';
