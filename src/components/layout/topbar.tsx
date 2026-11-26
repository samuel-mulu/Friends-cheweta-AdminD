'use client';

import { LogOut, Menu, MessageSquare, RefreshCw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getSmsBalance } from '@/features/payments/admin-payments-api';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './theme-toggle';
import { useAuth } from '@/features/auth/auth-provider';

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, logout } = useAuth();
  const sms = useQuery({ queryKey: ['admin', 'sms-balance'], queryFn: getSmsBalance, enabled: Boolean(user), staleTime: 60_000 });
  const smsLabel = sms.isFetching ? 'Checking…' : sms.data?.enabled === false ? 'Disabled' :
    sms.data?.balance != null ? [sms.data.balance, sms.data.currency].filter(Boolean).join(' ') : 'Unavailable';

  return (
    <header className='sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b bg-background/90 px-4 backdrop-blur sm:h-16 sm:px-5 md:px-7'>
      <div className='flex min-w-0 items-center gap-2'>
        <Button
          variant='ghost'
          size='icon'
          className='shrink-0 lg:hidden'
          onClick={onMenuClick}
          aria-label='Open menu'
        >
          <Menu className='h-5 w-5' />
        </Button>
        <div className='min-w-0 lg:hidden'>
          <div className='truncate font-semibold'>Friends Admin</div>
        </div>
        <div className='hidden text-xs text-muted-foreground lg:block'>
          Production-minded operations workspace
        </div>
      </div>
      <div className='flex shrink-0 items-center gap-1'>
        <Button variant='ghost' size='sm' disabled={sms.isFetching} onClick={() => void sms.refetch()}
          aria-label={`Refresh GeezSMS balance. ${smsLabel}`} title={`GeezSMS balance: ${smsLabel}`}>
          <MessageSquare className='h-4 w-4' />
          <span className='hidden sm:inline'>SMS {smsLabel}</span>
          <RefreshCw className={`hidden h-3 w-3 sm:inline ${sms.isFetching ? 'animate-spin' : ''}`} />
        </Button>
        <ThemeToggle />
        <div className='mx-2 hidden h-7 w-px bg-border sm:block' />
        <div className='mr-2 hidden text-right sm:block'>
          <div className='text-sm font-medium'>{user?.fullName}</div>
          <div className='text-[11px] text-muted-foreground'>Administrator</div>
        </div>
        <Button variant='ghost' size='icon' onClick={() => void logout()} aria-label='Logout'>
          <LogOut className='h-4 w-4' />
        </Button>
      </div>
    </header>
  );
}
