'use client';

import { useState, type FormEvent } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ErrorState } from '@/components/feedback/error-state';
import { PageHeader } from '@/components/layout/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  changeDepositApprovalPin, getDepositConfig, modeLabels, providerLabels, resetTelebirrFallback, updateDepositConfig,
  type DepositConfig, type DepositMode, type DepositProviderConfig,
} from '@/features/payments/admin-payments-api';
import { formatDateTime } from '@/lib/formatters/date';

const queryKey = ['admin', 'deposit-config'] as const;

export default function DepositConfigurationPage() {
  const client = useQueryClient();
  const query = useQuery({ queryKey, queryFn: getDepositConfig, refetchInterval: 15_000 });
  const [notice, setNotice] = useState('');
  function update(config: DepositConfig, message: string) {
    client.setQueryData(queryKey, config);
    setNotice(message);
  }

  return (
    <>
      <PageHeader eyebrow='Payments' title='Deposit configuration' description='Manage provider availability and receipt verification.' />
      {notice && <p role='status' className='mb-3 text-sm text-muted-foreground'>{notice}</p>}
      {query.isLoading && <Skeleton className='h-56' />}
      {query.isError && <ErrorState message='Could not load deposit configuration.' onRetry={() => void query.refetch()} />}
      {query.data && (
        <div className='grid gap-4 xl:grid-cols-2'>
          {query.data.providers.map((provider) => (
            <ProviderForm key={`${provider.channel}:${provider.approvalMode}:${provider.enabled}:${provider.fallbackThreshold}:${provider.fallbackWindowMinutes}:${provider.fallbackDurationMinutes}`}
              provider={provider} update={update} />
          ))}
          <PinForm configured={query.data.hasApprovalPin} />
        </div>
      )}
    </>
  );
}

function ProviderForm({ provider, update }: { provider: DepositProviderConfig; update: (value: DepositConfig, message: string) => void }) {
  const [enabled, setEnabled] = useState(provider.enabled);
  const [mode, setMode] = useState(provider.approvalMode);
  const [threshold, setThreshold] = useState(String(provider.fallbackThreshold ?? 2));
  const [window, setWindow] = useState(String(provider.fallbackWindowMinutes ?? 3));
  const [duration, setDuration] = useState(String(provider.fallbackDurationMinutes ?? 30));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const active = provider.approvalMode === 'LOCAL_WITH_FALLBACK' && provider.effectiveMode === 'AUTOMATIC';

  async function run(operation: () => Promise<DepositConfig>, success: string) {
    setBusy(true);
    setError('');
    try {
      update(await operation(), success);
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Could not update deposit configuration.');
    } finally {
      setBusy(false);
    }
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void run(() => updateDepositConfig(provider.channel, {
      enabled, approvalMode: mode,
      ...(mode === 'LOCAL_WITH_FALLBACK' ? {
        fallbackThreshold: Number(threshold), fallbackWindowMinutes: Number(window), fallbackDurationMinutes: Number(duration),
      } : {}),
    }), 'Provider settings saved.');
  }

  return (
    <Card>
      <CardHeader className='flex items-center justify-between gap-3'>
        <CardTitle>{providerLabels[provider.channel]}</CardTitle>
        {active && <Badge variant='warning'>Fallback active</Badge>}
      </CardHeader>
      <CardContent>
        <form onSubmit={save} className='space-y-4'>
          <p className='text-sm text-muted-foreground'>Current mode: {provider.enabled ? modeLabels[provider.effectiveMode] : 'Disabled'}</p>
          {!provider.settlementConfigured && <p className='text-sm text-muted-foreground'>Settlement account setup is required.</p>}
          <label className='flex items-center gap-2 text-sm'>
            <input type='checkbox' checked={enabled} onChange={(event) => setEnabled(event.target.checked)} />
            Accept deposits
          </label>
          <label className='block space-y-1 text-sm'>
            <span>Approval mode</span>
            <select className='block h-10 w-full rounded-md border bg-background px-3' value={mode}
              onChange={(event) => setMode(event.target.value as DepositMode)}>
              {provider.allowedModes.map((option) => <option key={option} value={option}>{modeLabels[option]}</option>)}
            </select>
          </label>
          {mode === 'LOCAL_WITH_FALLBACK' && (
            <div className='grid gap-3 sm:grid-cols-3'>
              <label className='space-y-1 text-sm'><span>Failure threshold</span>
                <Input type='number' min={1} max={50} required value={threshold} onChange={(event) => setThreshold(event.target.value)} />
              </label>
              <label className='space-y-1 text-sm'><span>Window (minutes)</span>
                <Input type='number' min={1} max={60} required value={window} onChange={(event) => setWindow(event.target.value)} />
              </label>
              <label className='space-y-1 text-sm'><span>Fallback (minutes)</span>
                <Input type='number' min={1} max={1440} required value={duration} onChange={(event) => setDuration(event.target.value)} />
              </label>
            </div>
          )}
          {active && provider.fallbackUntil && (
            <div className='rounded-md border bg-muted/30 p-3 text-sm'>
              <p>{provider.fallbackReason}</p>
              <p>Returns to Local at {formatDateTime(provider.fallbackUntil)}.</p>
            </div>
          )}
          <div className='flex flex-wrap gap-2'>
            <Button type='submit' disabled={busy}>Save settings</Button>
            {active && <Button type='button' variant='outline' disabled={busy}
              onClick={() => void run(resetTelebirrFallback, 'Telebirr returned to Local.')}>Return to Local</Button>}
          </div>
          {error && <p role='alert' className='text-sm text-destructive'>{error}</p>}
        </form>
      </CardContent>
    </Card>
  );
}

function PinForm({ configured }: { configured: boolean }) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await changeDepositApprovalPin(current, next);
      setCurrent('');
      setNext('');
      setMessage('Approval PIN updated.');
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Could not update the approval PIN.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <CardHeader><CardTitle>Manual approval PIN</CardTitle></CardHeader>
      <CardContent>
        {configured ? (
          <form onSubmit={(event) => void submit(event)} className='space-y-3'>
            <label className='block space-y-1 text-sm'><span>Current PIN</span>
              <Input type='password' inputMode='numeric' autoComplete='off' maxLength={6} value={current} onChange={(event) => setCurrent(event.target.value)} />
            </label>
            <label className='block space-y-1 text-sm'><span>New PIN</span>
              <Input type='password' inputMode='numeric' autoComplete='new-password' maxLength={6} value={next} onChange={(event) => setNext(event.target.value)} />
            </label>
            <Button type='submit' disabled={busy || !/^\d{6}$/.test(current) || !/^\d{6}$/.test(next)}>Change PIN</Button>
            {message && <p role='status' className='text-sm text-muted-foreground'>{message}</p>}
            {error && <p role='alert' className='text-sm text-destructive'>{error}</p>}
          </form>
        ) : <p className='text-sm text-muted-foreground'>Set an initial PIN in the backend configuration.</p>}
      </CardContent>
    </Card>
  );
}
