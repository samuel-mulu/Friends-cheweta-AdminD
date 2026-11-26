'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ErrorState } from '@/components/feedback/error-state';
import { PageHeader } from '@/components/layout/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  feedbackCategories, feedbackKey, feedbackStatuses, getFeedback, listFeedback, updateFeedback,
  type Feedback, type FeedbackCategory, type FeedbackStatus,
} from '@/features/communications/communications-api';
import { formatDateTime } from '@/lib/formatters/date';

export default function FeedbackPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<FeedbackStatus | ''>('OPEN');
  const [category, setCategory] = useState<FeedbackCategory | ''>('');
  const [selected, setSelected] = useState<string | null>(null);
  const list = useQuery({ queryKey: [...feedbackKey, 'list', page, status, category], queryFn: () => listFeedback(page, status, category) });
  const detail = useQuery({ queryKey: [...feedbackKey, 'detail', selected], queryFn: () => getFeedback(selected!), enabled: selected !== null });

  return (
    <>
      <PageHeader eyebrow='Player communication' title='Feedback' description='Review player feedback and send private replies.' />
      <div className='grid items-start gap-5 xl:grid-cols-2'>
        <Card className={selected ? 'hidden xl:block' : undefined}>
          <CardHeader><CardTitle>Feedback queue</CardTitle></CardHeader>
          <CardContent className='space-y-3'>
            <div className='flex flex-wrap gap-2'>
              <select aria-label='Filter by status' className='h-10 rounded-md border bg-background px-3 text-sm' value={status}
                onChange={(event) => { setStatus(event.target.value as FeedbackStatus | ''); setPage(1); }}>
                <option value=''>All statuses</option>
                {Object.entries(feedbackStatuses).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
              </select>
              <select aria-label='Filter by category' className='h-10 rounded-md border bg-background px-3 text-sm' value={category}
                onChange={(event) => { setCategory(event.target.value as FeedbackCategory | ''); setPage(1); }}>
                <option value=''>All categories</option>
                {Object.entries(feedbackCategories).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
              </select>
            </div>
            {list.isLoading && <Skeleton className='h-48' />}
            {list.isError && <ErrorState message='Could not load feedback.' onRetry={() => void list.refetch()} />}
            {list.data?.items.length === 0 && <p className='py-4 text-sm text-muted-foreground'>No feedback matches these filters.</p>}
            {list.data?.items.map((item) => (
              <button key={item.id} type='button' aria-pressed={item.id === selected}
                className='block w-full rounded-lg border p-3 text-left hover:bg-muted/40 aria-pressed:border-primary aria-pressed:bg-accent'
                onClick={() => setSelected(item.id)}>
                <div className='flex flex-wrap items-center gap-2'>
                  <span className='break-words font-semibold'>{item.user.fullName}</span>
                  <FeedbackBadge item={item} />
                </div>
                <p className='mt-1 text-xs text-muted-foreground'>{feedbackCategories[item.category]} · {formatDateTime(item.createdAt)}</p>
                <p className='mt-1 line-clamp-2 break-words text-sm'>{item.message ?? item.adminReply}</p>
              </button>
            ))}
            {(page > 1 || list.data?.hasMore) && (
              <div className='flex justify-between'>
                <Button size='sm' variant='outline' disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
                <Button size='sm' variant='outline' disabled={!list.data?.hasMore} onClick={() => setPage(page + 1)}>Next</Button>
              </div>
            )}
          </CardContent>
        </Card>
        {selected === null && <Card><CardContent className='pt-5 text-sm text-muted-foreground'>Select a feedback item to view it.</CardContent></Card>}
        {selected !== null && (
          <div className='min-w-0 space-y-3'>
            <Button variant='outline' size='sm' className='xl:hidden' onClick={() => setSelected(null)}>
              <ArrowLeft className='h-4 w-4' /> Back to queue
            </Button>
            {detail.isLoading && <Skeleton className='h-48' />}
            {detail.isError && <ErrorState message='Could not load this feedback item.' onRetry={() => void detail.refetch()} />}
            {detail.data && <FeedbackDetail key={detail.data.id} item={detail.data} />}
          </div>
        )}
      </div>
    </>
  );
}

function FeedbackBadge({ item }: { item: Feedback }) {
  return <Badge variant={item.status === 'OPEN' ? 'warning' : item.status === 'REPLIED' ? 'success' : 'neutral'}>{feedbackStatuses[item.status]}</Badge>;
}

function FeedbackDetail({ item }: { item: Feedback }) {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState('');
  const [notice, setNotice] = useState('');
  const change = useMutation({
    mutationFn: (input: { adminReply: string } | { status: FeedbackStatus }) => updateFeedback(item.id, input),
    onSuccess: async (updated, input) => {
      queryClient.setQueryData([...feedbackKey, 'detail', item.id], updated);
      if ('adminReply' in input) setDraft('');
      setNotice('adminReply' in input ? 'Reply sent.' : input.status === 'CLOSED' ? 'Feedback closed.' : 'Feedback reopened.');
      await queryClient.invalidateQueries({ queryKey: feedbackKey });
    },
  });

  function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.trim() || change.isPending) return;
    setNotice('');
    change.mutate({ adminReply: draft.trim() });
  }

  return (
    <Card>
      <CardHeader><CardTitle>{feedbackCategories[item.category]}</CardTitle></CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex flex-wrap items-center justify-between gap-2'>
          <Link className='font-medium text-primary underline' href={`/players/${item.user.id}`}>{item.user.fullName}</Link>
          <FeedbackBadge item={item} />
        </div>
        <p className='text-xs text-muted-foreground'>{item.user.phoneNumber} · {formatDateTime(item.createdAt)}</p>
        {item.message ? <p className='whitespace-pre-wrap break-words rounded-lg border p-3 text-sm'>{item.message}</p> :
          <p className='text-sm text-muted-foreground'>Started by admin.</p>}
        {item.adminReply && (
          <div className='rounded-lg bg-muted/40 p-3 text-sm'>
            <p className='font-semibold'>Current reply</p>
            <p className='mt-1 whitespace-pre-wrap break-words'>{item.adminReply}</p>
            <p className='mt-2 text-xs text-muted-foreground'>
              {item.repliedBy?.fullName}{item.repliedAt ? ` · ${formatDateTime(item.repliedAt)}` : ''}
              {item.playerSeenAt ? ' · Seen' : ''}
            </p>
          </div>
        )}
        <form className='space-y-3' onSubmit={send}>
          <label className='block space-y-1 text-sm font-medium'><span>{item.adminReply ? 'Replace reply' : 'Reply to player'}</span>
            <textarea required maxLength={2000} value={draft} onChange={(event) => setDraft(event.target.value)}
              className='block min-h-28 w-full rounded-md border bg-background p-3' />
          </label>
          <div className='flex flex-wrap gap-2'>
            <Button type='submit' disabled={!draft.trim() || change.isPending}>Send reply</Button>
            <Button type='button' variant='outline' disabled={change.isPending} onClick={() => {
              setNotice('');
              change.mutate({ status: item.status === 'CLOSED' ? item.adminReply ? 'REPLIED' : 'OPEN' : 'CLOSED' });
            }}>{item.status === 'CLOSED' ? 'Reopen' : 'Close'}</Button>
          </div>
        </form>
        {notice && <p role='status' className='text-sm'>{notice}</p>}
        {change.isError && <p role='alert' className='text-sm text-destructive'>{change.error.message}</p>}
      </CardContent>
    </Card>
  );
}
