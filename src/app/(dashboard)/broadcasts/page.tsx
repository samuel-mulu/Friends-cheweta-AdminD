'use client';

import { useState, type FormEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Megaphone } from 'lucide-react';
import { ErrorState } from '@/components/feedback/error-state';
import { PageHeader } from '@/components/layout/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  broadcastsKey, broadcastModes, deleteBroadcast, listBroadcasts, publishBroadcast, remindBroadcast,
  setForcedBroadcast, type Broadcast, type BroadcastMode,
} from '@/features/communications/communications-api';
import { formatDateTime } from '@/lib/formatters/date';

const descriptions: Record<BroadcastMode, string> = {
  DISMISSIBLE: 'Players can dismiss it from their inbox. You can send it again as a reminder.',
  PERSISTENT: 'Pinned in the player inbox until you delete it.',
  FORCED: 'Blocks the app while live. Players can finish or resume a live match first.',
};

type Action =
  | { kind: 'publish'; input: { title: string; body: string; category: BroadcastMode; expectedLiveId: string | null }; replace: string | null }
  | { kind: 'activate'; broadcast: Broadcast; expectedLiveId: string | null; replace: string | null }
  | { kind: 'stop' | 'delete' | 'remind'; broadcast: Broadcast };

export default function BroadcastsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState<BroadcastMode>('DISMISSIBLE');
  const [action, setAction] = useState<Action | null>(null);
  const [notice, setNotice] = useState('');

  const query = useQuery({ queryKey: [...broadcastsKey, page], queryFn: () => listBroadcasts(page) });
  const active = query.data?.active;
  const mutation = useMutation({
    mutationFn: async (next: Action) => {
      switch (next.kind) {
        case 'publish': await publishBroadcast(next.input); return 'Broadcast published.';
        case 'activate': await setForcedBroadcast(next.broadcast.id, true, next.expectedLiveId); return 'Forced notice is live.';
        case 'stop': await setForcedBroadcast(next.broadcast.id, false); return 'Forced notice stopped.';
        case 'delete': await deleteBroadcast(next.broadcast.id); return 'Broadcast deleted.';
        case 'remind': await remindBroadcast(next.broadcast.id); return 'Reminder sent.';
      }
    },
    onSuccess: async (message, next) => {
      setNotice(message);
      setAction(null);
      if (next.kind === 'publish') {
        setTitle('');
        setBody('');
        setCategory('DISMISSIBLE');
        setPage(1);
      }
      await queryClient.invalidateQueries({ queryKey: broadcastsKey });
    },
    onError: () => void queryClient.invalidateQueries({ queryKey: broadcastsKey }),
  });

  function confirm(next: Action) {
    mutation.reset();
    setNotice('');
    setAction(next);
  }

  function publish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim() || !body.trim() || !query.data || mutation.isPending) return;
    const next: Action = {
      kind: 'publish', input: { title: title.trim(), body: body.trim(), category, expectedLiveId: active?.id ?? null },
      replace: active?.title ?? null,
    };
    if (category === 'FORCED') confirm(next);
    else {
      setNotice('');
      mutation.mutate(next);
    }
  }

  return (
    <>
      <PageHeader eyebrow='Player communication' title='Broadcasts' description='Send in-app announcements to all players.' />
      {notice && <p role='status' className='mb-4 text-sm font-medium'>{notice}</p>}
      {active && (
        <div className='mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-muted/40 p-4'>
          <div className='min-w-0'>
            <Badge variant='warning'>Forced notice live</Badge>
            <p className='mt-2 break-words font-medium'>{active.title}</p>
          </div>
          <Button variant='outline' onClick={() => confirm({ kind: 'stop', broadcast: active })}>Turn off</Button>
        </div>
      )}
      <div className='grid gap-5 xl:grid-cols-[minmax(340px,2fr)_minmax(0,3fr)]'>
        <Card>
          <CardHeader><CardTitle>New broadcast</CardTitle></CardHeader>
          <CardContent>
            <form className='space-y-4' onSubmit={publish}>
              <label className='block space-y-1 text-sm font-medium'><span>Display mode</span>
                <select className='block h-10 w-full rounded-md border bg-background px-3' value={category}
                  onChange={(event) => setCategory(event.target.value as BroadcastMode)}>
                  {Object.entries(broadcastModes).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </label>
              <p className='text-sm text-muted-foreground'>{descriptions[category]}</p>
              <label className='block space-y-1 text-sm font-medium'><span>Title</span>
                <Input required maxLength={200} value={title} onChange={(event) => setTitle(event.target.value)} />
              </label>
              <label className='block space-y-1 text-sm font-medium'><span>Message</span>
                <textarea required maxLength={5000} value={body} onChange={(event) => setBody(event.target.value)}
                  className='block min-h-32 w-full resize-y rounded-md border bg-background p-3' />
              </label>
              <div className='rounded-lg border bg-muted/25 p-3 text-sm'>
                <p className='mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground'><Megaphone className='h-4 w-4' />Player preview</p>
                <p className='break-words font-semibold'>{title.trim() || 'Announcement title'}</p>
                <p className='mt-1 max-h-40 overflow-auto whitespace-pre-wrap break-words text-muted-foreground'>{body.trim() || 'Your message will appear here.'}</p>
              </div>
              <Button type='submit' disabled={!query.data || !title.trim() || !body.trim() || mutation.isPending}>
                {mutation.isPending && !action ? 'Publishing…' : 'Publish broadcast'}
              </Button>
              {mutation.isError && !action && <p role='alert' className='text-sm text-destructive'>{mutation.error.message}</p>}
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Broadcast history</CardTitle></CardHeader>
          <CardContent className='space-y-3'>
            {query.isLoading && <Skeleton className='h-48' />}
            {query.isError && <ErrorState message='Could not load broadcasts.' onRetry={() => void query.refetch()} />}
            {query.data?.items.length === 0 && <p className='text-sm text-muted-foreground'>No broadcasts yet.</p>}
            {query.data?.items.map((item) => (
              <article key={item.id} className='space-y-2 rounded-lg border p-4'>
                <div className='flex flex-wrap items-center gap-2'>
                  <h2 className='min-w-0 break-words font-semibold'>{item.title}</h2>
                  <Badge variant={item.forcedLive ? 'warning' : 'neutral'}>{item.forcedLive ? 'Forced · Live' : item.category === 'FORCED' ? 'Forced · Off' : broadcastModes[item.category]}</Badge>
                </div>
                <p className='max-h-28 overflow-auto whitespace-pre-wrap break-words text-sm'>{item.body}</p>
                <p className='text-xs text-muted-foreground'>{formatDateTime(item.createdAt)}{item.createdBy ? ` · ${item.createdBy.fullName}` : ''}</p>
                <div className='flex flex-wrap gap-2'>
                  {item.category === 'FORCED' && (
                    <Button size='sm' variant='outline' onClick={() => confirm(item.forcedLive
                      ? { kind: 'stop', broadcast: item }
                      : { kind: 'activate', broadcast: item, expectedLiveId: active?.id ?? null, replace: active?.title ?? null })}>
                      {item.forcedLive ? 'Turn off' : 'Turn on'}
                    </Button>
                  )}
                  {item.category === 'DISMISSIBLE' && <Button size='sm' variant='outline' onClick={() => confirm({ kind: 'remind', broadcast: item })}>Remind</Button>}
                  <Button size='sm' variant='ghost' onClick={() => confirm({ kind: 'delete', broadcast: item })}>Delete</Button>
                </div>
              </article>
            ))}
            {(page > 1 || query.data?.hasMore) && (
              <div className='flex justify-between'>
                <Button variant='outline' size='sm' disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
                <Button variant='outline' size='sm' disabled={!query.data?.hasMore} onClick={() => setPage(page + 1)}>Next</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Dialog open={action !== null} onOpenChange={(open) => { if (!open && !mutation.isPending) setAction(null); }}>
        {action && (
          <DialogContent>
            <DialogTitle className='pr-6 text-lg font-semibold'>{actionTitle(action)}</DialogTitle>
            <DialogDescription className='mt-2 break-words text-sm text-muted-foreground'>{actionDescription(action)}</DialogDescription>
            {mutation.isError && <p role='alert' className='mt-3 text-sm text-destructive'>{mutation.error.message}</p>}
            <div className='mt-5 flex justify-end gap-2'>
              <Button variant='outline' disabled={mutation.isPending} onClick={() => setAction(null)}>Cancel</Button>
              <Button variant={action.kind === 'delete' ? 'destructive' : 'default'} disabled={mutation.isPending} onClick={() => mutation.mutate(action)}>
                {mutation.isPending ? 'Saving…' : 'Confirm'}
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}

function actionTitle(action: Action) {
  switch (action.kind) {
    case 'publish': return 'Publish forced notice?';
    case 'activate': return 'Turn on forced notice?';
    case 'stop': return 'Turn off forced notice?';
    case 'delete': return 'Delete broadcast?';
    case 'remind': return 'Send reminder?';
  }
}

function actionDescription(action: Action) {
  if (action.kind === 'publish' || action.kind === 'activate') {
    const title = action.kind === 'publish' ? action.input.title : action.broadcast.title;
    return `“${title}” will block the app while live. Players can finish their current match.${action.replace ? ` This replaces “${action.replace}”.` : ''}`;
  }
  if (action.kind === 'remind') return `“${action.broadcast.title}” will return to players’ inboxes, including players who dismissed it.`;
  return `“${action.broadcast.title}” will disappear from player view.`;
}
