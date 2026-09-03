'use client';

import { useQuery } from '@tanstack/react-query';
import {
  Users,
  Gamepad2,
  Landmark,
  ShieldAlert,
  Trophy,
  WalletCards,
  UserX,
  CircleDollarSign,
} from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/page-header';
import { StatCard } from '@/components/dashboard/stat-card';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/feedback/error-state';
import { getDashboardSummary } from '@/features/dashboard/dashboard-api';
import { formatMinor } from '@/lib/formatters/money';
import { Button } from '@/components/ui/button';

export default function OverviewPage() {
  const query = useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: getDashboardSummary,
    refetchInterval: 30_000,
  });

  if (query.isLoading) {
    return (
      <>
        <PageHeader
          eyebrow='Operations'
          title='Overview'
          description='A focused view of player, game and financial health.'
        />
        <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className='h-36' />
          ))}
        </div>
      </>
    );
  }

  if (query.isError || !query.data) {
    return (
      <>
        <PageHeader eyebrow='Operations' title='Overview' />
        <ErrorState message='Could not load the admin dashboard.' onRetry={() => void query.refetch()} />
      </>
    );
  }

  const d = query.data;

  return (
    <>
      <PageHeader
        eyebrow='Operations'
        title='Overview'
        description='Live operational totals from the Friends Game Hub backend.'
        actions={
          <Button asChild variant='outline'>
            <Link href='/players'>View players</Link>
          </Button>
        }
      />
      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        <StatCard label='Total players' value={d.users.totalPlayers} icon={Users} href='/players' />
        <StatCard
          label='Active players'
          value={d.users.activePlayers}
          icon={Users}
          tone='success'
          href='/players'
        />
        <StatCard
          label='Blocked players'
          value={d.users.blockedPlayers}
          icon={UserX}
          tone={d.users.blockedPlayers ? 'warning' : 'default'}
          href='/players'
        />
        <StatCard
          label='Live matches'
          value={d.matches.live}
          icon={Gamepad2}
          tone={d.matches.live ? 'success' : 'default'}
          href='/matches'
        />
        <StatCard
          label='Pending deposits'
          value={d.payments.pendingDeposits}
          icon={Landmark}
          tone={d.payments.pendingDeposits ? 'warning' : 'default'}
          href='/deposits'
        />
        <StatCard
          label='Pending withdrawals'
          value={d.payments.pendingWithdrawals}
          icon={WalletCards}
          tone={d.payments.pendingWithdrawals ? 'warning' : 'default'}
          href='/withdrawals'
        />
        <StatCard
          label='Open risk flags'
          value={d.risk.openFlags}
          icon={ShieldAlert}
          tone={d.risk.openFlags ? 'danger' : 'default'}
          href='/risk'
        />
        <StatCard label='Finished matches' value={d.matches.finished} icon={Trophy} href='/matches' />
      </div>
      <div className='mt-6 grid gap-4 xl:grid-cols-[1.25fr_.75fr]'>
        <Card>
          <CardHeader>
            <h2 className='font-semibold'>Settlement totals</h2>
            <p className='mt-1 text-sm text-muted-foreground'>
              Durable totals from completed match settlements.
            </p>
          </CardHeader>
          <CardContent>
            <div className='grid gap-4 sm:grid-cols-3'>
              <Metric
                label='Total game pot'
                value={formatMinor(d.settlements.totalPotMinor)}
                icon={CircleDollarSign}
              />
              <Metric
                label='Winner payouts'
                value={formatMinor(d.settlements.totalPayoutMinor)}
                icon={Trophy}
              />
              <Metric
                label='Platform fees'
                value={formatMinor(d.settlements.totalPlatformFeeMinor)}
                icon={Landmark}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h2 className='font-semibold'>Attention queue</h2>
            <p className='mt-1 text-sm text-muted-foreground'>Items likely to need an operator next.</p>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              <Attention label='Deposits awaiting review' value={d.payments.pendingDeposits} href='/deposits' />
              <Attention
                label='Withdrawals awaiting review'
                value={d.payments.pendingWithdrawals}
                href='/withdrawals'
              />
              <Attention label='Open risk flags' value={d.risk.openFlags} href='/risk' />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function Metric({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof CircleDollarSign;
}) {
  return (
    <div className='rounded-xl bg-muted/60 p-4'>
      <Icon className='h-4 w-4 text-muted-foreground' />
      <p className='mt-4 text-lg font-semibold'>{value}</p>
      <p className='mt-1 text-xs text-muted-foreground'>{label}</p>
    </div>
  );
}

function Attention({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link
      href={href}
      className='flex items-center justify-between rounded-lg border px-3 py-3 transition-colors hover:bg-muted/40'
    >
      <span className='text-sm text-muted-foreground'>{label}</span>
      <span className='text-sm font-semibold'>{value}</span>
    </Link>
  );
}
