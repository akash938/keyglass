export const KEYBOARD_CHATTER_THRESHOLD_MS = 55;
export const MOUSE_CHATTER_THRESHOLD_MS = 80;

export interface ChatterEvaluation {
  isChatter: boolean;
  deltaMs: number | null;
}

export function evaluateSwitchChatter(
  previousDownMs: number | undefined,
  currentDownMs: number,
  thresholdMs: number
): ChatterEvaluation {
  if (previousDownMs === undefined) {
    return { isChatter: false, deltaMs: null };
  }
  const deltaMs = Math.round(currentDownMs - previousDownMs);
  return {
    isChatter: deltaMs > 0 && deltaMs < thresholdMs,
    deltaMs,
  };
}
