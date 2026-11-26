'use client';

import { useState, type FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageSquarePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { feedbackKey, sendPlayerFeedback } from '@/features/communications/communications-api';

export function PlayerFeedbackDialog({ userId, playerName }: { userId: string; playerName: string }) {
  const client = useQueryClient();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const send = useMutation({
    mutationFn: (body: string) => sendPlayerFeedback(userId, body),
    onSuccess: () => {
      setMessage('');
      setOpen(false);
      setSent(true);
      void client.invalidateQueries({ queryKey: feedbackKey });
    },
  });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (message.trim() && !send.isPending) send.mutate(message.trim());
  }

  return (
    <div>
      <Dialog open={open} onOpenChange={(next) => {
        if (send.isPending) return;
        setOpen(next);
        if (next) { send.reset(); setSent(false); }
      }}>
        <DialogTrigger asChild>
          <Button variant='outline'><MessageSquarePlus className='h-4 w-4' />Send feedback message</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle className='text-lg font-semibold'>Message {playerName}</DialogTitle>
          <DialogDescription className='mt-2 text-sm text-muted-foreground'>The player will receive this privately in Feedback.</DialogDescription>
          <form onSubmit={submit} className='mt-4 space-y-3'>
            <label className='block space-y-1 text-sm font-medium'><span>Message</span>
              <textarea required maxLength={2000} value={message} onChange={(event) => setMessage(event.target.value)}
                className='block min-h-28 w-full rounded-md border bg-background p-3' />
            </label>
            {send.isError && <p role='alert' className='text-sm text-destructive'>{send.error.message}</p>}
            <Button type='submit' disabled={!message.trim() || send.isPending}>{send.isPending ? 'Sending…' : 'Send message'}</Button>
          </form>
        </DialogContent>
      </Dialog>
      {sent && <p role='status' className='mt-1 text-sm'>Feedback message sent.</p>}
    </div>
  );
}
