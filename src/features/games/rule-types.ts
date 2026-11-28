/**
 * Player-facing game types behind a rules version. A game mode (stake) picks
 * one; players see its Amharic name in the app.
 *
 * - Dama: ታንከኛ (men capture forward and backward) or እግረኛ (forward only).
 * - Ludo: መመለስ ያለበት (with sending back), መመለስ የሌለበት (no captures) or
 *   መመለስ የረሳ ይሸነፋል (skipping a possible capture loses the match).
 * - Karta: 1v1 (first to 3 rounds) or a queue table (up to 4 seats; the
 *   round winner keeps dealing, every round pays at once).
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
  /** Part of suggested mode codes (`DAMA_FWD_1V1_100`); empty for the classic type. */
  codePart: string;
};

export const RULE_TYPES: Record<string, RuleType[]> = {
  DAMA: [
    { rulesVersion: 'DAMA_ET_FORWARD_V1', name: 'እግረኛ', hint: 'ወደፊት ብቻ ይበላል', detail: 'Men capture forward only', icon: '🚶', codePart: 'FWD_' },
    { rulesVersion: 'DAMA_ET_V1', name: 'ታንከኛ', hint: 'ወደፊት እና ወደኋላ ይበላል', detail: 'Men capture forward and backward', icon: '🛡️', codePart: '' },
  ],
  LUDO: [
    { rulesVersion: 'LUDO_CLASSIC_V3', name: 'መመለስ ያለበት', hint: 'የተመታ ወደ ቤቱ ይመለሳል', detail: 'Classic: landing on an opponent sends it home', icon: '↩️', codePart: '' },
    { rulesVersion: 'LUDO_NO_CAPTURE_V1', name: 'መመለስ የሌለበት', hint: 'ማንም ወደ ቤቱ አይመለስም', detail: 'No captures: tokens may share any square', icon: '🤝', codePart: 'NOCAP_' },
    { rulesVersion: 'LUDO_MISSED_CAPTURE_V1', name: 'መመለስ የረሳ ይሸነፋል', hint: 'መመለስ እየቻለ የተወ ይሸነፋል', detail: 'Skipping a possible capture loses the match', icon: '⚠️', codePart: 'MISS_' },
  ],
  KARTA: [
    { rulesVersion: 'KARTA_LATLAT_V1', name: 'ሁለት ለሁለት', hint: 'መጀመሪያ 3 ዙር ያሸነፈ', detail: '1v1: first to 3 rounds takes the pot', icon: '🃏', codePart: '' },
    {
      rulesVersion: 'KARTA_TABLE_V1',
      name: 'ጠረጴዛ',
      hint: 'ያሸነፈ ያከፋፍላል፣ ዙሩ ወዲያው ይከፈላል',
      detail: 'Queue table (up to 4): the winner keeps dealing; every round pays at once',
      icon: '🪑',
      codePart: 'TABLE',
    },
  ],
};

/**
 * Players per game. Ludo: one match of 2–4 players (3–4 fill automatically).
 * Karta table: seats at the table (rounds are always 1v1). Dama: 1v1 only.
 */
export const PLAYER_COUNTS: Record<string, number[]> = { LUDO: [2, 3, 4], KARTA: [2, 3, 4], DAMA: [2] };

/** Karta queue table: `playerCount` is its seat limit. */
export const isKartaTable = (rulesVersion: string) => rulesVersion === 'KARTA_TABLE_V1';

/** Player counts the admin may pick for this game and rules (just [2] when fixed). */
export function playerCountsFor(gameCode: string, rulesVersion: string): number[] {
  if (gameCode === 'KARTA') return isKartaTable(rulesVersion) ? [2, 3, 4] : [2];
  return PLAYER_COUNTS[gameCode] ?? [2];
}

/** A suggested mode code, e.g. `LUDO_4P_100`, `DAMA_FWD_1V1_50`, `KARTA_TABLE4_20`. */
export function suggestedModeCode(gameCode: string, rulesVersion: string, players: number, stakeLabel: string): string {
  if (isKartaTable(rulesVersion)) return `${gameCode}_TABLE${players}_${stakeLabel}`;
  return `${gameCode}_${ruleTypeCodePart(rulesVersion)}${players > 2 ? `${players}P` : '1V1'}_${stakeLabel}`;
}

/** Kept for older imports. */
export const DAMA_RULE_TYPES = RULE_TYPES.DAMA;

/** The type of a rules version, when its game has named types. */
export function ruleTypeOf(rulesVersion: string): RuleType | null {
  for (const types of Object.values(RULE_TYPES)) {
    const type = types.find((t) => t.rulesVersion === rulesVersion);
    if (type) return type;
  }
  return null;
}

/** Code fragment used in suggested mode codes. */
export function ruleTypeCodePart(rulesVersion: string): string {
  return ruleTypeOf(rulesVersion)?.codePart ?? '';
}
