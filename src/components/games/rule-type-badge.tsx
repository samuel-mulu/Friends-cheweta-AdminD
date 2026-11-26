import { ruleTypeOf } from '@/features/games/rule-types';

/** A named game type (e.g. Dama እግረኛ / ታንከኛ) with its version underneath; the bare version otherwise. */
export function RuleTypeBadge({ rulesVersion }: { rulesVersion: string }) {
  const type = ruleTypeOf(rulesVersion);
  if (!type) return <span className='font-mono text-xs'>{rulesVersion}</span>;
  return (
    <span className='inline-flex flex-col gap-0.5' title={type.detail}>
      <span className='inline-flex w-fit items-center gap-1 rounded-full bg-amber-400/15 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:text-amber-300'>
        <span aria-hidden>{type.icon}</span>
        {type.name}
      </span>
      <span className='font-mono text-[11px] text-muted-foreground'>{rulesVersion}</span>
    </span>
  );
}
