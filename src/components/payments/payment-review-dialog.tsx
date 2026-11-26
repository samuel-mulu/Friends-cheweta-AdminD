'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

type Props = {
  kind: 'deposit' | 'withdrawal';
  amountLabel: string;
  player: string;
  onApprove: (value: string) => Promise<unknown>;
  onReject: (reason: string) => Promise<unknown>;
};

export function PaymentReviewDialog({ kind, amountLabel, player, onApprove, onReject }: Props) {
  return (
    <div className='flex justify-end gap-2'>
      <ReviewAction
        label={kind === 'deposit' ? 'Approve' : 'Mark paid'}
        field={kind === 'deposit' ? 'Approval PIN' : 'Payout receipt URL'}
        mode={kind === 'deposit' ? 'pin' : 'url'}
        description={`${amountLabel} for ${player}`}
        submit={onApprove}
      />
      <ReviewAction label='Reject' field='Reason' mode='reason' description={`${amountLabel} for ${player}`} submit={onReject} />
    </div>
  );
}

function ReviewAction({ label, field, mode, description, submit }: {
  label: string;
  field: string;
  mode: 'pin' | 'url' | 'reason';
  description: string;
  submit: (value: string) => Promise<unknown>;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const input = value.trim();
  const valid = mode === 'pin' ? /^\d{6}$/.test(input) : mode === 'url' ? /^https:\/\/[^\s]+$/i.test(input) : input.length >= 3;

  async function confirm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!valid || busy) return;
    setBusy(true);
    setError('');
    try {
      await submit(input);
      setValue('');
      setOpen(false);
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Could not save the review.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => {
      if (busy) return;
      setOpen(next);
      if (!next) {
        setValue('');
        setError('');
      }
    }}>
      <DialogTrigger asChild>
        <Button size='sm' variant={mode === 'reason' ? 'outline' : 'default'}>{label}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className='text-lg font-semibold'>{label} {mode === 'url' ? 'withdrawal' : 'request'}</DialogTitle>
        <DialogDescription className='text-muted-foreground'>{description}</DialogDescription>
        <form className='space-y-4' onSubmit={confirm}>
          <label className='block space-y-2 text-sm font-medium'>
            <span>{field}</span>
            <Input
              type={mode === 'pin' ? 'password' : mode === 'url' ? 'url' : 'text'}
              value={value}
              autoComplete='off'
              inputMode={mode === 'pin' ? 'numeric' : undefined}
              maxLength={mode === 'pin' ? 6 : 500}
              onChange={(event) => setValue(event.target.value)}
            />
          </label>
          {error && <p role='alert' className='text-sm text-destructive'>{error}</p>}
          <div className='flex justify-end'>
            <Button type='submit' variant={mode === 'reason' ? 'destructive' : 'default'} disabled={busy || !valid}>
              {busy ? 'Saving…' : label}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
