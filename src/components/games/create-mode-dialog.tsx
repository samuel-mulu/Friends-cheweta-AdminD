'use client';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { createGameMode } from '@/features/games/admin-games-api';
import { RULE_TYPES, type RuleType, isKartaTable, playerCountsFor, suggestedModeCode } from '@/features/games/rule-types';
import { cn } from '@/lib/utils';

/**
 * Rules versions each live game supports (newest first) and its default move time.
 * A game with `types` makes the admin pick a named type (no default) instead of a raw version.
 */
export const RULES_VERSIONS: Record<string, { versions: string[]; turnSeconds: number; label: string; types?: RuleType[] }> = {
  LUDO: { versions: RULE_TYPES.LUDO.map((t) => t.rulesVersion), turnSeconds: 30, label: 'Ludo', types: RULE_TYPES.LUDO },
  KARTA: { versions: RULE_TYPES.KARTA.map((t) => t.rulesVersion), turnSeconds: 15, label: 'Karta Lat Lat', types: RULE_TYPES.KARTA },
  DAMA: { versions: RULE_TYPES.DAMA.map((t) => t.rulesVersion), turnSeconds: 40, label: 'Dama', types: RULE_TYPES.DAMA },
};

export function CreateModeDialog({ gameCode }: { gameCode: string }) {
  const game = RULES_VERSIONS[gameCode] ?? RULES_VERSIONS.LUDO;
  const typed = !!game.types?.length;
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [stake, setStake] = useState('10');
  const [fee, setFee] = useState('0');
  const [turn, setTurn] = useState(String(game.turnSeconds));
  // Typed games start with nothing picked: the type must be a deliberate choice.
  const [rules, setRules] = useState(typed ? '' : game.versions[0]);
  const [players, setPlayers] = useState(2);
  const qc = useQueryClient();
  const type = game.types?.find((t) => t.rulesVersion === rules) ?? null;
  const stakeLabel = Number(stake) > 0 ? String(Math.round(Number(stake))) : '100';
  const counts = playerCountsFor(gameCode, rules);
  const table = isKartaTable(rules);
  // A count this game/type cannot have falls back to its default (Karta 1v1 = 2, a table = 4).
  const playerCount = counts.includes(players) ? players : table ? 4 : counts[0];
  const size = table ? `table of ${playerCount}` : playerCount > 2 ? `${playerCount} players` : '1v1';
  const m = useMutation({
    mutationFn: () =>
      createGameMode({
        gameCode,
        code: code.trim().toUpperCase(),
        name: name.trim(),
        playerCount,
        stakeAmountMinor: String(Math.round(Number(stake) * 100)),
        platformFeeBps: Math.round(Number(fee) * 100),
        turnDurationSeconds: Number(turn),
        rulesVersion: rules.trim(),
        enabled: true,
      }),
    onSuccess: () => {
      setOpen(false);
      setRules(typed ? '' : game.versions[0]);
      setPlayers(2);
      void qc.invalidateQueries({ queryKey: ['admin', 'game-modes', gameCode] });
    },
  });
  const ready = !m.isPending && code.trim().length >= 3 && !!name.trim() && !!rules;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className='h-4 w-4' />
          Add mode
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className='text-lg font-semibold'>Create {gameCode} mode</DialogTitle>
        <DialogDescription className='mt-2 text-sm text-muted-foreground'>
          {typed ? 'Choose the game type first; players see it when they pick this stake.' : 'Pick one of the supported rules versions.'}{' '}
          {table
            ? 'A table seats up to the chosen number of players; each round is 1v1 and pays at once, and the winner keeps dealing.'
            : counts.length > 1
              ? '3–4 player stakes fill automatically from ready players; the winner takes the pot.'
              : ''}
        </DialogDescription>
        <div className='mt-5 grid gap-4'>
          {typed ? (
            <div className='grid gap-1.5 text-sm font-medium'>
              <span>
                Game type <span className='text-red-600'>*</span>
              </span>
              <TypePicker types={game.types!} value={rules} onChange={setRules} />
            </div>
          ) : (
            <Field label='Rules version'>
              <select className='h-10 w-full rounded-lg border bg-background px-3 text-sm' value={rules} onChange={(e) => setRules(e.target.value)}>
                {game.versions.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </Field>
          )}
          {counts.length > 1 && (
            <div className='grid gap-1.5 text-sm font-medium'>
              <span>{table ? 'Seats at the table' : 'Players'}</span>
              <CountPicker counts={counts} value={playerCount} onChange={setPlayers} />
            </div>
          )}
          <Field label='Code'>
            <Input placeholder={suggestedModeCode(gameCode, rules, playerCount, stakeLabel)} value={code} onChange={(e) => setCode(e.target.value)} />
          </Field>
          <Field label='Name'>
            <Input placeholder={`${game.label}${type ? ` ${type.name}` : ''} ${size} · ${stakeLabel} ETB`} value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label='Stake (ETB)'>
            <Input type='number' min='0' step='0.01' value={stake} onChange={(e) => setStake(e.target.value)} />
          </Field>
          <Field label='Platform fee (%)'>
            <Input type='number' min='0' max='100' step='0.01' value={fee} onChange={(e) => setFee(e.target.value)} />
          </Field>
          <Field label='Turn duration (seconds)'>
            <Input type='number' min='5' max='300' value={turn} onChange={(e) => setTurn(e.target.value)} />
          </Field>
        </div>
        <div className='mt-6 flex items-center justify-end gap-3'>
          {typed && !rules && <span className='text-xs text-muted-foreground'>Choose a game type to continue.</span>}
          <Button disabled={!ready} onClick={() => m.mutate()}>
            {m.isPending ? 'Creating…' : type ? `Create ${type.name} mode` : 'Create mode'}
          </Button>
        </div>
        {m.isError && <p className='mt-3 text-sm text-red-600'>Could not create the mode.</p>}
      </DialogContent>
    </Dialog>
  );
}

