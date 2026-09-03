'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity,
  ArrowDownToLine,
  BadgeDollarSign,
  BarChart3,
  Bell,
  Gamepad2,
  Landmark,
  LineChart,
  ScrollText,
  ServerCog,
  Settings,
  ShieldAlert,
  Swords,
  Users,
  WalletCards,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const primary = [
  { href: '/overview', label: 'Overview', icon: BarChart3 },
  { href: '/players', label: 'Players', icon: Users },
];
const finance = [
  { href: '/wallet-transactions', label: 'Wallet & ledger', icon: WalletCards },
  { href: '/deposits', label: 'Deposits', icon: Landmark },
  { href: '/withdrawals', label: 'Withdrawals', icon: ArrowDownToLine },
  { href: '/settlements', label: 'Settlements', icon: BadgeDollarSign },
];
const games = [
  { href: '/games', label: 'Games & modes', icon: Gamepad2 },
  { href: '/matches', label: 'Matches', icon: Swords },
];
const operations = [
  { href: '/realtime', label: 'Realtime operations', icon: Activity },
  { href: '/risk', label: 'Risk & anti-cheat', icon: ShieldAlert },
  { href: '/audit', label: 'Audit logs', icon: ScrollText },
  { href: '/notifications', label: 'Notifications', icon: Bell },
];
const intelligence = [
  { href: '/reports', label: 'Reports & analytics', icon: LineChart },
  { href: '/system', label: 'System & production', icon: ServerCog },
];

function NavLink({
  href,
  label,
  Icon,
  path,
  onNavigate,
}: {
  href: string;
  label: string;
  Icon: typeof BarChart3;
  path: string;
  onNavigate?: () => void;
}) {
  const active = path === href || path.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        'mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
        active ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
      )}
    >
      <Icon className='h-[18px] w-[18px]' />
      {label}
    </Link>
  );
}

function SidebarBody({
  path,
  onNavigate,
  showClose,
  onClose,
}: {
  path: string;
  onNavigate?: () => void;
  showClose?: boolean;
  onClose?: () => void;
}) {
  return (
    <>
      <div className='flex h-16 items-center gap-3 border-b px-5'>
        <div className='grid h-9 w-9 place-items-center rounded-xl bg-primary text-sm font-bold text-primary-foreground'>
          FG
        </div>
        <div className='min-w-0 flex-1'>
          <div className='truncate text-sm font-semibold'>Friends Game Hub</div>
          <div className='text-[11px] text-muted-foreground'>Admin Console</div>
        </div>
        {showClose ? (
          <Button variant='ghost' size='icon' onClick={onClose} aria-label='Close menu'>
            <X className='h-4 w-4' />
          </Button>
        ) : null}
      </div>
      <nav className='flex-1 overflow-y-auto p-3'>
        <p className='px-3 pb-2 pt-3 text-[11px] font-semibold uppercase tracking-[.14em] text-muted-foreground'>
          Workspace
        </p>
        {primary.map((item) => (
          <NavLink key={item.href} {...item} Icon={item.icon} path={path} onNavigate={onNavigate} />
        ))}
        <p className='px-3 pb-2 pt-6 text-[11px] font-semibold uppercase tracking-[.14em] text-muted-foreground'>
          Finance
        </p>
        {finance.map((item) => (
          <NavLink key={item.href} {...item} Icon={item.icon} path={path} onNavigate={onNavigate} />
        ))}
        <p className='px-3 pb-2 pt-6 text-[11px] font-semibold uppercase tracking-[.14em] text-muted-foreground'>
          Games
        </p>
        {games.map((item) => (
          <NavLink key={item.href} {...item} Icon={item.icon} path={path} onNavigate={onNavigate} />
        ))}
        <p className='px-3 pb-2 pt-6 text-[11px] font-semibold uppercase tracking-[.14em] text-muted-foreground'>
          Operations
        </p>
        {operations.map((item) => (
          <NavLink key={item.href} {...item} Icon={item.icon} path={path} onNavigate={onNavigate} />
        ))}
        <p className='px-3 pb-2 pt-6 text-[11px] font-semibold uppercase tracking-[.14em] text-muted-foreground'>
          Insights & release
        </p>
        {intelligence.map((item) => (
          <NavLink key={item.href} {...item} Icon={item.icon} path={path} onNavigate={onNavigate} />
        ))}
      </nav>
      <div className='border-t p-3'>
        <div className='flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground'>
          <Settings className='h-4 w-4' />
          A0–A17 complete
        </div>
      </div>
    </>
  );
}

export function Sidebar({
  mobileOpen,
  onMobileClose,
}: {
  mobileOpen: boolean;
  onMobileClose: () => void;
}) {
  const path = usePathname();

  return (
    <>
      <aside className='hidden h-screen w-64 shrink-0 flex-col border-r bg-card lg:flex'>
        <SidebarBody path={path} />
      </aside>

      <div className={cn('fixed inset-0 z-50 lg:hidden', mobileOpen ? '' : 'pointer-events-none')}>
        <button
          type='button'
          aria-label='Close menu overlay'
          className={cn(
            'absolute inset-0 bg-black/40 transition-opacity',
            mobileOpen ? 'opacity-100' : 'opacity-0',
          )}
          onClick={onMobileClose}
        />
        <aside
          className={cn(
            'absolute inset-y-0 left-0 flex w-[min(18rem,88vw)] flex-col border-r bg-card shadow-xl transition-transform duration-200',
            mobileOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <SidebarBody path={path} onNavigate={onMobileClose} showClose onClose={onMobileClose} />
        </aside>
      </div>
    </>
  );
}
