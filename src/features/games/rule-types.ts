/**
 * Player-facing game types behind a rules version. Dama has two:
 * ታንከኛ (men capture forward and backward) and እግረኛ (men capture forward only).
 * Kings are the same in both.
 */
export type RuleType = {
  rulesVersion: string;
  /** Amharic name players see in the app. */
  name: string;
  /** Short Amharic description (as in the app). */
  hint: string;
  /** English explanation for operators. */
  detail: string;
  icon: string;
};

export const DAMA_RULE_TYPES: RuleType[] = [
  {
    rulesVersion: 'DAMA_ET_FORWARD_V1',
    name: 'እግረኛ',
    hint: 'ወደፊት ብቻ ይበላል',
    detail: 'Men capture forward only',
    icon: '🚶',
  },
  {
    rulesVersion: 'DAMA_ET_V1',
    name: 'ታንከኛ',
    hint: 'ወደፊት እና ወደኋላ ይበላል',
    detail: 'Men capture forward and backward',
    icon: '🛡️',
  },
];

/** The type of a rules version, when that game has named types. */
export function ruleTypeOf(rulesVersion: string): RuleType | null {
  return DAMA_RULE_TYPES.find((type) => type.rulesVersion === rulesVersion) ?? null;
}

/** Code fragment used in suggested mode codes (`DAMA_FWD_1V1_100`). */
export function ruleTypeCodePart(rulesVersion: string): string {
  return rulesVersion === 'DAMA_ET_FORWARD_V1' ? 'FWD_' : '';
}