/** Two big cards, one per type (as players see them in the app). */
function TypePicker({ types, value, onChange }: { types: RuleType[]; value: string; onChange: (rulesVersion: string) => void }) {
  return (
    <div role='radiogroup' aria-label='Game type' className={cn('grid gap-3', types.length > 2 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-2')}>
      {types.map((t) => {
        const selected = t.rulesVersion === value;
        return (
          <button
            key={t.rulesVersion}
            type='button'
            role='radio'
            aria-checked={selected}
            onClick={() => onChange(t.rulesVersion)}
            className={cn(
              'flex flex-col items-center gap-1 rounded-xl border-2 px-3 py-3 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400',
              selected
                ? 'border-amber-400 bg-amber-400/10 text-foreground shadow-sm'
                : 'border-border bg-muted/30 text-muted-foreground hover:border-amber-300/60 hover:bg-muted/60',
            )}
          >
            <span className='text-base font-bold'>
              <span aria-hidden className='mr-1.5'>
                {t.icon}
              </span>
              {t.name}
            </span>
            <span className='text-xs font-medium'>{t.hint}</span>
            <span className='text-[11px] font-normal text-muted-foreground'>{t.detail}</span>
          </button>
        );
      })}
    </div>
  );
}

/** 2 · 3 · 4 as a segmented control. */
function CountPicker({ counts, value, onChange }: { counts: number[]; value: number; onChange: (count: number) => void }) {
  return (
    <div role='radiogroup' aria-label='Players' className='inline-flex w-fit rounded-lg border bg-muted/30 p-1'>
      {counts.map((count) => {
        const selected = count === value;
        return (
          <button
            key={count}
            type='button'
            role='radio'
            aria-checked={selected}
            onClick={() => onChange(count)}
            className={cn(
              'min-w-12 rounded-md px-4 py-1.5 text-sm font-semibold tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400',
              selected ? 'bg-amber-400 text-black shadow-sm' : 'text-muted-foreground hover:bg-muted',
            )}
          >
            {count}
          </button>
        );
      })}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className='grid gap-1.5 text-sm font-medium'>
      <span>{label}</span>
      {children}
    </label>
  );
}
